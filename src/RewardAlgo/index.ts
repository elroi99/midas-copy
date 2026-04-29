// ============================================================
// TYPES
// ============================================================

type Routing = Record<
  string,
  {
    rail_id: string;
    category_id: string;
  }
>;

type Rails = Record<
  string,
  {
    categories: Record<
      string,
      {
        earn_rate_percent: number;
        reward_pool_id?: string;
        spend_limit_id?: string;
        restricted?: boolean;
        milestone_excluded?: boolean;
        fee_waiver_excluded?: boolean;
      }
    >;
  }
>;

type SpendLimits = Record<string, { max_spend: number }>;
type RewardPools = Record<string, { max_points: number }>;

type SpendSumsConfig = Record<string, { sum_of: string[] }>;

type Milestone = { threshold: number; bonus_points: number };


// ============================================================
// TRACE COLLECTOR (DEBUG ONLY)
// ============================================================

class TraceCollector {
  events: any[] = [];

  record(event: any) {
    this.events.push(event);
  }

  getTrace() {
    return this.events;
  }
}


// ============================================================
// REWARD BREAKDOWN COLLECTOR
// ============================================================

class RewardBreakdownCollector {

  aggregated: Record<string, any> = {};
  spendIntents: Record<string, any> = {};

  milestoneContribution: Record<string, number> = {};
  milestoneExcluded: Record<string, number> = {};

  spendLimitEvents: Record<string, any> = {};
  rewardPoolEvents: Record<string, any> = {};

  ensureIntent(intent: string) {
    if (!this.spendIntents[intent]) {
      this.spendIntents[intent] = {
        input_spend_monthly: 0,
        eligible_spend_monthly: 0,
        accelerated_spend_monthly: 0,
        base_spend_monthly: 0,
        accelerated_points_monthly: 0,
        base_points_monthly: 0,
        routed_via: null,
        aggregated_into: null
      };
    }
  }

  ensureAggregate(cat: string) {
    if (!this.aggregated[cat]) {
      this.aggregated[cat] = {
        input_spend_monthly: 0,
        eligible_spend_monthly: 0,
        accelerated_spend_monthly: 0,
        base_spend_monthly: 0,
        accelerated_points_monthly: 0,
        base_points_monthly: 0,
        route: null
      };
    }
  }

  recordInput(cardSpend: string, rawIntent: string, amount: number, route: any) {

    this.ensureIntent(rawIntent);
    this.ensureAggregate(cardSpend);

    this.spendIntents[rawIntent].input_spend_monthly += amount;
    this.spendIntents[rawIntent].routed_via = route;
    this.spendIntents[rawIntent].aggregated_into = cardSpend;

    this.aggregated[cardSpend].input_spend_monthly += amount;
    this.aggregated[cardSpend].route = route;
  }

  recordEligible(cardSpend: string, rawIntent: string, eligible: number) {

    this.ensureIntent(rawIntent);
    this.ensureAggregate(cardSpend);

    this.spendIntents[rawIntent].eligible_spend_monthly += eligible;
    this.aggregated[cardSpend].eligible_spend_monthly += eligible;
  }

  recordAccelerated(cardSpend: string, rawIntent: string, spend: number, points: number) {

    this.ensureIntent(rawIntent);
    this.ensureAggregate(cardSpend);

    this.spendIntents[rawIntent].accelerated_spend_monthly += spend;
    this.spendIntents[rawIntent].accelerated_points_monthly += points;

    this.aggregated[cardSpend].accelerated_spend_monthly += spend;
    this.aggregated[cardSpend].accelerated_points_monthly += points;
  }

  recordBase(cardSpend: string, rawIntent: string, spend: number, points: number) {

    this.ensureIntent(rawIntent);
    this.ensureAggregate(cardSpend);

    this.spendIntents[rawIntent].base_spend_monthly += spend;
    this.spendIntents[rawIntent].base_points_monthly += points;

    this.aggregated[cardSpend].base_spend_monthly += spend;
    this.aggregated[cardSpend].base_points_monthly += points;
  }

  recordMilestoneContribution(intent: string, amount: number) {
    this.milestoneContribution[intent] =
      (this.milestoneContribution[intent] ?? 0) + amount;
  }

  recordMilestoneExcluded(intent: string, amount: number) {
    this.milestoneExcluded[intent] =
      (this.milestoneExcluded[intent] ?? 0) + amount;
  }

  recordSpendLimit(limitId: string, requested: number, eligible: number) {

    if (!this.spendLimitEvents[limitId]) {
      this.spendLimitEvents[limitId] = {
        requested: 0,
        eligible: 0
      };
    }

    this.spendLimitEvents[limitId].requested += requested;
    this.spendLimitEvents[limitId].eligible += eligible;
  }

  recordRewardPool(poolId: string, pointsUsed: number) {

    if (!this.rewardPoolEvents[poolId]) {
      this.rewardPoolEvents[poolId] = {
        points_used: 0
      };
    }

    this.rewardPoolEvents[poolId].points_used += pointsUsed;
  }

  getBreakdown() {
    return {
      aggregated_rewards: this.aggregated,
      spend_intent_rewards: this.spendIntents,
      milestone_contribution: this.milestoneContribution,
      milestone_excluded: this.milestoneExcluded,
      spend_limit_events: this.spendLimitEvents,
      reward_pool_events: this.rewardPoolEvents
    };
  }
}



// ============================================================
// MAIN REWARD ENGINE
// ============================================================

function calculateCardRewards(params: {
  cardId: string;
  cardName: string;

  normalizedSpends: Record<string, number>;
  spendSumsConfig: SpendSumsConfig;
  routing: Routing;
  rails: Rails;

  baseRatePercent: number;

  spendLimits?: SpendLimits;
  rewardPools?: RewardPools;

  milestones?: Milestone[];
  spend_based_waiver?: { threshold: number };
}) {

  const trace = new TraceCollector();
  const collector = new RewardBreakdownCollector();


  // ----------------------------------------------------------
  // Aggregate spends
  // ----------------------------------------------------------

  const aggregatedSpends: Record<string, number> = {};
  const contributionMap: Record<string, Record<string, number>> = {};

  for (const cardSpend in params.spendSumsConfig) {

    const intents = params.spendSumsConfig[cardSpend].sum_of;

    aggregatedSpends[cardSpend] = 0;
    contributionMap[cardSpend] = {};

    for (const intent of intents) {

      const amount = params.normalizedSpends[intent] ?? 0;

      aggregatedSpends[cardSpend] += amount;
      contributionMap[cardSpend][intent] = amount;
    }
  }


  // ----------------------------------------------------------
  // Initialize pools and limits
  // ----------------------------------------------------------

  const rewardPools: Record<string, number> = {};
  if (params.rewardPools) {
    for (const p in params.rewardPools) {
      rewardPools[p] = params.rewardPools[p].max_points;
    }
  }

  const spendLimits: Record<string, number> = {};
  if (params.spendLimits) {
    for (const s in params.spendLimits) {
      spendLimits[s] = params.spendLimits[s].max_spend;
    }
  }


  let totalAccelerated = 0;
  let totalBase = 0;

  let milestoneEligibleSpend = 0;
  let waiverEligibleSpend = 0;


  // ----------------------------------------------------------
  // Process each aggregated spend
  // ----------------------------------------------------------

  for (const cardSpend in aggregatedSpends) {

    const inputAmount = aggregatedSpends[cardSpend];
    if (inputAmount <= 0) continue;

    const route = params.routing[cardSpend];
    const rail = params.rails[route.rail_id];
    const category = rail.categories[route.category_id];

    trace.record({
      type: "route",
      cardSpend,
      route
    });


    const contributions = contributionMap[cardSpend];


    // ------------------------------------------------------
    // Record input spend
    // ------------------------------------------------------

    for (const intent in contributions) {
      collector.recordInput(cardSpend, intent, contributions[intent], route);
    }


    if (category.restricted) {
      trace.record({
        type: "restricted",
        cardSpend
      });
      continue;
    }


    // ------------------------------------------------------
    // Spend limit handling
    // ------------------------------------------------------

    let eligibleSpend = inputAmount;

    if (category.spend_limit_id) {

      const limitRemaining = spendLimits[category.spend_limit_id];

      if (limitRemaining != null) {

        eligibleSpend = Math.min(inputAmount, limitRemaining);

        spendLimits[category.spend_limit_id] -= eligibleSpend;

        collector.recordSpendLimit(
          category.spend_limit_id,
          inputAmount,
          eligibleSpend
        );
      }
    }


    // ------------------------------------------------------
    // Distribute eligible spend across intents
    // ------------------------------------------------------

    for (const intent in contributions) {

      const share = contributions[intent] / inputAmount;
      const eligible = eligibleSpend * share;

      collector.recordEligible(cardSpend, intent, eligible);

      if (!category.milestone_excluded) {
        collector.recordMilestoneContribution(intent, eligible);
        milestoneEligibleSpend += eligible;
      } else {
        collector.recordMilestoneExcluded(intent, eligible);
      }

      if (!category.fee_waiver_excluded) {
        waiverEligibleSpend += eligible;
      }
    }


    // ------------------------------------------------------
    // Accelerated rewards
    // ------------------------------------------------------

    const earnRate = category.earn_rate_percent;

    const rawAcceleratedPoints = Math.floor(
      (eligibleSpend * earnRate) / 100
    );

    let acceleratedAwarded = rawAcceleratedPoints;

    if (category.reward_pool_id) {

      const remainingPool = rewardPools[category.reward_pool_id] ?? 0;

      acceleratedAwarded = Math.min(rawAcceleratedPoints, remainingPool);

      rewardPools[category.reward_pool_id] -= acceleratedAwarded;

      collector.recordRewardPool(
        category.reward_pool_id,
        acceleratedAwarded
      );
    }

    totalAccelerated += acceleratedAwarded;


    // ------------------------------------------------------
    // Split accelerated across intents
    // ------------------------------------------------------

    for (const intent in contributions) {

      const share = contributions[intent] / inputAmount;

      const spendPart = eligibleSpend * share;
      const pointsPart = acceleratedAwarded * share;

      collector.recordAccelerated(cardSpend, intent, spendPart, pointsPart);
    }


    // ------------------------------------------------------
    // Base rewards
    // ------------------------------------------------------

    const acceleratedSpendUsed =
      earnRate > 0 ? (acceleratedAwarded / earnRate) * 100 : 0;

    const remainingSpend = Math.max(
      0,
      eligibleSpend - acceleratedSpendUsed
    );

    const basePoints = Math.floor(
      (remainingSpend * params.baseRatePercent) / 100
    );

    totalBase += basePoints;

    for (const intent in contributions) {

      const share = contributions[intent] / inputAmount;

      const spendPart = remainingSpend * share;
      const pointsPart = basePoints * share;

      collector.recordBase(cardSpend, intent, spendPart, pointsPart);
    }
  }


  // ----------------------------------------------------------
  // Milestones
  // ----------------------------------------------------------

  milestoneEligibleSpend *= 12;
  waiverEligibleSpend *= 12;

  let milestoneBonus = 0;

  if (params.milestones) {
    for (const m of params.milestones) {
      if (milestoneEligibleSpend >= m.threshold) {
        milestoneBonus += m.bonus_points;
      }
    }
  }

  const feeWaived =
    waiverEligibleSpend > (params.spend_based_waiver?.threshold ?? Infinity);


  // ----------------------------------------------------------
  // Yearly totals
  // ----------------------------------------------------------

  totalAccelerated *= 12;
  totalBase *= 12;

  const totalPoints =
    totalAccelerated + totalBase + milestoneBonus;


  return {

    summary: {
      total_points_yearly: totalPoints,
      accelerated_points_yearly: totalAccelerated,
      base_points_yearly: totalBase,
      milestone_bonus: milestoneBonus,
      fee_waived: feeWaived
    },

    breakdown: collector.getBreakdown(),

    trace: trace.getTrace()
  };
}



// ============================================================
// EXAMPLE CONFIG INCLUDING VALUATION (NOT USED BY ENGINE)
// ============================================================

const reward_program = {

  reward_currency: {
    code: "MR_POINTS",
    display_name: "Membership Rewards Points",
    type: "points"
  },

  valuation_profiles: [
    {
      id: "floor",
      rupee_value_per_unit: 0.4
    },
    {
      id: "average",
      rupee_value_per_unit: 0.75
    },
    {
      id: "high",
      rupee_value_per_unit: 1.2
    }
  ],

  default_profile: "average"
};





// ============================================================
// SAMPLE USER SPENDS (already normalized to monthly)
// ============================================================

const normalizedSpends = {
  amazon: 20000,
  flipkart: 10000,
  flights_annual: 60000 / 12, // normalized to monthly
  hotels_annual: 48000 / 12,
  rent: 30000
};


// ============================================================
// SPEND SUMS (aggregation layer)
// ============================================================

const spendSumsConfig = {
  online_retail: {
    sum_of: ["amazon", "flipkart"]
  },

  travel_flights: {
    sum_of: ["flights_annual"]
  },

  travel_hotels: {
    sum_of: ["hotels_annual"]
  },

  rent_spend: {
    sum_of: ["rent"]
  }
};


// ============================================================
// ROUTING CONFIG
// ============================================================

const routing = {

  online_retail: {
    rail_id: "vouchers",
    category_id: "amazon_shopping"
  },

  travel_flights: {
    rail_id: "portal",
    category_id: "flights"
  },

  travel_hotels: {
    rail_id: "portal",
    category_id: "hotels"
  },

  rent_spend: {
    rail_id: "third_party",
    category_id: "rent_payment"
  }
};


// ============================================================
// RAILS CONFIG
// ============================================================

const rails = {

  vouchers: {
    categories: {

      amazon_shopping: {
        earn_rate_percent: 16,
        reward_pool_id: "accelerated_pool",
        spend_limit_id: "amazon_voucher_limit"
      }
    }
  },

  portal: {
    categories: {

      flights: {
        earn_rate_percent: 16,
        reward_pool_id: "accelerated_pool"
      },

      hotels: {
        earn_rate_percent: 33,
        reward_pool_id: "accelerated_pool"
      }
    }
  },

  third_party: {
    categories: {

      rent_payment: {
        earn_rate_percent: 0,
        milestone_excluded: true
      }
    }
  }
};


// ============================================================
// SPEND LIMITS
// ============================================================

const spendLimits = {

  amazon_voucher_limit: {
    max_spend: 10000
  }
};


// ============================================================
// REWARD POOLS
// ============================================================

const rewardPools = {

  accelerated_pool: {
    max_points: 10000
  }
};


// ============================================================
// MILESTONES
// ============================================================

const milestones = [

  {
    threshold: 750000,
    bonus_points: 5000
  },

  {
    threshold: 1500000,
    bonus_points: 5000
  }
];


// ============================================================
// SPEND BASED WAIVER
// ============================================================

const spend_based_waiver = {
  threshold: 800000
};


// ============================================================
// CALL THE ENGINE
// ============================================================

const result = calculateCardRewards({

  cardId: "hypothetical_infinia",
  cardName: "Hypothetical HDFC Infinia",

  normalizedSpends,
  spendSumsConfig,
  routing,
  rails,

  baseRatePercent: 3.33,

  spendLimits,
  rewardPools,

  milestones,
  spend_based_waiver
});


// ============================================================
// OUTPUT
// ============================================================

console.log("RESULT");
console.log(JSON.stringify(result, null, 2));


const FAKE_EXPORT = "fake";
export default FAKE_EXPORT;