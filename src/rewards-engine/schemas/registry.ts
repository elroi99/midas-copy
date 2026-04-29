import { CardRegistry } from "../types";

// This registry is an overkill for the V1 of the validator. consider removing this
// it seems to be unused too right now
export const INFINIA_REGISTRY: CardRegistry = {
  card_id: "hdfc_infinia",
  rails: [
    {
      id: "accelerated_portal",
      display_name: "HDFC SmartBuy",
      rail_type: "Accelerated Portal",
      categories: [
        {
          id: "flights_annual",
          display_name: "Flights",
          default_rate: 16,
          allowed_spend_intents: ["flights_annual"]
        },
        {
          id: "hotels_annual",
          display_name: "Hotels",
          default_rate: 33,
          allowed_spend_intents: ["hotels_annual"]
        },
      ],
    },
    {
      id: "vouchers",
      display_name: "SmartBuy Vouchers",
      rail_type: "Voucher Portal",
      categories: [
        {
          id: "flat",
          display_name: "Brand Vouchers",
          default_rate: 16,
          allowed_spend_intents: ["amazon", "flipkart", "other_online_spends", "other_offline_spends", "water_bills"]
        },
        {
          id: "amazon_pay",
          display_name: "Amazon Pay Voucher",
          default_rate: 16,
          allowed_spend_intents: ["mobile_phone_bills", "electricity_bills", "insurance_health_annual", "insurance_car_or_bike_annual"]
        },
        {
          id: "swiggy",
          display_name: "Swiggy Voucher",
          default_rate: 16,
          allowed_spend_intents: ["grocery_spends_online", "online_food_ordering", "dining_or_going_out"]
        },
      ],
    },
    {
      id: "direct",
      display_name: "Direct Payment",
      rail_type: "Standard",
      categories: [
        { id: "dining", display_name: "Dining", default_rate: 10, allowed_spend_intents: ["dining_or_going_out"] },
        { id: "fuel", display_name: "Fuel", default_rate: 0, is_restricted_by_default: true, allowed_spend_intents: ["fuel"] },
        { id: "education", display_name: "Education", default_rate: 0, is_restricted_by_default: true, allowed_spend_intents: ["education"] },
        { id: "rent", display_name: "Rent", default_rate: 3.33, allowed_spend_intents: ["rent"] },
        { id: "flat", display_name: "All other spends", default_rate: 3.33, allowed_spend_intents: [] },
      ],
    },
  ],
};

export async function fetchCardRegistry(cardId: string): Promise<CardRegistry> {
  // Mocking an API call
  return INFINIA_REGISTRY;
}
