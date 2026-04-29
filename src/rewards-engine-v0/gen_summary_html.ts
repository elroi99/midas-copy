/**
 * gen_summary_html.ts
 *
 * Generates an HTML table summarising base, voucher, hotel, and flights rates
 * for all cards in generated_configs.ts.
 *
 * Usage:
 *   npx tsx src/rewards-engine-v0/gen_summary_html.ts
 *
 * Output:
 *   src/rewards-engine-v0/summary_table.html
 */

import * as fs from "fs";
import * as path from "path";
import { ALL_GENERATED_CARDS } from "./generated_configs";

function pct(value: number | undefined): string {
  if (value === undefined || value === null) return "—";
  const p = parseFloat((value * 100).toPrecision(6));
  return p % 1 === 0 ? `${p}%` : `${p}%`;
}

const rows = ALL_GENERATED_CARDS.map((card) => {
  const base = pct(card.direct.base.earn_rate_percent);
  const voucher =
    card.vouchers.length > 0 ? pct(card.vouchers[0].earn_rate_percent) : "—";
  const hotel = pct(card.accelerated_portal?.categories.hotels?.earn_rate_percent);
  const flights = pct(card.accelerated_portal?.categories.flights?.earn_rate_percent);

  return `    <tr>
      <td>${card.display_name}</td>
      <td class="num">${base}</td>
      <td class="num">${voucher}</td>
      <td class="num">${hotel}</td>
      <td class="num">${flights}</td>
    </tr>`;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Card Earn Rates Summary</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px;
      background: #f5f5f5;
      margin: 32px;
      color: #1a1a1a;
    }
    h1 {
      font-size: 18px;
      margin-bottom: 16px;
      color: #111;
    }
    table {
      border-collapse: collapse;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      min-width: 700px;
    }
    thead tr {
      background: #1a1a1a;
      color: #fff;
    }
    th {
      padding: 10px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    th.num, td.num {
      text-align: right;
      font-family: "SF Mono", "Fira Code", monospace;
    }
    td {
      padding: 9px 16px;
      border-bottom: 1px solid #eee;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    tbody tr:hover {
      background: #f9f9f9;
    }
    td.num {
      color: #0066cc;
    }
    .dash {
      color: #bbb;
    }
    p.meta {
      margin-top: 12px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <h1>Card Earn Rates — ${ALL_GENERATED_CARDS.length} cards</h1>
  <table>
    <thead>
      <tr>
        <th>Card Name</th>
        <th class="num">Base Rate</th>
        <th class="num">Voucher Rate</th>
        <th class="num">Hotel Rate</th>
        <th class="num">Flights Rate</th>
      </tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <p class="meta">Generated from generated_configs.ts · All rates shown as percentages (e.g. 2% = 0.02 stored internally)</p>
</body>
</html>
`;

const outFile = path.resolve(__dirname, "summary_table.html");
fs.writeFileSync(outFile, html, "utf-8");
console.log(`✓ Summary table → ${outFile}`);
