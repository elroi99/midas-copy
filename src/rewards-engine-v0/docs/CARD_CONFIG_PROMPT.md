# Card Config Generation Prompt (v0)

Use this prompt to generate a `CardConfigV0` TypeScript export from raw card data.
Copy everything from the horizontal rule below into a new chat, then append your card data at the end.

---

## System Context

You are generating a TypeScript constant that conforms to the `CardConfigV0` interface used in a credit card rewards engine. Output **only** the TypeScript `export const` statement — no prose, no markdown fences, no explanation.

---

## Types Reference

```typescript
// All valid category keys
const STANDARD_CATEGORIES = [
  "flights", "shopping", "ecommerce", "grocery", "dining", "movies", "hotels",
  "railways", "educational_institutions", "gold_jewellery", "rent_payment",
  "insurance_payment", "government_transactions", "utilities", "fuel"
] as const;
type StandardCategory = (typeof STANDARD_CATEGORIES)[number];

// All valid merchant keys
const MERCHANT_NAMES = [
  "zepto", "blinkit", "swiggy", "amazon", "flipkart", "zomato",
  "eazydiner", "myntra", "amazon_pay"
] as const;
type MerchantName = (typeof MERCHANT_NAMES)[number];

interface DirectBaseConfig {
  earn_rate_percent: number;
}

interface DirectMerchantConfig {
  display_name: string;
  earn_rate_percent: number;
  spend_limit: number | null;   // monthly cap on eligible spend in ₹; null = uncapped
  earn_limit: number | null;    // cap on points/miles earned; null = uncapped
  categories: StandardCategory[];
}

interface DirectSpendCategoryConfig {
  display_name: string;
  earn_rate_percent: number;
  spend_limit: number | null;
  earn_limit: number | null;
  categories: StandardCategory[];
}

interface DirectRailV0 {
  base: DirectBaseConfig;
  merchants: Partial<Record<MerchantName, DirectMerchantConfig>>;
  spend_categories: Partial<Record<StandardCategory, DirectSpendCategoryConfig>>;
}

interface AcceleratedPortalCategoryConfig {
  display_name: string;
  earn_rate_percent: number;
  spend_limit: number | null;
  earn_limit: number | null;
  categories: StandardCategory[];
}

interface AcceleratedPortalRailV0 {
  rail_type: string;
  display_name: string;           // name of the portal, e.g. "Axis Travel EDGE"
  template: { routing: string };  // use "{display_name}" as placeholder
  categories: {
    flights?: AcceleratedPortalCategoryConfig;
    hotels?: AcceleratedPortalCategoryConfig;
  };
}

interface VoucherMerchantConfig {
  display_name: string;
  merchant_name: string;
  additional_discount: number;      // upfront % discount on voucher face value
  spend_limit_monthly: number | null;
  surcharge_percent: number;        // 0 if none
  usage_instructions: string;
  categories: StandardCategory[];
  frontend_tags: string[];
}

interface VoucherPortalConfig {
  rail_type: string;
  display_name: string;
  earn_rate_percent: number;
  template: { routing: string; voucher_discount?: string };
  merchants: Partial<Record<MerchantName, VoucherMerchantConfig>>;
}

interface ValuationProfileV0 {
  id: string;
  rupee_value_per_unit: number;
  description?: string;
}

interface RewardProgramV0 {
  reward_currency: {
    code: string;         // e.g. "hdfc_reward_points", "axis_edge_miles"
    display_name: string; // e.g. "Reward Points", "EDGE Miles"
    type: "points" | "miles" | "cashback";
  };
  valuation_profiles: ValuationProfileV0[];
  default_valuation_profile_id: string;
}

interface CardConfigV0 {
  card_id: string;           // snake_case, e.g. "hdfc_infinia"
  display_name: string;      // full card name
  direct: DirectRailV0;
  accelerated_portal?: AcceleratedPortalRailV0;  // omit if card has no travel portal
  vouchers: VoucherPortalConfig[];               // use [] if no voucher program
  reward_program: RewardProgramV0;
}
```

---

## Defaults (apply these when the user does not specify)

| Field | Default |
|-------|---------|
| `direct.merchants` | `{}` (empty — fill only when merchant-specific rates are given) |
| `vouchers` | `[]` (empty — filled separately later) |
| `spend_limit` | `null` (uncapped) |
| `earn_limit` | `null` (uncapped) |
| `spend_limit_monthly` on voucher merchants | `null` |
| `surcharge_percent` on voucher merchants | `0` |
| `accelerated_portal` | omit the key entirely if no portal rates are given |
| `direct.spend_categories` | Populate **all 15** `STANDARD_CATEGORIES`. Use the overridden rate for categories explicitly given; use `direct.base.earn_rate_percent` for all others. |

---

## Output Format

```typescript
import { CardConfigV0 } from "@/src/rewards-engine-v0/types";

export const CARD_NAME_V0: CardConfigV0 = {
  // … full object
};
```

Name the constant in `SCREAMING_SNAKE_CASE` with a `_V0` suffix.

---

## Example (Minimal — 1 category override, no portal, no vouchers)

**Input data:**
- Card: "HDFC MoneyBack+"  
- Base rate: 2%  
- Override: dining → 5%  
- Reward program: cashback, 1 paisa per unit, default profile "standard"

**Expected output:**

```typescript
import { CardConfigV0 } from "@/src/rewards-engine-v0/types";

export const HDFC_MONEYBACK_PLUS_V0: CardConfigV0 = {
  card_id: "hdfc_moneyback_plus",
  display_name: "HDFC MoneyBack+",
  direct: {
    base: { earn_rate_percent: 2 },
    merchants: {},
    spend_categories: {
      flights:                  { display_name: "Flights",                  earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping:                 { display_name: "Shopping",                 earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce:                { display_name: "E-Commerce",               earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery:                  { display_name: "Grocery",                  earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining:                   { display_name: "Dining",                   earn_rate_percent: 5,  spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies:                   { display_name: "Movies",                   earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels:                   { display_name: "Hotels",                   earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways:                 { display_name: "Railways",                 earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Education",               earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery:           { display_name: "Gold & Jewellery",         earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment:             { display_name: "Rent",                     earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment:        { display_name: "Insurance",                earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions:  { display_name: "Government Transactions",  earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities:                { display_name: "Utilities",                earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel:                     { display_name: "Fuel",                     earn_rate_percent: 2,  spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "hdfc_cashback", display_name: "Cashback", type: "cashback" },
    valuation_profiles: [
      { id: "standard", rupee_value_per_unit: 1.0, description: "1 paisa per unit" },
    ],
    default_valuation_profile_id: "standard",
  },
};
```

---

## Card Data

<!-- Paste your raw card data below this line -->
