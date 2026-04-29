// @ts-nocheck
import { SpendInputs, CardConfig, SpendSumsConfig } from "./types";

export const SPEND_INPUTS: SpendInputs = {
  amazon: { period: "monthly", display_name: "Amazon Shopping" },
  flipkart: { period: "monthly", display_name: "Flipkart Shopping" },
  other_online_spends: { period: "monthly", display_name: "Other Online Shopping" },
  other_offline_spends: { period: "monthly", display_name: "Other Offline Spending" },
  mobile_phone_bills: { period: "monthly", display_name: "Mobile Bills" },
  electricity_bills: { period: "monthly", display_name: "Electricity Bills" },
  water_bills: { period: "monthly", display_name: "Water Bills" },
  insurance_health_annual: { period: "annual", display_name: "Health Insurance" },
  insurance_car_or_bike_annual: { period: "annual", display_name: "Vehicle Insurance" },
  rent: { period: "monthly", display_name: "Rent Payment" },
  education: { period: "monthly", display_name: "Education" },
  grocery_spends_online: { period: "monthly", display_name: "Online Groceries" },
  online_food_ordering: { period: "monthly", display_name: "Food Delivery" },
  fuel: { period: "monthly", display_name: "Fuel Spends" },
  dining_or_going_out: { period: "monthly", display_name: "Dining Out" },
  flights_annual: { period: "annual", display_name: "Flight Bookings" },
  hotels_annual: { period: "annual", display_name: "Hotel Stays" },
};

// Legacy aggregation construct separated from the mathematical engine config
export const SPEND_SUMS: SpendSumsConfig = {
  shopping: { sum_of: ["amazon", "flipkart", "other_online_spends", "other_offline_spends"] },
  utilities: { sum_of: ["mobile_phone_bills", "electricity_bills", "water_bills"] },
  insurance: { sum_of: ["insurance_health_annual", "insurance_car_or_bike_annual"] },
  rent: { sum_of: ["rent"] },
  education: { sum_of: ["education"] },
  groceries: { sum_of: ["grocery_spends_online"] },
  food_delivery: { sum_of: ["online_food_ordering"] },
  fuel: { sum_of: ["fuel"] },
  dining: { sum_of: ["dining_or_going_out"] },
  travel_flights: { sum_of: ["flights_annual"] },
  travel_hotels: { sum_of: ["hotels_annual"] }
};

export const HYPOTHETICAL_INFINIA_CONFIG: CardConfig = {
  card_id: "hdfc_infinia_milestones",
  card_name: "HDFC Infinia (Hypothetical – With Milestones)",
  base_rate_percent: 3.33,
  spend_intent_routing: {
    // Shopping mapped to vouchers->flat
    amazon: { rail_id: "vouchers", category_id: "flat" },
    flipkart: { rail_id: "vouchers", category_id: "flat" },
    swiggy: { rail_id: "vouchers", category_id: "swiggy" },
    zomato: { rail_id: "vouchers", category_id: "zomato" },
    zepto: { rail_id: "vouchers", category_id: "zepto" },
    other_online_spends: { rail_id: "vouchers", category_id: "flat" },
    other_offline_spends: { rail_id: "vouchers", category_id: "flat" },
    // Utilities mapped to vouchers->flat
    mobile_phone_bills: { rail_id: "vouchers", category_id: "flat" },
    electricity_bills: { rail_id: "vouchers", category_id: "flat" },
    water_bills: { rail_id: "vouchers", category_id: "flat" },
    // Insurance mapped to vouchers->amazon_pay
    insurance_health_annual: { rail_id: "vouchers", category_id: "amazon_pay" },
    insurance_car_or_bike_annual: { rail_id: "vouchers", category_id: "amazon_pay" },
    // Rent
    rent: { rail_id: "direct", category_id: "rent" },
    // Education
    education: { rail_id: "direct", category_id: "education" },
    // Groceries & Food mapped to vouchers->flat
    grocery_spends_online: { rail_id: "vouchers", category_id: "swiggy" },
    online_food_ordering: { rail_id: "vouchers", category_id: "swiggy" },
    fuel: { rail_id: "direct", category_id: "fuel" },
    dining_or_going_out: { rail_id: "vouchers", category_id: "swiggy" },
    // Accelerated Travels
    flights_annual: { rail_id: "accelerated_portal", category_id: "flights" },
    hotels_annual: { rail_id: "accelerated_portal", category_id: "hotels" }
  },
  rails: {
    accelerated_portal: {
      rail_type: "Accelerated Portal",
      display_name: "HDFC SmartBuy",
      template: { routing: "Book your flights or hotels via {display_name}" },
      categories: {
        flights: {
          display_name: "Flights",
          earn_rate_percent: 16,
          reward_pool_id: "accelerated_portal_pool"
        },
        hotels: {
          display_name: "Hotels",
          earn_rate_percent: 33,
          reward_pool_id: "accelerated_portal_pool"
        }
      }
    },
    vouchers: {
      rail_type: "Voucher Portal",
      display_name: "SmartBuy",
      template: {
        routing: 'Buy the {merchant_name} voucher from {display_name} and use it for payment.',
        voucher_discount: "{merchant_name} vouchers are usually available at a {additional_discount}% discount, giving you an immediate saving of ₹{amount}"
      },
      categories: {
        flat: {
          // This needs to be changed to the individual brand vouchers
          display_name: "Brand Vouchers",
          merchant_name: "Brand",
          earn_rate_percent: 16,
        },
        amazon_pay: {
          display_name: "Amazon Pay Voucher",
          merchant_name: "Amazon Pay",
          earn_rate_percent: 16,
          additional_discount: 4,
          spend_limit_id: "amazon_pay_voucher_spend_limit",
        },
        swiggy: {
          display_name: "Swiggy Voucher",
          merchant_name: "Swiggy",
          earn_rate_percent: 16,
          additional_discount: 6,
          spend_limit_id: "swiggy_voucher_spend_limit"
        },
      }
    },
    direct: {
      rail_type: "Direct Payment",
      template: { routing: "Pay for {category_name} by swiping your card at the store or checkout using your card" },
      categories: {
        dining: { earn_rate_percent: 10, display_name: "Dining" },
        fuel: { earn_rate_percent: 2, display_name: "Fuel" },
        education: { earn_rate_percent: 0, restricted: true, display_name: "Education" },
        flat: { earn_rate_percent: 3.33, display_name: "All other spends" }, // Is this redundant ? -- cause it is essentially the base rate... how can we make this DRY ?
        rent: {
          earn_rate_percent: 3.33,
          display_name: "Rent",
          milestone_excluded: true,
          fee_waiver_excluded: true,
          usage_instructions: "You will have to pay via the Red Giraffe platform. \nIt is designed specifically for rent"
        },
      }
    }
  },
  spend_limits: {
    amazon_pay_voucher_spend_limit: { max_spend: 10000 },
    swiggy_voucher_spend_limit: { max_spend: 2000 }
  },
  reward_pools: {
    accelerated_portal_pool: { max_points: 15000 },
  },
  milestones: [
    { threshold: 750000, bonus_points: 5000 },
    { threshold: 1500000, bonus_points: 5000 }
  ],
  spend_based_waiver: { threshold: 800000 },
  reward_program: {
    reward_currency: { code: "HDFC_tier_one", display_name: "Reward Points", type: "points" },
    valuation_profiles: [
      { id: "x1", rupee_value_per_unit: 0.4, description: "Low-end" },
      { id: "x2", rupee_value_per_unit: 0.75, description: "Typical" },
      { id: "x3", rupee_value_per_unit: 1.2, description: "Optimized" }
    ],
    default_valuation_profile_id: "x3"
  }
};

export const ALL_CARDS: CardConfig[] = [
  HYPOTHETICAL_INFINIA_CONFIG,
];




// direct

// 1. `amazon`
// 2. `flipkart`
// 18. `zepto`
// 19. `swiggy`
// 20. `zomato`
// 21. `myntra`

// 3. `other_online_spends`
// 4. `other_offline_spends`
// 5. `mobile_phone_bills`
// 6. `electricity_bills`
// 7. `water_bills`
// 8. `insurance_health_annual`
// 9. `insurance_car_or_bike_annual`
// 10. `rent`
// 11. `school_fees`
// 12. `grocery_spends_online`
// 13. `online_food_ordering`
// 14. `fuel`
// 15. `dining_or_going_out`
// 16. `flights`
// 17. `hotels`

// acceleratedPortal
// 16. `flights`
// 17. `hotels`

// vouchers
// amazon_pay
// uber
// amazon
// swiggy
// zomato
// zepto











// acc merchants(chose 7)
// chose 4 - 5 categories(direct swipe)
//   - dining
//   - rent
//   - utilities
//   - insurance - (0, milestoneExcluded, feeWaiverExcluded)
//   - education - (0, milestoneExcluded, feeWaiverExcluded)


// --------------------------------------------------------------

// direct_swipe
//   - all other spends(base)
//     - 6 - 7 merchants
// voucher
// acceleratedPortal
//   - flights
//   - hotels


// zepto
// 1. check voucher portal for merchant availability and calculate
// 2. check points earned at base
// 3. compare the two


// groceries
//   zepto aka groceries
// 1. check voucher portal for merchant availability and calculate
// 2. check points earned at base
// 3. compare the two


// amazon pay

// zepto(groceries)

// swiggy
// zomato

// amazon
// flipkart
