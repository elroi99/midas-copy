/**
 * gen_configs_from_csv.ts
 *
 * Reads a card CSV and generates a TypeScript file of CardConfigV0 objects.
 *
 * Usage:
 *   npx tsx src/rewards-engine-v0/gen_configs_from_csv.ts <path-to-csv>
 *
 * Output:
 *   src/rewards-engine-v0/generated_configs.ts
 */

import * as fs from "fs";
import * as path from "path";

// ─── CSV Column Indices ───────────────────────────────────────────────────────
// Card Name, Base Earn Rate (%), Travel Portal, Vouchers, Hotel, Flights,
// Special merchant, Status, Column 1
const COL_NAME = 0;
const COL_BASE_RATE = 1;
const COL_TRAVEL_PORTAL = 2;
const COL_VOUCHERS = 3;
const COL_HOTEL = 4;
const COL_FLIGHTS = 5;
const COL_SPECIAL = 6;
const COL_STATUS = 7;
const COL_HARDCODE = 8;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse a percentage string (e.g. "2", "2%", "0.5%") into a decimal (0.02, 0.005). */
function parseRate(raw: string): number | null {
  const trimmed = raw.trim().replace(/%$/, "");
  if (!trimmed) return null;
  const n = parseFloat(trimmed);
  if (isNaN(n)) return null;
  return n / 100;
}

/** Return true if the cell means "not applicable" (em dash, encoding artifact, "na", "NA", or empty). */
function isNA(raw: string): boolean {
  const t = raw.trim();
  return (
    t === "" ||
    t === "—" ||
    t.startsWith("\u00E2") || // corrupted em dash encoding artifact (â, â€", etc.)
    t.toLowerCase() === "na"
  );
}

/** Convert a display name to snake_case card_id. */
function toCardId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Convert card_id to UPPER_SNAKE_CASE for the export constant name. */
function toExportName(cardId: string): string {
  return cardId.toUpperCase() + "_V0";
}

/**
 * Parse a very simple CSV (no embedded newlines in cells).
 * Handles quoted fields with commas inside.
 */
function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let inQuotes = false;
    let cell = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cols.push(cell);
        cell = "";
      } else {
        cell += ch;
      }
    }
    cols.push(cell);
    rows.push(cols);
  }
  return rows;
}

// ─── Fixed merchant table ─────────────────────────────────────────────────────

const MERCHANTS = [
  { key: "zepto",      display: "Zepto",       cats: '["grocery", "ecommerce"]' },
  { key: "blinkit",   display: "Blinkit",      cats: '["grocery"]' },
  { key: "swiggy",    display: "Swiggy",       cats: '["dining", "grocery"]' },
  { key: "amazon",    display: "Amazon",       cats: '["ecommerce", "shopping"]' },
  { key: "flipkart",  display: "Flipkart",     cats: '["ecommerce", "shopping"]' },
  { key: "zomato",    display: "Zomato",       cats: '["dining", "grocery"]' },
  { key: "eazydiner", display: "EazyDiner",    cats: '["dining"]' },
  { key: "myntra",    display: "Myntra",       cats: '["shopping", "ecommerce"]' },
  { key: "amazon_pay",display: "Amazon Pay",   cats: '["ecommerce", "shopping", "grocery"]' },
];

const RESTRICTED_CATS = new Set([
  "fuel",
  "government_transactions",
  "insurance_payment",
  "educational_institutions",
  "utilities",
  "rent_payment",
  "gold_jewellery",
]);

const NON_RESTRICTED_CATS = [
  { key: "flights",   display: "Flights" },
  { key: "shopping",  display: "Shopping" },
  { key: "ecommerce", display: "Ecommerce" },
  { key: "grocery",   display: "Grocery" },
  { key: "dining",    display: "Dining" },
  { key: "movies",    display: "Movies" },
  { key: "hotels",    display: "Hotels" },
  { key: "railways",  display: "Railways" },
];

const RESTRICTED_CAT_LIST = [
  { key: "educational_institutions", display: "Educational Institutions" },
  { key: "gold_jewellery",           display: "Gold Jewellery" },
  { key: "rent_payment",             display: "Rent Payment" },
  { key: "insurance_payment",        display: "Insurance Payment" },
  { key: "government_transactions",  display: "Government Transactions" },
  { key: "utilities",                display: "Utilities" },
  { key: "fuel",                     display: "Fuel" },
];

// ─── Special merchant column parser ──────────────────────────────────────────
// Maps natural language category names to their keys.
// Ignores merchant-specific overrides (e.g. "Amazon - 5%").
// Returns a map of category key → decimal rate.

function parseSpecialMerchantOverrides(raw: string): Map<string, number> {
  const overrides = new Map<string, number>();
  if (!raw || !raw.trim()) return overrides;

  // Pattern: find a rate like "10%", "12.5%", "5%" near category keywords
  // We look for patterns like "<rate>% ... <categories>" or "<categories> ... <rate>%"
  const rateMatch = raw.match(/([\d.]+)%/);
  if (!rateMatch) return overrides;

  const rate = parseFloat(rateMatch[1]) / 100;

  const lower = raw.toLowerCase();

  // Only override non-restricted categories
  if (lower.includes("dining") || lower.includes("food delivery") || lower.includes("dineout")) {
    overrides.set("dining", rate);
  }
  if (lower.includes("grocery") || lower.includes("instamart")) {
    overrides.set("grocery", rate);
  }
  if (lower.includes("shopping") && !lower.includes("online shopping")) {
    overrides.set("shopping", rate);
  }
  if (lower.includes("flights") || lower.includes("air travel")) {
    overrides.set("flights", rate);
  }
  if (lower.includes("hotels")) {
    overrides.set("hotels", rate);
  }
  if (lower.includes("movies")) {
    overrides.set("movies", rate);
  }
  if (lower.includes("railways") || lower.includes("train")) {
    overrides.set("railways", rate);
  }

  return overrides;
}

// ─── Code generation ──────────────────────────────────────────────────────────

function fmt(n: number): string {
  // Format decimal with up to 6 significant digits, no trailing zeros
  return parseFloat(n.toPrecision(6)).toString();
}

function generateConfig(row: string[]): string | null {
  const name = row[COL_NAME]?.trim() ?? "";
  if (!name) return null;

  const status = (row[COL_STATUS] ?? "").trim();
  if (status.toLowerCase() !== "keep") return null;

  const isIocl = (row[COL_HARDCODE] ?? "").trim().toLowerCase() === "hard code";

  const rawBase = row[COL_BASE_RATE] ?? "";
  const csvBaseRate = parseRate(rawBase);
  if (csvBaseRate === null) return null;

  // For IOCL: base = 0, fuel = csvBaseRate; otherwise base = csvBaseRate
  const baseRate = isIocl ? 0 : csvBaseRate;

  const cardId = toCardId(name);
  const exportName = toExportName(cardId);

  const travelPortal = row[COL_TRAVEL_PORTAL]?.trim() ?? "";
  const rawVouchers = row[COL_VOUCHERS] ?? "";
  const rawHotel = row[COL_HOTEL] ?? "";
  const rawFlights = row[COL_FLIGHTS] ?? "";
  const specialMerchant = row[COL_SPECIAL] ?? "";

  const hotelRate = isNA(rawHotel) ? null : parseRate(rawHotel);
  const flightsRate = isNA(rawFlights) ? null : parseRate(rawFlights);
  const hasAcceleratedPortal =
    !isNA(travelPortal) && (hotelRate !== null || flightsRate !== null);

  const hasVouchers = !isNA(rawVouchers) && !isNA(travelPortal);
  const voucherRate = hasVouchers ? parseRate(rawVouchers) : null;

  // Category overrides from Special merchant column (ignored for complex cases)
  const catOverrides = parseSpecialMerchantOverrides(specialMerchant);

  // ── Build direct.merchants ──────────────────────────────────────────────────
  const merchantsLines = MERCHANTS.map(
    (m) =>
      `      ${m.key.padEnd(10)}: { display_name: "${m.display}", earn_rate_percent: ${fmt(baseRate)}, spend_limit: null, earn_limit: null, categories: ${m.cats} },`
  ).join("\n");

  // ── Build direct.spend_categories ──────────────────────────────────────────
  const spendCatLines: string[] = [];

  for (const cat of NON_RESTRICTED_CATS) {
    let rate = baseRate;
    if (isIocl) rate = 0;
    if (catOverrides.has(cat.key) && !RESTRICTED_CATS.has(cat.key)) {
      rate = catOverrides.get(cat.key)!;
    }
    spendCatLines.push(
      `      ${cat.key.padEnd(25)}: { display_name: "${cat.display}", earn_rate_percent: ${fmt(rate)}, spend_limit: null, earn_limit: null, categories: ["${cat.key}"] },`
    );
  }

  for (const cat of RESTRICTED_CAT_LIST) {
    let rate = 0;
    // IOCL exception: fuel gets the CSV base rate
    if (isIocl && cat.key === "fuel") rate = csvBaseRate;
    spendCatLines.push(
      `      ${cat.key.padEnd(25)}: { display_name: "${cat.display}", earn_rate_percent: ${fmt(rate)}, spend_limit: null, earn_limit: null, categories: ["${cat.key}"] },`
    );
  }

  // ── accelerated_portal ────────────────────────────────────────────────────
  let acceleratedBlock = "";
  if (hasAcceleratedPortal) {
    const catLines: string[] = [];
    if (flightsRate !== null) {
      catLines.push(
        `      flights: { display_name: "Flights", earn_rate_percent: ${fmt(flightsRate)}, categories: ["flights"], spend_limit: null, earn_limit: null },`
      );
    }
    if (hotelRate !== null) {
      catLines.push(
        `      hotels:  { display_name: "Hotels",  earn_rate_percent: ${fmt(hotelRate)}, categories: ["hotels"],  spend_limit: null, earn_limit: null },`
      );
    }
    acceleratedBlock = `
  accelerated_portal: {
    rail_type: "Accelerated Portal",
    display_name: "${travelPortal}",
    template: {
      routing: "Book your flights or hotels via {display_name}",
    },
    categories: {
${catLines.join("\n")}
    },
  },
`;
  }

  // ── vouchers ──────────────────────────────────────────────────────────────
  let vouchersBlock = "";
  if (!hasVouchers) {
    vouchersBlock = `  vouchers: [],`;
  } else {
    vouchersBlock = `  vouchers: [
    {
      rail_type: "Voucher Portal",
      display_name: "${travelPortal}",
      earn_rate_percent: ${fmt(voucherRate!)},
      template: {
        routing: "Buy the {merchant_name} voucher from {display_name} and use it for payment.",
        voucher_discount: "{merchant_name} vouchers are available at a {additional_discount}% discount, saving you ₹{amount} instantly.",
      },
      merchants: GIFT_EDGE_MERCHANTS,
    },
  ],`;
  }

  // ── reward_program ────────────────────────────────────────────────────────
  const rewardProgramBlock = `  reward_program: {
    reward_currency: {
      code: "hdfc_reward_points",
      display_name: "Reward Points",
      type: "points",
    },
    valuation_profiles: [
      TEMP_FAKE_VALUATION_PROFILE,
      { id: "x1", rupee_value_per_unit: 0.25, description: "Low-end" },
      { id: "x2", rupee_value_per_unit: 0.5, description: "Typical" },
      { id: "x3", rupee_value_per_unit: 0.75, description: "Optimized" },
    ],
    default_valuation_profile_id: "temp_fake",
  },`;

  return `export const ${exportName}: CardConfigV0 = {
  card_id: "${cardId}",
  display_name: "${name}",

  direct: {
    base: {
      earn_rate_percent: ${fmt(baseRate)},
    },
    merchants: {
${merchantsLines}
    },
    spend_categories: {
${spendCatLines.join("\n")}
    },
  },
${acceleratedBlock}
${vouchersBlock}

${rewardProgramBlock}
};`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx gen_configs_from_csv.ts <path-to-csv>");
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsv(content);

  const configs: string[] = [];
  const exportNames: string[] = [];
  let skipped = 0;

  for (const row of rows) {
    // Skip header rows and empty rows
    if (!row[COL_NAME]?.trim() || row[COL_NAME].trim() === "Card Name") continue;

    const status = (row[COL_STATUS] ?? "").trim().toLowerCase();
    if (status === "ignore" || status === "") {
      skipped++;
      continue;
    }

    const code = generateConfig(row);
    if (!code) {
      skipped++;
      continue;
    }

    const cardId = toCardId(row[COL_NAME].trim());
    const exportName = toExportName(cardId);
    configs.push(code);
    exportNames.push(exportName);
  }

  const outputPath = path.join(
    path.dirname(path.resolve(csvPath)),
    // Always write next to this script
    path.resolve(__dirname, "generated_configs.ts")
      .replace(process.cwd() + "/", "")
  );

  const outFile = path.resolve(__dirname, "generated_configs.ts");

  const fileContent = `// AUTO-GENERATED by gen_configs_from_csv.ts — do not edit manually.
// Re-run the script to regenerate.

import type { CardConfigV0 } from "./types";
import { GIFT_EDGE_MERCHANTS, TEMP_FAKE_VALUATION_PROFILE } from "./configs";

${configs.join("\n\n")}

export const ALL_GENERATED_CARDS: CardConfigV0[] = [
  ${exportNames.join(",\n  ")},
];
`;

  fs.writeFileSync(outFile, fileContent, "utf-8");
  console.log(`✓ Generated ${configs.length} card configs → ${outFile}`);
  console.log(`  Skipped ${skipped} rows (Ignore / no data)`);
}

main();
