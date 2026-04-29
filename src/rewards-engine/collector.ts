// types.ts doesn't export SpendIntentKey, use string



export class RewardBreakdownCollector {
  private userSpendIntents: Record<string, any> = {};
  private restrictedSpends: any = {
    spend_intents: [],
    total_yearly_amount: 0
  };
  private unrewardedDueToLimits: any = {
    spend_intents: [],
    total_unrewarded_yearly: 0
  };

  private milestoneContributions: any[] = [];
  private milestoneExclusions: any[] = [];
  private waiverContributions: any[] = [];
  private waiverExclusions: any[] = [];
  private expStrings : any[] = [];

  private summary: any = {};
  private cardBaseRate: number = 0;
  private currencyName: string = "points";
  private pointsValuation: number = 1;

  setCardContext(params: { baseRate: number, currencyName: string, valuation: number }) {
    this.cardBaseRate = params.baseRate;
    this.currencyName = params.currencyName;
    this.pointsValuation = params.valuation;
  }

  beginSpendIntent(params: {
    spend_intent_key: string;
    spend_intent_label: string;
    monthly_amount: number;
    yearly_amount: number;
    rail_id: string;
    rail_label: string;
    category_id: string;
    category_label: string;
    category_roi: number;
    additional_discount_roi: number;
    additional_discount_amount: number;
    portal_name?: string;
    merchant_name?: string;
    routing_statement?: string;
    usage_instructions?: string;
  }) {
    this.userSpendIntents[params.spend_intent_key] = {
      input: {
        monthly_amount: params.monthly_amount,
        yearly_amount: params.yearly_amount,
      },
      routing: {
        rail_id: params.rail_id,
        rail_label: params.rail_label,
        category_id: params.category_id,
        category_label: params.category_label,
        category_roi: params.category_roi,
        additional_discount_roi: params.additional_discount_roi,
        portal_name: params.portal_name,
        merchant_name: params.merchant_name,
      },
      limits: {
        total_eligible_monthly_limit: 0,
        additional_discount_amount: params.additional_discount_amount,
        spend_applied_monthly: 0,
        unrewarded_monthly: 0,
        spend_limit_remaining: 0,
      },
      rewards: {
        accelerated: null,
        base: null,
        additional_discount: {
          spend_intent_key: params.spend_intent_key,
          amount_monthly: params.additional_discount_amount,
          additional_discount_roi: params.additional_discount_roi,
        },
        total_points_monthly: 0,
      },
      flags: {
         restricted: false,
         pool_exhausted: false,
         milestone_excluded: false,
         fee_waiver_excluded: false
      },
      metadata: {
        spend_intent_label: params.spend_intent_label,
        routing_statement: params.routing_statement,
      },
      explainability_strings: []
    };

    if (params.routing_statement) {
      this.userSpendIntents[params.spend_intent_key].explainability_strings.push({
        type: "ROUTING",
        spend_intent_key: params.spend_intent_key,
        message: params.routing_statement
      });
    }

    if (params.usage_instructions) {
      this.userSpendIntents[params.spend_intent_key].explainability_strings.push({
        type: "USAGE",
        spend_intent_key: params.spend_intent_key,
        message: params.usage_instructions
      });
    }
  }

  markRestricted(params: {
    spend_intent_key: string;
    monthly_amount: number;
    yearly_amount: number;
    rail_id: string;
    category_id: string;
  }) {
    this.restrictedSpends.spend_intents.push({
      spend_intent_key: params.spend_intent_key,
      monthly_amount: params.monthly_amount,
      yearly_amount: params.yearly_amount,
      routing: {
        rail_id: params.rail_id,
        category_id: params.category_id
      }
    });
    this.restrictedSpends.total_yearly_amount += params.yearly_amount;

    if (this.userSpendIntents[params.spend_intent_key]) {
       this.userSpendIntents[params.spend_intent_key].flags.restricted = true;
    }

    this.userSpendIntents[params.spend_intent_key].explainability_strings.push({
      type: "RESTRICTION",
      spend_intent_key: params.spend_intent_key,
      message: `Spend on ${params.category_id} via ${params.rail_id} is restricted and does not earn any base or accelerated rewards.`
    });
  }

  recordLimits(params: {
    spend_intent_key: string;
    limit_id?: string;
    total_eligible_monthly_limit: number;
    additional_discount_amount: number;
    spend_applied_monthly: number;
    unrewarded_monthly: number;
    spend_limit_remaining: number;
  }) {
    const entry = this.userSpendIntents[params.spend_intent_key];
    entry.limits = params;
    
    entry.rewards.additional_discount.amount_monthly = params.additional_discount_amount;

    if (params.additional_discount_amount > 0) {
      const roi = entry.rewards.additional_discount.additional_discount_roi;
      entry.explainability_strings.push({
        type: "DISCOUNT",
        spend_intent_key: params.spend_intent_key,
        message: `An upfront discount of ₹${params.additional_discount_amount.toLocaleString()} (${roi}%) was applied to the initial spend.`
      });
    }

    if (params.unrewarded_monthly > 0) {
      entry.explainability_strings.push({
        type: "LIMIT EXCEEDED",
        spend_intent_key: params.spend_intent_key,
        message: `Spend exceeded the limit${params.limit_id ? ` for limit id : ${params.limit_id}` : ''}. ₹${params.unrewarded_monthly.toLocaleString()} was not eligible for rewards.`
      });

      this.unrewardedDueToLimits.spend_intents.push({
        spend_intent_key: params.spend_intent_key,
        unrewarded_monthly: params.unrewarded_monthly,
        unrewarded_yearly: params.unrewarded_monthly * 12,
        routing: {
          rail_id: entry.routing.rail_id,
          category_id: entry.routing.category_id
        }
      });
      this.unrewardedDueToLimits.total_unrewarded_yearly += params.unrewarded_monthly * 12;
    }
  }

  recordAcceleratedReward(params: {
    spend_intent_key: string;
    rate_percent: number;
    additional_discount_amount: number;
    spend_applied_monthly: number;
    points_earned: number;
    reward_pool?: {
      pool_id: string;
      points_consumed: number;
      points_remaining_after: number;
      max_points?: number;
    };
  }) {
    const entry = this.userSpendIntents[params.spend_intent_key];
    entry.rewards.accelerated = {
      ...params,
      spend_intent_key: params.spend_intent_key
    };
    if (params.points_earned > 0) {
       entry.explainability_strings.push({
         type: "ACCELERATED_REWARD",
         spend_intent_key: params.spend_intent_key,
         message: `Earned ${params.points_earned.toLocaleString()} ${this.currencyName} at rate of ${params.rate_percent}% on ₹${params.spend_applied_monthly.toLocaleString()} spend.`
       });
    }

    if (params.reward_pool && params.reward_pool.points_consumed > 0 && params.reward_pool.points_remaining_after === 0) {
       entry.flags.pool_exhausted = true;
       entry.explainability_strings.push({
         type: "POOL EXHAUSTED",
         spend_intent_key: params.spend_intent_key,
         message: `The reward pool (${params.reward_pool.pool_id}) was completely exhausted by this transaction. Further rewards will fall back to the base rate.`
       });
    }
  }

  recordBaseReward(params: {
    spend_intent_key: string;
    rate_percent: number;
    spend_applied: number;
    points_earned: number;
  }) {
    this.userSpendIntents[params.spend_intent_key].rewards.base = {
      ...params,
      spend_intent_key: params.spend_intent_key
    };
    if (params.points_earned > 0) {
      this.userSpendIntents[params.spend_intent_key].explainability_strings.push({
        type: "BASE_REWARD",
        spend_intent_key: params.spend_intent_key,
        message: `Earned ${params.points_earned.toLocaleString()} ${this.currencyName} at the base rate of ${params.rate_percent}% on ₹${params.spend_applied.toLocaleString()} spend.`
      });
    }
  }

  recordTotalPoints(params: {
    spend_intent_key: string;
    total_points_monthly: number;
  }) {
    this.userSpendIntents[params.spend_intent_key].rewards.total_points_monthly = params.total_points_monthly;
  }

  recordMilestoneContribution(params: {
    spend_intent_key: string;
    yearly_amount: number;
    excluded: boolean;
    rail_id: string;
    category_id: string;
  }) {
    if (params.excluded) {
      this.milestoneExclusions.push({
         spend_intent_key: params.spend_intent_key,
         amount_yearly: params.yearly_amount,
         routing: { rail_id: params.rail_id, category_id: params.category_id }
      });
      this.userSpendIntents[params.spend_intent_key].flags.milestone_excluded = true;
      this.userSpendIntents[params.spend_intent_key].explainability_strings.push({
         type: "MILESTONE EXCLUDED",
         spend_intent_key: params.spend_intent_key,
         message: `This category ${params.category_id} is explicitly excluded from contributing to annual milestone benefits.`
      });
    } else {
      this.milestoneContributions.push({
         spend_intent_key: params.spend_intent_key,
         yearly_amount: params.yearly_amount,
         routing: { rail_id: params.rail_id, category_id: params.category_id }
      });
    }
  }

  recordWaiverContribution(params: {
    spend_intent_key: string;
    yearly_amount: number;
    excluded: boolean;
    rail_id: string;
    category_id: string;
  }) {
    if (params.excluded) {
      this.waiverExclusions.push({
         spend_intent_key: params.spend_intent_key,
         yearly_amount: params.yearly_amount,
         routing: { rail_id: params.rail_id, category_id: params.category_id }
      });
      this.userSpendIntents[params.spend_intent_key].flags.fee_waiver_excluded = true;
      this.userSpendIntents[params.spend_intent_key].explainability_strings.push({
         type: "WAIVER EXCLUDED",
         spend_intent_key: params.spend_intent_key,
         message: `This category ${params.category_id} is explicitly excluded from contributing to annual fee waiver.`
      });
    } else {
      this.waiverContributions.push({
         spend_intent_key: params.spend_intent_key,
         yearly_amount: params.yearly_amount,
         routing: { rail_id: params.rail_id, category_id: params.category_id }
      });
    }
  }

  finalizeSummary(summary: any) {
    this.summary = summary;
  }

  getResult(
    milestonesHit: any[], 
    totalBonusPoints: number, 
    eligibleSpendYearlyMilestone: number, 
    eligibleSpendYearlyWaiver: number, 
    feeWaived: boolean, 
    waiverThreshold: number
  ) {
    return {
      summary: this.summary,
      user_spend_breakdown: this.userSpendIntents,
      milestones: {
        eligible_spend_yearly: eligibleSpendYearlyMilestone,
        contributing_spend_intents: this.milestoneContributions,
        excluded_spend_intents: this.milestoneExclusions,
        milestones_triggered: milestonesHit,
        total_bonus_points: totalBonusPoints
      },
      fee_waiver: {
        eligible_spend_yearly: eligibleSpendYearlyWaiver,
        contributing_spend_intents: this.waiverContributions,
        excluded_spend_intents: this.waiverExclusions,
        threshold: waiverThreshold,
        waived: feeWaived
      },
      restricted_spends: this.restrictedSpends,
      unrewarded_due_to_limits: this.unrewardedDueToLimits,
    };
  }
}
