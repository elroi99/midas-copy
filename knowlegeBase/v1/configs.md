1. **Global `spend_inputs` config**

   * Common across all cards
   * Defines *what inputs exist* and *their time period* (monthly vs annual)
   * Powers normalization
   * Stable, slow-changing

2. **Card-specific reward config (e.g. HDFC Infinia with milestones)**

   * Translates inputs into card spend categories (`spend_sums`)
   * Defines routing, earn rates, limits, pools, restrictions, milestones
   * Fast-changing, issuer-specific
   * Drives the entire reward calculation


### Config 1: Global spend input normalization config (unchanged, correct)
```JSON
   {
  "amazon": { "period": "monthly" },
  "flipkart": { "period": "monthly" },
  "other_online_spends": { "period": "monthly" },
  "other_offline_spends": { "period": "monthly" },

  "mobile_phone_bills": { "period": "monthly" },
  "electricity_bills": { "period": "monthly" },
  "water_bills": { "period": "monthly" },

  "insurance_health_annual": { "period": "annual" },
  "insurance_car_or_bike_annual": { "period": "annual" },

  "rent": { "period": "monthly" },
  "school_fees": { "period": "monthly" },

  "grocery_spends_online": { "period": "monthly" },
  "online_food_ordering": { "period": "monthly" },

  "fuel": { "period": "monthly" },
  "dining_or_going_out": { "period": "monthly" },

  "flights_annual": { "period": "annual" },
  "hotels_annual": { "period": "annual" }
}
```

### Config 2: Hypothetical HDFC Infinia with milestones corrected
```ts
const INFINIA_WITH_MILESTONES_CONFIG = {
  "card_id": "hdfc_infinia_milestones",
  "card_name": "HDFC Infinia (Hypothetical – With Milestones)",
  "base_rate_percent": 3.33,

  "spend_sums": {
    "shopping": {
      "sum_of": [
        "amazon",
        "flipkart",
        "other_online_spends",
        "other_offline_spends"
      ]
    },
    "utilities": {
      "sum_of": [
        "mobile_phone_bills",
        "electricity_bills",
        "water_bills"
      ]
    },
    "insurance": {
      "sum_of": [
        "insurance_health_annual",
        "insurance_car_or_bike_annual"
      ]
    },
    "rent": {
      "sum_of": ["rent"]
    },
    "education": {
      "sum_of": ["school_fees"]
    },
    "groceries": {
      "sum_of": ["grocery_spends_online"]
    },
    "food_delivery": {
      "sum_of": ["online_food_ordering"]
    },
    "fuel": {
      "sum_of": ["fuel"]
    },
    "dining": {
      "sum_of": ["dining_or_going_out"]
    },
    "travel_flights": {
      "sum_of": ["flights_annual"]
    },
    "travel_hotels": {
      "sum_of": ["hotels_annual"]
    }
  },

  "spend_intent_routing": {
    "shopping": {
      "rail_id": "vouchers",
      "category_id": "flat"
    },
    "utilities": {
      "rail_id": "vouchers",
      "category_id": "flat"
    },
    "insurance": {
      "rail_id": "vouchers",
      "category_id": "amazon_pay"
    },
    "rent": {
      "rail_id": "red_giraffe",
      "category_id": "rent"
    },
    "education": {
      "rail_id": "direct",
      "category_id": "education"
    },
    "groceries": {
      "rail_id": "vouchers",
      "category_id": "flat"
    },
    "food_delivery": {
      "rail_id": "vouchers",
      "category_id": "flat"
    },
    "fuel": {
      "rail_id": "direct",
      "category_id": "fuel"
    },
    "dining": {
      "rail_id": "direct",
      "category_id": "dining"
    },
    "travel_flights": {
      "rail_id": "accelerated_portal",
      "category_id": "flights"
    },
    "travel_hotels": {
      "rail_id": "accelerated_portal",
      "category_id": "hotels"
    }
  },

  "rails": {
    "accelerated_portal": {
      "categories": {
        "flights": {
          "earn_rate_percent": 16,
          "reward_pool_id": "accelerated_portal_pool"
        },
        "hotels": {
          "earn_rate_percent": 33,
          "reward_pool_id": "accelerated_portal_pool"
        }
      }
    },

    "vouchers": {
      "categories": {
        "flat": {
          "earn_rate_percent": 16,
          "additional_discount" : 2,
          "reward_pool_id": "accelerated_portal_pool"
        },
        "amazon_pay": {
          "earn_rate_percent": 16,
          "additional_discount" : 4,
          "spend_limit_id": "amazon_pay_voucher_limit",
          "reward_pool_id": "accelerated_portal_pool"
        }
      }
    },

    "direct": {
      "categories": {
        "dining": {
          "earn_rate_percent": 10
        },
        "fuel": {
          "earn_rate_percent": 2
        },
        "education": {
          "earn_rate_percent": 0,
          "restricted": true
        }
      }
    },

    "red_giraffe": {
      "categories": {
        "rent": {
          "earn_rate_percent": 3.33,
          "milestone_excluded": true
        }
      }
    }
  },

  "spend_limits": {
    "amazon_pay_voucher_limit": {
      "max_spend": 10000
    }
  },

  "reward_pools": {
    "accelerated_portal_pool": {
      "max_points": 15000
    }
  },

  "milestones": [
    {
      "threshold": 750000,
      "bonus_points": 5000
    },
    {
      "threshold": 1500000,
      "bonus_points": 5000
    }
  ]
}
```