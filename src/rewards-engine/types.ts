export type Amount = number; // rupees
export type Points = number;

export const SPEND_INTENT_KEYS = [
  "amazon", "flipkart", "water_bills", "swiggy", "zepto", "zomato", "myntra", "other_online_spends", "other_offline_spends",
  "mobile_phone_bills", "electricity_bills",
  "insurance_health_annual", "insurance_car_or_bike_annual",
  "rent", "education", "grocery_spends_online", "online_food_ordering",
  "fuel", "dining_or_going_out", "flights_annual", "hotels_annual"
] as const;

export type SpendIntentKey = typeof SPEND_INTENT_KEYS[number];

export type SpendInputs = Partial<Record<SpendIntentKey, {
  period: "monthly" | "annual";
  display_name?: string;
}>>;

export type SpendSumsConfig = Partial<Record<string, { sum_of: SpendIntentKey[] }>>;

export const DIRECT_CATEGORIES = [
  "amazon", "flipkart", "zepto", "swiggy", "zomato", "myntra",
  "other_online_spends", "other_offline_spends",
  "mobile_phone_bills", "electricity_bills", "water_bills",
  "insurance_health_annual", "insurance_car_or_bike_annual",
  "rent", "education", "grocery_spends_online", "online_food_ordering",
  "fuel", "dining_or_going_out", "flights", "hotels",
  "flat"
] as const;

export type DirectCategory = typeof DIRECT_CATEGORIES[number];

export const ACCELERATED_PORTAL_CATEGORIES = ["flights", "hotels"] as const;
export type AcceleratedPortalCategory = typeof ACCELERATED_PORTAL_CATEGORIES[number];

export const VOUCHER_CATEGORIES = ["amazon_pay", "uber", "amazon", "swiggy", "zomato", "zepto", "flat"] as const;
export type VoucherCategory = typeof VOUCHER_CATEGORIES[number];

export type AllCategories = DirectCategory | AcceleratedPortalCategory | VoucherCategory;

export interface RoutingEntry {
  rail_id: keyof RailMap;
  category_id: AllCategories;
}
export type SpendIntentRouting = Partial<Record<SpendIntentKey, RoutingEntry>>;



export type RailCategoryConfig<TCategory extends string = string> = {
  earn_rate_percent: number;
  additional_discount?: number;
  reward_pool_id?: string;
  spend_limit_id?: string;
  restricted?: boolean;
  milestone_excluded?: boolean;
  fee_waiver_excluded?: boolean;
  display_name: string;
  merchant_name?: string;
  usage_instructions?: string;
};

export type RailConfig<TCategory extends string = string> = {
  categories: Partial<Record<TCategory, RailCategoryConfig<TCategory>>>;
  rail_type?: string;
  display_name?: string;
  template?: { routing?: string, voucher_discount?: string };
};

export type RewardPools = Record<string, { max_points: number }>;
export type SpendLimits = Record<string, { max_spend: number }>;
export type Milestone = { threshold: number; bonus_points: number };

export type ValuationProfile = {
  id: string;
  rupee_value_per_unit: number;
  description?: string;
};

export type RewardProgram = {
  reward_currency: {
    code: string;
    display_name: string;
    type: "points" | "miles" | "cashback";
  };
  valuation_profiles: ValuationProfile[];
  default_valuation_profile_id: string;
};



export interface RailMap {
  direct?: RailConfig<DirectCategory>;
  accelerated_portal?: RailConfig<AcceleratedPortalCategory>;
  vouchers?: RailConfig<VoucherCategory>;
}

export interface CardConfig {
  card_id: string;
  card_name: string;
  base_rate_percent: number;
  spend_intent_routing: SpendIntentRouting;
  rails: RailMap;
  spend_limits?: SpendLimits;
  reward_pools?: RewardPools;
  milestones?: Milestone[];
  spend_based_waiver?: { threshold: number };
  reward_program?: RewardProgram;
}

export interface ValidationResult {
  is_valid: boolean;
  errors: Array<{
    code: string;
    message: string;
    path: string[];
  }>;
}

export interface CategoryMetadata {
  id: string;
  display_name: string;
  default_rate?: number;
  is_restricted_by_default?: boolean;
  allowed_spend_intents?: string[];
}

export interface RailMetadata {
  id: string;
  display_name: string;
  rail_type: string;
  categories: CategoryMetadata[];
}

export interface CardRegistry {
  card_id: string;
  rails: RailMetadata[];
}
