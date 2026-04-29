const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "bankkaroFullData.json");
const outputPath = path.join(__dirname, "bankkaroExtracted.json");

const raw = fs.readFileSync(inputPath, "utf-8");
// File has a non-JSON header line before the actual JSON object
const jsonStart = raw.indexOf("{");
const data = JSON.parse(raw.slice(jsonStart));

const EXCLUDED_PREFIXES = ["new_monthly", "new_cat"];

const extracted = data.savings.map((card) => {
  const filteredBreakdown = (card.spending_breakdown_array || [])
    .filter(
      (item) => !EXCLUDED_PREFIXES.some((prefix) => item.on.startsWith(prefix))
    )
    .map((item) => {
      const spend = item.spend ?? 0;
      const savings = item.savings ?? 0;
      const savings_rate = spend > 0 ? savings / spend : 0;

      const out = {
        on: item.on,
        savings_rate,
        explanation: item.explanation,
        totalMaxCap: item.totalMaxCap,
      };

      if ("conv_rate" in item) out.conv_rate = item.conv_rate;
      if ("maxCap" in item) out.maxCap = item.maxCap;
      if ("cashback_percentage" in item)
        out.cashback_percentage = item.cashback_percentage;

      return out;
    });

  return {
    bank_id: card.bank_id,
    card_name: card.card_name,
    card_type: card.card_type,
    seo_card_alias: card.seo_card_alias,
    joining_fees: card.joining_fees,
    id: card.id,
    spending_breakdown_array: filteredBreakdown,
  };
});

fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2), "utf-8");
console.log(`Done. ${extracted.length} cards written to bankkaroExtracted.json`);
