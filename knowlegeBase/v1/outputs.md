Below is a **systematic, comprehensive context checklist** you can hand to another AI (or human) so they can continue this work **without losing intent, constraints, or design philosophy**.

I’ll structure this as:

* A. What you already identified (refined)
* B. Critical concepts you missed or under-emphasized
* C. Design decisions and non-goals that must be explicit
* D. Artifacts that must be shared
* E. How to package this context for another AI

This is intentionally exhaustive.

---

## A. Card rewards fundamentals (you already listed – refined)

These explain **how rewards work in the real world**.

0. **Additional Discount**
    * Earned on some rail + categries
    * example. vouchers : some vouchers are sold at a discount on voucher platforms. eg. a 4% discount
    * hence, the effective price that will be charged to the card while buying the voucher from the platform will be reduced by 4%

1. **Base rewards**

   * Earned on all eligible spends
   * No caps or very high caps
   * Applied when accelerated rewards do not apply or are exhausted

2. **Accelerated rewards**

   * Higher earn rate than base
   * Applies only to specific rails + categories
   * Always capped (points cap, not spend cap)

3. **Accelerated reward caps**

   * Defined in **points**, not spend
   * Often **shared across multiple categories or rails**
   * Once exhausted, spend falls back to base rate

4. **Spend limits**

   * Caps on **spend amount**, not points
   * Can exist at:

     * rail level
     * category level
   * Excess spend becomes “unspent” for acceleration

5. **Milestones**

   * Bonus points awarded when **eligible spend thresholds** are crossed
   * Multiple milestones can exist per card
   * Eligibility is **category-dependent**

6. **Fee waiver (annual fee)**

   * Similar to milestones, but outcome is a boolean (waived or not)
   * Uses eligible spend logic
   * Conceptually similar but distinct from milestones

---

## B. Spend modeling concepts (this is core and easy to miss)

These explain **how user inputs become algo inputs**.

7. **Spend inputs (global, non-card)**

   * Granular user intents (Amazon, rent, fuel, insurance, etc.)
   * Each input has a **time period** (monthly or annual)
   * This config is **shared across all cards**

8. **Normalization**

   * Annual spends are converted to monthly
   * Happens **before any card logic**
   * Driven entirely by `spend_inputs` config

9. **Subtract Additional Discount**
    * Subtract additional discount from normlized amount, if applicable
    * This gives us the final amount ie. user spend intent that needs to be routed

---

## C. Spend routing (important nuance)

11. **What spend routing is**

    * A deterministic mapping from:
      `spend_intent → payment rail → rail category`
    * Defined entirely in config
    * No runtime decision-making
    * The spend intent here is normalized and after applying additional discount

12. **What spend routing is NOT**

    * Not optimization
    * Not combinatorics
    * Not “best-of” logic
    * V1 supports **exactly one route per card spend intent**

13. **Payment rails**

    * Examples: vouchers, accelerated_portal, direct, third_party (e.g. red_giraffe)
    * Rails may contain multiple internal categories

14. **Rail categories**

    * Sub-classifications within a rail
    * Carry earn rate, spend limits, pool references, restrictions

---

## D. Reward calculation order (critical for correctness)

15. **Order of operations (locked)**

    1. Normalize spend inputs
    2. Reduce additional discount if applicable
    3. Route each spend intent
    4. Apply spend limits
    5. Calculate accelerated rewards
    6. Apply reward pool caps
    7. Apply base rewards on remainder
    8. Accumulate milestone-eligible spend
    9. Apply milestone bonuses
    10. Apply fee waiver logic

16. **Pool consumption philosophy**

    * Points-based caps
    * Pools are **shared state**
    * One pool per execution in V1 (multi-pool explicitly out of scope)

---

## E. Config design principles (this is very important context)

17. **Two configs only (V1)**

    * Global `spend_inputs`
    * Card-specific config

18. **ID-based references**

    * No composite strings
    * No parsing logic
    * Rails, categories, pools, limits all have IDs

19. **No runtime state in config**

    * Pools define `max_points`, not balances
    * Runtime state lives in the algorithm

20. **No reverse lookups**

    * Rails/categories reference limits and pools directly
    * Algorithm never scans global objects to infer applicability

21. **Deterministic config-driven execution**

    * Config encodes decisions
    * Algorithm executes, does not decide

---

## F. Tracing and explainability (often misunderstood)

22. **Purpose of trace**

    * Auditability
    * Verification by a card expert
    * Post-hoc explanation

23. **What trace contains**

    * Inputs (normalized + aggregated)
    * Routing outcomes
    * Per-category execution results
    * Pool deductions
    * Milestone calculations
    * Restricted spends
    * Final totals

24. **What trace explicitly does NOT contain**

    * Reasoning
    * “Why this was chosen”
    * Config paths or IDs
    * Any optimization narrative

25. **Trace is a ledger**

    * Append-only
    * Facts only
    * Machine-first, human-renderable

---

## G. Algorithm design philosophy

26. **Separation of concerns**

    * Pure calculation logic
    * Trace collection isolated : trace collects the intermediate states, creates and returns final canonical output
    * No logging inside math helpers

27. **Math precision decisions**

    * JS `number` used
    * Points floored at boundaries
    * No decimal library in V1

28. **Extensibility boundaries**

    * Multi-pool per execution: explicitly out of scope
    * Routing combinatorics: explicitly out of scope
    * Future extensions expected but not pre-implemented

---

## H. Testing philosophy

29. **End-to-end correctness tests**

    * Normalize → aggregate → route → rewards → milestones
    * Assert final totals only

30. **Trace testing deferred**

    * Calculation correctness first
    * Trace validation later

---

## I. Things you had not explicitly listed (but are crucial)

* Determinism as a core requirement
* No UI coupling anywhere in the engine
* No issuer-specific naming in algorithm logic
* No hardcoded card behavior in code
* V1 intentionally favors simplicity over generality


# Outputs expected from the algorithm

## 1. First, reframe the problem correctly

What you are really building is **not just a calculator**, but a **calculation + attribution engine**.

Key insight:

* Rewards are computed at **card-spend (rail + category)** level
* But **users think in spend-intents**
* So attribution must be **projected back** to:

  * user spend intents
  * card spends
  * card-level constructs (milestones, waiver)

---

## 2. Outputs we need (high-level)

You effectively need **two parallel views of the same execution**:

### A. User Spend Intent View (primary for users)

“What happened to my Amazon spend / flights / rent?”

### B. Card Execution View + Final results

"Brings visibility into the card results for both card experts and end consumers"

---

## 3. Core design principle for outputs

> **The algorithm should emit facts, not prose.**
> Prose should be generated *from facts* later.
> **The algorithm emits facts, but the Collector renders context.**

The system uses a **three-stage architecture**:
1. **Calculation**: Pure math engine computes rewards.
2. **Collection**: `RewardBreakdownCollector` assembles numeric facts + metadata.

---

## 4. Final agreed upon output structure (canonical)

A **single return object**, internally segmented output

### Top-level shape

```ts
{
  summary,                // card-level outcome
  user_spend_breakdown,   // per spend intent (includes explanations)
  milestones,             // milestone evaluation
  fee_waiver              // waiver evaluation
}
```

Let’s unpack the breakdown.

---

## 5. User Spend Intent Breakdown

One entry per spend intent (Amazon, groceries, flights, etc.)

```ts
user_spend_breakdown: {
  [spend_intent_key]: {
    input: {
      monthly_amount,
      yearly_amount
    },

    routing: {
      card_spend_key,
      rail_id,
      category_id,
      category_roi,
      additional_discount_roi,
    },

    limits: {
      total_eligible_monthly_limit : number,
      additional_discount_amount : number,
      spend_applied_monthly : number,
      unrewarded_monthly : number,
      spend_limit_remaining: number
    },

    rewards: {
      accelerated: {
        spend_intent_key,
        rate_percent,
        additional_discount_amount,
        spend_applied_monthly: number,
        points_earned,

        reward_pool?: {
          pool_id: string,
          points_consumed: number,
          points_remaining_after: number
        }
      },
      base: {
        spend_intent_key,
        rate_percent,
        spend_applied,
        points_earned
      },
      additional_discount : {
        amount_monthly : number,
        additional_discount_roi : number
      },
      total_points_monthly,
    },

    flags: {
      restricted?: boolean,
      pool_exhausted?: boolean,
      milestone_excluded?: boolean,
      fee_waiver_excluded?: boolean
    }
  }
}
```

Why this works:

* Completely machine-readable
* Every number can be audited
* No narrative assumptions
* Supports proportional allocation if needed later

---

## 7. Milestones & Fee Waiver (yearly constructs)

### Milestones

```ts
milestones: {
  eligible_spend_yearly,
    contributing_spend_intents: Array<{
    spend_intent_key: string,
    yearly_amount: number,
    routing: {
      rail_id: string,
      category_id: string
    }
  }>,
  excluded_spend_intents: [
    { spend_intent_key, 
    amount_yearly ,     
      routing: {
      rail_id: string,
      category_id: string
    } }
  ],
  milestones_triggered: [
    { threshold, 
    bonus_points ,     
      routing: {
      rail_id: string,
      category_id: string
    } }
  ],
  total_bonus_points
}
```

### Fee waiver

```ts
fee_waiver: {
  eligible_spend_yearly,
    contributing_spend_intents: Array<{
    spend_intent_key: string,
    yearly_amount: number,
    routing: {
      rail_id: string,
      category_id: string
    }
  }>,

  excluded_spend_intents: Array<{
    spend_intent_key: string,
    yearly_amount: number,
    routing: {
      rail_id: string,
      category_id: string
    }
  }>,
  threshold,
  waived: boolean
}
```

## 5. Restricted & Unrewarded Spends (explicitly separated)

This satisfies your B-section cleanly.

### 5.1 Hard restricted spends (no rewards possible)

```ts
restricted_spends: {
  spend_intents: Array<{
    spend_intent_key: string,
    monthly_amount: number,
    yearly_amount: number,
    routing: {
      rail_id: string,
      category_id: string
    }
  }>,

  total_yearly_amount: number
}
```

---

### 5.2 Unrewarded due to limits (soft loss)

```ts
unrewarded_due_to_limits: {
  spend_intents: Array<{
    spend_intent_key: string,
    unrewarded_monthly: number,
    unrewarded_yearly: number,
    routing: {
      rail_id: string,
      category_id: string
    }
  }>,

  total_unrewarded_yearly: number
}
```

Key distinction preserved:

* Restricted ≠ unrewarded
* Enables future optimization suggestions

Clear. Auditable. No prose.

---


### Explanation sentences that need to be shown to the end user
Routing : Buy the Amazon Pay voucher from SmartBuy and use it for payment.
Upfront discounts / Additional discounts ( if applicable ) : Amazon Pay vouchers are usually available at a 4% discount, saving you ₹160.
Accelerated rewards ( if applicable ) : ₹3840 of your spend earned 614.4 Reward Points at a rate of 16%.
Base rewards ( if applicable ) : ₹300 of your spend earned 30 Reward Points at a base rate of 10%.
Total rewards : In total, this spend generated 614.4 Reward Points.
Effective return : Overall, this delivered an effective return of 22.43%.

## 8. Summary (what user ultimately cares about)

```ts
summary: {
  total_points_yearly,
  accelerated_points_yearly,
  base_points_yearly,
  milestone_bonus_points,
  fee_waived
}
```

This matches your current return + expands cleanly.

---

## 9. Where do human-readable sentences come from?


## What the algorithm does NOT do

* ❌ No JSON shaping
* ❌ No nested objects
* ❌ No lists
* ❌ No explanations
* ❌ No formatting
* ❌ No condition duplication

It just says:

> “Here is a fact that just happened.”

---

## What the RewardBreakdownCollector ( collector ) does

The collector:

* owns the output schema
* aggregates facts by hooking into the execution steps of the algorithm
* builds and returns

  * user_spend_intents
  * milestones
  * fee_waiver
  * restricted_spends
  * unrewarded_due_to_limits
  * summary

It is:

* replaceable
* testable
* disable-able (noop collector)

You can think of the RewardBreakdownCollector as a manager / timekeeper who watches a worker ( the algo ) work, collect results of the various intermediate steps that the worker performs and then finally creates a repot ( the final canonical output ) and provides it to the user

