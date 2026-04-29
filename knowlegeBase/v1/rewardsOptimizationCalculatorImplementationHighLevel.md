Excellent. Now we move from **conceptual reward theory** to **implementation architecture**.

This document explains:

* Why the config exists
* The different config layers
* The rationale behind each key
* How aggregation fits in
* How normalization fits in
* How routing works
* How pools and limits are modeled
* How milestones and waivers are represented

This is meant to clearly explain the *design philosophy* behind the system.

---

# Part 1: Why We Use a Config-Driven Architecture

Credit card rewards are:

* Complex
* Rule-based
* Issuer-specific
* Frequently changing

Hardcoding reward logic per card would:

* Make the system fragile
* Break comparisons
* Increase maintenance cost
* Make optimization opaque

So we designed:

> A deterministic engine powered entirely by configuration.

The algorithm:

* Does no decision-making
* Does no optimization search
* Does no reasoning
* Only executes what config declares

All business logic lives in config.

---

# Part 2: High-Level Architecture

We have **two primary configs**:

1. Global Spend Input Config (Normalization Layer)
2. Card-Specific Reward Config

---

# Part 3: Global Spend Input Config

Purpose:

* Standardize user inputs
* Normalize time periods
* Decouple UI from card logic

Example (conceptually):

```ts
spend_inputs: {
  amazon: { period: "monthly" },
  flights_annual: { period: "annual" },
  insurance_health_annual: { period: "annual" }
}
```

## Rationale

Users:

* Think in different timeframes (monthly rent, annual flights)
* Answer granular questions

Cards:

* Require consistent timeframes (usually monthly for rewards, yearly for milestones)

This layer:

* Normalizes everything to monthly for calculation
* Keeps UI independent from card configs

---s

# Part 4: Routing

Routing defines how a spend is executed.

Example:

```ts
routing: {
  amazon: {
    rail_id: "vouchers",
    category_id: "flat"
  },
  flights_annual: {
    rail_id: "accelerated_portal",
    category_id: "flights"
  }
}
```

## Rationale

The same user spend can be executed via:

* Direct swipe
* Accelerated portal
* Vouchers
* Third-party platform

Routing encodes:

* The optimal path for this card
* Without runtime decision-making
* Without combinatorics

Routing is deterministic.

---

# Part 5: Rails

Rails represent payment modes.

Example:

```ts
rails: {
  vouchers: {
    categories: {
      amazon_shopping: {
        earn_rate_percent: 16,
        reward_pool_id: "accelerated_portal_pool",
        spend_limit_id: "amazon_shopping_limit"
      }
    }
  }
}
```

## Why Rails Exist

Because reward mechanics differ by:

* Mode of execution
* Platform used
* Portal used

Rails allow modeling:

* Accelerated portal
* Direct swipe
* Voucher platforms
* Third-party platforms

Each rail can contain multiple categories.

---

# Part 6: Categories Within Rails

Categories allow modeling:

* Different earn rates
* Different pools
* Different milestone eligibility
* Different spend limits

Example:

```ts
amazon_shopping: {
  earn_rate_percent: 16,
  reward_pool_id: "accelerated_portal_pool",
  spend_limit_id: "amazon_shopping_limit",
  milestone_excluded: false,
  fee_waiver_excluded: false
}
```

Categories are the smallest unit of reward behavior.

---

# Part 7: Reward Pools

Example:

```ts
rewardPools: {
  accelerated_portal_pool: {
    max_points: 10000
  }
}
```

## Rationale

Accelerated rewards are capped.

Reward pools:

* Are measured in points
* Are depletable
* May be shared across categories
* Are separate from spend limits

Why separate object?

Because:

* Multiple categories reference same pool
* Pool is independent resource
* Avoid duplication

---

# Part 8: Spend Limits

Example:

```ts
spendLimits: {
  amazon_shopping_limit: {
    max_spend: 10000
  }
}
```

## Rationale

Spend limits:

* Are measured in rupees
* Cap how much spend can be routed
* Are depletable

They are separate from reward pools because:

* One caps currency
* One caps points

Modeling them separately avoids confusion.

---

# Part 9: Milestones

Example:

```ts
milestones: [
  { threshold: 750000, bonus_points: 5000 },
  { threshold: 1500000, bonus_points: 5000 }
]
```

Milestones:

* Are yearly constructs
* Use milestone eligible spend
* Do not depend on reward pools
* Are additive bonuses

Eligibility is controlled via category flags.

---

# Part 10: Fee Waiver

Example:

```ts
spend_based_waiver: {
  threshold: 800000
}
```

Similar to milestones:

* Yearly construct
* Uses eligible spend
* Controlled via exclusion flags

---

# Part 11: Aggregation Layer (`SPEND_SUMS`)

Purpose:

* This is a **separate object** (legacy grouping) used to bucket global `user_spend_intents` into semantic categories for interpretation.
* It is **no longer used inside the mathematical engine**.
* It helps translate the granular ledger facts back into high-level insights like "Total ROI on Shopping" vs "Total ROI on Travel".

The intention is to be able to group multiple raw user spend intents into semantic spend buckets so that it becomes easy to comment on higher level buckets of spending and how they compare across cards 
ie. it makes it easier to say that card X is better than card Y in the case of online shopping etc

Example:

```ts
export const SPEND_SUMS = {
  shopping: {
    sum_of: ["amazon", "flipkart"]
  }
}
```

## Why Aggregation is decoupled

Users think in reward-relevant buckets:

* Online retail
* Travel
* Utilities
* Insurance

Aggregation:

* Aggregation helps us group many different spends into logical buckets that are relevant to the user
* Makes cross-card comparison interpretable
* The mathematical engine only needs to know *how much was spent* and *on what rail*.
* Aggregating before rotation loses granular data.
* Different cards might have different grouping needs, but the user spends are constant.
* Preserving the `amazon` key throughout the ledger allows for much richer auditability.



# Part 12: Why Config Is Layered This Way

We separated:

1. Input normalization
2. Routing (Direct Intent -> Rail)
3. Reward mechanics
4. Pools
5. Spend limits
6. Milestones
7. Waivers

Because each represents a different conceptual layer:

| Layer           | Purpose               |
| --------------- | --------------------- |
| Spend Inputs    | User reality          |
| Routing         | Direct Rail Lookup    |
| Rail + Category | Reward mechanics      |
| Reward Pools    | Accelerated cap       |
| Spend Limits    | Currency cap          |
| Milestones      | Threshold bonus       |
| Waivers         | Fee benefit           |
| Aggregation     | (Separate post-process) Card ROI insights and performance insights. |

Each layer has:

* Single responsibility
* Clear boundary
* No hidden coupling

---

# Part 13 : Reward Program Currency and Conversion Rates

```json
{
    "reward_program": {
    "reward_currency": {
      "code": "HDFC_tier_one",
      "display_name": "HDFC_tier_one",
      "type": "points", // "points" | "miles" | "cashback"
    },
    "valuation_profiles": [
      {
        "id": "x1",
        "rupee_value_per_unit": 0.4,
        "description":
          "Low-end redemption value (statement credit / weak transfer)",
      },
      {
        "id": "x2",
        "rupee_value_per_unit": 0.75,
        "description": "Typical travel or voucher redemption value",
      },
      {
        "id": "x3",
        "rupee_value_per_unit": 1.2,
        "description": "Optimized airline or premium hotel transfers",
      },
    ],
    "default_valuation_profile_id": "x3",
  }
}
```
**Reward Program Configuration**

The `reward_program` object defines the **reward currency issued by the card** and **how that currency is converted to rupee value**.

* `reward_currency` describes the type of reward unit the card issues (e.g., points, miles, cashback).
* `valuation_profiles` define different **rupee valuations per reward unit**, depending on how the rewards are redeemed (e.g., statement credit, vouchers, travel transfers).
* `default_valuation_profile_id` specifies the **default rupee valuation** used when calculating ROI.

This allows the system to **first calculate rewards in the card’s native currency**, and then **convert them to rupee ROI using a chosen valuation profile**.


# Part 14: Why This Architecture Works

This structure gives:

* Deterministic execution
* No combinatorics
* Cross-card comparability
* Extensibility
* Config-only changes when cards update

And critically:

> The algorithm does not contain business logic.
> The config is the business logic.

---

# Part 14: Mental Model of Execution

When calculation runs:

1. Normalize spends (divide annual by 12)
2. Route spend (Direct intent lookup)
3. Apply spend limits
4. Apply accelerated rate
5. Apply reward pool
6. Apply base fallback
7. Track milestone eligibility
8. Track fee waiver eligibility
9. Add milestone bonus
10. Finalize totals
11. Convert to rupees using default valuation profile 
12. (Optional) Group into semantic buckets via SPEND_SUMS for reporting

Every step is driven by config keys.
