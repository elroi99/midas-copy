"use client";

import { useState } from "react";
import {
  discoverVoucherMerchants,
  rankSpend,
  MERCHANT_NAMES,
  STANDARD_CATEGORIES,
} from "@/src/rewards-engine-v0";
import type {
  CardConfigV0,
  ConsolidatedMerchantName,
  MerchantName,
  RankedOutput,
  RouteDetail,
  RouteTrace,
  SpendInput,
  StandardCategory,
} from "@/src/rewards-engine-v0";
import CardPortfolioPicker from "./CardPortfolioPicker";
import { ALL_GENERATED_CARDS } from "@/src/rewards-engine-v0/generated_configs";

// ─── Types ────────────────────────────────────────────────────────────────────

type InputType = "merchant" | "category";
type ActiveTab = "user" | "developer";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SpendAdvisor() {
  const [inputType, setInputType] = useState<InputType>("merchant");
  const [merchant, setMerchant] = useState<MerchantName>("swiggy");
  const [category, setCategory] = useState<StandardCategory>("dining");
  const [amount, setAmount] = useState<string>("500");
  const [portfolioCards, setPortfolioCards] = useState<CardConfigV0[]>([]);
  const [selectedVoucherMerchants, setSelectedVoucherMerchants] = useState<ConsolidatedMerchantName[]>([]);
  const [voucherSearch, setVoucherSearch] = useState<string>("");
  const [result, setResult] = useState<RankedOutput | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("user");

  const availableVoucherMerchants =
    inputType === "category"
      ? discoverVoucherMerchants(category, ALL_GENERATED_CARDS)
      : [];

  function handleRun() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;

    let input: SpendInput;
    if (inputType === "merchant") {
      input = { input_type: "merchant", merchant, amount: amt };
    } else {
      input = {
        input_type: "category",
        category,
        amount: amt,
        selected_voucher_merchants: selectedVoucherMerchants,
      };
    }

    setResult(rankSpend({ spendInput: input, cards: ALL_GENERATED_CARDS }));
    setActiveTab("user");
  }

  return (
    <div className="space-y-6">
      {/* ── Card Portfolio Picker ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <CardPortfolioPicker selected={portfolioCards} onChange={setPortfolioCards} />
      </div>

      {/* ── Input Panel ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
        {/* Input type toggle */}
        <div className="flex gap-2">
          {(["merchant", "category"] as InputType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setInputType(t);
                setResult(null);
                setSelectedVoucherMerchants([]);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                inputType === t
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t === "merchant" ? "Merchant" : "Category"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          {/* Merchant or category selector */}
          {inputType === "merchant" ? (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase tracking-wide">Merchant</label>
              <select
                value={merchant}
                onChange={(e) => setMerchant(e.target.value as MerchantName)}
                className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm"
              >
                {MERCHANT_NAMES.map((m) => (
                  <option key={m} value={m}>
                    {formatKey(m)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase tracking-wide">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as StandardCategory);
                  setSelectedVoucherMerchants([]);
                  setVoucherSearch("");
                }}
                className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm"
              >
                {STANDARD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {formatKey(c)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-400 uppercase tracking-wide">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm w-36"
              placeholder="500"
              min={1}
            />
          </div>

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={
              portfolioCards.length === 0 ||
              (inputType === "category" &&
                availableVoucherMerchants.length > 0 &&
                selectedVoucherMerchants.length === 0)
            }
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Run
          </button>
        </div>

        {/* Voucher merchant picker (category mode) */}
        {inputType === "category" && availableVoucherMerchants.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-3">
            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              Select merchants to include
            </p>
            <input
              type="text"
              value={voucherSearch}
              onChange={(e) => setVoucherSearch(e.target.value)}
              placeholder="Search merchants…"
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            />
            <div className="flex flex-wrap gap-2">
              {availableVoucherMerchants
                .filter((item) => fuzzyMatch(voucherSearch, item.merchant_name))
                .map((item) => {
                  const selected = selectedVoucherMerchants.includes(item.merchant);
                  return (
                    <button
                      key={item.merchant}
                      onClick={() =>
                        setSelectedVoucherMerchants(
                          selected ? [] : [item.merchant]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selected
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                      }`}
                    >
                      {item.merchant_name}
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="space-y-4">
          {/* Tab switcher */}
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
            {(["user", "developer"] as ActiveTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === t
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t === "user" ? "User View" : "Developer View"}
              </button>
            ))}
          </div>

          {activeTab === "user" ? (
            <UserView result={result} portfolioCards={portfolioCards} />
          ) : (
            <DeveloperView result={result} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Display Card helpers ─────────────────────────────────────────────────────

interface DisplayCard {
  card_id: string;
  card_display_name: string;
  isUsersCard: boolean;
  bestRoute: RouteTrace;
  directRoute: RouteTrace | null;
}

const DISPLAY_CARD_COUNT = 5;
const USER_SLOT_COUNT = 2;

function buildDisplayCards(traces: RouteTrace[], portfolioCards: CardConfigV0[]): DisplayCard[] {
  // Group traces by card
  const byCard = new Map<string, RouteTrace[]>();
  for (const t of traces) {
    if (!byCard.has(t.card_id)) byCard.set(t.card_id, []);
    byCard.get(t.card_id)!.push(t);
  }

  // Per card: best route (any rail, non-restricted) + best direct route
  const cardEntries: DisplayCard[] = [];
  for (const [card_id, cardTraces] of byCard) {
    const nonRestricted = cardTraces.filter((t) => !t.is_restricted);
    const bestRoute = nonRestricted.reduce<RouteTrace | null>(
      (best, t) => (!best || t.net_rupee_saving > best.net_rupee_saving ? t : best),
      null
    );
    if (!bestRoute) continue;

    const directRoute =
      nonRestricted
        .filter((t) => t.rail_id === "direct")
        .reduce<RouteTrace | null>(
          (best, t) => (!best || t.net_rupee_saving > best.net_rupee_saving ? t : best),
          null
        ) ?? null;

    cardEntries.push({
      card_id,
      card_display_name: bestRoute.card_display_name,
      isUsersCard: portfolioCards.some((c) => c.card_id === card_id),
      bestRoute,
      directRoute,
    });
  }

  // Sort globally by best route saving
  cardEntries.sort((a, b) => b.bestRoute.net_rupee_saving - a.bestRoute.net_rupee_saving);

  const portfolioIds = new Set(portfolioCards.map((c) => c.card_id));

  // Pick user's top 2
  const userSlots = cardEntries
    .filter((e) => portfolioIds.has(e.card_id))
    .slice(0, USER_SLOT_COUNT);
  const userSlotIds = new Set(userSlots.map((e) => e.card_id));

  // Fill remaining from global (skip cards already in user slots)
  const globalSlots = cardEntries
    .filter((e) => !userSlotIds.has(e.card_id))
    .slice(0, DISPLAY_CARD_COUNT - userSlots.length);

  // Merge and re-sort
  return [...userSlots, ...globalSlots].sort(
    (a, b) => b.bestRoute.net_rupee_saving - a.bestRoute.net_rupee_saving
  );
}

// ─── User View ────────────────────────────────────────────────────────────────

function UserView({ result, portfolioCards }: { result: RankedOutput; portfolioCards: CardConfigV0[] }) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedRoute, setExpandedRoute] = useState<"best" | "direct" | null>(null);

  const displayCards = buildDisplayCards(result.traces, portfolioCards);

  function handleRouteClick(card_id: string, routeType: "best" | "direct") {
    if (expandedCard === card_id && expandedRoute === routeType) {
      setExpandedCard(null);
      setExpandedRoute(null);
    } else {
      setExpandedCard(card_id);
      setExpandedRoute(routeType);
    }
  }

  return (
    <div className="space-y-3">
      {displayCards.map((dc) => {
        const activeTrace =
          expandedCard === dc.card_id
            ? expandedRoute === "direct"
              ? dc.directRoute
              : dc.bestRoute
            : null;
        const detail = activeTrace ? buildDetailFromTrace(activeTrace, result) : null;

        return (
          <div key={dc.card_id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Card header */}
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
              {dc.isUsersCard && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-950 border border-blue-800 text-blue-300">
                  Your card
                </span>
              )}
              <span className="text-sm font-medium text-zinc-200">{dc.card_display_name}</span>
            </div>

            {/* Route rows */}
            <div className="divide-y divide-zinc-800">
              {/* Best route */}
              <RouteRow
                label="Best route"
                trace={dc.bestRoute}
                isExpanded={expandedCard === dc.card_id && expandedRoute === "best"}
                onClick={() => handleRouteClick(dc.card_id, "best")}
              />

              {/* Direct swipe */}
              {dc.directRoute && (
                <RouteRow
                  label="Direct swipe"
                  trace={dc.directRoute}
                  isExpanded={expandedCard === dc.card_id && expandedRoute === "direct"}
                  onClick={() => handleRouteClick(dc.card_id, "direct")}
                />
              )}
            </div>

            {/* Expanded detail panel */}
            {detail && (
              <div className="border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">How to spend</p>
                    <p className="text-zinc-200 text-sm">{detail.routing_instruction}</p>
                  </div>
                  {detail.usage_instructions && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Usage</p>
                      <p className="text-zinc-300 text-sm">{detail.usage_instructions}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Breakdown</p>
                    <table className="w-full text-sm">
                      <tbody>
                        {detail.breakdown_rows.map((row, i) => (
                          <tr key={i} className={`border-t border-zinc-800 ${row.is_highlight ? "font-semibold text-white" : "text-zinc-400"}`}>
                            <td className="py-1.5 pr-4">{row.label}</td>
                            <td className={`py-1.5 text-right tabular-nums ${row.is_highlight ? "text-green-400" : "text-zinc-200"}`}>
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">Explainability</p>
                  <ol className="space-y-2">
                    {detail.explainability.map((line, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="text-zinc-600 tabular-nums shrink-0 w-4">{i + 1}.</span>
                        <span className="text-zinc-300">{line}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-3">
                    <Stat label="Discount" value={`₹${fmt(detail.total_upfront_discount_rupees)}`} />
                    <Stat label="Rewards" value={fmtRewards(detail.total_rewards_earned)} />
                    <Stat label="Points value" value={`₹${fmt(detail.total_points_rupee_value)}`} />
                    <Stat label="Net saving" value={`₹${fmt(detail.net_rupee_saving)}`} highlight />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Similar merchant suggestions */}
      {result.similar_merchant_suggestions.length > 0 && (
        <div className="bg-zinc-900 border border-amber-800/40 rounded-2xl p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wide mb-3">
            Similar merchant suggestions
          </p>
          <div className="space-y-2">
            {result.similar_merchant_suggestions.map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-zinc-800/60 rounded-lg px-4 py-2">
                <div>
                  <span className="text-zinc-200 font-medium">{formatKey(s.merchant)}</span>
                  <span className="text-zinc-500 text-xs ml-2">via {s.summary_row.rail_display_name}</span>
                  <span className="text-zinc-600 text-xs ml-2">({s.similarity_group})</span>
                </div>
                <span className="text-green-400 font-medium">₹{fmt(s.summary_row.net_rupee_saving)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Route Row ────────────────────────────────────────────────────────────────

function RouteRow({
  label,
  trace,
  isExpanded,
  onClick,
}: {
  label: string;
  trace: RouteTrace;
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
        isExpanded ? "bg-zinc-800/80" : "hover:bg-zinc-800/40"
      }`}
    >
      <span className="text-xs text-zinc-500 w-20 shrink-0">{label}</span>
      <span className="flex-1 flex items-center gap-2 min-w-0">
        <RailBadge railName={trace.rail_display_name} />
        <span className="text-zinc-400 text-sm truncate">{getCategoryDisplayName(trace)}</span>
      </span>
      <span className={`tabular-nums text-sm font-semibold shrink-0 ${
        trace.net_rupee_saving > 0 ? "text-green-400" : trace.net_rupee_saving < 0 ? "text-red-400" : "text-zinc-500"
      }`}>
        ₹{fmt(trace.net_rupee_saving)}
      </span>
      <span className="text-xs text-zinc-500 tabular-nums shrink-0 w-14 text-right">
        {trace.roi_pct.toFixed(2)}%
      </span>
      <span className="text-zinc-600 text-xs shrink-0">{isExpanded ? "▲" : "▼"}</span>
    </button>
  );
}

function getCategoryDisplayName(trace: RouteTrace): string {
  if (trace.merchant === null && trace.category === null) return "Base Rate";
  if (trace.category !== null) return formatKey(trace.category);
  if (trace.merchant !== null) return formatKey(trace.merchant);
  return "—";
}

// ─── Developer View ───────────────────────────────────────────────────────────

function DeveloperView({ result }: { result: RankedOutput }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-300">
            Route Traces —{" "}
            <span className="text-zinc-500 font-normal">{result.traces.length} routes computed</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-zinc-500 uppercase tracking-wide border-b border-zinc-800 bg-zinc-950">
                {[
                  "#", "card", "rail_id", "merchant", "category", "rail",
                  "discount%", "discount₹",
                  "eff_spend", "excess",
                  "rate%", "uncapped",
                  "surcharge%", "surcharge₹",
                  "earn_cap", "earned",
                  "₹/unit", "pts₹",
                  "total₹", "roi%", "net₹",
                  "flags",
                ].map((h) => (
                  <th key={h} className="px-3 py-2 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.traces.map((trace, i) => (
                <>
                  <TraceRow
                    key={i}
                    trace={trace}
                    rank={i + 1}
                    isExpanded={expandedIndex === i}
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  />
                  {expandedIndex === i && (
                    <tr key={`${i}-expanded`} className="bg-zinc-950">
                      <td colSpan={22} className="px-4 py-3">
                        <div className="space-y-2">
                          <p className="text-zinc-400 text-xs font-medium">Raw trace</p>
                          <pre className="text-zinc-300 text-xs overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(trace, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input echo */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Spend Input</p>
        <pre className="text-xs text-zinc-300 font-mono overflow-x-auto">
          {JSON.stringify(result.spend_input, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TraceRow({
  trace,
  rank,
  isExpanded,
  onClick,
}: {
  trace: RouteTrace;
  rank: number;
  isExpanded: boolean;
  onClick: () => void;
}) {
  const railColors: Record<string, string> = {
    direct: "text-zinc-400",
    voucher: "text-blue-400",
    accelerated_portal: "text-purple-400",
  };

  return (
    <tr
      onClick={onClick}
      className={`border-b border-zinc-800/60 cursor-pointer transition-colors ${
        isExpanded ? "bg-zinc-800/80" : "hover:bg-zinc-800/30"
      } ${trace.is_restricted ? "opacity-40" : ""}`}
    >
      <td className="px-3 py-2 text-zinc-600">{rank}</td>
      <td className="px-3 py-2 text-zinc-200 whitespace-nowrap">{trace.card_display_name}</td>
      <td className={`px-3 py-2 ${railColors[trace.rail_id] ?? "text-zinc-400"}`}>
        {trace.rail_id}
      </td>
      <td className="px-3 py-2 text-zinc-300">{trace.merchant ?? "—"}</td>
      <td className="px-3 py-2 text-zinc-300">{trace.category ?? "—"}</td>
      <td className="px-3 py-2 text-zinc-400">{trace.rail_display_name}</td>

      <Num value={trace.upfront_discount_rate_pct} suffix="%" dim={trace.upfront_discount_rate_pct === 0} />
      <Num value={trace.upfront_discount_rupees} prefix="₹" dim={trace.upfront_discount_rupees === 0} />

      <Num value={trace.effective_spend} prefix="₹" />
      <Num value={trace.excess_spend} prefix="₹" dim={trace.excess_spend === 0} warn={trace.excess_spend > 0} />

      <Num value={trace.reward_rate_pct} suffix="%" />
      <Num value={trace.reward_rupees_uncapped} />

      <Num value={trace.surcharge_rate_pct} suffix="%" dim={trace.surcharge_rate_pct === 0} warn={trace.surcharge_rate_pct > 0} />
      <Num value={trace.surcharge_rupees} prefix="₹" dim={trace.surcharge_rupees === 0} warn={trace.surcharge_rupees > 0} />

      <td className="px-3 py-2 text-zinc-500 tabular-nums">
        {trace.earn_cap !== null ? trace.earn_cap : "∞"}
      </td>
      <Num value={trace.rewards_earned} />

      <Num value={trace.rupee_value_per_unit} prefix="₹" />
      <Num value={trace.points_rupee_value} prefix="₹" />

      <Num value={trace.total_rupee_value} prefix="₹" />
      <Num value={trace.roi_pct} suffix="%" />
      <td
        className={`px-3 py-2 tabular-nums font-semibold ${
          trace.net_rupee_saving > 0
            ? "text-green-400"
            : trace.net_rupee_saving < 0
            ? "text-red-400"
            : "text-zinc-500"
        }`}
      >
        ₹{fmt(trace.net_rupee_saving)}
      </td>

      <td className="px-3 py-2">
        <div className="flex gap-1 flex-wrap">
          {trace.is_restricted && <Flag label="RESTRICTED" color="red" />}
          {trace.spend_limit_applied && <Flag label="SPEND CAP" color="orange" />}
          {trace.earn_limit_applied && <Flag label="EARN CAP" color="orange" />}
          {!trace.is_restricted && !trace.spend_limit_applied && !trace.earn_limit_applied && (
            <span className="text-zinc-700">—</span>
          )}
        </div>
      </td>
    </tr>
  );
}

function Num({
  value,
  prefix = "",
  suffix = "",
  dim = false,
  warn = false,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  dim?: boolean;
  warn?: boolean;
}) {
  return (
    <td
      className={`px-3 py-2 text-right tabular-nums ${
        warn ? "text-orange-400" : dim ? "text-zinc-700" : "text-zinc-300"
      }`}
    >
      {prefix}{typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value}{suffix}
    </td>
  );
}

function RailBadge({ railName }: { railName: string }) {
  const colors: Record<string, string> = {
    "Direct Swipe": "bg-zinc-800 text-zinc-400",
    "Gift EDGE": "bg-blue-950 text-blue-300",
    "Axis Travel EDGE": "bg-purple-950 text-purple-300",
  };
  const cls = colors[railName] ?? "bg-zinc-800 text-zinc-400";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{railName}</span>
  );
}

function Flag({ label, color }: { label: string; color: "red" | "orange" }) {
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-xs font-medium ${
        color === "red"
          ? "bg-red-950 text-red-400"
          : "bg-orange-950 text-orange-400"
      }`}
    >
      {label}
    </span>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-zinc-800/60 rounded-lg px-3 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? "text-green-400" : "text-zinc-200"}`}>
        {value}
      </p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Returns true if every character in query appears in target in order (case-insensitive)
function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function formatKey(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function fmt(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
}

function fmtRewards(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
}

// Build a RouteDetail for any selected trace (not just best route)
// This mirrors the logic in calculator.ts but runs client-side for any row
function buildDetailFromTrace(trace: RouteTrace, result: RankedOutput): RouteDetail {
  const currencyName =
    ALL_GENERATED_CARDS.find((c) => c.card_id === trace.card_id)?.reward_program.reward_currency
      .display_name ?? "Points";

  const breakdownRows: RouteDetail["breakdown_rows"] = [];
  breakdownRows.push({ label: "Spend amount", value: `₹${fmt(trace.input_amount)}` });

  if (trace.spend_limit_applied) {
    breakdownRows.push({
      label: `Spend limit (₹${fmt(trace.effective_spend + trace.excess_spend)} cap)`,
      value: `₹${fmt(trace.excess_spend)} earns nothing`,
    });
  }

  if (trace.upfront_discount_rupees > 0) {
    breakdownRows.push({
      label: `Upfront discount (${trace.upfront_discount_rate_pct}%)`,
      value: `+ ₹${fmt(trace.upfront_discount_rupees)}`,
    });
  }

  breakdownRows.push({
    label: `${currencyName} earned (${trace.reward_rate_pct}% on ₹${fmt(trace.effective_spend)})`,
    value: `${fmtRewards(trace.rewards_earned)} ${currencyName}`,
  });

  if (trace.earn_limit_applied) {
    breakdownRows.push({
      label: `Earn cap applied`,
      value: `Capped at ${fmtRewards(trace.rewards_earned)} ${currencyName}`,
    });
  }

  breakdownRows.push({
    label: `${currencyName} value (@ ₹${trace.rupee_value_per_unit}/unit)`,
    value: `+ ₹${fmt(trace.points_rupee_value)}`,
  });

  if (trace.surcharge_rupees > 0) {
    breakdownRows.push({
      label: `Surcharge (${trace.surcharge_rate_pct}%)`,
      value: `− ₹${fmt(trace.surcharge_rupees)}`,
    });
  }

  breakdownRows.push({
    label: "Net saving",
    value: `₹${fmt(trace.net_rupee_saving)}`,
    is_highlight: true,
  });

  const explainability: string[] = [];
  if (trace.spend_limit_applied) {
    explainability.push(
      `Spend limit applies — only ₹${fmt(trace.effective_spend)} earns rewards; ₹${fmt(trace.excess_spend)} excess earns nothing.`
    );
  }
  if (trace.upfront_discount_rupees > 0) {
    explainability.push(
      `${trace.upfront_discount_rate_pct}% upfront discount on ₹${fmt(trace.input_amount)} = ₹${fmt(trace.upfront_discount_rupees)} saved instantly.`
    );
  }
  explainability.push(
    `Earn ${trace.reward_rate_pct} ${currencyName} per ₹100 on ₹${fmt(trace.effective_spend)} = ${fmtRewards(trace.reward_rupees_uncapped)} ${currencyName}.`
  );
  if (trace.earn_limit_applied) {
    explainability.push(
      `Earn cap of ${fmtRewards(trace.earn_cap!)} ${currencyName} applied — capped to ${fmtRewards(trace.rewards_earned)} ${currencyName}.`
    );
  }
  explainability.push(
    `${fmtRewards(trace.rewards_earned)} ${currencyName} @ ₹${trace.rupee_value_per_unit}/unit = ₹${fmt(trace.points_rupee_value)}.`
  );
  if (trace.surcharge_rupees > 0) {
    explainability.push(
      `${trace.surcharge_rate_pct}% surcharge = ₹${fmt(trace.surcharge_rupees)} deducted.`
    );
  }

  const parts: string[] = [];
  if (trace.upfront_discount_rupees > 0) parts.push(`₹${fmt(trace.upfront_discount_rupees)} (discount)`);
  if (trace.points_rupee_value > 0) parts.push(`₹${fmt(trace.points_rupee_value)} (points)`);
  if (trace.surcharge_rupees > 0) parts.push(`− ₹${fmt(trace.surcharge_rupees)} (surcharge)`);
  explainability.push(`Net saving: ${parts.join(" + ")} = ₹${fmt(trace.net_rupee_saving)}.`);

  const routingInstruction =
    trace.rail_id === "accelerated_portal"
      ? `Book via ${trace.rail_display_name}.`
      : trace.rail_id === "voucher"
      ? `Buy the ${formatKey(trace.merchant ?? "")} voucher from ${trace.rail_display_name} and use it for payment.`
      : "Swipe your card directly at checkout.";

  const usageInstructions =
    trace.rail_id === "voucher" && trace.merchant
      ? (ALL_GENERATED_CARDS.find((c) => c.card_id === trace.card_id)
          ?.vouchers.flatMap((p) => Object.entries(p.merchants))
          .find(([k]) => k === trace.merchant)?.[1]?.usage_instructions ?? "")
      : "Pay directly using your card at checkout.";

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
