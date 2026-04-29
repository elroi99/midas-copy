"use client";

import React, { useState, Fragment } from "react";
import JsonView from '@uiw/react-json-view';

export default function RewardsTable({ ledger, config }: { ledger: any, config: any }) {


  if (!ledger || !config) return <div>Loading Ledger...</div>;

  const intents = Object.entries(ledger.user_spend_breakdown);
  
  return (
    <div className="flex flex-col gap-12 w-full mx-auto p-4">

      {/* SECTION 0: CARD CONFIG AND IDENTITY */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            {config.card_name}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
            <span className="px-2.5 py-1 rounded-full bg-zinc-200/50 dark:bg-zinc-800 font-mono text-xs">{config.card_id}</span>
            <span>Base Earn Rate: <strong className="text-zinc-900 dark:text-zinc-300">{config.base_rate_percent}%</strong></span>
          </div>
        </div>
        
        <details className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors">
            <span>View Engine Configuration Payload</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 overflow-auto max-h-[500px]">
            <JsonView 
              value={config} 
              displayDataTypes={false}
              collapsed={false} 
              style={{ background: 'transparent', fontSize: '14px', fontFamily: 'monospace' }} 
            />
          </div>
        </details>
      </section>
      
      {/* SECTION 1: THE INPUTS */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">1. User Spend Inputs & Normalization</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Spend Intent</th>
                <th className="px-4 py-3 font-semibold text-right">Raw Submitted (₹)</th>
                <th className="px-4 py-3 font-semibold text-right">Normalized Monthly (₹)</th>
                <th className="px-4 py-3 font-semibold text-right">Normalized Annual (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
              {intents.map(([key, data]: any) => (
                <tr key={key} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-medium">{key}</td>
                  <td className="px-4 py-3 text-right">{data.input.monthly_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400">{data.input.monthly_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-zinc-500">{data.input.yearly_amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: INTENT EXECUTION (THE MONSTER TABLE) */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">2. Intent Execution Breakdown</h2>
        <p className="text-sm text-zinc-500 mb-4">Tracing the deterministic math of each normalized spend through routing, restrictions, discounts, limits, and pool fallback.</p>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <table className="min-w-max w-full text-sm text-left">
            <thead className="bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300">
              {/* Core Grouping Headers */}
              <tr>
                <th colSpan={2} className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-200/50 dark:bg-zinc-800 font-bold uppercase tracking-wider text-xs border-r">Identity & Routing</th>
                <th colSpan={4} className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-purple-100/50 dark:bg-purple-900/20 font-bold uppercase tracking-wider text-xs border-r text-purple-700 dark:text-purple-400">Limits & Discounts</th>
                <th colSpan={6} className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-green-100/50 dark:bg-green-900/20 font-bold uppercase tracking-wider text-xs border-r text-green-700 dark:text-green-400">Reward Generation Math</th>
                <th colSpan={3} className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-orange-100/50 dark:bg-orange-900/20 font-bold uppercase tracking-wider text-xs text-orange-700 dark:text-orange-400">State Flags</th>
              </tr>
              {/* Actual Column Headers */}
              <tr>
                <th className="px-4 py-3 font-semibold">Spend Intent</th>
                <th className="px-4 py-3 font-semibold border-r border-zinc-200 dark:border-zinc-800">Rail → Category</th>
                
                <th className="px-4 py-3 font-semibold text-right">Effective Spend (₹)</th>
                <th className="px-4 py-3 font-semibold text-right text-purple-600 dark:text-purple-400">Upfront Savings (₹)</th>
                <th className="px-4 py-3 font-semibold text-right">Eligible ( Discounted price capped by spend cap) (₹)</th>
                <th className="px-4 py-3 font-semibold text-right border-r border-zinc-200 dark:border-zinc-800 text-red-500">Unrewarded (Stashed)</th>

                <th className="px-4 py-3 font-semibold text-right">Accel Rate</th>
                <th className="px-4 py-3 font-semibold text-right text-green-600 dark:text-green-400">Accel Pts</th>
                <th className="px-4 py-3 font-semibold text-right border-r border-zinc-200 dark:border-zinc-800">Pool ID/Status</th>
                <th className="px-4 py-3 font-semibold text-right text-zinc-500">Base Fallback (₹)</th>
                <th className="px-4 py-3 font-semibold text-right text-green-600 dark:text-green-400">Base Pts</th>
                <th className="px-4 py-3 font-semibold text-right text-zinc-900 dark:text-zinc-100 font-bold border-r border-zinc-200 dark:border-zinc-800">Total Pts</th>

                <th className="px-4 py-3 font-semibold text-center">Restricted?</th>
                <th className="px-4 py-3 font-semibold text-center">Mst Excl?</th>
                <th className="px-4 py-3 font-semibold text-center">Waiver Excl?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
              {intents.map(([key, data]: any) => {

                const effective = data.input.monthly_amount - data.rewards.additional_discount.amount_monthly;
                const strings = data.explainability_strings || [];
                // console.log(strings , "ze strings")
                
                return (
                  <React.Fragment key={key}>
                    <tr className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 whitespace-nowrap transition-colors`}>
                      {/* Identity & Trigger */}
                      <td className="px-4 py-3 font-medium bg-zinc-50/50 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-3">

                          <span className="text-zinc-900 dark:text-zinc-100">{key}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs border-r border-zinc-200 dark:border-zinc-800">
                        <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800">{data.routing.rail_id}</span>
                        <span className="mx-1 text-zinc-400">→</span>
                        <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800">{data.routing.category_id}</span>
                      </td>

                      {/* Limits */}
                      <td className="px-4 py-3 text-right">{effective.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-purple-600 dark:text-purple-400">
                        {data.rewards.additional_discount.amount_monthly > 0 ? `+${data.rewards.additional_discount.amount_monthly.toLocaleString()}` : "-"}
                        {data.rewards.additional_discount.additional_discount_roi > 0 && <span className="ml-1 text-xs text-purple-400">({data.rewards.additional_discount.additional_discount_roi}%)</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{data.limits.spend_applied_monthly.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right border-r border-zinc-200 dark:border-zinc-800 text-red-500">
                        {data.limits.unrewarded_monthly > 0 ? data.limits.unrewarded_monthly.toLocaleString() : "-"}
                      </td>

                      {/* Rewards */}
                      <td className="px-4 py-3 text-right text-zinc-500">{data.rewards.accelerated?.rate_percent || 0}%</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">{data.rewards.accelerated?.points_earned || 0}</td>
                      <td className="px-4 py-3 text-right text-xs border-r border-zinc-200 dark:border-zinc-800">
                        {data.rewards.accelerated?.reward_pool?.pool_id ? (
                          <div className="flex flex-col items-end">
                            <span>{data.rewards.accelerated.reward_pool.pool_id}</span>
                            {data.flags.pool_exhausted && <span className="text-[10px] text-red-500 uppercase font-bold mt-0.5">Exhausted</span>}
                          </div>
                        ) : <span className="text-zinc-400">-</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-500">{data.rewards.base?.spend_applied.toLocaleString() || 0}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">{data.rewards.base?.points_earned || 0}</td>
                      <td className="px-4 py-3 text-right font-bold text-zinc-900 border-r border-zinc-200 dark:border-zinc-800 dark:text-zinc-100">{data.rewards.total_points_monthly.toLocaleString()}</td>

                      {/* Flags */}
                      <td className="px-4 py-3 text-center">{data.flags.restricted ? "⚠️" : "-"}</td>
                      <td className="px-4 py-3 text-center">{data.flags.milestone_excluded ? "❌" : "-"}</td>
                      <td className="px-4 py-3 text-center">{data.flags.fee_waiver_excluded ? "❌" : "-"}</td>
                    </tr>
                    
                    {strings.length > 0 && (
                      <tr className="bg-zinc-50/30 dark:bg-zinc-800/20 border-b border-zinc-200 dark:border-zinc-800">
                        <td colSpan={15} className="px-4 py-2 text-xs">
                          <div className="flex flex-col gap-1.5 pl-4 border-l-2 border-blue-400 dark:border-blue-500 my-1">
                            {strings.map((str: any, i: number) => (
                              <div key={i} className="flex gap-2 items-start whitespace-normal">
                                <span className="font-mono text-[9px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded uppercase font-bold tracking-wider shrink-0 mt-0.5">
                                  {str.type}
                                </span>
                                <span className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                  {str.message}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: CARD AGGREGATIONS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">3a. Milestones & Waivers</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Benefit Type</th>
                  <th className="px-4 py-3 font-semibold text-right">Eligible Spend Trajectory (₹)</th>
                  <th className="px-4 py-3 font-semibold text-right">Status / Bonus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-medium">Annual Milestones</td>
                  <td className="px-4 py-3 text-right">{ledger.milestones.eligible_spend_yearly.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-bold">
                    {ledger.milestones.total_bonus_points > 0 ? `+${ledger.milestones.total_bonus_points.toLocaleString()} Pts` : "Not Achieved"}
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-medium">Fee Waiver (Req: {ledger.fee_waiver.threshold.toLocaleString()})</td>
                  <td className="px-4 py-3 text-right">{ledger.fee_waiver.eligible_spend_yearly.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold">
                    {ledger.fee_waiver.waived ? <span className="text-green-600 dark:text-green-400">Waived</span> : <span className="text-red-500">Not Waived</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">3b. Final Output Bottom Line</h2>
          <div className="overflow-hidden rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Aggregated Ledger Source</th>
                  <th className="px-4 py-3 font-semibold text-right">Value Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 dark:divide-blue-900/30 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
                <tr>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-xs">SUM(Accelerated Extracted Limits) × 12</td>
                  <td className="px-4 py-3 text-right font-medium">{ledger.summary.accelerated_points_yearly.toLocaleString()} points</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-xs">SUM(Base Fallback / Non-Accel) × 12</td>
                  <td className="px-4 py-3 text-right font-medium">{ledger.summary.base_points_yearly.toLocaleString()} points</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-xs">SUM(Milestones Triggered)</td>
                  <td className="px-4 py-3 text-right font-medium">{ledger.summary.milestone_bonus_points.toLocaleString()} points</td>
                </tr>
                <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                  <td className="px-4 py-3 font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide text-xs">Total Unified Credit Points (Annual)</td>
                  <td className="px-4 py-4 text-right font-black text-blue-600 dark:text-blue-400 text-lg">
                    {ledger.summary.total_points_yearly.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-900/20">
                  <td className="px-4 py-3 font-bold text-green-900 dark:text-green-300 uppercase tracking-wide text-xs">Est. Realized Rupee Value (Profile x3)</td>
                  <td className="px-4 py-4 text-right font-black text-green-600 dark:text-green-400 text-lg">
                    ₹{ledger.summary.valuation_in_rupees.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
