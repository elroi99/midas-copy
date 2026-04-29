import {
  CardConfig,
  ValidationResult,
  RailMap,
  DIRECT_CATEGORIES,
  ACCELERATED_PORTAL_CATEGORIES,
  VOUCHER_CATEGORIES,
  SPEND_INTENT_KEYS
} from "../types";


/**
 * Validates a CardConfig object against strict business logic rules.
 * Enforces coverage, referential integrity, and logical consistency.
 */
export function validateCardConfig(
  config: CardConfig,
): ValidationResult {
  const errors: ValidationResult["errors"] = [];

  // 1. Structural Constants Check
  if (!config.card_id) errors.push({ code: "REQ_FIELD", message: "card_id is required", path: ["card_id"] });
  if (config.base_rate_percent < 0) errors.push({ code: "INVALID_RATE", message: "base_rate_percent must be >= 0", path: ["base_rate_percent"] });

  // 2. Strict Coverage Check (All SPEND_INTENT_KEYS must be routed)
  // Every key defined in the whitelist must be routed in spend_intent_routing.
  for (const intentKey of SPEND_INTENT_KEYS) {
    if (!(config.spend_intent_routing as any)[intentKey]) {
      errors.push({
        code: "MISSING_COVERAGE",
        message: `Spend intent '${intentKey}' is not mapped in spend_intent_routing. Every intent from global SPEND_INPUTS must be explicitly routed.`,
        path: ["spend_intent_routing", intentKey],
      });
    }
  }

  // 2 & 3. Routing & Referential Integrity
  for (const intentKey in config.spend_intent_routing) {
    const route = (config.spend_intent_routing as any)[intentKey];
    if (!route) {
      errors.push({
        code: "INCOMPLETE_ROUTING_ENTRY",
        message: `Routing entry for spend intent '${intentKey}' is defined but empty.`,
        path: ["spend_intent_routing", intentKey],
      });
      continue;
    }

    // Check if intentKey exists in the whitelist (prevent unknown routing entries)
    if (!SPEND_INTENT_KEYS.includes(intentKey as any)) {
      errors.push({
        code: "UNKNOWN_INTENT",
        message: `Spend intent '${intentKey}' does not exist in the global SPEND_INPUTS registry.`,
        path: ["spend_intent_routing", intentKey],
      });
    }

    const railId = route.rail_id as keyof RailMap;
    const rail = config.rails[railId];
    if (!rail) {
      errors.push({
        code: "INVALID_RAIL_ID",
        message: `Rail '${route.rail_id}' referenced in routing for '${intentKey}' does not exist.`,
        path: ["spend_intent_routing", intentKey, "rail_id"],
      });
      continue;
    }

    // Rule 2: Ensure category_id exists within the rail's categories
    const categories = rail.categories as Record<string, any>;
    if (!categories[route.category_id as any]) {
      errors.push({
        code: "INVALID_CATEGORY_ID",
        message: `Category '${route.category_id}' referenced for intent '${intentKey}' does not exist in rail '${route.rail_id}'.`,
        path: ["spend_intent_routing", intentKey, "category_id"],
      });
    }
  }

  // 4. Rails & Categories Deep Check
  for (const railId in config.rails) {
    const rail = config.rails[railId as keyof RailMap];
    if (!rail) {
      errors.push({
        code: "INCOMPLETE_RAIL_DEFINITION",
        message: `Rail '${railId}' is defined but empty.`,
        path: ["rails", railId],
      });
      continue;
    }

    if (!rail.categories) {
      errors.push({
        code: "MISSING_CATEGORIES",
        message: `Rail '${railId}' is missing its categories object.`,
        path: ["rails", railId, "categories"],
      });
      continue;
    }

    const categories = rail.categories as Record<string, any>;
    for (const catId in categories) {
      const category = categories[catId];

      if (category.earn_rate_percent < 0) {
        errors.push({
          code: "INVALID_RATE",
          message: `Earn rate for category '${catId}' in rail '${railId}' cannot be negative.`,
          path: ["rails", railId, "categories", catId, "earn_rate_percent"],
        });
      }

      if (railId === "direct" && !DIRECT_CATEGORIES.includes(catId as any)) {
        errors.push({
          code: "INVALID_CATEGORY_ID",
          message: `Category '${catId}' is not a valid predefined category for the 'direct' rail.`,
          path: ["rails", railId, "categories", catId],
        });
      }

      if (railId === "accelerated_portal" && !ACCELERATED_PORTAL_CATEGORIES.includes(catId as any)) {
        errors.push({
          code: "INVALID_CATEGORY_ID",
          message: `Category '${catId}' is not a valid predefined category for the 'accelerated_portal' rail.`,
          path: ["rails", railId, "categories", catId],
        });
      }

      if (railId === "vouchers" && !VOUCHER_CATEGORIES.includes(catId as any)) {
        errors.push({
          code: "INVALID_CATEGORY_ID",
          message: `Category '${catId}' is not a valid predefined category for the 'vouchers' rail.`,
          path: ["rails", railId, "categories", catId],
        });
      }

      // Rule 3: Verify Reward Pool & Spend Limit References
      if (category.reward_pool_id && (!config.reward_pools || !config.reward_pools[category.reward_pool_id])) {
        errors.push({
          code: "DANGLING_POOL_REFERENCE",
          message: `Reward pool '${category.reward_pool_id}' referenced by category '${catId}' does not exist.`,
          path: ["rails", railId, "categories", catId, "reward_pool_id"],
        });
      }

      if (category.spend_limit_id && (!config.spend_limits || !config.spend_limits[category.spend_limit_id])) {
        errors.push({
          code: "DANGLING_LIMIT_REFERENCE",
          message: `Spend limit '${category.spend_limit_id}' referenced by category '${catId}' does not exist.`,
          path: ["rails", railId, "categories", catId, "spend_limit_id"],
        });
      }
    }
  }

  // Rule 4: Milestone Threshold Ordering
  if (config.milestones && config.milestones.length > 0) {
    for (let i = 1; i < config.milestones.length; i++) {
      if (config.milestones[i].threshold <= config.milestones[i - 1].threshold) {
        errors.push({
          code: "INVALID_MILESTONE_ORDER",
          message: `Milestone threshold ${config.milestones[i].threshold} at index ${i} must be greater than previous threshold ${config.milestones[i - 1].threshold}.`,
          path: ["milestones", i.toString(), "threshold"],
        });
      }
    }
  }

  // 5. Reward Program Check
  if (config.reward_program) {
    const profileIds = config.reward_program.valuation_profiles.map(p => p.id);
    if (!profileIds.includes(config.reward_program.default_valuation_profile_id)) {
      errors.push({
        code: "INVALID_DEFAULT_PROFILE",
        message: `Default profile ID '${config.reward_program.default_valuation_profile_id}' not found in valuation_profiles.`,
        path: ["reward_program", "default_valuation_profile_id"],
      });
    }
  }

  return {
    is_valid: errors.length === 0,
    errors,
  };
}
