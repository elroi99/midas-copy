import type {
  CardConfigV0,
  ConsolidatedMerchantName,
  MerchantName,
  RankedOutput,
  RouteDetail,
  RouteSummaryRow,
  RouteTrace,
  SimilarMerchantSuggestion,
  SpendInput,
  StandardCategory,
  ValuationProfileV0,
  VoucherPortalConfig,
} from "./types";

// ─── Similarity Groups ────────────────────────────────────────────────────────

const SIMILARITY_GROUPS: Array<{ name: string; merchants: MerchantName[] }> = [
  { name: "grocery_&_essentials", merchants: ["zepto", "blinkit", "swiggy"] },
  { name: "ecommerce", merchants: ["amazon", "flipkart"] },
  { name: "dining", merchants: ["zomato", "swiggy", "eazydiner"] },
];

// ─── Phase 1: Discover Voucher Merchants ─────────────────────────────────────

export function discoverVoucherMerchants(
  category: StandardCategory,
  cards: CardConfigV0[]
): Array<{ merchant: ConsolidatedMerchantName; merchant_name: string }> {
  const results: Array<{ merchant: ConsolidatedMerchantName; merchant_name: string }> = [];
  const seen = new Set<string>();

  for (const card of cards) {
    for (const portal of card.vouchers) {
      for (const [merchantKey, merchantConfig] of Object.entries(portal.merchants)) {
        if (!merchantConfig) continue;
        if (!merchantConfig.categories.includes(category)) continue;
        if (seen.has(merchantKey)) continue;
        seen.add(merchantKey);

        results.push({
          merchant: merchantKey as ConsolidatedMerchantName,
          merchant_name: merchantConfig.merchant_name,
        });
      }
    }
  }

  return results;
}

// ─── Phase 2: Rank Spend ──────────────────────────────────────────────────────

// Internal: enumerate and sort traces for a spend input — no similarity search.
// Called by rankSpend and reused for similar merchant evaluation to avoid recursion.
function computeTraces(spendInput: SpendInput, cards: CardConfigV0[]): RouteTrace[] {
  const amount = spendInput.amount;
  const allTraces: RouteTrace[] = [];

  for (const card of cards) {
    const profile = getDefaultValuationProfile(card);

    if (spendInput.input_type === "merchant") {
      const merchant = spendInput.merchant;

      const directMerchantConfig = card.direct.merchants[merchant];
      if (directMerchantConfig) {
        allTraces.push(
          buildDirectMerchantTrace(card, merchant, directMerchantConfig, amount, profile)
        );
      }

      for (const portal of card.vouchers) {
        const voucherConfig = portal.merchants[merchant];
        if (voucherConfig) {
          allTraces.push(
            buildVoucherTrace(card, portal, merchant, voucherConfig, amount, profile)
          );
        }
      }

      if (card.accelerated_portal) {
        const merchantCategories = directMerchantConfig?.categories ?? [];
        for (const [portalCatKey, portalCatConfig] of Object.entries(
          card.accelerated_portal.categories
        )) {
          if (!portalCatConfig) continue;
          const intersects = portalCatConfig.categories.some((c) =>
            merchantCategories.includes(c)
          );
          if (intersects) {
            allTraces.push(
              buildAcceleratedPortalTrace(
                card,
                portalCatKey as StandardCategory,
                portalCatConfig,
                amount,
                profile,
                spendInput.input_type,
                merchant,
                null
              )
            );
          }
        }
      }

      if (!directMerchantConfig) {
        allTraces.push(buildBaseFallbackTrace(card, amount, profile, spendInput.input_type));
      }
    } else {
      const category = spendInput.category;
      const selectedVoucherMerchants = spendInput.selected_voucher_merchants;

      const spendCatConfig = card.direct.spend_categories[category];
      if (spendCatConfig) {
        allTraces.push(
          buildDirectSpendCategoryTrace(card, category, spendCatConfig, amount, profile)
        );
      }

      for (const [merchantKey, merchantConfig] of Object.entries(card.direct.merchants)) {
        if (!merchantConfig) continue;
        if (!merchantConfig.categories.includes(category)) continue;
        allTraces.push(
          buildDirectMerchantTrace(
            card,
            merchantKey as MerchantName,
            merchantConfig,
            amount,
            profile
          )
        );
      }

      for (const portal of card.vouchers) {
        for (const merchant of selectedVoucherMerchants) {
          const voucherConfig = portal.merchants[merchant];
          if (!voucherConfig) continue;
          allTraces.push(
            buildVoucherTrace(card, portal, merchant, voucherConfig, amount, profile)
          );
        }
      }

      if (card.accelerated_portal) {
        for (const [portalCatKey, portalCatConfig] of Object.entries(
          card.accelerated_portal.categories
        )) {
          if (!portalCatConfig) continue;
          if (!portalCatConfig.categories.includes(category)) continue;
          allTraces.push(
            buildAcceleratedPortalTrace(
              card,
              portalCatKey as StandardCategory,
              portalCatConfig,
              amount,
              profile,
              spendInput.input_type,
              null,
              category
            )
          );
        }
      }

      if (!spendCatConfig) {
        allTraces.push(buildBaseFallbackTrace(card, amount, profile, spendInput.input_type));
      }
    }
  }

  allTraces.sort((a, b) => {
    if (a.is_restricted && !b.is_restricted) return 1;
    if (!a.is_restricted && b.is_restricted) return -1;
    return b.net_rupee_saving - a.net_rupee_saving;
  });

  return allTraces;
}

export function rankSpend(params: {
  spendInput: SpendInput;
  cards: CardConfigV0[];
}): RankedOutput {
  const { spendInput, cards } = params;
  const amount = spendInput.amount;

  const allTraces = computeTraces(spendInput, cards);
  console.log(allTraces, "the traces")

  const summaryRows: RouteSummaryRow[] = allTraces.map((t) => traceToSummaryRow(t, amount));
  const bestTrace = allTraces.find((t) => !t.is_restricted) ?? allTraces[0] ?? null;
  const bestRouteDetail = bestTrace ? traceToRouteDetail(bestTrace, cards) : null;

  // Similarity suggestions (merchant input only)
  const similarMerchantSuggestions: SimilarMerchantSuggestion[] = [];
  if (spendInput.input_type === "merchant" && bestTrace) {
    const inputMerchant = spendInput.merchant;
    const similarMerchants = getSimilarMerchants(inputMerchant);

    for (const { merchant, group } of similarMerchants) {
      const similarInput: SpendInput = { input_type: "merchant", merchant, amount };
      const similarTraces = computeTraces(similarInput, cards);
      const similarBestTrace = similarTraces[0];
      if (!similarBestTrace) continue;
      if (similarBestTrace.net_rupee_saving <= bestTrace.net_rupee_saving) continue;

      similarMerchantSuggestions.push({
        merchant,
        similarity_group: group,
        summary_row: traceToSummaryRow(similarBestTrace, amount),
        trace: similarBestTrace,
      });

    }
  }

  return {
    spend_input: spendInput,
    summary_rows: summaryRows,
    best_route_detail: bestRouteDetail,
    traces: allTraces,
    similar_merchant_suggestions: similarMerchantSuggestions,
  };
}

// ─── Trace Builders ───────────────────────────────────────────────────────────

function buildDirectMerchantTrace(
  card: CardConfigV0,
  merchant: MerchantName,
  config: NonNullable<CardConfigV0["direct"]["merchants"][MerchantName]>,
  amount: number,
  profile: ValuationProfileV0
): RouteTrace {
  const effectiveSpend =
    config.spend_limit !== null ? Math.min(config.spend_limit, amount) : amount;
  const excessSpend = amount - effectiveSpend;
  const rewardRupeeUncapped = effectiveSpend * config.earn_rate_percent;
  const rewardsEarned =
    config.earn_limit !== null
      ? Math.min(rewardRupeeUncapped, config.earn_limit)
      : rewardRupeeUncapped;
  const pointsRupeeValue = rewardsEarned * profile.rupee_value_per_unit;
  const netRupeeSaving = pointsRupeeValue;

  return {
    rail_id: "direct",
    input_type: "merchant",
    input_amount: amount,
    merchant,
    category: null,

    card_id: card.card_id,
    card_display_name: card.display_name,
    rail_display_name: "Direct Swipe",

    upfront_discount_rate_pct: 0,
    upfront_discount_rupees: 0,

    effective_spend: effectiveSpend,
    excess_spend: excessSpend,

    reward_rate_pct: config.earn_rate_percent,
    reward_rupees_uncapped: rewardRupeeUncapped,

    surcharge_rate_pct: 0,
    surcharge_rupees: 0,

    earn_cap: config.earn_limit,
    rewards_earned: rewardsEarned,

    valuation_profile_id: profile.id,
    rupee_value_per_unit: profile.rupee_value_per_unit,
    points_rupee_value: pointsRupeeValue,

    total_rupee_value: pointsRupeeValue,
    roi_pct: amount > 0 ? (netRupeeSaving / amount) * 100 : 0,
    net_rupee_saving: netRupeeSaving,

    is_restricted: config.earn_rate_percent === 0,
    spend_limit_applied: excessSpend > 0,
    earn_limit_applied: config.earn_limit !== null && rewardRupeeUncapped > config.earn_limit,
  };
}

function buildDirectSpendCategoryTrace(
  card: CardConfigV0,
  category: StandardCategory,
  config: NonNullable<CardConfigV0["direct"]["spend_categories"][StandardCategory]>,
  amount: number,
  profile: ValuationProfileV0
): RouteTrace {
  const effectiveSpend =
    config.spend_limit !== null ? Math.min(config.spend_limit, amount) : amount;
  const excessSpend = amount - effectiveSpend;
  const rewardRupeeUncapped = effectiveSpend * config.earn_rate_percent;
  const rewardsEarned =
    config.earn_limit !== null
      ? Math.min(rewardRupeeUncapped, config.earn_limit)
      : rewardRupeeUncapped;
  const pointsRupeeValue = rewardsEarned * profile.rupee_value_per_unit;
  const netRupeeSaving = pointsRupeeValue;

  return {
    rail_id: "direct",
    input_type: "category",
    input_amount: amount,
    merchant: null,
    category,

    card_id: card.card_id,
    card_display_name: card.display_name,
    rail_display_name: "Direct Swipe",

    upfront_discount_rate_pct: 0,
    upfront_discount_rupees: 0,

    effective_spend: effectiveSpend,
    excess_spend: excessSpend,

    reward_rate_pct: config.earn_rate_percent,
    reward_rupees_uncapped: rewardRupeeUncapped,

    surcharge_rate_pct: 0,
    surcharge_rupees: 0,

    earn_cap: config.earn_limit,
    rewards_earned: rewardsEarned,

    valuation_profile_id: profile.id,
    rupee_value_per_unit: profile.rupee_value_per_unit,
    points_rupee_value: pointsRupeeValue,

    total_rupee_value: pointsRupeeValue,
    roi_pct: amount > 0 ? (netRupeeSaving / amount) * 100 : 0,
    net_rupee_saving: netRupeeSaving,

    is_restricted: config.earn_rate_percent === 0,
    spend_limit_applied: excessSpend > 0,
    earn_limit_applied: config.earn_limit !== null && rewardRupeeUncapped > config.earn_limit,
  };
}

function buildVoucherTrace(
  card: CardConfigV0,
  portal: VoucherPortalConfig,
  merchant: ConsolidatedMerchantName,
  config: NonNullable<VoucherPortalConfig["merchants"][ConsolidatedMerchantName]>,
  amount: number,
  profile: ValuationProfileV0
): RouteTrace {
  const discountRupees = amount * config.additional_discount;
  const amountPaid = amount - discountRupees; // actual cash outflow after upfront discount
  const effectiveSpend =
    config.spend_limit_monthly !== null
      ? Math.min(config.spend_limit_monthly, amountPaid)
      : amountPaid;
  const excessSpend = amountPaid - effectiveSpend;
  const surchargeRupees = amountPaid * config.surcharge_percent;
  const rewardRupeeUncapped = effectiveSpend * portal.earn_rate_percent;
  const rewardsEarned = rewardRupeeUncapped; // no earn_limit on voucher merchants
  const pointsRupeeValue = rewardsEarned * profile.rupee_value_per_unit;
  const totalRupeeValue = discountRupees + pointsRupeeValue;
  const netRupeeSaving = totalRupeeValue - surchargeRupees;

  return {
    rail_id: "voucher",
    input_type: "merchant",
    input_amount: amount,
    merchant,
    category: null,

    card_id: card.card_id,
    card_display_name: card.display_name,
    rail_display_name: portal.display_name,
    portal_id: portal.display_name,

    upfront_discount_rate_pct: config.additional_discount,
    upfront_discount_rupees: discountRupees,

    effective_spend: effectiveSpend,
    excess_spend: excessSpend,

    reward_rate_pct: portal.earn_rate_percent,
    reward_rupees_uncapped: rewardRupeeUncapped,

    surcharge_rate_pct: config.surcharge_percent,
    surcharge_rupees: surchargeRupees,

    earn_cap: null,
    rewards_earned: rewardsEarned,

    valuation_profile_id: profile.id,
    rupee_value_per_unit: profile.rupee_value_per_unit,
    points_rupee_value: pointsRupeeValue,

    total_rupee_value: totalRupeeValue,
    roi_pct: amount > 0 ? (netRupeeSaving / amount) * 100 : 0,
    net_rupee_saving: netRupeeSaving,

    is_restricted: false,
    spend_limit_applied: excessSpend > 0,
    earn_limit_applied: false,
  };
}

function buildAcceleratedPortalTrace(
  card: CardConfigV0,
  portalCategoryKey: StandardCategory,
  config: NonNullable<
    NonNullable<CardConfigV0["accelerated_portal"]>["categories"][keyof NonNullable<
      CardConfigV0["accelerated_portal"]
    >["categories"]]
  >,
  amount: number,
  profile: ValuationProfileV0,
  inputType: "merchant" | "category",
  merchant: MerchantName | null,
  category: StandardCategory | null
): RouteTrace {
  const effectiveSpend =
    config.spend_limit !== null ? Math.min(config.spend_limit, amount) : amount;
  const excessSpend = amount - effectiveSpend;
  const rewardRupeeUncapped = effectiveSpend * config.earn_rate_percent;
  const rewardsEarned =
    config.earn_limit !== null
      ? Math.min(rewardRupeeUncapped, config.earn_limit)
      : rewardRupeeUncapped;
  const pointsRupeeValue = rewardsEarned * profile.rupee_value_per_unit;
  const netRupeeSaving = pointsRupeeValue;

  return {
    rail_id: "accelerated_portal",
    input_type: inputType,
    input_amount: amount,
    merchant,
    category: category ?? portalCategoryKey,

    card_id: card.card_id,
    card_display_name: card.display_name,
    rail_display_name: card.accelerated_portal!.display_name,

    upfront_discount_rate_pct: 0,
    upfront_discount_rupees: 0,

    effective_spend: effectiveSpend,
    excess_spend: excessSpend,

    reward_rate_pct: config.earn_rate_percent,
    reward_rupees_uncapped: rewardRupeeUncapped,

    surcharge_rate_pct: 0,
    surcharge_rupees: 0,

    earn_cap: config.earn_limit,
    rewards_earned: rewardsEarned,

    valuation_profile_id: profile.id,
    rupee_value_per_unit: profile.rupee_value_per_unit,
    points_rupee_value: pointsRupeeValue,

    total_rupee_value: pointsRupeeValue,
    roi_pct: amount > 0 ? (netRupeeSaving / amount) * 100 : 0,
    net_rupee_saving: netRupeeSaving,

    is_restricted: false,
    spend_limit_applied: excessSpend > 0,
    earn_limit_applied: config.earn_limit !== null && rewardRupeeUncapped > config.earn_limit,
  };
}

function buildBaseFallbackTrace(
  card: CardConfigV0,
  amount: number,
  profile: ValuationProfileV0,
  inputType: "merchant" | "category"
): RouteTrace {
  const rewardsEarned = amount * card.direct.base.earn_rate_percent;
  const pointsRupeeValue = rewardsEarned * profile.rupee_value_per_unit;
  const netRupeeSaving = pointsRupeeValue;

  return {
    rail_id: "direct",
    input_type: inputType,
    input_amount: amount,
    merchant: null,
    category: null,

    card_id: card.card_id,
    card_display_name: card.display_name,
    rail_display_name: "Direct Swipe",

    upfront_discount_rate_pct: 0,
    upfront_discount_rupees: 0,

    effective_spend: amount,
    excess_spend: 0,

    reward_rate_pct: card.direct.base.earn_rate_percent,
    reward_rupees_uncapped: rewardsEarned,

    surcharge_rate_pct: 0,
    surcharge_rupees: 0,

    earn_cap: null,
    rewards_earned: rewardsEarned,

    valuation_profile_id: profile.id,
    rupee_value_per_unit: profile.rupee_value_per_unit,
    points_rupee_value: pointsRupeeValue,

    total_rupee_value: pointsRupeeValue,
    roi_pct: amount > 0 ? (netRupeeSaving / amount) * 100 : 0,
    net_rupee_saving: netRupeeSaving,

    is_restricted: false,
    spend_limit_applied: false,
    earn_limit_applied: false,
  };
}

// ─── Trace → User-Facing Shapes ───────────────────────────────────────────────

function traceToSummaryRow(trace: RouteTrace, inputAmount: number): RouteSummaryRow {
  const categoryDisplayName = getCategoryDisplayName(trace);
  return {
    card_display_name: trace.card_display_name,
    rail_display_name: trace.rail_display_name,
    category_display_name: categoryDisplayName,
    upfront_discount_rupees: trace.upfront_discount_rupees,
    rewards_earned: trace.rewards_earned,
    points_rupee_value: trace.points_rupee_value,
    net_rupee_saving: trace.net_rupee_saving,
    effective_rate_pct: inputAmount > 0 ? (trace.net_rupee_saving / inputAmount) * 100 : 0,
    is_restricted: trace.is_restricted,
  };
}

function traceToRouteDetail(trace: RouteTrace, cards: CardConfigV0[]): RouteDetail {
  const currencyName = getRewardCurrencyName(trace.card_id, cards);

  const routingInstruction = buildRoutingInstruction(trace, cards);
  const usageInstructions = buildUsageInstructions(trace, cards);

  const breakdownRows = buildBreakdownRows(trace, currencyName);
  const explainability = buildExplainability(trace, currencyName);

  return {
    routing_instruction: routingInstruction,
    usage_instructions: usageInstructions,
    breakdown_rows: breakdownRows,
    explainability,
    total_upfront_discount_rupees: trace.upfront_discount_rupees,
    total_rewards_earned: trace.rewards_earned,
    total_points_rupee_value: trace.points_rupee_value,
    net_rupee_saving: trace.net_rupee_saving,
  };
}

// ─── Detail Helpers ───────────────────────────────────────────────────────────

function getCategoryDisplayName(trace: RouteTrace): string {
  if (trace.merchant === null && trace.category === null) return "Base Rate";
  if (trace.category !== null) return formatCategory(trace.category);
  if (trace.merchant !== null) return formatMerchant(trace.merchant);
  return "—";
}

function formatCategory(cat: StandardCategory): string {
  return cat
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatMerchant(m: ConsolidatedMerchantName): string {
  return m
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getRewardCurrencyName(cardId: string, cards: CardConfigV0[]): string {
  const card = cards.find((c) => c.card_id === cardId);
  return card?.reward_program.reward_currency.display_name ?? "Points";
}

function getDefaultValuationProfile(card: CardConfigV0): ValuationProfileV0 {
  const profile = card.reward_program.valuation_profiles.find(
    (p) => p.id === card.reward_program.default_valuation_profile_id
  );
  if (!profile) {
    throw new Error(
      `Card ${card.card_id}: default_valuation_profile_id "${card.reward_program.default_valuation_profile_id}" not found in valuation_profiles`
    );
  }
  return profile;
}

function buildRoutingInstruction(trace: RouteTrace, cards: CardConfigV0[]): string {
  const card = cards.find((c) => c.card_id === trace.card_id);
  if (!card) return "Swipe your card directly.";

  if (trace.rail_id === "voucher" && trace.merchant !== null) {
    for (const portal of card.vouchers) {
      const vConfig = portal.merchants[trace.merchant];
      if (!vConfig) continue;
      return portal.template.routing
        .replace("{merchant_name}", vConfig.merchant_name)
        .replace("{display_name}", portal.display_name);
    }
  }

  if (trace.rail_id === "accelerated_portal" && card.accelerated_portal) {
    return card.accelerated_portal.template.routing.replace(
      "{display_name}",
      card.accelerated_portal.display_name
    );
  }

  return "Swipe your card directly at checkout.";
}

function buildUsageInstructions(trace: RouteTrace, cards: CardConfigV0[]): string {
  if (trace.rail_id !== "voucher" || trace.merchant === null) {
    return "Pay directly using your card at checkout.";
  }
  const card = cards.find((c) => c.card_id === trace.card_id);
  if (!card) return "";
  for (const portal of card.vouchers) {
    const vConfig = portal.merchants[trace.merchant];
    if (vConfig) return vConfig.usage_instructions;
  }
  return "";
}

function buildBreakdownRows(
  trace: RouteTrace,
  currencyName: string
): RouteDetail["breakdown_rows"] {
  const rows: RouteDetail["breakdown_rows"] = [];

  rows.push({ label: "Spend amount", value: `₹${fmt(trace.input_amount)}` });

  if (trace.spend_limit_applied) {
    rows.push({
      label: `Spend limit (₹${fmt(trace.effective_spend + trace.excess_spend)} cap → ₹${fmt(trace.effective_spend)} eligible)`,
      value: `₹${fmt(trace.excess_spend)} earns nothing`,
    });
  }

  if (trace.upfront_discount_rupees > 0) {
    rows.push({
      label: `Upfront discount (${trace.upfront_discount_rate_pct}%)`,
      value: `+ ₹${fmt(trace.upfront_discount_rupees)}`,
    });
  }

  rows.push({
    label: `${currencyName} earned (${trace.reward_rate_pct}% on ₹${fmt(trace.effective_spend)})`,
    value: `${fmtRewards(trace.rewards_earned)} ${currencyName}`,
  });

  if (trace.earn_limit_applied) {
    rows.push({
      label: `Earn cap applied (${fmtRewards(trace.earn_cap!)} ${currencyName} max)`,
      value: `Capped at ${fmtRewards(trace.rewards_earned)} ${currencyName}`,
    });
  }

  rows.push({
    label: `${currencyName} value (@ ₹${trace.rupee_value_per_unit}/${currencyName.toLowerCase().slice(0, -1)})`,
    value: `+ ₹${fmt(trace.points_rupee_value)}`,
  });

  if (trace.surcharge_rupees > 0) {
    rows.push({
      label: `Surcharge (${trace.surcharge_rate_pct}%)`,
      value: `− ₹${fmt(trace.surcharge_rupees)}`,
    });
  }

  rows.push({
    label: "Net saving",
    value: `₹${fmt(trace.net_rupee_saving)}`,
    is_highlight: true,
  });

  return rows;
}

function buildExplainability(trace: RouteTrace, currencyName: string): string[] {
  const lines: string[] = [];

  if (trace.spend_limit_applied) {
    lines.push(
      `Spend limit of ₹${fmt(trace.effective_spend + trace.excess_spend)} applies — only ₹${fmt(trace.effective_spend)} earns rewards (₹${fmt(trace.excess_spend)} excess earns nothing).`
    );
  }

  if (trace.upfront_discount_rupees > 0) {
    lines.push(
      `${trace.upfront_discount_rate_pct}% upfront discount on ₹${fmt(trace.input_amount)} = ₹${fmt(trace.upfront_discount_rupees)} saved instantly at checkout.`
    );
  }

  lines.push(
    `Earn ${trace.reward_rate_pct} ${currencyName} per ₹100 spent on ₹${fmt(trace.effective_spend)} = ${fmtRewards(trace.reward_rupees_uncapped)} ${currencyName}.`
  );

  if (trace.earn_limit_applied) {
    lines.push(
      `Earn cap of ${fmtRewards(trace.earn_cap!)} ${currencyName} applies — capped from ${fmtRewards(trace.reward_rupees_uncapped)} to ${fmtRewards(trace.rewards_earned)} ${currencyName}.`
    );
  }

  lines.push(
    `${fmtRewards(trace.rewards_earned)} ${currencyName} valued at ₹${trace.rupee_value_per_unit} each = ₹${fmt(trace.points_rupee_value)}.`
  );

  if (trace.surcharge_rupees > 0) {
    lines.push(
      `${trace.surcharge_rate_pct}% surcharge on ₹${fmt(trace.input_amount)} = ₹${fmt(trace.surcharge_rupees)} deducted.`
    );
  }

  const parts: string[] = [];
  if (trace.upfront_discount_rupees > 0)
    parts.push(`₹${fmt(trace.upfront_discount_rupees)} (discount)`);
  if (trace.points_rupee_value > 0)
    parts.push(`₹${fmt(trace.points_rupee_value)} (${currencyName.toLowerCase()})`);
  if (trace.surcharge_rupees > 0)
    parts.push(`− ₹${fmt(trace.surcharge_rupees)} (surcharge)`);

  lines.push(`Net saving: ${parts.join(" + ")} = ₹${fmt(trace.net_rupee_saving)}.`);

  return lines;
}

// ─── Similarity Helpers ───────────────────────────────────────────────────────

function getSimilarMerchants(
  merchant: MerchantName
): Array<{ merchant: MerchantName; group: string }> {
  const result: Array<{ merchant: MerchantName; group: string }> = [];
  const seen = new Set<MerchantName>();

  for (const group of SIMILARITY_GROUPS) {
    if (!group.merchants.includes(merchant)) continue;
    for (const m of group.merchants) {
      if (m === merchant) continue;
      if (seen.has(m)) continue;
      seen.add(m);
      result.push({ merchant: m, group: group.name });
    }
  }

  return result;
}

// ─── Formatting Utilities ─────────────────────────────────────────────────────

function fmt(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
}

function fmtRewards(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
}
