---
name: Reward Programs by Issuer
description: Canonical reward_program data (currency code, display_name, type, valuation_profiles) confirmed by the user for each card issuer
type: reference
---

## American Express (Amex MR)
- code: `amex_mr`
- display_name: `"Membership Rewards Points"`
- type: `"points"`
- valuation_profiles: standard (0.5 ₹/pt), optimized (1.0 ₹/pt, via transfers)
- default_valuation_profile_id: `"optimized"`

## AU Bank
- code: `au_reward_points`
- display_name: `"AU Reward Points"`
- type: `"points"`
- valuation_profiles: standard (0.25 ₹/pt)
- default_valuation_profile_id: `"standard"`

## HSBC
- code: `hsbc_reward_points`
- display_name: `"HSBC Reward Points"`
- type: `"points"`
- valuation_profiles: standard (0.25 ₹/pt)
- default_valuation_profile_id: `"standard"`

## RBL Bank
- code: `rbl_reward_points`
- display_name: `"RBL Reward Points"`
- type: `"points"`
- valuation_profiles: standard (0.25 ₹/pt)
- default_valuation_profile_id: `"standard"`

## Standard Chartered
- code: `sc_reward_points`
- display_name: `"360° Reward Points"`
- type: `"points"`
- valuation_profiles: standard (0.30 ₹/pt)
- default_valuation_profile_id: `"standard"`

## HDFC Bank (existing)
- code: `hdfc_reward_points`
- display_name: `"Reward Points"`
- type: `"points"`
- valuation_profiles: x1 (0.5), x2 (1.0 — default), x3 (1.5)

## Axis Bank (existing)
- code: `axis_edge_miles`
- display_name: `"EDGE Miles"`
- type: `"miles"`
- valuation_profiles: x1 (0.35), x2 (0.6), x3 (1.0 — default)

## ICICI Bank (existing)
- code: `icici_paypoints`
- display_name: `"ICICI PayPoints"`
- type: `"points"`
- valuation_profiles: x1 (0.25), x2 (0.5 — default), x3 (1.0)
