"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { ChevronDown, Info, ShieldCheck, Zap, AlertCircle, HelpCircle, TrendingUp } from "lucide-react";
import RewardsTable from "../RewardsTable";

interface Props {
  card: any;
  result: any;
}

export default function CardDetailView({ card, result }: Props) {
  const [showTechnical, setShowTechnical] = useState(false);
  const [expandedIntent, setExpandedIntent] = useState<string | null>(null);

  const intents = Object.entries(result.user_spend_breakdown);
  const globalStrings = result.explainability_strings || [];
  const currencyName = card.reward_program?.reward_currency.display_name || "Points";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Summary Header */}
      <section className="space-y-6">
        <div className="p-10 rounded-[48px] bg-zinc-900 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full -mr-24 -mt-24" />
          
          <div className="relative space-y-6">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Net Annual Savings</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter text-blue-400">
                ₹{result.summary.valuation_in_rupees.toLocaleString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
               <div className="space-y-2">
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Total {currencyName}</p>
                  <p className="text-xl font-bold">{result.summary.total_points_yearly.toLocaleString()}</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Fee Waiver</p>
                  <p className={clsx(
                    "text-xl font-bold font-mono uppercase tracking-widest",
                    result.fee_waiver.waived ? "text-green-400" : "text-zinc-500"
                  )}>
                    {result.fee_waiver.waived ? "Achieved" : "Missed"}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Logic (Milestones, Waivers) - Hidden if empty */}
      {globalStrings.length > 0 && (
        <section className="space-y-4 px-2">
           <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Summary Insights</h3>
           <div className="space-y-3">
              {globalStrings.map((str: any, i: number) => (
                <div key={i} className="flex gap-4 p-5 bg-blue-50 border border-blue-100 rounded-[24px] items-start">
                   <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                      <ShieldCheck className="w-4 h-4" />
                   </div>
                   <p className="text-sm font-bold text-blue-900/80 leading-relaxed">{str.message}</p>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* 2. Itemized Breakdown */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-zinc-900">Breakdown</h2>
          <button 
            onClick={() => setShowTechnical(!showTechnical)}
            className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            {showTechnical ? "Hide Engine Ledger" : "View Engine Ledger"}
          </button>
        </div>

        {showTechnical && (
          <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 overflow-x-auto text-[10px] font-mono shadow-inner">
             <RewardsTable ledger={result} config={card} />
          </div>
        )}

        <div className="space-y-4">
          {intents.map(([key, data]: [string, any]) => {
            const isExpanded = expandedIntent === key;
            const points = data.rewards.total_points_monthly;
            const discount = data.rewards.additional_discount.amount_monthly;
            
            const acc = data.rewards.accelerated;
            const base = data.rewards.base;

            return (
              <div 
                key={key}
                className={clsx(
                  "rounded-[40px] border transition-all duration-500 overflow-hidden",
                  isExpanded ? "bg-white border-zinc-200 shadow-2xl shadow-zinc-100" : "bg-white border-zinc-100"
                )}
              >
                <button 
                  onClick={() => setExpandedIntent(isExpanded ? null : key)}
                  className="w-full flex items-center justify-between p-8 text-left group"
                >
                  <div className="space-y-2">
                    <p className="text-lg font-black text-zinc-900 capitalize leading-tight">{key.replace("_", " ")}</p>
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 rounded text-[9px] font-black bg-zinc-100 text-zinc-400 uppercase tracking-wider">
                          {data.routing.rail_label}
                       </span>
                       <span className="text-zinc-300">→</span>
                       <span className="text-[10px] font-bold text-zinc-400">{data.routing.category_label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xl font-black text-zinc-900 tracking-tight">
                        {points > 0 ? `+${points.toLocaleString()} pts` : `₹${discount.toLocaleString()}`}
                      </p>
                      {points > 0 && discount > 0 && (
                        <p className="text-[10px] text-green-600 font-black">+₹{discount.toLocaleString()}</p>
                      )}
                    </div>
                    <div className={clsx(
                       "p-2 rounded-full transition-all duration-500",
                       isExpanded ? "bg-zinc-900 text-white" : "bg-zinc-50 text-zinc-300"
                    )}>
                       <ChevronDown className={clsx(
                         "w-5 h-5 transition-transform duration-500",
                         isExpanded && "rotate-180"
                       )} />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-8 pb-8 space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="h-px bg-zinc-100 w-full" />
                    
                    {/* Itemized Points Table - Hidden if required data is missing */}
                    {(acc || base) && (
                      <div className="bg-zinc-50 rounded-[28px] p-6 border border-zinc-100">
                        <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Calculation Table</h4>
                        <table className="w-full text-xs">
                            <thead>
                              <tr className="text-zinc-400 font-bold border-b border-zinc-200">
                                  <th className="pb-3 text-left">Type</th>
                                  <th className="pb-3 text-right">Spend</th>
                                  <th className="pb-3 text-right">Rate</th>
                                  <th className="pb-3 text-right">Earned</th>
                              </tr>
                            </thead>
                            <tbody className="font-bold text-zinc-800">
                              {acc && (
                                  <tr className="border-b border-zinc-100/50">
                                    <td className="py-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        Accelerated
                                    </td>
                                    <td className="py-4 text-right">₹{(acc.spend_applied_monthly || 0).toLocaleString()}</td>
                                    <td className="py-4 text-right text-blue-600">{(acc.rate_percent || 0).toLocaleString()}%</td>
                                    <td className="py-4 text-right">{(acc.points_earned || 0).toLocaleString()}</td>
                                  </tr>
                              )}
                              {base && (
                                  <tr className="border-b border-zinc-100/50">
                                    <td className="py-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                        Base
                                    </td>
                                    <td className="py-4 text-right">₹{(base.spend_applied || base.spend_applied_monthly || 0).toLocaleString()}</td>
                                    <td className="py-4 text-right text-zinc-400">{(base.rate_percent || 0).toLocaleString()}%</td>
                                    <td className="py-4 text-right">{(base.points_earned || 0).toLocaleString()}</td>
                                  </tr>
                              )}
                              <tr className="text-zinc-900">
                                  <td className="pt-4 text-left font-black uppercase tracking-widest text-[10px]">Total</td>
                                  <td className="pt-4"></td>
                                  <td className="pt-4"></td>
                                  <td className="pt-4 text-right font-black text-sm">{points.toLocaleString()} {currencyName}</td>
                              </tr>
                            </tbody>
                        </table>
                      </div>
                    )}

                    {/* Step-by-Step Reasoning - Hidden if empty */}
                    {data.explainability_strings && data.explainability_strings.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-1">Step-by-Step Reasoning</h4>
                        <div className="space-y-3">
                            {data.explainability_strings.map((str: any, i: number) => (
                              <div key={i} className="flex gap-4 items-start">
                                <div className={clsx(
                                  "p-2 rounded-xl shrink-0 mt-0.5 shadow-sm",
                                  str.type === "ROUTING" ? "bg-blue-600 text-white" :
                                  str.type === "ACCELERATED_REWARD" ? "bg-green-600 text-white" :
                                  str.type === "DISCOUNT" ? "bg-purple-600 text-white" :
                                  "bg-zinc-900 text-white"
                                )}>
                                  {str.type === "ROUTING" && <Zap className="w-3.5 h-3.5" />}
                                  {str.type === "ACCELERATED_REWARD" && <ShieldCheck className="w-3.5 h-3.5" />}
                                  {str.type === "DISCOUNT" && <TrendingUp className="w-3.5 h-3.5" />}
                                  {str.type === "RESTRICTION" && <AlertCircle className="w-3.5 h-3.5" />}
                                  {!["ROUTING", "ACCELERATED_REWARD", "DISCOUNT", "RESTRICTION"].includes(str.type) && <HelpCircle className="w-3.5 h-3.5" />}
                                </div>
                                <div className="space-y-1 py-1">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300">{str.type}</p>
                                  <p className="text-sm text-zinc-600 leading-relaxed font-bold">
                                    {str.message}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Milestone Progress */}
      <section className="space-y-6 px-2">
        <h2 className="text-2xl font-black text-zinc-900">Milestones</h2>
        <div className="p-8 rounded-[48px] bg-zinc-50 border border-zinc-100 space-y-8 shadow-inner">
           <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Yearly Spend Target</p>
                <div className="text-right">
                   <p className="text-lg font-black text-zinc-900">₹{(result.milestones?.eligible_spend_yearly || 0).toLocaleString()}</p>
                   <p className="text-[10px] text-zinc-300 font-bold">Target: ₹{card.milestones?.[card.milestones.length - 1]?.threshold.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
              <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden p-1">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-sm shadow-blue-200"
                  style={{ width: `${Math.min(100, ((result.milestones?.eligible_spend_yearly || 0) / (card.milestones?.[card.milestones.length - 1]?.threshold || 1)) * 100)}%` }}
                />
              </div>
           </div>
           
           {result.milestones?.milestones_triggered?.length > 0 && (
             <div className="pt-6 border-t border-zinc-200 flex gap-3 overflow-x-auto pb-2 noscroll">
                {result.milestones.milestones_triggered.map((m: any, i: number) => (
                  <div key={i} className="px-5 py-4 rounded-[28px] bg-white border border-zinc-100 shadow-sm whitespace-nowrap">
                     <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Milestone Unlocked</p>
                     <p className="text-lg font-black text-zinc-900">+{m.bonus_points.toLocaleString()} pts</p>
                  </div>
                ))}
             </div>
           )}
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
}
