# Card Config Generator — v0 Rewards Engine

You are generating a `CardConfigV0` TypeScript constant for the Midas v0 rewards engine. Follow every rule in this document exactly. Do not infer or improvise — if data is missing, leave the field as `null` or omit the optional rail as specified.

---

## Section 1: TypeScript Types

The output must conform to these types exactly.

```typescript
// ─── Standard Category Whitelist ─────────────────────────────────────────────

export const STANDARD_CATEGORIES = [
  "flights",
  "shopping",
  "ecommerce",
  "grocery",
  "dining",
  "movies",
  "hotels",
  "railways",
  "educational_institutions",
  "gold_jewellery",
  "rent_payment",
  "insurance_payment",
  "government_transactions",
  "utilities",
  "fuel",
] as const;

export type StandardCategory = (typeof STANDARD_CATEGORIES)[number];

// ─── Merchant Whitelist ───────────────────────────────────────────────────────

export const MERCHANT_NAMES = [
  "zepto",
  "blinkit",
  "swiggy",
  "amazon",
  "flipkart",
  "zomato",
  "eazydiner",
  "myntra",
  "amazon_pay",
] as const;

export type MerchantName = (typeof MERCHANT_NAMES)[number];

// ─── Reward Program ───────────────────────────────────────────────────────────

export interface ValuationProfileV0 {
  id: string;
  rupee_value_per_unit: number;
  description?: string;
}

export interface RewardProgramV0 {
  reward_currency: {
    code: string;
    display_name: string;
    type: "points" | "miles" | "cashback";
  };
  valuation_profiles: ValuationProfileV0[];
  default_valuation_profile_id: string;
}

// ─── Direct Rail ─────────────────────────────────────────────────────────────

export interface DirectBaseConfig {
  earn_rate_percent: number;
}

export interface DirectMerchantConfig {
  display_name: string;
  earn_rate_percent: number;
  spend_limit: number | null;
  earn_limit: number | null;
  categories: StandardCategory[];
}

export interface DirectSpendCategoryConfig {
  display_name: string;
  earn_rate_percent: number;
  spend_limit: number | null;
  earn_limit: number | null;
  categories: StandardCategory[];
}

export interface DirectRailV0 {
  base: DirectBaseConfig;
  merchants: Partial<Record<MerchantName, DirectMerchantConfig>>;
  spend_categories: Partial<Record<StandardCategory, DirectSpendCategoryConfig>>;
}

// ─── Accelerated Portal Rail ──────────────────────────────────────────────────

export interface AcceleratedPortalCategoryConfig {
  display_name: string;
  earn_rate_percent: number;
  spend_limit: number | null;
  earn_limit: number | null;
  categories: StandardCategory[];
}

export interface AcceleratedPortalRailV0 {
  rail_type: string;
  display_name: string;
  template: { routing: string };
  categories: {
    flights?: AcceleratedPortalCategoryConfig;
    hotels?: AcceleratedPortalCategoryConfig;
  };
}

// ─── Voucher Rail ─────────────────────────────────────────────────────────────

export interface VoucherMerchantConfig {
  display_name: string;
  merchant_name: string;
  additional_discount: number;
  spend_limit_monthly: number | null;
  surcharge_percent: number;
  usage_instructions: string;
  categories: StandardCategory[];
  frontend_tags: string[];
}

export interface VoucherPortalConfig {
  rail_type: string;
  display_name: string;
  earn_rate_percent: number;
  template: {
    routing: string;
    voucher_discount?: string;
  };
  merchants: Partial<Record<MerchantName, VoucherMerchantConfig>>;
}

// ─── Card Config ──────────────────────────────────────────────────────────────

export interface CardConfigV0 {
  card_id: string;
  display_name: string;
  direct: DirectRailV0;
  accelerated_portal?: AcceleratedPortalRailV0;
  vouchers: VoucherPortalConfig[];
  reward_program: RewardProgramV0;
}
```

---

## Section 2: Input Format

You will receive two inputs for each card:

### 2a. CSV row (primary)

| Column | Maps to |
|---|---|
| Card Name | `display_name` |
| Base Earn Rate (%) | `direct.base.earn_rate_percent` |
| Travel Portal | Portal display name, or "—" = no portal |
| Vouchers | Voucher portal `earn_rate_percent`, or "—" = no vouchers |
| Hotel | `accelerated_portal.categories.hotels.earn_rate_percent`, blank = omit |
| Flights | `accelerated_portal.categories.flights.earn_rate_percent`, blank = omit |
| Special merchant | Category-level overrides; see Section 5 |

`"—"` or `"â"` in any column means that rail/feature is not applicable — omit it.

### 2b. Supplementary input (provided per card)

```
card_id: (snake_case identifier, e.g. hsbc_travelone)

reward_program:
  reward_currency: { code: "", display_name: "", type: "points|miles|cashback" }
  valuation_profiles:
    - { id: "", rupee_value_per_unit: , description: "" }
  default_valuation_profile_id: ""

voucher_portal_merchants: (only if Vouchers column is not "—")
  <merchant_key>:
    display_name: ""
    merchant_name: ""
    additional_discount: 
    spend_limit_monthly: 
    surcharge_percent: 
    usage_instructions: ""
    categories: []
    frontend_tags: []
```

---

## Section 3: Fixed Rule — `direct.merchants`

**Always include all 9 merchants, in this exact order.** Do not skip any.

All merchants use:
- `earn_rate_percent` = `direct.base.earn_rate_percent` (same as base — no special merchant rates)
- `spend_limit: null`
- `earn_limit: null`
- Category mappings below — **never change these**

| key | display_name | categories |
|---|---|---|
| `zepto` | `"Zepto"` | `["grocery", "ecommerce"]` |
| `blinkit` | `"Blinkit"` | `["grocery"]` |
| `swiggy` | `"Swiggy"` | `["dining", "grocery"]` |
| `amazon` | `"Amazon"` | `["ecommerce", "shopping"]` |
| `flipkart` | `"Flipkart"` | `["ecommerce", "shopping"]` |
| `zomato` | `"Zomato"` | `["dining", "grocery"]` |
| `eazydiner` | `"EazyDiner"` | `["dining"]` |
| `myntra` | `"Myntra"` | `["shopping", "ecommerce"]` |
| `amazon_pay` | `"Amazon Pay"` | `["ecommerce", "shopping", "grocery"]` |

---

## Section 4: Fixed Rule — `direct.spend_categories`

**Always include all 15 categories.** Use this exact display name and single-item categories array for each.

### Permanently restricted (earn_rate_percent: 0, always — regardless of base rate)

| key | display_name |
|---|---|
| `fuel` | `"Fuel"` |
| `government_transactions` | `"Government Transactions"` |
| `insurance_payment` | `"Insurance Payment"` |
| `educational_institutions` | `"Educational Institutions"` |
| `utilities` | `"Utilities"` |
| `rent_payment` | `"Rent Payment"` |
| `gold_jewellery` | `"Gold Jewellery"` |

### Earn at base rate (unless a category-level override is provided — see Section 5)

| key | display_name |
|---|---|
| `flights` | `"Flights"` |
| `shopping` | `"Shopping"` |
| `ecommerce` | `"Ecommerce"` |
| `grocery` | `"Grocery"` |
| `dining` | `"Dining"` |
| `movies` | `"Movies"` |
| `hotels` | `"Hotels"` |
| `railways` | `"Railways"` |

All spend_categories: `spend_limit: null`, `earn_limit: null` (unless card data explicitly states otherwise).

The `categories` array for each spend_category is always `[<the category key itself>]`, e.g. `categories: ["flights"]`.

---

## Section 5: Special Cases

### 5a. Category-level overrides (from the "Special merchant" column)

If the Special merchant column contains a cashback or earn rate for a standard category (e.g. "10% Cashback on Dining, Grocery & Food Delivery"), override only those categories in `direct.spend_categories`. Map natural-language category names to keys:

| Natural language | Key |
|---|---|
| Dining / Food Delivery | `dining` |
| Grocery | `grocery` |
| Shopping | `shopping` |
| Flights / Air travel | `flights` |
| Hotels | `hotels` |
| Movies | `movies` |
| Railways / Train | `railways` |

Example: "10% Cashback on Dining, Grocery & Food Delivery" → set `dining` and `grocery` to `earn_rate_percent: 10`.

### 5b. IOCL fuel-only cards

When the input notes "Only fuel - IOCL" or "Hard code" in Column 1:
- Set `direct.base.earn_rate_percent: 0` — the card earns nothing on regular swipes
- Set `direct.spend_categories.fuel.earn_rate_percent` = the CSV "Base Earn Rate (%)" value
- All other spend_categories remain 0 (restricted categories stay 0, and non-restricted categories are also 0 because base is 0)
- All `direct.merchants` use `earn_rate_percent: 0` (since base = 0)

### 5c. Named merchants not in MERCHANT_NAMES (e.g. Air India)

Ignore entirely. Do not add new keys to `direct.merchants`.

---

## Section 6: Rail Rules

### `accelerated_portal`

Omit the entire `accelerated_portal` key if both Hotel and Flights columns are blank or "—".

If either Hotel or Flights has a value, include the rail with only the categories that have values:

```typescript
accelerated_portal: {
  rail_type: "Accelerated Portal",
  display_name: "<Travel Portal column value>",
  template: {
    routing: "Book your flights or hotels via {display_name}",
  },
  categories: {
    // include only if Flights column has a value:
    flights: {
      display_name: "Flights",
      earn_rate_percent: <Flights column value>,
      categories: ["flights"],
      spend_limit: null,
      earn_limit: null,
    },
    // include only if Hotel column has a value:
    hotels: {
      display_name: "Hotels",
      earn_rate_percent: <Hotel column value>,
      categories: ["hotels"],
      spend_limit: null,
      earn_limit: null,
    },
  },
},
```

### `vouchers`

Set to `[]` if the Vouchers column is "—".

Otherwise, construct a single `VoucherPortalConfig` using:
- `rail_type: "Voucher Portal"`
- `display_name` = Travel Portal column value
- `earn_rate_percent` = Vouchers column value
- `template.routing` = `"Buy the {merchant_name} voucher from {display_name} and use it for payment."`
- `template.voucher_discount` = `"{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly."`
- `merchants` = from the supplementary `voucher_portal_merchants` input

If no voucher portal merchant detail is provided but Vouchers is not "—", set `merchants: {}`.

---

## Section 7: Output Format

```typescript
export const {CARD_ID_UPPER}_V0: CardConfigV0 = {
  // ...
};
```

- `card_id` = snake_case from supplementary input
- Export name = uppercase snake_case + `_V0` (e.g. `HSBC_TRAVELONE_V0`)
- Valid TypeScript — no placeholder comments, no `// TODO`, no `any`
- Do not import anything; produce the object literal only

---

## Section 8: Worked Example

> **Note:** This example (Axis Atlas) pre-dates the rules above. The new rules differ in two ways:
> 1. All 9 merchants must be included (this example only has 6)
> 2. `educational_institutions` must be 0% restricted (this example incorrectly has it at base rate)
> 
> Follow the rules in Sections 3–6, not this example, for those fields. Use this only as a reference for the overall shape.

```typescript
export const AXIS_ATLAS_V0: CardConfigV0 = {
  card_id: "axis_atlas",
  display_name: "Axis Bank Atlas Credit Card",

  direct: {
    base: {
      earn_rate_percent: 2,
    },
    merchants: {
      // Under new rules: all 9 merchants at base rate (2%), null limits
      zepto:      { display_name: "Zepto",      earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["grocery", "ecommerce"] },
      blinkit:    { display_name: "Blinkit",    earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      swiggy:     { display_name: "Swiggy",     earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["dining", "grocery"] },
      amazon:     { display_name: "Amazon",     earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["ecommerce", "shopping"] },
      flipkart:   { display_name: "Flipkart",   earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["ecommerce", "shopping"] },
      zomato:     { display_name: "Zomato",     earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["dining", "grocery"] },
      eazydiner:  { display_name: "EazyDiner",  earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["dining"] },
      myntra:     { display_name: "Myntra",     earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["shopping", "ecommerce"] },
      amazon_pay: { display_name: "Amazon Pay", earn_rate_percent: 2, spend_limit: null, earn_limit: null, categories: ["ecommerce", "shopping", "grocery"] },
    },
    spend_categories: {
      flights:                 { display_name: "Flights",                  earn_rate_percent: 12, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping:                { display_name: "Shopping",                 earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce:               { display_name: "Ecommerce",                earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery:                 { display_name: "Grocery",                  earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining:                  { display_name: "Dining",                   earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies:                  { display_name: "Movies",                   earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels:                  { display_name: "Hotels",                   earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways:                { display_name: "Railways",                 earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions:{ display_name: "Educational Institutions", earn_rate_percent: 0,  spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery:          { display_name: "Gold Jewellery",           earn_rate_percent: 0,  spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment:            { display_name: "Rent Payment",             earn_rate_percent: 0,  spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment:       { display_name: "Insurance Payment",        earn_rate_percent: 0,  spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions",  earn_rate_percent: 0,  spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities:               { display_name: "Utilities",                earn_rate_percent: 0,  spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel:                    { display_name: "Fuel",                     earn_rate_percent: 0,  spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },

  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Axis Travel EDGE",
    template: {
      routing: "Book your flights or hotels via {display_name}",
    },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 16, categories: ["flights"], spend_limit: null, earn_limit: null },
      hotels:  { display_name: "Hotels",  earn_rate_percent: 33, categories: ["hotels"],  spend_limit: null, earn_limit: null },
    },
  },

  vouchers: [
    {
      rail_type: "Voucher Portal",
      display_name: "Gift EDGE",
      earn_rate_percent: 2,
      template: {
        routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
        voucher_discount: "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
      },
      merchants: {
        amazon_pay: { display_name: "Amazon Pay Voucher", merchant_name: "Amazon Pay", additional_discount: 4, spend_limit_monthly: null, surcharge_percent: 0, usage_instructions: "Add to Amazon Pay wallet and use at checkout.", categories: ["ecommerce", "shopping", "grocery"], frontend_tags: ["Online Shopping", "Grocery"] },
        swiggy:     { display_name: "Swiggy Voucher",     merchant_name: "Swiggy",     additional_discount: 3, spend_limit_monthly: 5000, surcharge_percent: 0, usage_instructions: "Redeem via Swiggy app under Offers > Vouchers.",         categories: ["dining", "grocery"],              frontend_tags: ["Food Delivery", "Dining"] },
        zomato:     { display_name: "Zomato Voucher",     merchant_name: "Zomato",     additional_discount: 3, spend_limit_monthly: 5000, surcharge_percent: 0, usage_instructions: "Redeem via Zomato app under Payment > Gift Cards.",      categories: ["dining", "grocery"],              frontend_tags: ["Food Delivery", "Dining"] },
        myntra:     { display_name: "Myntra Voucher",     merchant_name: "Myntra",     additional_discount: 3, spend_limit_monthly: 5000, surcharge_percent: 0, usage_instructions: "Apply voucher code at Myntra checkout.",                  categories: ["shopping", "ecommerce"],          frontend_tags: ["Fashion", "Shopping"] },
      },
    },
  ],

  reward_program: {
    reward_currency: {
      code: "axis_edge_miles",
      display_name: "EDGE Miles",
      type: "miles",
    },
    valuation_profiles: [
      { id: "x1", rupee_value_per_unit: 0.35, description: "Low-end" },
      { id: "x2", rupee_value_per_unit: 0.6,  description: "Typical" },
      { id: "x3", rupee_value_per_unit: 1.0,  description: "Optimized" },
    ],
    default_valuation_profile_id: "x3",
  },
};
```
