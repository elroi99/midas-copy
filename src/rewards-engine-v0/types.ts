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

// ─── Voucher-Only Merchant Whitelist ─────────────────────────────────────────
// Merchants that appear exclusively in voucher portals and not in direct rails.
// Add new voucher-portal-only merchants here.

export const VOUCHER_ONLY_MERCHANT_NAMES = [
  "reliance_smart",
  "abraham_and_thakore_luxe",
  "absolute_barbecues",
  "absolute_barbeque",
  "adidas_kids",
  "aeropostale",
  "aeropostale_bagline",
  "air_india",
  "ajio",
  "ajio_luxe",
  "aldo",
  "aliste",
  "allen_solly",
  "amazon_fresh",
  "amazon_prime_membership",
  "amazon_prime_shopping",
  "american_eagle",
  "american_tourister",
  "apollo",
  "apollo_diagnostics",
  "apollo_healing",
  "apollo_pharmacy",
  "apple",
  "appyhigh",
  "archies",
  "archies_gallery",
  "armani_exchange",
  "armani_exchange_luxe",
  "asia_seven_express",
  "assembly",
  "aurelia",
  "auric",
  "bagline",
  "bakingo",
  "ballyluxe_gift_card",
  "barbeque_nation",
  "bare_anatomy",
  "baskin_robbins",
  "bata",
  "bath_and_body_works",
  "beer_cafe",
  "behrouz_biryani",
  "beverly_hills_polo_club",
  "beyoung",
  "biba",
  "big_basket",
  "bigbasket",
  "bikanervala",
  "birkenstock",
  "blaupunkt",
  "blissclub",
  "blue_tokai_coffee",
  "bluestone_diamond",
  "boat",
  "bobbi_brown",
  "boditive",
  "body_craft",
  "bodycraft",
  "book_my_show",
  "bookmyshow",
  "bottega_veneta",
  "bpcl",
  "braingymjr",
  "brooks_brother",
  "brooks_brothers_luxe",
  "buywithemi",
  "cafe_coffee_day",
  "cafe_delhi_heights",
  "call_it_spring",
  "campus",
  "campus_sutra",
  "canali_luxe_gift_card",
  "celio",
  "cello",
  "charles_and_keith",
  "charles_tyrwhitt_luxe_gift_card",
  "chemist_at_play",
  "chumbak",
  "chunmun",
  "cinepolis",
  "citizen",
  "citizen_watches",
  "clayco",
  "cleartax",
  "cleartrip",
  "cleartrip_hotel",
  "coach",
  "coachluxe_gift_card",
  "colorplus",
  "cosmopolitan_india",
  "costa_coffee",
  "croma",
  "crossword",
  "cult",
  "daily_objects",
  "decathlon",
  "decathlon_omni",
  "decathlon_sports_india",
  "diesel_luxe_gift_card",
  "discovery_plus",
  "district",
  "dominos",
  "donatekart",
  "dpauls",
  "dpauls_travel_and_tours",
  "dune_london",
  "duneluxe_gift_card",
  "duroflex",
  "ea7_luxe_gift_card",
  "easemytrip",
  "easemytrip_generic",
  "easemytrip_holiday",
  "easemytrip_hotel",
  "easybuy",
  "eatsure",
  "elleven",
  "elver",
  "emporio_armani_luxe",
  "epic_on",
  "epic_on_1",
  "epic_on_12",
  "epic_on_3",
  "epic_on_6",
  "estele",
  "estuary_world",
  "et_prime",
  "euphoria_diamond_jewellery",
  "euphoria_gold_coin",
  "faasos",
  "fab",
  "fabindia",
  "fashion_factory",
  "fastrack",
  "fastrack_bags",
  "fastrack_smartwatches",
  "femmella",
  "ferns_n_petals",
  "ferragamo_luxe",
  "first_cry",
  "firstcry",
  "fitpass",
  "flixbus",
  "flower_aura",
  "forever21",
  "forever_new",
  "foxtale",
  "freecultr",
  "french_accent",
  "fresh_menu",
  "freshmenu",
  "frido",
  "funcity",
  "future_world",
  "future_world_apple_reseller",
  "gaana",
  "gas",
  "gasluxe",
  "giorgio_armani_luxe",
  "giva",
  "giva_jewellery",
  "giva_silver_coin",
  "glam_studios",
  "goibibo_hotel",
  "grt_jewellers",
  "gupta_distributors",
  "h_by_hamleys_luxe",
  "hamleys",
  "hamleys_luxe",
  "hammer",
  "haute_sauce",
  "health_and_glow",
  "healthians",
  "healthifyme_smart",
  "healthkart",
  "helios",
  "hidesign",
  "himalaya",
  "himalaya_wellness",
  "hindustan_times_premium",
  "hoichoi",
  "home_centre",
  "home_stop",
  "homecentre",
  "house_of_vaaree",
  "hp_pay",
  "hugo_boss",
  "hugo_bossluxe",
  "hush_puppies",
  "igp",
  "ikea",
  "indian_terrain",
  "indian_terrrain",
  "inglot",
  "instafab_plus",
  "iocl",
  "irctc",
  "iserveu_prepaid",
  "itc",
  "itc_hotels",
  "ixigo",
  "ixigo_hotel",
  "jack_and_jones",
  "jimmy_choo_luxe",
  "jio_mart",
  "jiohotstar",
  "jockey",
  "joy_alukkas_diamond",
  "joy_alukkas_jewellery",
  "joyalukkas_diamond",
  "juicy_couture_bagline",
  "just_lil_things",
  "kama_ayurveda",
  "kate_spade",
  "kfc",
  "kiehls",
  "kimirica",
  "klook",
  "l_occitane",
  "la_martina_luxe",
  "lakme_salon",
  "lawrence_and_mayo",
  "lccitane",
  "leaf",
  "lee",
  "lenskart",
  "lenskartcom",
  "levis",
  "liberty",
  "lifestyle",
  "linen_club",
  "lionsgate_play",
  "little_bite_food",
  "live_hindustan",
  "live_mint",
  "louis_philippe",
  "lulu_hypermarket",
  "lunch_box",
  "luxe",
  "mac",
  "machaan",
  "mainland_china",
  "maje_luxe",
  "makemytrip",
  "makemytrip_holiday",
  "makemytrip_hotel",
  "malabar_diamond",
  "mamaearth",
  "mango",
  "manyavar",
  "marks_and_spencer",
  "marriott",
  "marriott_spa",
  "matrix",
  "max",
  "max_fashion",
  "mcdonalds",
  "me_n_moms",
  "mediwheel",
  "mia_by_tanishq",
  "michael_kors",
  "microsoft_xbox",
  "milton",
  "miniklub",
  "mmt_wedding",
  "modern_bazaar",
  "mokobara",
  "mother_care",
  "mothercare",
  "muji",
  "muro_qc",
  "nat_habit",
  "nature_s_basket",
  "neemans",
  "neerus",
  "netmeds",
  "next",
  "nilkamal_homes",
  "nua_woman",
  "nua_women",
  "nykaa",
  "nykaa_fashion",
  "nykaa_man",
  "o2_spa",
  "ode_spa_salon",
  "oh_calcutta",
  "ola_cabs",
  "only",
  "organic_india",
  "ottplay",
  "oven_story",
  "ovenstory",
  "pantaloons",
  "park_avenue",
  "parx",
  "paul_and_shark",
  "paul_shark",
  "paul_smith",
  "pcj_diamond_jewellery",
  "pcjeweller",
  "peora_fashions",
  "pepperfry",
  "peter_england",
  "pharmeasy",
  "philips",
  "phone_pe",
  "pigeon",
  "pixel_go",
  "pizza_hut",
  "planet_fashion",
  "points_for_good",
  "polar_bear",
  "pottery_barn",
  "prestige",
  "prestige_smart_kitchen",
  "pret_a_manger",
  "puma",
  "punjab_grill",
  "pure_home_and_living",
  "pure_home_living",
  "pvr",
  "rangriti",
  "ratnadeep_retail",
  "ratnadeep_super_market",
  "ray_ban",
  "raymond_ready_to_wear",
  "razorpay_money_flex",
  "rb",
  "relaxo",
  "reliance",
  "reliance_digital",
  "reliance_fashion_factory",
  "reliance_footwear",
  "reliance_jio_mart",
  "reliance_my_jio_store",
  "reliance_smart_bazaar",
  "reliance_smart_point",
  "reliance_trends",
  "reliance_trends_footwear",
  "rentomojo",
  "resonate",
  "resonate_router_ups",
  "ritu_kumar",
  "rowan",
  "samsonite",
  "sandro",
  "satya_paul",
  "satya_paul_accessories",
  "scotch_and_soda",
  "scotch_and_soda_luxe",
  "shell",
  "shemaroome",
  "shiv_naresh",
  "shiva_organic",
  "shoppers_stop",
  "shopy_vision",
  "sigree",
  "simon_carter",
  "simple",
  "skechers",
  "skinn",
  "skullcandy",
  "smile_foundation",
  "soch",
  "sonyliv",
  "sotc_travel",
  "speedo",
  "spencer_s_retail",
  "ssunsu",
  "starbucks",
  "steam_wallet",
  "sterling_holidays",
  "steve_madden",
  "street_foods_by_punjab_grill",
  "subway",
  "sunglass_hut",
  "sunscoop",
  "supa",
  "superbottoms",
  "superdry",
  "superdry_sport",
  "surat_diamonds_main",
  "sweet_bengal",
  "sweet_truth",
  "swiggy_money",
  "taco_bell",
  "taj",
  "taj_experiences",
  "taj_j_wellness_circle",
  "taneira",
  "tanishq_studded",
  "tata_cliq",
  "tata_cliq_luxury",
  "tattva_spa",
  "tcns_aurelia",
  "tcns_w",
  "tego",
  "tgif",
  "the_body_shop",
  "the_collective",
  "the_good_bowl",
  "the_man_company",
  "the_postcard",
  "the_raymond_shop",
  "the_sleep_company",
  "the_white_crow",
  "third_wave_coffee",
  "tim_hortons",
  "timezone",
  "tinder",
  "titan",
  "titan_eye",
  "titan_eye_plus",
  "titan_minimals",
  "titan_smartwatches",
  "tods",
  "tommy_hilfiger_bagline",
  "tory_burch",
  "toscano",
  "trends_footwear",
  "trends_junior",
  "trends_man",
  "trends_woman",
  "trends_women",
  "tribe",
  "tripxoxo",
  "truefitt_and_hill",
  "tumi",
  "typsy_beauty",
  "uber",
  "unipin",
  "unipin_bgmi",
  "united_colors_of_benetton_bagline",
  "unlimited",
  "urban_ladder",
  "urban_space",
  "v_mart",
  "vaango",
  "valentino",
  "valorant",
  "van_heusen",
  "vero_moda",
  "versace",
  "victoria_s_secret",
  "victoria_s_secret_beauty",
  "vijay_sales",
  "villeroy_and_boch",
  "vinci_botanicals",
  "vrott",
  "w",
  "w_for_women",
  "wakefit",
  "wellbeing_nutrition",
  "wendy_s",
  "wendys",
  "west_elm",
  "westside",
  "wildcraft",
  "william_penn",
  "woggles",
  "wonderchef",
  "woodland",
  "wow_chicken",
  "wow_china",
  "wow_momo",
  "wrangler",
  "yatra",
  "youmee",
  "zambar",
  "zee5",
  "zee5_12m_4k",
  "zee5_12m_hd",
  "zee5_3m_hd",
  "zee5_6m_hd",
  "zoomcar",
] as const;

export type VoucherOnlyMerchantName = (typeof VOUCHER_ONLY_MERCHANT_NAMES)[number];

// ─── Consolidated Merchant Whitelist ─────────────────────────────────────────
// Union of all merchant names across all rails. Used wherever a merchant key
// can come from either direct configs or voucher portal configs.

export const CONSOLIDATED_MERCHANT_NAMES = [
  ...MERCHANT_NAMES,
  ...VOUCHER_ONLY_MERCHANT_NAMES,
] as const;

export type ConsolidatedMerchantName = (typeof CONSOLIDATED_MERCHANT_NAMES)[number];

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
  spend_limit: number | null;  // cap on eligible spend (rupees)
  earn_limit: number | null;   // cap on points/miles earned (independent of spend_limit)
  categories: StandardCategory[];
}

export interface DirectSpendCategoryConfig {
  display_name: string;
  earn_rate_percent: number;
  spend_limit: number | null;  // cap on eligible spend (rupees)
  earn_limit: number | null;   // cap on points/miles earned (independent of spend_limit)
  // retained for future dynamic routing (e.g. adding "travel" to flights/hotels)
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
  spend_limit: number | null;  // cap on eligible spend (rupees)
  earn_limit: number | null;   // cap on points/miles earned (independent of spend_limit)
  // drives dynamic routing — no hardcoded category names in the engine
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
  merchant_name: string;          // human-readable name for UI
  additional_discount: number;    // upfront % discount at time of voucher purchase
  spend_limit_monthly: number | null;
  surcharge_percent: number;      // can be 0+; reduces net saving
  usage_instructions: string;
  categories: StandardCategory[];
  frontend_tags: string[];        // explicit UI-level filter labels, not derived
}

export interface VoucherPortalConfig {
  rail_type: string;
  display_name: string;
  earn_rate_percent: number;      // portal-level rate; applies to all merchants on this portal
  template: {
    routing: string;
    voucher_discount?: string;
  };
  merchants: Partial<Record<ConsolidatedMerchantName, VoucherMerchantConfig>>;
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

// ─── Spend Input ──────────────────────────────────────────────────────────────

export type SpendInput =
  | { input_type: "merchant"; merchant: MerchantName; amount: number }
  | {
    input_type: "category";
    category: StandardCategory;
    amount: number;
    // user-selected voucher merchants from the phase 1 discoverVoucherMerchants picker
    // only these will have voucher routes computed
    selected_voucher_merchants: ConsolidatedMerchantName[];
  };

// ─── Rail ID ──────────────────────────────────────────────────────────────────

export type RailId = "direct" | "accelerated_portal" | "voucher";

// ─── Developer Output: RouteTrace ─────────────────────────────────────────────
//
// Flat record in computation order. Designed for table rendering and step-by-step
// debugging. merchant/category nullability by route type:
//
//   Direct merchant      → merchant: "swiggy", category: null
//   Direct spend_category → merchant: null,    category: "dining"
//   Direct base fallback  → merchant: null,    category: null
//   Voucher              → merchant: "swiggy", category: null
//   Accelerated portal   → merchant: null,    category: "flights"

export interface RouteTrace {
  // Inputs
  rail_id: RailId;
  input_type: "merchant" | "category";
  input_amount: number;
  merchant: ConsolidatedMerchantName | null;
  category: StandardCategory | null;

  // Routing identity
  card_id: string;
  card_display_name: string;
  rail_display_name: string;
  portal_id?: string;             // for voucher routes: identifies the portal

  // Calculation (in computation order)
  upfront_discount_rate_pct: number;
  upfront_discount_rupees: number;

  effective_spend: number;        // after spend_limit cap
  excess_spend: number;           // spend that earns nothing due to spend_limit

  reward_rate_pct: number;        // earn_rate_percent from config
  reward_rupees_uncapped: number; // effective_spend * reward_rate_pct / 100 (before earn cap)

  surcharge_rate_pct: number;
  surcharge_rupees: number;

  earn_cap: number | null;        // earn_limit from config; null = no cap
  rewards_earned: number;         // after earn_cap applied (in points/miles)

  // Valuation (always uses default_valuation_profile)
  valuation_profile_id: string;
  rupee_value_per_unit: number;
  points_rupee_value: number;

  // Totals
  total_rupee_value: number;      // upfront_discount_rupees + points_rupee_value
  roi_pct: number;                // (total_rupee_value - surcharge_rupees) / input_amount * 100
  net_rupee_saving: number;       // total_rupee_value - surcharge_rupees (can be negative)

  // Flags
  is_restricted: boolean;
  spend_limit_applied: boolean;
  earn_limit_applied: boolean;
}

// ─── User-Facing Output ───────────────────────────────────────────────────────

// Compact row for the ranked comparison table
export interface RouteSummaryRow {
  card_display_name: string;
  rail_display_name: string;       // e.g. "Gift EDGE", "Direct Swipe"
  category_display_name: string;   // e.g. "Swiggy Voucher", "Dining", "Base Rate"
  upfront_discount_rupees: number;
  rewards_earned: number;          // in points / miles
  points_rupee_value: number;
  net_rupee_saving: number;
  effective_rate_pct: number;      // net_rupee_saving / input_amount * 100
  is_restricted: boolean;
}

// Full breakdown for the selected route's detail panel
export interface RouteDetail {
  // How to spend
  routing_instruction: string;
  usage_instructions: string;

  // Calculation breakdown rows (rendered in order as a table)
  breakdown_rows: Array<{
    label: string;
    value: string;              // pre-formatted: "₹15", "+ 10 EDGE Miles", "− ₹0", etc.
    is_highlight?: boolean;     // true for the net saving row
  }>;

  // Narrative explainability strings (one per meaningful step)
  explainability: string[];

  // Summary totals
  total_upfront_discount_rupees: number;
  total_rewards_earned: number;
  total_points_rupee_value: number;
  net_rupee_saving: number;
}

// ─── Similar Merchant Suggestion ──────────────────────────────────────────────

export interface SimilarMerchantSuggestion {
  merchant: MerchantName;
  similarity_group: string;      // "grocery_&_essentials" | "ecommerce" | "dining"
  summary_row: RouteSummaryRow;  // best route for this merchant (compact)
  trace: RouteTrace;             // best route debug trace
}

// ─── Top-Level Output ─────────────────────────────────────────────────────────

export interface RankedOutput {
  spend_input: SpendInput;
  summary_rows: RouteSummaryRow[];          // ranked best→worst; restricted routes at bottom
  best_route_detail: RouteDetail | null;    // full breakdown of the top route
  traces: RouteTrace[];                     // same order as summary_rows
  similar_merchant_suggestions: SimilarMerchantSuggestion[];
}
