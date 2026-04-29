import {
  CardConfigV0,
  STANDARD_CATEGORIES,
  MERCHANT_NAMES,
  CONSOLIDATED_MERCHANT_NAMES,
} from "./types";

export interface V0ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_CATEGORIES = new Set<string>(STANDARD_CATEGORIES);
const VALID_MERCHANTS = new Set<string>(MERCHANT_NAMES);
const VALID_VOUCHER_MERCHANTS = new Set<string>(CONSOLIDATED_MERCHANT_NAMES);
const VALID_CURRENCY_TYPES = new Set(["points", "miles", "cashback"]);

// earn_rate_percent must be stored as a decimal: 3% → 0.03, never 3.
// Allowed range: [0, 1). Zero is valid (restricted/blocked category).
function checkEarnRate(value: unknown, path: string, errors: string[]): void {
  if (typeof value !== "number") {
    errors.push(`${path} must be a number`);
    return;
  }
  if (value < 0) {
    errors.push(`${path} must be >= 0`);
  } else if (value >= 1) {
    errors.push(
      `${path} must be a decimal (e.g. 0.03 for 3%) — got ${value}, which looks like a raw percentage`
    );
  }
}

export function validateCardConfigV0(config: CardConfigV0): V0ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ── Top-level structural checks ──────────────────────────────────────────────

  if (!config.card_id || typeof config.card_id !== "string") {
    errors.push("card_id must be a non-empty string");
  }

  if (!config.display_name || typeof config.display_name !== "string") {
    errors.push("display_name must be a non-empty string");
  }

  // ── Direct rail ───────────────────────────────────────────────────────────────

  if (!config.direct) {
    errors.push("direct rail is missing");
  } else {
    // base rate
    checkEarnRate(config.direct.base?.earn_rate_percent, "direct.base.earn_rate_percent", errors);

    // spend_categories
    const coveredCategories = new Set<string>();
    for (const [key, catConfig] of Object.entries(
      config.direct.spend_categories ?? {}
    )) {
      if (!VALID_CATEGORIES.has(key)) {
        errors.push(
          `direct.spend_categories key "${key}" is not a valid StandardCategory`
        );
      }
      if (catConfig) {
        coveredCategories.add(key);
        checkEarnRate(catConfig.earn_rate_percent, `direct.spend_categories["${key}"].earn_rate_percent`, errors);
        if (catConfig.spend_limit !== null && catConfig.spend_limit !== undefined && catConfig.spend_limit <= 0) {
          errors.push(
            `direct.spend_categories["${key}"].spend_limit must be null or > 0`
          );
        }
        if (catConfig.earn_limit !== null && catConfig.earn_limit !== undefined && catConfig.earn_limit <= 0) {
          errors.push(
            `direct.spend_categories["${key}"].earn_limit must be null or > 0`
          );
        }
        for (const cat of catConfig.categories ?? []) {
          if (!VALID_CATEGORIES.has(cat)) {
            errors.push(
              `direct.spend_categories["${key}"].categories contains invalid value "${cat}"`
            );
          }
        }
      }
    }

    // warn if any standard category is not covered
    const missingCategories = STANDARD_CATEGORIES.filter(
      (c) => !coveredCategories.has(c)
    );
    if (missingCategories.length > 0) {
      warnings.push(
        `direct.spend_categories does not cover: ${missingCategories.join(", ")} — these will fall back to base rate`
      );
    }

    // merchants
    const merchantEntries = Object.entries(config.direct.merchants ?? {});
    if (merchantEntries.length === 0) {
      warnings.push("direct.merchants is empty — no merchant-level overrides");
    }
    for (const [key, merchantConfig] of merchantEntries) {
      if (!VALID_MERCHANTS.has(key)) {
        errors.push(
          `direct.merchants key "${key}" is not a valid MerchantName`
        );
      }
      if (merchantConfig) {
        checkEarnRate(merchantConfig.earn_rate_percent, `direct.merchants["${key}"].earn_rate_percent`, errors);
        if (merchantConfig.spend_limit !== null && merchantConfig.spend_limit !== undefined && merchantConfig.spend_limit <= 0) {
          errors.push(
            `direct.merchants["${key}"].spend_limit must be null or > 0`
          );
        }
        if (merchantConfig.earn_limit !== null && merchantConfig.earn_limit !== undefined && merchantConfig.earn_limit <= 0) {
          errors.push(
            `direct.merchants["${key}"].earn_limit must be null or > 0`
          );
        }
        for (const cat of merchantConfig.categories ?? []) {
          if (!VALID_CATEGORIES.has(cat)) {
            errors.push(
              `direct.merchants["${key}"].categories contains invalid value "${cat}"`
            );
          }
        }
      }
    }
  }

  // ── Accelerated portal rail ───────────────────────────────────────────────────

  if (config.accelerated_portal) {
    const portal = config.accelerated_portal;

    if (!portal.rail_type) {
      errors.push("accelerated_portal.rail_type is missing");
    }
    if (!portal.display_name) {
      errors.push("accelerated_portal.display_name is missing");
    }
    if (!portal.template?.routing) {
      errors.push("accelerated_portal.template.routing is missing");
    }

    const { flights, hotels } = portal.categories ?? {};

    for (const [slot, slotConfig] of [
      ["flights", flights],
      ["hotels", hotels],
    ] as const) {
      if (slotConfig) {
        checkEarnRate(slotConfig.earn_rate_percent, `accelerated_portal.categories.${slot}.earn_rate_percent`, errors);
        if (slotConfig.spend_limit !== null && slotConfig.spend_limit !== undefined && slotConfig.spend_limit <= 0) {
          errors.push(
            `accelerated_portal.categories.${slot}.spend_limit must be null or > 0`
          );
        }
        if (slotConfig.earn_limit !== null && slotConfig.earn_limit !== undefined && slotConfig.earn_limit <= 0) {
          errors.push(
            `accelerated_portal.categories.${slot}.earn_limit must be null or > 0`
          );
        }
        for (const cat of slotConfig.categories ?? []) {
          if (!VALID_CATEGORIES.has(cat)) {
            errors.push(
              `accelerated_portal.categories.${slot}.categories contains invalid value "${cat}"`
            );
          }
        }
      }
    }
  }

  // ── Vouchers ──────────────────────────────────────────────────────────────────

  if (!config.vouchers || config.vouchers.length === 0) {
    warnings.push("vouchers is empty — no voucher portals configured");
  } else {
    for (const [pi, portal] of config.vouchers.entries()) {
      if (!portal.rail_type) {
        errors.push(`vouchers[${pi}].rail_type is missing`);
      }
      if (!portal.display_name) {
        errors.push(`vouchers[${pi}].display_name is missing`);
      }
      checkEarnRate(portal.earn_rate_percent, `vouchers[${pi}].earn_rate_percent`, errors);
      if (!portal.template?.routing) {
        errors.push(`vouchers[${pi}].template.routing is missing`);
      }

      for (const [key, merchantConfig] of Object.entries(
        portal.merchants ?? {}
      )) {
        if (!VALID_VOUCHER_MERCHANTS.has(key)) {
          errors.push(
            `vouchers[${pi}].merchants key "${key}" is not a valid MerchantName`
          );
        }
        if (merchantConfig) {
          if (
            typeof merchantConfig.additional_discount !== "number" ||
            merchantConfig.additional_discount < 0
          ) {
            errors.push(
              `vouchers[${pi}].merchants["${key}"].additional_discount must be >= 0`
            );
          }
          if (
            merchantConfig.spend_limit_monthly !== null &&
            merchantConfig.spend_limit_monthly !== undefined &&
            merchantConfig.spend_limit_monthly <= 0
          ) {
            errors.push(
              `vouchers[${pi}].merchants["${key}"].spend_limit_monthly must be null or > 0`
            );
          }
          if (
            typeof merchantConfig.surcharge_percent !== "number" ||
            merchantConfig.surcharge_percent < 0
          ) {
            errors.push(
              `vouchers[${pi}].merchants["${key}"].surcharge_percent must be >= 0`
            );
          }
          for (const cat of merchantConfig.categories ?? []) {
            if (!VALID_CATEGORIES.has(cat)) {
              errors.push(
                `vouchers[${pi}].merchants["${key}"].categories contains invalid value "${cat}"`
              );
            }
          }
        }
      }
    }
  }

  // ── Reward program ────────────────────────────────────────────────────────────

  if (!config.reward_program) {
    errors.push("reward_program is missing");
  } else {
    const rp = config.reward_program;

    if (!rp.reward_currency?.code) {
      errors.push("reward_program.reward_currency.code is missing");
    }
    if (!rp.reward_currency?.display_name) {
      errors.push("reward_program.reward_currency.display_name is missing");
    }
    if (!VALID_CURRENCY_TYPES.has(rp.reward_currency?.type)) {
      errors.push(
        `reward_program.reward_currency.type must be "points", "miles", or "cashback" — got "${rp.reward_currency?.type}"`
      );
    }

    if (!rp.valuation_profiles || rp.valuation_profiles.length === 0) {
      errors.push("reward_program.valuation_profiles must be a non-empty array");
    } else {
      const profileIds = new Set(rp.valuation_profiles.map((p) => p.id));
      if (!profileIds.has(rp.default_valuation_profile_id)) {
        errors.push(
          `reward_program.default_valuation_profile_id "${rp.default_valuation_profile_id}" does not match any valuation_profiles id`
        );
      }
      for (const [i, profile] of rp.valuation_profiles.entries()) {
        if (!profile.id) {
          errors.push(`reward_program.valuation_profiles[${i}].id is missing`);
        }
        if (
          typeof profile.rupee_value_per_unit !== "number" ||
          profile.rupee_value_per_unit <= 0
        ) {
          errors.push(
            `reward_program.valuation_profiles[${i}].rupee_value_per_unit must be a positive number`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
