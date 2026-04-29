import { ALL_GENERATED_CARDS } from "./generated_configs";
import type { CardConfigV0, ValuationProfileV0, VoucherPortalConfig } from "./types";

// ─── Temp Fake Valuation Profile ─────────────────────────────────────────────
// Remove this const and all TEMP_FAKE_VALUATION_PROFILE spread references once
// real valuation profiles are confirmed per card.
export const TEMP_FAKE_VALUATION_PROFILE: ValuationProfileV0 = {
  id: "temp_fake",
  rupee_value_per_unit: 1.0,
  description: "Temporary Fake",
};

const VoucherPortals: VoucherPortalConfig[] = [
  {
    rail_type: "Voucher Portal",
    display_name: "Gift EDGE",
    earn_rate_percent: 0.02,
    template: {
      routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
      voucher_discount:
        "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
    },
    merchants: {
      amazon_pay: {
        display_name: "Amazon Pay Voucher",
        merchant_name: "Amazon Pay",
        additional_discount: 0.04,
        spend_limit_monthly: null,
        surcharge_percent: 0,
        usage_instructions: "Add to Amazon Pay wallet and use at checkout.",
        categories: ["ecommerce", "shopping", "grocery"],
        frontend_tags: ["Online Shopping", "Grocery"],
      },
      swiggy: {
        display_name: "Swiggy Voucher",
        merchant_name: "Swiggy",
        additional_discount: 0.03,
        spend_limit_monthly: 5000,
        surcharge_percent: 0,
        usage_instructions: "Redeem via Swiggy app under Offers > Vouchers.",
        categories: ["dining", "grocery"],
        frontend_tags: ["Food Delivery", "Dining"],
      },
      zomato: {
        display_name: "Zomato Voucher",
        merchant_name: "Zomato",
        additional_discount: 0.03,
        spend_limit_monthly: 5000,
        surcharge_percent: 0,
        usage_instructions: "Redeem via Zomato app under Payment > Gift Cards.",
        categories: ["dining", "grocery"],
        frontend_tags: ["Food Delivery", "Dining"],
      },
      myntra: {
        display_name: "Myntra Voucher",
        merchant_name: "Myntra",
        additional_discount: 0.03,
        spend_limit_monthly: 5000,
        surcharge_percent: 0,
        usage_instructions: "Apply voucher code at Myntra checkout under payment options.",
        categories: ["shopping", "ecommerce"],
        frontend_tags: ["Fashion", "Shopping"],
      },
    },
  },
]



const MAXIMIZE_MERCHANTS: VoucherPortalConfig['merchants'] = {
  amazon_pay: {
    display_name: "Amazon Pay Voucher",
    merchant_name: "Amazon Pay",
    additional_discount: 0.05,
    spend_limit_monthly: null,
    surcharge_percent: 0,
    usage_instructions: "Add to Amazon Pay wallet and use at checkout.",
    categories: ["ecommerce", "shopping", "grocery"],
    frontend_tags: ["Online Shopping", "Grocery"],
  },
  swiggy: {
    display_name: "Swiggy Voucher",
    merchant_name: "Swiggy",
    additional_discount: 0.04,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Redeem via Swiggy app under Offers > Vouchers.",
    categories: ["dining", "grocery"],
    frontend_tags: ["Food Delivery", "Dining"],
  },
  zomato: {
    display_name: "Zomato Voucher",
    merchant_name: "Zomato",
    additional_discount: 0.04,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Redeem via Zomato app under Payment > Gift Cards.",
    categories: ["dining", "grocery"],
    frontend_tags: ["Food Delivery", "Dining"],
  },
  myntra: {
    display_name: "Myntra Voucher",
    merchant_name: "Myntra",
    additional_discount: 0.02,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Apply voucher code at Myntra checkout under payment options.",
    categories: ["shopping", "ecommerce"],
    frontend_tags: ["Fashion", "Shopping"],
  },
}

export const GIFT_EDGE_MERCHANTS: VoucherPortalConfig['merchants'] = {
  amazon_pay: {
    display_name: "Amazon Pay Voucher",
    merchant_name: "Amazon Pay",
    additional_discount: 0.04,
    spend_limit_monthly: null,
    surcharge_percent: 0,
    usage_instructions: "Add to Amazon Pay wallet and use at checkout.",
    categories: ["ecommerce", "shopping", "grocery"],
    frontend_tags: ["Online Shopping", "Grocery"],
  },
  swiggy: {
    display_name: "Swiggy Voucher",
    merchant_name: "Swiggy",
    additional_discount: 0.03,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Redeem via Swiggy app under Offers > Vouchers.",
    categories: ["dining", "grocery"],
    frontend_tags: ["Food Delivery", "Dining"],
  },
  zomato: {
    display_name: "Zomato Voucher",
    merchant_name: "Zomato",
    additional_discount: 0.03,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Redeem via Zomato app under Payment > Gift Cards.",
    categories: ["dining", "grocery"],
    frontend_tags: ["Food Delivery", "Dining"],
  },
  myntra: {
    display_name: "Myntra Voucher",
    merchant_name: "Myntra",
    additional_discount: 0.03,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Apply voucher code at Myntra checkout under payment options.",
    categories: ["shopping", "ecommerce"],
    frontend_tags: ["Fashion", "Shopping"],
  },
}

const SMARTBUY_MERCHANTS: VoucherPortalConfig['merchants'] = {
  amazon_pay: {
    display_name: "Amazon Pay Voucher",
    merchant_name: "Amazon Pay",
    additional_discount: 0.03,
    spend_limit_monthly: null,
    surcharge_percent: 0,
    usage_instructions: "Add to Amazon Pay wallet and use at checkout.",
    categories: ["ecommerce", "shopping", "grocery"],
    frontend_tags: ["Online Shopping", "Grocery"],
  },
  swiggy: {
    display_name: "Swiggy Voucher",
    merchant_name: "Swiggy",
    additional_discount: 0.04,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Redeem via Swiggy app under Offers > Vouchers.",
    categories: ["dining", "grocery"],
    frontend_tags: ["Food Delivery", "Dining"],
  },
  zomato: {
    display_name: "Zomato Voucher",
    merchant_name: "Zomato",
    additional_discount: 0.02,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Redeem via Zomato app under Payment > Gift Cards.",
    categories: ["dining", "grocery"],
    frontend_tags: ["Food Delivery", "Dining"],
  },
  myntra: {
    display_name: "Myntra Voucher",
    merchant_name: "Myntra",
    additional_discount: 0.04,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Apply voucher code at Myntra checkout under payment options.",
    categories: ["shopping", "ecommerce"],
    frontend_tags: ["Fashion", "Shopping"],
  },
  "reliance_smart": {
    display_name: "Reliance Smart Voucher",
    merchant_name: "Reliance Smart",
    additional_discount: 0.04,
    spend_limit_monthly: 5000,
    surcharge_percent: 0,
    usage_instructions: "Apply voucher code at Myntra checkout under payment options.",
    categories: ["shopping", "ecommerce"],
    frontend_tags: ["Fashion", "Shopping"],
  },
}


export const VoucherPortalsNew: VoucherPortalConfig[] = [
  {
    rail_type: "Voucher Portal",
    display_name: "Gift EDGE",
    earn_rate_percent: 0.02,
    template: {
      routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
      voucher_discount: "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
    },
    merchants: GIFT_EDGE_MERCHANTS,
  },
  {
    rail_type: "Voucher Portal",
    display_name: "Maximize",
    earn_rate_percent: 0,
    template: {
      routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
      voucher_discount: "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
    },
    merchants: MAXIMIZE_MERCHANTS,
  },
  {
    rail_type: "Voucher Portal",
    display_name: "SmartBuy Vouchers",
    earn_rate_percent: 0.0333,
    template: {
      routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
      voucher_discount: "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
    },
    merchants: SMARTBUY_MERCHANTS,
  },
];

// it is basically VoucherPortalsNew[0]
export const SIMULATED_GIFT_EDGE = {
  rail_type: "Voucher Portal",
  display_name: "Gift EDGE",
  earn_rate_percent: 0.02,
  template: {
    routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
    voucher_discount: "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
  },
  merchants: {
    amazon_pay: {
      display_name: "Amazon Pay Voucher",
      merchant_name: "Amazon Pay",
      additional_discount: 0.04,
      spend_limit_monthly: null,
      surcharge_percent: 0,
      usage_instructions: "Add to Amazon Pay wallet and use at checkout.",
      categories: ["ecommerce", "shopping", "grocery"],
      frontend_tags: ["Online Shopping", "Grocery"],
    },
    swiggy: {
      display_name: "Swiggy Voucher",
      merchant_name: "Swiggy",
      additional_discount: 0.03,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Redeem via Swiggy app under Offers > Vouchers.",
      categories: ["dining", "grocery"],
      frontend_tags: ["Food Delivery", "Dining"],
    },
    zomato: {
      display_name: "Zomato Voucher",
      merchant_name: "Zomato",
      additional_discount: 0.03,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Redeem via Zomato app under Payment > Gift Cards.",
      categories: ["dining", "grocery"],
      frontend_tags: ["Food Delivery", "Dining"],
    },
    myntra: {
      display_name: "Myntra Voucher",
      merchant_name: "Myntra",
      additional_discount: 0.03,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Apply voucher code at Myntra checkout under payment options.",
      categories: ["shopping", "ecommerce"],
      frontend_tags: ["Fashion", "Shopping"],
    },
  },
}

// it is basically VoucherPortalsNew[0]
export const SIMULATED_MAXIMIZE = {
  rail_type: "Voucher Portal",
  display_name: "Maximize",
  earn_rate_percent: 0,
  template: {
    routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
    voucher_discount: "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
  },
  merchants: {
    amazon_pay: {
      display_name: "Amazon Pay Voucher",
      merchant_name: "Amazon Pay",
      additional_discount: 0.05,
      spend_limit_monthly: null,
      surcharge_percent: 0,
      usage_instructions: "Add to Amazon Pay wallet and use at checkout.",
      categories: ["ecommerce", "shopping", "grocery"],
      frontend_tags: ["Online Shopping", "Grocery"],
    },
    swiggy: {
      display_name: "Swiggy Voucher",
      merchant_name: "Swiggy",
      additional_discount: 0.04,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Redeem via Swiggy app under Offers > Vouchers.",
      categories: ["dining", "grocery"],
      frontend_tags: ["Food Delivery", "Dining"],
    },
    zomato: {
      display_name: "Zomato Voucher",
      merchant_name: "Zomato",
      additional_discount: 0.04,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Redeem via Zomato app under Payment > Gift Cards.",
      categories: ["dining", "grocery"],
      frontend_tags: ["Food Delivery", "Dining"],
    },
    myntra: {
      display_name: "Myntra Voucher",
      merchant_name: "Myntra",
      additional_discount: 0.02,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Apply voucher code at Myntra checkout under payment options.",
      categories: ["shopping", "ecommerce"],
      frontend_tags: ["Fashion", "Shopping"],
    },
  },
}

// it is basically VoucherPortalsNew[0]
export const SIMULATED_SMARTBUY = {
  rail_type: "Voucher Portal",
  display_name: "SmartBuy Vouchers",
  earn_rate_percent: 0.0333,
  template: {
    routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
    voucher_discount: "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
  },
  merchants: {
    amazon_pay: {
      display_name: "Amazon Pay Voucher",
      merchant_name: "Amazon Pay",
      additional_discount: 0.03,
      spend_limit_monthly: null,
      surcharge_percent: 0,
      usage_instructions: "Add to Amazon Pay wallet and use at checkout.",
      categories: ["ecommerce", "shopping", "grocery"],
      frontend_tags: ["Online Shopping", "Grocery"],
    },
    swiggy: {
      display_name: "Swiggy Voucher",
      merchant_name: "Swiggy",
      additional_discount: 0.04,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Redeem via Swiggy app under Offers > Vouchers.",
      categories: ["dining", "grocery"],
      frontend_tags: ["Food Delivery", "Dining"],
    },
    zomato: {
      display_name: "Zomato Voucher",
      merchant_name: "Zomato",
      additional_discount: 0.02,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Redeem via Zomato app under Payment > Gift Cards.",
      categories: ["dining", "grocery"],
      frontend_tags: ["Food Delivery", "Dining"],
    },
    myntra: {
      display_name: "Myntra Voucher",
      merchant_name: "Myntra",
      additional_discount: 0.04,
      spend_limit_monthly: 5000,
      surcharge_percent: 0,
      usage_instructions: "Apply voucher code at Myntra checkout under payment options.",
      categories: ["shopping", "ecommerce"],
      frontend_tags: ["Fashion", "Shopping"],
    },
  },
}

export const AXIS_ATLAS_V0: CardConfigV0 = {
  card_id: "axis_atlas",
  display_name: "Axis Bank Atlas Credit Card",

  direct: {
    base: {
      earn_rate_percent: 0.02,
    },
    merchants: {
      zepto: {
        display_name: "Zepto",
        earn_rate_percent: 0.02,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["grocery", "ecommerce"],
      },
      swiggy: {
        display_name: "Swiggy",
        earn_rate_percent: 0.02,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["dining", "grocery"],
      },
      amazon: {
        display_name: "Amazon",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce", "shopping"],
      },
      flipkart: {
        display_name: "Flipkart",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce", "shopping"],
      },
      zomato: {
        display_name: "Zomato",
        earn_rate_percent: 0.02,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["dining", "grocery"],
      },
      myntra: {
        display_name: "Myntra",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["shopping", "ecommerce"],
      },
    },

    spend_categories: {
      flights: {
        display_name: "Flights",
        earn_rate_percent: 0.12,
        spend_limit: null,
        earn_limit: null,
        categories: ["flights"],
      },
      shopping: {
        display_name: "Shopping",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["shopping"],
      },
      ecommerce: {
        display_name: "Ecommerce",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce"],
      },
      grocery: {
        display_name: "Grocery",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["grocery"],
      },
      dining: {
        display_name: "Dining",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["dining"],
      },
      movies: {
        display_name: "Movies",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["movies"],
      },
      hotels: {
        display_name: "Hotels",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["hotels"],
      },
      railways: {
        display_name: "Railways",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["railways"],
      },
      educational_institutions: {
        display_name: "Educational Institutions",
        earn_rate_percent: 0.02,
        spend_limit: null,
        earn_limit: null,
        categories: ["educational_institutions"],
      },
      gold_jewellery: {
        display_name: "Gold Jewellery",
        earn_rate_percent: 0,
        spend_limit: null,
        earn_limit: null,
        categories: ["gold_jewellery"],
      },
      rent_payment: {
        display_name: "Rent Payment",
        earn_rate_percent: 0,
        spend_limit: null,
        earn_limit: null,
        categories: ["rent_payment"],
      },
      insurance_payment: {
        display_name: "Insurance Payment",
        earn_rate_percent: 0,
        spend_limit: null,
        earn_limit: null,
        categories: ["insurance_payment"],
      },
      government_transactions: {
        display_name: "Government Transactions",
        earn_rate_percent: 0,
        spend_limit: null,
        earn_limit: null,
        categories: ["government_transactions"],
      },
      utilities: {
        display_name: "Utilities",
        earn_rate_percent: 0,
        spend_limit: null,
        earn_limit: null,
        categories: ["utilities"],
      },
      fuel: {
        display_name: "Fuel",
        earn_rate_percent: 0,
        spend_limit: null,
        earn_limit: null,
        categories: ["fuel"],
      },
    },
  },

  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Axis Travel EDGE",
    template: {
      routing: "Book your flights or hotels via {display_name}",
    },
    categories: {
      flights: {
        display_name: "Flights",
        earn_rate_percent: 0.16,
        categories: ["flights"],
        spend_limit: null,
        earn_limit: null,
      },
      hotels: {
        display_name: "Hotels",
        earn_rate_percent: 0.33,
        categories: ["hotels"],
        spend_limit: null,
        earn_limit: null,
      },
    },
  },
  vouchers: VoucherPortalsNew,
  reward_program: {
    reward_currency: {
      code: "axis_edge_miles",
      display_name: "EDGE Miles",
      type: "miles",
    },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "x1", rupee_value_per_unit: 0.35, description: "Low-end" },
      { id: "x2", rupee_value_per_unit: 0.6, description: "Typical" },
      { id: "x3", rupee_value_per_unit: 1.0, description: "Optimized" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// HDFC Infinia Credit Card — v0 Rewards Engine Config

export const HDFC_INFINIA_V0: CardConfigV0 = {
  card_id: "hdfc_infinia",
  display_name: "HDFC Bank Infinia Credit Card",

  direct: {
    base: {
      earn_rate_percent: 0.033,
    },
    merchants: {
      zepto: {
        display_name: "Zepto",
        earn_rate_percent: 0.033,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["grocery", "ecommerce"],
      },
      swiggy: {
        display_name: "Swiggy",
        earn_rate_percent: 0.033,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["dining", "grocery"],
      },
      amazon: {
        display_name: "Amazon",
        earn_rate_percent: 0.033,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce", "shopping"],
      },
      flipkart: {
        display_name: "Flipkart",
        earn_rate_percent: 0.033,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce", "shopping"],
      },
      zomato: {
        display_name: "Zomato",
        earn_rate_percent: 0.033,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["dining", "grocery"],
      },
      myntra: {
        display_name: "Myntra",
        earn_rate_percent: 0.033,
        spend_limit: null,
        earn_limit: null,
        categories: ["shopping", "ecommerce"],
      },
    },

    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0.033, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },

  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "HDFC SmartBuy",
    template: {
      routing: "Book your flights or hotels via {display_name}",
    },
    categories: {
      flights: {
        display_name: "Flights",
        earn_rate_percent: 0.33,
        categories: ["flights"],
        spend_limit: null,
        earn_limit: null,
      },
      hotels: {
        display_name: "Hotels",
        earn_rate_percent: 0.33,
        categories: ["hotels"],
        spend_limit: null,
        earn_limit: null,
      },
    },
  },

  vouchers: VoucherPortalsNew,

  reward_program: {
    reward_currency: {
      code: "hdfc_reward_points",
      display_name: "Reward Points",
      type: "points",
    },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "x1", rupee_value_per_unit: 0.5, description: "Low-end" },
      { id: "x2", rupee_value_per_unit: 1.0, description: "Typical" },
      { id: "x3", rupee_value_per_unit: 1.5, description: "Optimized" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// HDFC Regalia Credit Card — v0 Rewards Engine Config

export const HDFC_REGALIA_V0: CardConfigV0 = {
  card_id: "hdfc_regalia",
  display_name: "HDFC Bank Regalia Credit Card",

  direct: {
    base: {
      earn_rate_percent: 0.013,
    },
    merchants: {
      zepto: {
        display_name: "Zepto",
        earn_rate_percent: 0.013,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["grocery", "ecommerce"],
      },
      swiggy: {
        display_name: "Swiggy",
        earn_rate_percent: 0.013,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["dining", "grocery"],
      },
      amazon: {
        display_name: "Amazon",
        earn_rate_percent: 0.013,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce", "shopping"],
      },
      flipkart: {
        display_name: "Flipkart",
        earn_rate_percent: 0.013,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce", "shopping"],
      },
      zomato: {
        display_name: "Zomato",
        earn_rate_percent: 0.013,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["dining", "grocery"],
      },
      myntra: {
        display_name: "Myntra",
        earn_rate_percent: 0.013,
        spend_limit: null,
        earn_limit: null,
        categories: ["shopping", "ecommerce"],
      },
    },

    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0.013, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },

  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "HDFC SmartBuy",
    template: {
      routing: "Book your flights or hotels via {display_name}",
    },
    categories: {
      flights: {
        display_name: "Flights",
        earn_rate_percent: 0.13,
        categories: ["flights"],
        spend_limit: null,
        earn_limit: null,
      },
      hotels: {
        display_name: "Hotels",
        earn_rate_percent: 0.13,
        categories: ["hotels"],
        spend_limit: null,
        earn_limit: null,
      },
    },
  },

  vouchers: VoucherPortalsNew,

  reward_program: {
    reward_currency: {
      code: "hdfc_reward_points",
      display_name: "Reward Points",
      type: "points",
    },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "x1", rupee_value_per_unit: 0.25, description: "Low-end" },
      { id: "x2", rupee_value_per_unit: 0.5, description: "Typical" },
      { id: "x3", rupee_value_per_unit: 0.75, description: "Optimized" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ICICI Emerald Private Metal Credit Card — v0 Rewards Engine Config

export const ICICI_EMERALD_PRIVATE_METAL_V0: CardConfigV0 = {
  card_id: "icici_emerald_private_metal",
  display_name: "ICICI Bank Emerald Private Metal Credit Card",

  direct: {
    base: {
      earn_rate_percent: 0.03,
    },
    merchants: {
      zepto: {
        display_name: "Zepto",
        earn_rate_percent: 0.03,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["grocery", "ecommerce"],
      },
      swiggy: {
        display_name: "Swiggy",
        earn_rate_percent: 0.03,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["dining", "grocery"],
      },
      amazon: {
        display_name: "Amazon",
        earn_rate_percent: 0.03,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce", "shopping"],
      },
      flipkart: {
        display_name: "Flipkart",
        earn_rate_percent: 0.03,
        spend_limit: null,
        earn_limit: null,
        categories: ["ecommerce", "shopping"],
      },
      zomato: {
        display_name: "Zomato",
        earn_rate_percent: 0.03,
        spend_limit: 3000,
        earn_limit: 200,
        categories: ["dining", "grocery"],
      },
      myntra: {
        display_name: "Myntra",
        earn_rate_percent: 0.03,
        spend_limit: null,
        earn_limit: null,
        categories: ["shopping", "ecommerce"],
      },
    },

    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },

  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "ICICI iShop",
    template: {
      routing: "Book your flights or hotels via {display_name}",
    },
    categories: {
      flights: {
        display_name: "Flights",
        earn_rate_percent: 0.16,
        categories: ["flights"],
        spend_limit: null,
        earn_limit: null,
      },
      hotels: {
        display_name: "Hotels",
        earn_rate_percent: 0.16,
        categories: ["hotels"],
        spend_limit: null,
        earn_limit: null,
      },
    },
  },

  vouchers: VoucherPortalsNew,

  reward_program: {
    reward_currency: {
      code: "icici_paypoints",
      display_name: "ICICI PayPoints",
      type: "points",
    },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "x1", rupee_value_per_unit: 0.25, description: "Low-end" },
      { id: "x2", rupee_value_per_unit: 0.5, description: "Typical" },
      { id: "x3", rupee_value_per_unit: 1.0, description: "Optimized" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── American Express Platinum Travel Credit Card ─────────────────────────────

export const AMEX_PLATINUM_TRAVEL_V0: CardConfigV0 = {
  card_id: "amex_platinum_travel",
  display_name: "American Express Platinum Travel Credit Card",
  direct: {
    base: { earn_rate_percent: 0.02 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Amex Reward Multiplier",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.06, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.06, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: VoucherPortalsNew,
  reward_program: {
    reward_currency: { code: "amex_mr", display_name: "Membership Rewards Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.5, description: "Standard" },
      { id: "optimized", rupee_value_per_unit: 1.0, description: "Optimized via transfers" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── American Express Membership Rewards Credit Card ──────────────────────────

export const AMEX_MEMBERSHIP_REWARDS_V0: CardConfigV0 = {
  card_id: "amex_membership_rewards",
  display_name: "American Express Membership Rewards Credit Card",
  direct: {
    base: { earn_rate_percent: 0.02 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Amex Reward Multiplier",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.04, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.04, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "amex_mr", display_name: "Membership Rewards Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.5, description: "Standard" },
      { id: "optimized", rupee_value_per_unit: 1.0, description: "Optimized via transfers" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── American Express Gold Charge Card ───────────────────────────────────────

export const AMEX_GOLD_CHARGE_V0: CardConfigV0 = {
  card_id: "amex_gold_charge",
  display_name: "American Express Gold Charge Card",
  direct: {
    base: { earn_rate_percent: 0.02 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Amex Reward Multiplier",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "amex_mr", display_name: "Membership Rewards Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.5, description: "Standard" },
      { id: "optimized", rupee_value_per_unit: 1.0, description: "Optimized via transfers" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── American Express Platinum Reserve Credit Card ────────────────────────────

export const AMEX_PLATINUM_RESERVE_V0: CardConfigV0 = {
  card_id: "amex_platinum_reserve",
  display_name: "American Express Platinum Reserve Credit Card",
  direct: {
    base: { earn_rate_percent: 0.02 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Amex Reward Multiplier",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.06, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.06, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "amex_mr", display_name: "Membership Rewards Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.5, description: "Standard" },
      { id: "optimized", rupee_value_per_unit: 1.0, description: "Optimized via transfers" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── American Express SmartEarn Credit Card ───────────────────────────────────

export const AMEX_SMARTEARN_V0: CardConfigV0 = {
  card_id: "amex_smartearn",
  display_name: "American Express SmartEarn Credit Card",
  direct: {
    base: { earn_rate_percent: 0.02 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Amex Reward Multiplier",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.04, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.04, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "amex_mr", display_name: "Membership Rewards Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.5, description: "Standard" },
      { id: "optimized", rupee_value_per_unit: 1.0, description: "Optimized via transfers" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── American Express Platinum Charge Card ────────────────────────────────────

export const AMEX_PLATINUM_CHARGE_V0: CardConfigV0 = {
  card_id: "amex_platinum_charge",
  display_name: "American Express Platinum Charge Card",
  direct: {
    base: { earn_rate_percent: 0.025 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.025, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.025, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.025, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.025, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.025, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.025, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.025, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.025, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Amex Reward Multiplier",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "amex_mr", display_name: "Membership Rewards Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.5, description: "Standard" },
      { id: "optimized", rupee_value_per_unit: 1.0, description: "Optimized via transfers" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── Ixigo AU Credit Card ─────────────────────────────────────────────────────

export const IXIGO_AU_V0: CardConfigV0 = {
  card_id: "ixigo_au",
  display_name: "Ixigo AU Credit Card",
  direct: {
    base: { earn_rate_percent: 0.005 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.005, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.005, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.005, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.005, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.005, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.005, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.005, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.005, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "au_reward_points", display_name: "AU Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── AU Bank Zenith+ Credit Card ──────────────────────────────────────────────

export const AU_BANK_ZENITH_PLUS_V0: CardConfigV0 = {
  card_id: "au_bank_zenith_plus",
  display_name: "AU Bank Zenith+ Credit Card",
  direct: {
    base: { earn_rate_percent: 0.01 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "au_reward_points", display_name: "AU Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── HSBC TravelOne Credit Card ───────────────────────────────────────────────

export const HSBC_TRAVEL_ONE_V0: CardConfigV0 = {
  card_id: "hsbc_travel_one",
  display_name: "HSBC TravelOne Credit Card",
  direct: {
    base: { earn_rate_percent: 0.02 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.02, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Hopper",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.24, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.16, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "hsbc_reward_points", display_name: "HSBC Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── HSBC Visa Platinum Credit Card ──────────────────────────────────────────

export const HSBC_VISA_PLATINUM_V0: CardConfigV0 = {
  card_id: "hsbc_visa_platinum",
  display_name: "HSBC Visa Platinum Credit Card",
  direct: {
    base: { earn_rate_percent: 0.015 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Hopper",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.09, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.06, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "hsbc_reward_points", display_name: "HSBC Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── HSBC Live+ Credit Card ───────────────────────────────────────────────────

export const HSBC_LIVE_PLUS_V0: CardConfigV0 = {
  card_id: "hsbc_live_plus",
  display_name: "HSBC Live+ Credit Card",
  direct: {
    base: { earn_rate_percent: 0.015 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.015, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Hopper",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.09, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.06, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "hsbc_reward_points", display_name: "HSBC Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── HSBC Premier Credit Card ─────────────────────────────────────────────────

export const HSBC_PREMIER_V0: CardConfigV0 = {
  card_id: "hsbc_premier",
  display_name: "HSBC Premier Credit Card",
  direct: {
    base: { earn_rate_percent: 0.03 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Hopper",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.36, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.18, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "hsbc_reward_points", display_name: "HSBC Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── HSBC RuPay Cashback Credit Card ─────────────────────────────────────────

export const HSBC_RUPAY_CASHBACK_V0: CardConfigV0 = {
  card_id: "hsbc_rupay_cashback",
  display_name: "HSBC RuPay Cashback Credit Card",
  direct: {
    base: { earn_rate_percent: 0.01 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.01, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "Hopper",
    template: { routing: "Book your flights or hotels via {display_name}" },
    categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.09, spend_limit: null, earn_limit: null, categories: ["flights"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.06, spend_limit: null, earn_limit: null, categories: ["hotels"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "hsbc_reward_points", display_name: "HSBC Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── IndianOil RBL Bank Credit Card ──────────────────────────────────────────

export const INDIANOIL_RBL_V0: CardConfigV0 = {
  card_id: "indianoil_rbl",
  display_name: "IndianOil RBL Bank Credit Card",
  direct: {
    base: { earn_rate_percent: 0 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0.1, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "rbl_reward_points", display_name: "RBL Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── IndianOil RBL Bank XTRA Credit Card ─────────────────────────────────────

export const INDIANOIL_RBL_XTRA_V0: CardConfigV0 = {
  card_id: "indianoil_rbl_xtra",
  display_name: "IndianOil RBL Bank XTRA Credit Card",
  direct: {
    base: { earn_rate_percent: 0 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0.15, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "rbl_reward_points", display_name: "RBL Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.25, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};

// ─── Standard Chartered Ultimate Credit Card ──────────────────────────────────

export const SC_ULTIMATE_V0: CardConfigV0 = {
  card_id: "sc_ultimate",
  display_name: "Standard Chartered Ultimate Credit Card",
  direct: {
    base: { earn_rate_percent: 0.03 },
    merchants: {},
    spend_categories: {
      flights: { display_name: "Flights", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["flights"] },
      shopping: { display_name: "Shopping", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["shopping"] },
      ecommerce: { display_name: "Ecommerce", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["ecommerce"] },
      grocery: { display_name: "Grocery", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["grocery"] },
      dining: { display_name: "Dining", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["dining"] },
      movies: { display_name: "Movies", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["movies"] },
      hotels: { display_name: "Hotels", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["hotels"] },
      railways: { display_name: "Railways", earn_rate_percent: 0.03, spend_limit: null, earn_limit: null, categories: ["railways"] },
      educational_institutions: { display_name: "Educational Institutions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["educational_institutions"] },
      gold_jewellery: { display_name: "Gold Jewellery", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["gold_jewellery"] },
      rent_payment: { display_name: "Rent Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["rent_payment"] },
      insurance_payment: { display_name: "Insurance Payment", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["insurance_payment"] },
      government_transactions: { display_name: "Government Transactions", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["government_transactions"] },
      utilities: { display_name: "Utilities", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["utilities"] },
      fuel: { display_name: "Fuel", earn_rate_percent: 0, spend_limit: null, earn_limit: null, categories: ["fuel"] },
    },
  },
  vouchers: [],
  reward_program: {
    reward_currency: { code: "sc_reward_points", display_name: "360° Reward Points", type: "points" },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "standard", rupee_value_per_unit: 0.3, description: "Standard" },
    ],
    default_valuation_profile_id: "temp_fake",
  },
};


// / DO NOT ADD THESE CARDS TO THE ALL_GENERATED_CARDS LIST : these were cards with fake data
// AXIS_ATLAS_V0,
// HDFC_INFINIA_V0,
// HDFC_REGALIA_V0,
// ICICI_EMERALD_PRIVATE_METAL_V0,

export const ALL_GENERATED_CARDSALL_GENERATED_CARDS: CardConfigV0[] = [

  AMEX_PLATINUM_TRAVEL_V0,
  AMEX_MEMBERSHIP_REWARDS_V0,
  AMEX_GOLD_CHARGE_V0,
  AMEX_PLATINUM_RESERVE_V0,
  AMEX_SMARTEARN_V0,
  AMEX_PLATINUM_CHARGE_V0,
  IXIGO_AU_V0,
  AU_BANK_ZENITH_PLUS_V0,
  HSBC_TRAVEL_ONE_V0,
  HSBC_VISA_PLATINUM_V0,
  HSBC_LIVE_PLUS_V0,
  HSBC_PREMIER_V0,
  HSBC_RUPAY_CASHBACK_V0,
  INDIANOIL_RBL_V0,
  INDIANOIL_RBL_XTRA_V0,
  SC_ULTIMATE_V0,
];

// ─── Dev-time validation ──────────────────────────────────────────────────────
// Runs on module load in development. Logs errors/warnings for any card that
// fails validateCardConfigV0. Import is deferred to avoid a circular reference
// (validator.ts imports types.ts; configs.ts also imports types.ts).
if (process.env.NODE_ENV === "development") {
  // Dynamic require so this doesn't affect the production bundle
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { validateCardConfigV0 } = require("./validator") as typeof import("./validator");
  for (const card of ALL_GENERATED_CARDS) {
    const result = validateCardConfigV0(card);
    if (!result.valid) {
      console.error(`[v0 validator] ${card.card_id} — ERRORS:`, result.errors);
    }
    if (result.warnings.length > 0) {
      console.warn(`[v0 validator] ${card.card_id} — warnings:`, result.warnings);
    }
  }
}