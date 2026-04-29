direct
    - base
    - 7 merchants
     zepto ( groceries )
    - some categories ( optional )
        - shopping
        - groceries
        - rent
        - utilities
        - education
        - insurance
        - govt transactions
        - fuel

voucher
    - list of standard merchants ( each with associated categories )
    - a_pay ( category  "utilities" , "insurance" , "fuel")
    - hpcl ( category "fuel")
    - zepto ( category "groceries")

acc -- 
    hotels
    flights


things to standardize 
standard categories 
standard merchant names


routing ( dynamic )
input 
    - card portfolio
    - merchant OR category ( utilities )
    - amount

synonyms list
    groceries [ zepto , blinkit , swiggy ]
    ecommerce [ amazon , flipkart ]
    dining [ zomato , swiggy , eazydiner ]


// per voucher data required
amazon_pay: {
    display_name: "Amazon Pay Voucher",
    merchant_name: "Amazon Pay",
    earn_rate_percent: 16,
    additional_discount: 4,
    spend_limit_monthly : ,
    usage_instructions : "any special instructions"
    category : [ ],
}


HDFC config
[

]

HDFC ( infinia ,  dcb )
HDFC ( regalia )
HDFC ( millennia )


[
{
rewardRate : 8,





merchants : [
amazon_pay: {
    display_name: "Amazon Pay Voucher",
    merchant_name: "Amazon Pay",
    additional_discount: 4,
    spend_limit_monthly : ,
    usage_instructions : "any special instructions"
    category : [ ],
}
]

}

,
{
rewardRate : 2,

}
]


voucher multiplier 
voucher discount 4%




synonyms list
    groceries [ zepto , blinkit , swiggy ]
    ecommerce [ amazon , flipkart ]
    dining [ zomato , swiggy , eazydiner ]

// for each voucher portal ( each card will have one or more voucher portal )
{
          rail_type: "Voucher Portal",
      display_name: "SmartBuy",
      template: {
        routing: 'Buy the {merchant_name} voucher from {display_name} and use it for payment.',
        voucher_discount: "{merchant_name} vouchers are usually available at a {additional_discount}% discount, giving you an immediate saving of ₹{amount}"
      },
      earn_rate_percent : 16,
      categories : [
amazon_pay: {
    display_name: "Amazon Pay Voucher",
    merchant_name: "Amazon Pay",
    additional_discount: 4,
    spend_limit_monthly : 10000,
    surcharge_percent : 2,
    usage_instructions : "any special instructions"
    category : [ ],
    product_category : []
},
swiggy: {
    display_name: "Amazon Pay Voucher",
    merchant_name: "Amazon Pay",
    additional_discount: 4,
    spend_limit_monthly : ,
    usage_instructions : "any special instructions"
    category : [ ],
    product_category : []
}
]
}


### Standardized categories ( across direct swipe and vouchers routes )
Flights
Shopping
Ecommerce ( online marketplaces -- flipkart and amazon )
Grocery 
Dining
Movies
Hotels
Railways
Educational Institutions
Gold Jewellery
Rent Payment
Insurance Payment
Government Transactions
Utilities
Fuel

Vouchers will also have a separate grouping category ( we might or might not use this )





### Merchants where direct swipe broad categories will have a different rate as compared to direct swipe merchants
Uber
Air India
Marriot
MMT
Cleartrip
Taj 
Myntra
Flipkart
Amazon
Croma
Tata Cliq
Westside
Swiggy