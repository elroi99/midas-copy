# Plan: v0 Rewards Engine

## Context

The v0 engine is a **per-spend advisor** — given a single spend (merchant or category + amount) and a user's card portfolio, return a ranked list of card + route combinations by net rupee saving.

Three rails per card: **Direct**, **Accelerated Portal**, **Vouchers** (array, one entry per portal).

---

## Files

| File | Action |
|------|--------|
| `src/rewards-engine-v0/types.ts` | Create |
| `src/rewards-engine-v0/calculator.ts` | Create |
| `src/rewards-engine-v0/configs.ts` | Create |
| `src/rewards-engine-v0/index.ts` | Rewrite to barrel exports |

No separate `merchants.ts` — merchant metadata lives in the card config itself.

---

## Step 1: `types.ts`

### Standard Category whitelist

```typescript
export const STANDARD_CATEGORIES = [
  "flights", "shopping", "ecommerce", "grocery", "dining",
  "movies", "hotels", "railways", "educational_institutions",
  "gold_jewellery", "rent_payment", "insurance_payment",
  "government_transactions", "utilities", "fuel"
] as const;
export type StandardCategory = typeof STANDARD_CATEGORIES[number];
```

### Merchant whitelist

Covers all keys used across all rails (direct merchants + voucher merchants) plus similarity search merchants.
Merchants can appear in the whitelist without having a card config entry — the engine simply finds no routes for them.
```typescript
export const MERCHANT_NAMES = [
  "zepto", "blinkit", "swiggy", "amazon", "flipkart",
  "zomato", "eazydiner", "myntra", "amazon_pay"
] as const;
export type MerchantName = typeof MERCHANT_NAMES[number];
```

### Direct rail

```typescript
// base rate — fallback when no merchant or category match
interface DirectBaseConfig {
  earn_rate_percent: number;
}

// specific merchant config within direct
interface DirectMerchantConfig {
  display_name: string;
  earn_rate_percent: number;
  spend_limit: number | null;   // cap on eligible spend (rupees)
  earn_limit: number | null;    // cap on points earned (independent of spend_limit)
  categories: StandardCategory[];
}

// category-level config within direct
// categories[] is retained for future dynamic routing (e.g., adding "travel" to flights)
interface DirectSpendCategoryConfig {
  display_name: string;
  earn_rate_percent: number;
  categories: StandardCategory[];
}

interface DirectRailV0 {
  base: DirectBaseConfig;
  merchants: Partial<Record<MerchantName, DirectMerchantConfig>>;
  spend_categories: Partial<Record<StandardCategory, DirectSpendCategoryConfig>>;
}
```

### Accelerated portal rail

```typescript
// categories[] drives dynamic routing — no hardcoded category names in the engine
interface AcceleratedPortalCategoryConfig {
  display_name: string;
  earn_rate_percent: number;
  categories: StandardCategory[];
  earn_limit: number | null;   // replaces reward_pool; same pattern as direct merchants
}

interface AcceleratedPortalRailV0 {
  rail_type: string;
  display_name: string;
  template: { routing: string };
  categories: {
    flights?: AcceleratedPortalCategoryConfig;
    hotels?: AcceleratedPortalCategoryConfig;
  };
}
```

Note: `classification_categories` is dropped — replaced by `categories` (standard whitelist). `reward_pool_id` is dropped — replaced by `earn_limit`.

### Voucher rail (array — one entry per portal)

```typescript
interface VoucherMerchantConfig {
  display_name: string;
  merchant_name: string;           // human-readable name for UI
  additional_discount: number;     // upfront % discount at time of purchase
  spend_limit_monthly: number | null;
  surcharge_percent: number;       // can be 0+; reduces net saving
  usage_instructions: string;
  categories: StandardCategory[];
  frontend_tags: string[];         // explicit UI-level filter labels, not derived
}

interface VoucherPortalConfig {
  rail_type: string;
  display_name: string;
  earn_rate_percent: number;       // portal-level earn rate (applies to all merchants)
  template: { routing: string; voucher_discount?: string };
  merchants: Partial<Record<MerchantName, VoucherMerchantConfig>>;
}
```

### Card config

```typescript
interface CardConfigV0 {
  card_id: string;
  display_name: string;
  direct: DirectRailV0;
  accelerated_portal?: AcceleratedPortalRailV0;
  vouchers: VoucherPortalConfig[];
  reward_program: RewardProgramV0;   // required
}
```

### Reward program (same shape as v1, defined locally)

```typescript
interface ValuationProfileV0 {
  id: string;
  rupee_value_per_unit: number;
  description?: string;
}

interface RewardProgramV0 {
  reward_currency: { code: string; display_name: string; type: "points" | "miles" | "cashback" };
  valuation_profiles: ValuationProfileV0[];
  default_valuation_profile_id: string;
}
```

### SpendInput (discriminated union)

```typescript
export type SpendInput =
  | { input_type: "merchant"; merchant: MerchantName; amount: number }
  | {
      input_type: "category";
      category: StandardCategory;
      amount: number;
      // user-selected voucher merchants from the phase 1 picker (discoverVoucherMerchants)
      // only these voucher merchants will have routes computed
      selected_voucher_merchants: MerchantName[];
    };
```

### Output types

```typescript
export type RailId = "direct" | "accelerated_portal" | "voucher";

export interface RouteResult {
  // Identity
  card_id: string;
  card_display_name: string;
  rail_id: RailId;
  rail_display_name: string;
  category_key: string;
  category_display_name: string;

  // Amounts
  input_amount: number;
  effective_spend: number;          // after spend_limit cap
  excess_spend: number;             // amount that earns nothing due to spend_limit
  surcharge_amount: number;         // rupee cost of surcharge (voucher portals)
  additional_discount_amount: number;

  // Rewards
  earn_rate_percent: number;
  raw_points: number;
  points_earned: number;            // after earn_limit cap
  points_rupee_value: number;

  // Net
  // Vouchers: discount_rupees + points_rupee_value - surcharge_rupees (can be negative)
  // Direct / portal: points_rupee_value only
  net_rupee_saving: number;
  net_reward_rate_pct: number;      // (earn_rate_percent * rupee_value_per_unit) - surcharge_percent; for UI display

  // Metadata
  routing_instruction: string;
  usage_instructions?: string;
  frontend_tags?: string[];
  is_restricted: boolean;
  is_base_rate_fallback: boolean;
  valuation_profile_id: string;

  // Limit details (for UI transparency)
  spend_limit_applied?: { limit: number; effective_spend: number; excess_spend: number };
  earn_limit_applied?: { limit: number; raw_points: number; points_earned: number };
}

export interface SimilarMerchantSuggestion {
  merchant: MerchantName;
  similarity_group: string;        // "grocery_&_essentials" | "ecommerce" | "dining"
  best_route: RouteResult;         // best route found for this merchant across all cards
}

export interface RankedOutput {
  spend_input: SpendInput;
  routes: RouteResult[];           // sorted by net_rupee_saving descending; restricted routes at bottom
  best_route: RouteResult | null;
  // only populated when input_type === "merchant", merchant is in a similarity group,
  // and a similar merchant has a better net_rupee_saving than the original's best_route
  similar_merchant_suggestions: SimilarMerchantSuggestion[];
}
```

---

## Step 2: `configs.ts`

Axis Atlas config typed against `CardConfigV0`. Migrate from `v0configImproved` in `index.ts` with:

1. Drop `makemytrip` from voucher merchants
2. Replace `classification_categories` with `categories` in `accelerated_portal`
3. `null` values kept as-is (explicit)
4. Add `reward_program` (EDGE Miles; user fills actual valuation values)
5. Replace `reward_pools` with `earn_limit: number | null` on accelerated portal categories

```typescript
export const AXIS_ATLAS_V0: CardConfigV0 = {
  card_id: "axis_atlas",
  display_name: "Axis Bank Atlas Credit Card",
  direct: { base: {...}, merchants: {...}, spend_categories: {...} },
  accelerated_portal: { ... },
  vouchers: [{ /* Gift EDGE portal */ }],
  reward_program: {
    reward_currency: { code: "axis_edge_miles", display_name: "EDGE Miles", type: "miles" },
    valuation_profiles: [
      { id: "x1", rupee_value_per_unit: /* TBD */, description: "Low-end" },
      { id: "x2", rupee_value_per_unit: /* TBD */, description: "Typical" },
      { id: "x3", rupee_value_per_unit: /* TBD */, description: "Optimized" }
    ],
    default_valuation_profile_id: "x3"
  }
};

export const ALL_CARDS_V0: CardConfigV0[] = [AXIS_ATLAS_V0];
```

---

## Step 3: `calculator.ts`

```typescript
// Phase 1: returns voucher merchants matching a category across all cards
// lightweight — no reward math, just merchant discovery for the UI picker
export function discoverVoucherMerchants(
  category: StandardCategory,
  cards: CardConfigV0[]
): Array<{
  merchant: MerchantName;
  display_name: string;
  portal_display_name: string;
  card_id: string;
  card_display_name: string;
}>

// Phase 2: full route enumeration and ranking
export function rankSpend(params: {
  spendInput: SpendInput;
  cards: CardConfigV0[];
}): RankedOutput
```

### Similarity search (merchant input only)

Defined as a module-level const in `calculator.ts` — not in card configs:

```typescript
const SIMILARITY_GROUPS: Array<{ name: string; merchants: MerchantName[] }> = [
  { name: "grocery_&_essentials", merchants: ["zepto", "blinkit", "swiggy"] },
  { name: "ecommerce",            merchants: ["amazon", "flipkart"] },
  { name: "dining",               merchants: ["zomato", "swiggy", "eazydiner"] },
];
```

When `input_type === "merchant"`:
1. Find all groups containing the input merchant
2. Collect all OTHER merchants from those groups (union, deduplicated, excluding the input merchant)
3. For each similar merchant, run the full route enumeration across all cards
4. Surface as `similar_merchant_suggestions` only those where `best_route.net_rupee_saving > original best_route.net_rupee_saving`
5. If a similar merchant has no routes on any card (e.g., blinkit not in any config), it is silently skipped

Example — input: swiggy
- Groups: grocery_&_essentials [zepto, blinkit, swiggy] + dining [zomato, swiggy, eazydiner]
- Similar merchants to evaluate: zepto, blinkit, zomato, eazydiner

### Route enumeration

**For `input_type: "merchant"`**:
1. `direct.merchants[merchant]` → direct merchant route (or mark restricted if earn_rate = 0)
2. For each portal in `vouchers[]`: `portal.merchants[merchant]` → one voucher route per portal
3. `accelerated_portal`: iterate portal categories; for each, check if merchant's `categories` intersects that portal category's `categories[]` — if yes, generate portal route. No hardcoded category name checks.
4. Base fallback: `direct.base.earn_rate_percent`, `is_base_rate_fallback: true`

**For `input_type: "category"`**:
1. `direct.spend_categories[category]` → category-level direct route
2. All `direct.merchants` entries where merchant's `categories` includes input category → per-merchant direct routes
3. For each portal in `vouchers[]`: only `selected_voucher_merchants` entries (user-selected from phase 1 picker) → one route per selected merchant per portal
4. `accelerated_portal`: iterate portal categories; check if any portal category's `categories[]` includes the input category → generate portal route. No hardcoded category name checks.
5. Base fallback: `direct.base.earn_rate_percent`, `is_base_rate_fallback: true`

### Reward calculation per route

```
// Direct merchant route
effective_spend = spend_limit !== null ? Math.min(spend_limit, amount) : amount
excess_spend = amount - effective_spend
raw_points = effective_spend * earn_rate_percent / 100
points_earned = earn_limit !== null ? Math.min(raw_points, earn_limit) : raw_points
points_rupee_value = points_earned * valuation_profile.rupee_value_per_unit
net_rupee_saving = points_rupee_value

// Voucher route
// Step 1: upfront discount (applied to full amount)
discount_rupees = amount * additional_discount_percent / 100

// Step 2: earn on capped spend, then subtract surcharge on full amount
//   surcharge_percent reduces the effective return — can make this component negative
effective_spend = spend_limit_monthly !== null ? Math.min(spend_limit_monthly, amount) : amount
raw_points = effective_spend * portal.earn_rate_percent / 100
points_rupee_value = raw_points * valuation_profile.rupee_value_per_unit
surcharge_rupees = amount * surcharge_percent / 100

// derived rate for UI display (does not account for spend_limit, but useful for quick comparison)
net_reward_rate_pct = (portal.earn_rate_percent * rupee_value_per_unit) - surcharge_percent
// negative → surcharge exceeds reward value; the discount is the only benefit

net_rupee_saving = discount_rupees + points_rupee_value - surcharge_rupees  // can be negative

// Accelerated portal route
raw_points = amount * earn_rate_percent / 100
points_earned = earn_limit !== null ? Math.min(raw_points, earn_limit) : raw_points
points_rupee_value = points_earned * valuation_profile.rupee_value_per_unit
net_rupee_saving = points_rupee_value

// Base fallback
raw_points = amount * base_rate_percent / 100
net_rupee_saving = raw_points * valuation_profile.rupee_value_per_unit
```

### Ranking

Sort all `RouteResult[]` by `net_rupee_saving` descending. Restricted routes (`is_restricted: true`, `net_rupee_saving = 0`) go to the bottom.

---

## Step 4: `index.ts` (rewrite)

```typescript
export * from './types';
export * from './calculator';
export * from './configs';
```

Remove the dead `SpendInputStep` import and both unexported config constants.

---

## Verification scenarios

1. Swiggy ₹500 → top route: Swiggy voucher (Gift EDGE: 3% discount + 2% earn) > direct 2%
2. Grocery ₹2000 → fans out to zepto/swiggy/zomato direct + swiggy/zomato vouchers; zepto direct should rank if no zepto voucher exists
3. Flights ₹20000 → accelerated portal (16% earn) vs base (2%)
4. Dining ₹4000 on swiggy → spend_limit: 3000 applied, excess ₹1000 shown in output
5. `npm run build` passes with no type errors
