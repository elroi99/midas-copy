Excellent. We will now formalize:

1. The standardized user-facing spend enum (global spend inputs) ( depending on the card, we can include some of these or exclude some of these)
2. A fully annotated sample card config
3. Clear explanation of each section and why it exists

This will serve as a reference architecture document.

---

# Part 1: Standardized User-Facing Spend Categories (Global Enum)

These are the canonical spend inputs collected from all users.

They are:

- Card-agnostic
- UI-facing
- Normalized before calculation
- Stable across all cards
- ( Although we will not be doing this, we can , depending on the card, add new inputs or only expose a couple of inputs to our users -- this is doable because we will aggregate them for calculations)

These represent real-world spending, not reward constructs.

---

## Global Spend Inputs (Enum)

```ts
export const SPEND_INPUTS = {
  // -------------------------
  // Online Shopping
  // -------------------------
  amazon: { period: "monthly" },
  flipkart: { period: "monthly" },
  other_online_spends: { period: "monthly" },
  other_offline_spends: { period: "monthly" },

  // -------------------------
  // Bills & Utilities
  // -------------------------
  mobile_phone_bills: { period: "monthly" },
  electricity_bills: { period: "monthly" },
  water_bills: { period: "monthly" },
  insurance_health_annual: { period: "annual" },
  insurance_car_or_bike_annual: { period: "annual" },
  rent: { period: "monthly" },
  school_fees: { period: "monthly" },

  // -------------------------
  // Groceries
  // -------------------------
  grocery_spends_online: { period: "monthly" },

  // -------------------------
  // Food Ordering
  // -------------------------
  online_food_ordering: { period: "monthly" },

  // -------------------------
  // Fuel
  // -------------------------
  fuel: { period: "monthly" },

  // -------------------------
  // Dining Out
  // -------------------------
  dining_or_going_out: { period: "monthly" },

  // -------------------------
  // Travel
  // -------------------------
  flights_annual: { period: "annual" },
  hotels_annual: { period: "annual" },

  // Lounge usage (non-monetary but benefit tracking)
  domestic_lounge_usage_quarterly: { period: "quarterly" },
  international_lounge_usage_quarterly: { period: "quarterly" },
};
```

---

## Why This Exists

This layer ensures:

- Every card receives identical user inputs
- Time periods are explicit
- No card config contaminates UI structure
- Cross-card comparison is fair

This is the foundation of comparability.

---

# Part 2: Fully Annotated Sample Card Config

Hypothetical HDFC Infinia with Milestones

Below is a complete example reflecting our final architecture.

---

```ts
export const HYPOTHETICAL_INFINIA_WITH_MILESTONES = {
  // -------------------------------------
  // Card Identity
  // -------------------------------------
  card_id: "hdfc_infinia_milestone",
  card_name: "HDFC Infinia (Hypothetical with Milestones)",

  // -------------------------------------
  // Base Reward Rate (fallback)
  // -------------------------------------
  base_rate_percent: 3.33,
  // Applied when:
  // - Accelerated pool exhausted
  // - Category has no acceleration
  // - Remaining spend after acceleration

  // -------------------------------------
  // Spend Aggregation Layer
  // Used after call reward calculation is done
  // Useful for UI and reporting. ie. useful for commenting on the performance of a card in one particular semantic spend bucket eg online_shopping or travel etc
  // -------------------------------------
  spend_sums: {
    online_retail: {
      sum_of: ["amazon", "flipkart", "other_online_spends"],
    },

    offline_retail: {
      sum_of: ["other_offline_spends"],
    },

    groceries: {
      sum_of: ["grocery_spends_online"],
    },

    food_delivery: {
      sum_of: ["online_food_ordering"],
    },

    fuel_spend: {
      sum_of: ["fuel"],
    },

    dining_spend: {
      sum_of: ["dining_or_going_out"],
    },

    flights: {
      sum_of: ["flights_annual"],
    },

    hotels: {
      sum_of: ["hotels_annual"],
    },

    insurance_spend: {
      sum_of: ["insurance_health_annual", "insurance_car_or_bike_annual"],
    },

    rent_spend: {
      sum_of: ["rent"],
    },

    utilities: {
      sum_of: [
        "mobile_phone_bills",
        "electricity_bills",
        "water_bills",
        "school_fees",
      ],
    },
  },

  // -------------------------------------
  // Routing Layer
  // Defines deterministic execution path
  // -------------------------------------
  routing: {
    online_retail: {
      rail_id: "vouchers",
      category_id: "amazon_shopping",
    },

    groceries: {
      rail_id: "vouchers",
      category_id: "amazon_shopping",
    },

    food_delivery: {
      rail_id: "vouchers",
      category_id: "amazon_shopping",
    },

    flights: {
      rail_id: "accelerated_portal",
      category_id: "flights",
    },

    hotels: {
      rail_id: "accelerated_portal",
      category_id: "hotels",
    },

    rent_spend: {
      rail_id: "third_party",
      category_id: "red_giraffe",
    },

    insurance_spend: {
      rail_id: "vouchers",
      category_id: "amazon_pay",
    },

    utilities: {
      rail_id: "direct",
      category_id: "standard",
    },

    fuel_spend: {
      rail_id: "direct",
      category_id: "standard",
    },

    dining_spend: {
      rail_id: "direct",
      category_id: "standard",
    },

    offline_retail: {
      rail_id: "direct",
      category_id: "standard",
    },
  },

  // -------------------------------------
  // Rails and Categories
  // -------------------------------------
  rails: {
    accelerated_portal: {
      categories: {
        flights: {
          earn_rate_percent: 16,
          reward_pool_id: "accelerated_portal_pool",
        },

        hotels: {
          earn_rate_percent: 33,
          reward_pool_id: "accelerated_portal_pool",
        },
      },
    },

    vouchers: {
      categories: {
        amazon_shopping: {
          earn_rate_percent: 16,
          additional_discount : 2,
          reward_pool_id: "accelerated_portal_pool",
          spend_limit_id: "amazon_shopping_limit",
        },

        amazon_pay: {
          earn_rate_percent: 16,
          additional_discount : 4,
          reward_pool_id: "accelerated_portal_pool",
          spend_limit_id: "amazon_pay_limit",
        },
      },
    },

    direct: {
      categories: {
        standard: {
          earn_rate_percent: 0,
          // Base rate applies
        },
      },
    },

    third_party: {
      categories: {
        red_giraffe: {
          earn_rate_percent: 0,
          milestone_excluded: true,
        },
        houisng : {
          earn_rate_percent : 2,
          milestone_excluded : true,
        }
      },
    },
  },

  // -------------------------------------
  // Reward Pools (Accelerated Caps)
  // -------------------------------------
  reward_pools: {
    accelerated_portal_pool: {
      max_points: 10000,
      // Shared across flights, hotels, vouchers
    },
  },

  // -------------------------------------
  // Spend Limits (Currency Caps)
  // -------------------------------------
  spend_limits: {
    amazon_shopping_limit: {
      max_spend: 10000,
    },

    amazon_pay_limit: {
      max_spend: 10000,
    },
  },

  // -------------------------------------
  // Milestones (Yearly)
  // -------------------------------------
  milestones: [
    {
      threshold: 750000,
      bonus_points: 5000,
    },

    {
      threshold: 1500000,
      bonus_points: 5000,
    },
  ],

  // -------------------------------------
  // Spend-Based Fee Waiver
  // -------------------------------------
  spend_based_waiver: {
    threshold: 800000,
  },
  reward_program: {
    reward_currency: {
      code: "HDFC_tier_one",
      display_name: "HDFC_tier_one",
      type: "points", // "points" | "miles" | "cashback"
    },
    valuation_profiles: [
      {
        id: "x1",
        rupee_value_per_unit: 0.4,
        description:
          "Low-end redemption value (statement credit / weak transfer)",
      },
      {
        id: "x2",
        rupee_value_per_unit: 0.75,
        description: "Typical travel or voucher redemption value",
      },
      {
        id: "x3",
        rupee_value_per_unit: 1.2,
        description: "Optimized airline or premium hotel transfers",
      },
    ],
    default_valuation_profile_id: "x3",
  },
};
```

---

# Why This Structure Is Correct

### 1. Decouples UI from card logic

### 2. Keeps routing deterministic

### 3. Separates spend limits from reward pools

### 4. Supports shared accelerated pools

### 5. Supports milestone eligibility flags

### 6. Allows extension without changing algorithm



# Final Architecture Summary

| Layer        | Responsibility                  |
| ------------ | ------------------------------- |
| SPEND_INPUTS | Standardized user reality (with labels) |
| routing      | Deterministic execution mapping |
| rails        | Reward behavior definitions (with portal names) |
| categories   | Specific earn rules (with merchant names) |
| templates    | Natural language blueprints (user/technical) |
| reward_pools | Accelerated caps                |
| spend_limits | Currency caps                   |
| milestones   | Threshold bonuses               |
| waivers      | Fee removal logic               |
| spend_sums   | User-friendly buckets           |
| reward_program | Currency and valuation logic   |

---


