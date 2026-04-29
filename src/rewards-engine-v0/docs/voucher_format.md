 
 ### STANDARD CATEGORIES
 These are the standard categories that will appear in categories array of a merchant
 eg. in the case of Zomato ( categories: ["dining", "grocery"] )
 STANDARD_CATEGORIES = [
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
] 

Note : 
I will also need a list of standard merchant names that will be used across all the voucher portals
This in incredibly important because those names will power our comparisons across direct and vouchers


### FORMAT FOR A PARTICULAR VOUCHER PORTAL
copy the entire object ie. including both the brackets 
```ts
{
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
```