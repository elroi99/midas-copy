# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Next.js dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

There is no test runner configured — no `test` script exists.

## Architecture

**Midas** is a credit card rewards optimization engine with a Next.js frontend. Users enter their monthly spending across categories and the engine computes which card yields the best rewards.

### Core: Rewards Engine (`src/rewards-engine/`)

The engine is purely declarative — card behavior is fully described by a `CardConfig` object (see `types.ts`), and `calculator.ts` interprets it at runtime.

**Rail system** — every spend intent is routed to exactly one rail:
- `direct` — base category earn rates
- `accelerated_portal` — elevated rates for portal bookings (flights, hotels)
- `vouchers` — merchant-specific voucher programs (Amazon, Swiggy, Uber, etc.)

**Calculation pipeline** (`calculator.ts`):
1. Normalize raw spend amounts (monthly/annual)
2. Route each `SpendIntentKey` → rail → category via `spend_intent_routing`
3. Apply pool limits (`reward_pools`) and spend caps (`spend_limits`)
4. Calculate accelerated points (category rate) + base points (card base rate)
5. Apply milestones (threshold-based bonus points)
6. Check fee waiver eligibility
7. Return a `FinalLedger` with full breakdown

**Collector** (`collector.ts`) tracks per-intent breakdowns, pool depletion events, milestone contributions, restricted spends, and human-readable routing rationale strings.

**Validator** (`schemas/validator.ts`) enforces referential integrity on `CardConfig` — all routing targets must exist in the rails definition.

### UI (`src/components/`)

Multi-step wizard at `/calculator`:
1. `CategorySelector` — pick spending categories
2. `SpendInputStep` — enter monthly amounts
3. `ComparisonDashboard` — cards sorted by net savings
4. `CardDetailView` — per-category earn breakdown for a specific card

The homepage (`/`) demos the engine with hardcoded spends via `src/Screens/homepage.tsx`.

### Key Types (`src/rewards-engine/types.ts`)

- `SpendIntentKey` — 21 user-facing spending intents (e.g. `"amazon"`, `"rent"`, `"flights"`)
- `CardConfig` — full card definition; the single source of truth for card behavior
- `FinalLedger` — output of `calculateCardRewards()`
- `ValidationResult` — output of `validateCardConfig()`

### Path Alias

`@/*` maps to the repo root (not `src/`). So `import { X } from "@/src/rewards-engine"` is the correct form.

### Card Configs (`src/rewards-engine/configs.ts`)

Currently contains `HYPOTHETICAL_INFINIA_CONFIG` and the `ALL_CARDS` array. New cards are added here as `CardConfig` objects and pushed into `ALL_CARDS`.
