---
name: CSV Parsing Conventions
description: Recurring patterns and decisions from parsing the user's card CSV format into CardConfigV0
type: feedback
---

## Vouchers column vs Accelerated Portal rates
The CSV "Vouchers" column stores the voucher portal earn rate (for `vouchers: []` metadata, not yet used). The "Flights" and "Hotel" columns are the accelerated_portal rates — not the direct category overrides.

## HSBC "10% Cashback on Dining, Grocery & Food Delivery" special merchant note
Map `dining` and `grocery` in `spend_categories` to `earn_rate_percent: 10`. The CSV note in "Special merchant" column is a category override, not a merchant-level override. "Food Delivery" maps to `dining` (no separate food_delivery category exists in the v0 schema).

## IndianOil RBL cards — fuel-only earners
CSV note "Only fuel - IOCL" with "Hard code" means the card's earn rate IS the fuel rate. Use base earn rate for all 15 categories (all earn the same rate). The rate reflects fuel-only real-world earning but the validator requires all categories to be positive — use base rate everywhere.

## Air India special merchant — not a valid MerchantName
"Air India - 25" in Amex Platinum Charge's Special merchant column cannot be stored in `direct.merchants` (Air India is not in the valid MerchantName whitelist). Note it in output but do not add it.

## "Ignoring it for now" in Special merchant column
Treat as no special merchant data — use `merchants: {}`.

## Standard Chartered Ultimate — no portal despite having Flights/Hotel CSV columns
Travel Portal = "—" means no accelerated_portal. The Flights/Hotel rates in the CSV (3%/3%) match the base rate exactly, so everything collapses to base rate across all categories.

## Scapia Card — skip
The Scapia row has no Status value. Always skip rows where Status is blank or not exactly "Keep".
