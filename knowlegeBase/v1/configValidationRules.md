# Credit Card Configuration Validation Rules

Because the rewards engine is mathematically deterministic, the configuration JSON fed into it acts as the raw source of truth. Consequently, corrupted, contradictory, or malformed configurations will silently execute and produce garbage ledger outputs.

Before a `CardConfig` and `SpendInputs` are parsed by the calculator, they should be gated by a strict validation layer (e.g., zod, yup, or custom TypeScript invariant assertions).

Here are the critical levels of validation that must be passed:

## 1. Structural Validation (Types & Schemas)
- **Presence of Required Fields:** Ensure core constants like `card_id`, `base_rate_percent`, `reward_program` (and its properties) exist.
- **Type Checking:** Verify properties explicitly. e.g., `base_rate_percent` MUST be a `number`, not a string `"1"`.
- **String Literals / Enums:** Flags like `period` can strictly ONLY be `"monthly"` or `"annual"`.
- **Positive Numeric Constraints:** Rates, multipliers, spend limits, milestones, and reward pools MUST be `> 0`. A negative pool limit or cash back rate fundamentally breaks the calculation logic and should crash early.

## 2. Referential Integrity (Graph Consistency)
The configuration creates a directed graph of relationships between intents, rails, categories, pools, and limits. Dangling pointers will crash the execution engine.
- **Valid Spend Intents:** `spend_sums.routing` loops through every user spend. Ensure every `user_spend_intent` defined in the routing actually exists in the global `SpendInputs` reference. 
- **Valid Rails in Routing:** If an intent maps to `{ rail_id: "vouchers" }`, then `rails["vouchers"]` MUST be defined in the CardConfig.
- **Valid Rail Categories:** If an intent maps to `{ rail_id: "vouchers", category_id: "amazon_shopping" }`, then `rails["vouchers"].categories["amazon_shopping"]` MUST exist.
- **Valid Pool References:** Inside a category definition (like `amazon_shopping`), if `reward_pool: "monthly_accelerated_cap"` is defined, then `reward_pools["monthly_accelerated_cap"]` MUST exist in the global config.
- **Valid Spend Limit References:** If a category defines `spend_limit_id: "voucher_cap"`, then `spend_limits["voucher_cap"]` MUST exist globally.

## 3. Logical & Mathematical Invariance
- **Discount Arithmetic:** If `voucher_portal_discount` is specified on a rail category, `0 < voucher_portal_discount < 100` MUST be true.
- **Reward Program Valuation:**
  - A `default` valuation string MUST exist in the `valuation_profiles` object.
  - Every rupee conversion rate inside `conversion_value_rupees` MUST be strictly `> 0.00`. An accrual of 0-value points does not justify acceleration maths.

## 4. Path Routing Overlaps (Determinism Checks)
- **Unique Execution Paths:** In the `spend_sums.routing` object, ensure that a specific `card_spend_key` is not accidentally routed into *multiple* rails simultaneously (e.g., mapping `airlines` individually under `vouchers` AND separately inside `exceptions`). The system must enforce that any spend intent deterministically processes down an isolated execution path. 

## 5. Coverage
- Each of the SPEND_ keys should be addressed in the routing config of the card config. this way each kind of spend is classified / addressed. This leads to a certian level of standardization and helps with ease of comparison between cards. 
Please also make sure that 
Please plase use SPEND_INPUTS as the source of thuth for the keys of spend_intent_routing
