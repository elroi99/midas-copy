---
name: earn_rate_percent must never be zero
description: Validator rejects earn_rate_percent <= 0 — all spend_categories must use base rate, not 0, even for restricted categories
type: feedback
---

Always use `direct.base.earn_rate_percent` as the default for all 15 spend_categories. Never set `earn_rate_percent: 0` in any spend_category entry, even for categories like gold_jewellery, rent_payment, fuel, etc. that are typically restricted or earn nothing.

**Why:** `validateCardConfigV0` checks `catConfig.earn_rate_percent <= 0` and pushes a hard error. Existing configs (AXIS_ATLAS, HDFC_INFINIA, HDFC_REGALIA) have 0 values but those were written before validation was enforced on new configs. New configs must have all positive earn rates.

**How to apply:** When generating any new CardConfigV0, always default uncovered categories to `direct.base.earn_rate_percent`, never to 0. If a card genuinely earns 0 on a category, discuss with the user before picking a placeholder rate.
