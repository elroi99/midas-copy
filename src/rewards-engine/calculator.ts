// @ts-nocheck
import { RewardBreakdownCollector } from "./collector";
import { SpendInputs, CardConfig } from "./types";

function roundCurrency(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export function calculateCardRewards(params: {
  cardConfig: CardConfig;
  rawSpends: Record<string, number>;
  spendInputsConfig: SpendInputs;
}) {
  const { cardConfig, rawSpends, spendInputsConfig } = params;
  const collector = new RewardBreakdownCollector();

  // 1. Initialize Card Context
  const defaultProfile = cardConfig.reward_program?.valuation_profiles.find(
    (p) => p.id === cardConfig.reward_program!.default_valuation_profile_id
  ) || cardConfig.reward_program?.valuation_profiles[0];

  collector.setCardContext({
    baseRate: cardConfig.base_rate_percent,
    currencyName: cardConfig.reward_program?.reward_currency.display_name || "points",
    valuation: defaultProfile?.rupee_value_per_unit || 1
  });

  // 2. Normalize spends
  const normalizedSpends: Record<string, number> = {};
  for (const key in rawSpends) {
    const inputConfig = (spendInputsConfig as any)[key];
    const period = inputConfig?.period ?? "monthly";
    const rawVal = period === "annual" ? rawSpends[key] / 12 : rawSpends[key];
    normalizedSpends[key] = roundCurrency(rawVal);
  }

  // Initialize runtime balances
  const poolBalances: Record<string, number> = {};
  if (cardConfig.reward_pools) {
    for (const poolId in cardConfig.reward_pools) {
      poolBalances[poolId] = cardConfig.reward_pools[poolId].max_points;
    }
  }

  const spendLimits: Record<string, number> = {};
  if (cardConfig.spend_limits) {
    for (const limitId in cardConfig.spend_limits) {
      spendLimits[limitId] = cardConfig.spend_limits[limitId].max_spend;
    }
  }

  let totalAccelerated = 0;
  let totalBase = 0;
  let milestoneEligibleSpend = 0;
  let waiverEligibleSpend = 0;

  // 3. Process each intention independently by looking up its route directly
  for (const spendIntentKey in normalizedSpends) {
    const amount = normalizedSpends[spendIntentKey];
    if (amount <= 0) continue;

    const route = (cardConfig.spend_intent_routing as any)[spendIntentKey];
    if (!route) continue; // Unmapped spend, safely skip

    const railConfig = cardConfig.rails[route.rail_id];
    const categoryConfig = railConfig?.categories[route.category_id];
    if (!categoryConfig) continue;

    const additionalDiscountRoi = categoryConfig.additional_discount ?? 0;
    const additionalDiscountAmount = roundCurrency((amount * additionalDiscountRoi) / 100);
    const effectiveAmount = roundCurrency(amount - additionalDiscountAmount);

    let routingTemplate = railConfig.template?.routing || "Route via {rail_name} for {category_name}";
    const routingStatement = routingTemplate
      .replace(/{display_name}/g, railConfig.display_name || "")
      .replace(/{merchant_name}/g, categoryConfig.merchant_name || "")
      .replace(/{category_name}/g, categoryConfig.display_name || route.category_id)
      .replace(/{rail_name}/g, railConfig.rail_type || route.rail_id);

    collector.beginSpendIntent({
      spend_intent_key: spendIntentKey,
      spend_intent_label: (spendInputsConfig as any)[spendIntentKey]?.display_name || spendIntentKey,
      monthly_amount: amount,
      yearly_amount: amount * 12,
      rail_id: route.rail_id,
      rail_label: railConfig.rail_type || route.rail_id,
      category_id: route.category_id,
      category_label: categoryConfig.display_name || route.category_id,
      category_roi: categoryConfig.earn_rate_percent,
      additional_discount_roi: additionalDiscountRoi,
      additional_discount_amount: additionalDiscountAmount,
      portal_name: railConfig.display_name,
      merchant_name: categoryConfig.merchant_name,
      routing_statement: routingStatement,
      usage_instructions: categoryConfig.usage_instructions,
    });

    if (categoryConfig.restricted) {
      collector.markRestricted({
        spend_intent_key: spendIntentKey,
        monthly_amount: amount,
        yearly_amount: amount * 12,
        rail_id: route.rail_id,
        category_id: route.category_id
      });
      // Do not continue, we still want limits and flags to track into user_spend_breakdown as '0' points
    }

    // 5. Apply spend limit
    let eligibleSpend = effectiveAmount;
    let currLimit = -1; // local copy of spend limit from spendLimits balances object

    if (categoryConfig.spend_limit_id && spendLimits[categoryConfig.spend_limit_id] != null) {
      currLimit = spendLimits[categoryConfig.spend_limit_id];
      eligibleSpend = Math.min(effectiveAmount, currLimit);
      spendLimits[categoryConfig.spend_limit_id] = roundCurrency(spendLimits[categoryConfig.spend_limit_id] - eligibleSpend);
    }

    const unrewardedMonthly = effectiveAmount - eligibleSpend;

    collector.recordLimits({
      spend_intent_key: spendIntentKey,
      limit_id: categoryConfig.spend_limit_id,
      total_eligible_monthly_limit: currLimit !== -1 ? currLimit : -1,
      additional_discount_amount: additionalDiscountAmount,
      spend_applied_monthly: eligibleSpend,
      unrewarded_monthly: unrewardedMonthly,
      spend_limit_remaining: categoryConfig.spend_limit_id ? spendLimits[categoryConfig.spend_limit_id] : -1
    });

    // 6. Calculate Accelerated Rewards
    const earnRate = categoryConfig.restricted ? 0 : categoryConfig.earn_rate_percent;
    const rawAcceleratedPoints = roundCurrency((eligibleSpend * earnRate) / 100);

    let acceleratedAwarded = rawAcceleratedPoints;
    let poolConsumed = 0; // local copy of reward pool tracker entry ( needed to pass to the collector ) 
    let poolRemainingAfter = -1; // local copy of the pool balance tracker entry after the spend ( needed to pass to the collector )

    if (categoryConfig.reward_pool_id && poolBalances[categoryConfig.reward_pool_id] != null) {
      const remainingPool = poolBalances[categoryConfig.reward_pool_id];
      acceleratedAwarded = Math.min(rawAcceleratedPoints, remainingPool);
      poolBalances[categoryConfig.reward_pool_id] -= acceleratedAwarded;
      poolConsumed = acceleratedAwarded;
      poolRemainingAfter = poolBalances[categoryConfig.reward_pool_id];
    }

    totalAccelerated += acceleratedAwarded;

    collector.recordAcceleratedReward({
      spend_intent_key: spendIntentKey,
      rate_percent: categoryConfig.restricted ? 0 : earnRate,
      additional_discount_amount: additionalDiscountAmount,
      spend_applied_monthly: categoryConfig.restricted ? 0 : eligibleSpend,
      points_earned: categoryConfig.restricted ? 0 : acceleratedAwarded,
      reward_pool: categoryConfig.reward_pool_id && !categoryConfig.restricted ? {
        pool_id: categoryConfig.reward_pool_id,
        points_consumed: poolConsumed,
        points_remaining_after: poolRemainingAfter,
        max_points: cardConfig.reward_pools?.[categoryConfig.reward_pool_id].max_points
      } : undefined
    });

    // 7. Calculate Base Rewards
    const acceleratedSpendUsed = earnRate > 0 ? roundCurrency((acceleratedAwarded / earnRate) * 100) : 0;

    // Only grant base rewards on portion of spend that wasn't successfully accelerated
    const remainingSpend = Math.max(0, roundCurrency(eligibleSpend - acceleratedSpendUsed));
    const basePoints = categoryConfig.restricted ? 0 : Math.floor((remainingSpend * cardConfig.base_rate_percent) / 100);

    totalBase += basePoints;

    collector.recordBaseReward({
      spend_intent_key: spendIntentKey,
      rate_percent: categoryConfig.restricted ? 0 : cardConfig.base_rate_percent,
      spend_applied: categoryConfig.restricted ? 0 : remainingSpend,
      points_earned: categoryConfig.restricted ? 0 : basePoints
    });

    collector.recordTotalPoints({
      spend_intent_key: spendIntentKey,
      total_points_monthly: categoryConfig.restricted ? 0 : (acceleratedAwarded + basePoints)
    });

    // 8. Track Milestones & Fee Waivers
    if (!categoryConfig.milestone_excluded && !categoryConfig.restricted) {
      milestoneEligibleSpend += eligibleSpend;
    }
    if (!categoryConfig.fee_waiver_excluded && !categoryConfig.restricted) {
      waiverEligibleSpend += eligibleSpend;
    }

    collector.recordMilestoneContribution({
      spend_intent_key: spendIntentKey,
      yearly_amount: eligibleSpend * 12, // Converting monthly eligible to yearly
      excluded: !!categoryConfig.milestone_excluded || !!categoryConfig.restricted,
      rail_id: route.rail_id,
      category_id: route.category_id
    });

    collector.recordWaiverContribution({
      spend_intent_key: spendIntentKey,
      yearly_amount: eligibleSpend * 12,
      excluded: !!categoryConfig.fee_waiver_excluded || !!categoryConfig.restricted,
      rail_id: route.rail_id,
      category_id: route.category_id
    });
  }

  // 9. Calculate Yearly Milestones and Waivers
  const eligibleSpendYearlyMilestone = milestoneEligibleSpend * 12;
  const eligibleSpendYearlyWaiver = waiverEligibleSpend * 12;

  let milestoneBonus = 0;
  const milestonesHit: any[] = [];
  if (cardConfig.milestones) {
    for (const m of cardConfig.milestones) {
      if (eligibleSpendYearlyMilestone >= m.threshold) {
        milestoneBonus += m.bonus_points;
        milestonesHit.push({
          threshold: m.threshold,
          bonus_points: m.bonus_points,
          routing: { rail_id: "system", category_id: "milestone" } // Meta-routing for structural consistency
        });
      }
    }
  }

  let feeWaived = false;
  const waiverThreshold = cardConfig.spend_based_waiver?.threshold ?? Infinity;
  if (eligibleSpendYearlyWaiver >= waiverThreshold) {
    feeWaived = true;
  }

  // 10. Generate Summary
  const totalAcceleratedYearly = totalAccelerated * 12;
  const totalBaseYearly = totalBase * 12;
  const totalPointsYearly = totalAcceleratedYearly + totalBaseYearly + milestoneBonus;

  let rupeeValue = 0;
  // 11. Value reward points in rupees
  if (cardConfig.reward_program) {
    const profile = cardConfig.reward_program.valuation_profiles.find(
      (p) => p.id === cardConfig.reward_program!.default_valuation_profile_id
    ) || cardConfig.reward_program.valuation_profiles[0];
    if (profile) {
      rupeeValue = roundCurrency(totalPointsYearly * profile.rupee_value_per_unit);
    }
  }

  const summary = {
    total_points_yearly: totalPointsYearly,
    accelerated_points_yearly: totalAcceleratedYearly,
    base_points_yearly: totalBaseYearly,
    milestone_bonus_points: milestoneBonus,
    fee_waived: feeWaived,
    valuation_in_rupees: rupeeValue
  };

  collector.finalizeSummary(summary);

  return collector.getResult(
    milestonesHit,
    milestoneBonus,
    eligibleSpendYearlyMilestone,
    eligibleSpendYearlyWaiver,
    feeWaived,
    waiverThreshold
  );
}
