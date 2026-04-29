"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { ChevronRight, Info } from "lucide-react";
import { SPEND_SUMS } from "@/src/rewards-engine";

interface Props {
  results: any[];
  onSelectCard: (id: string) => void;
  categories: string[];
}

export default function ComparisonDashboard({ results, onSelectCard, categories }: Props) {
  const [tab, setTab] = useState<"quick" | "detailed">("quick");

  // Sort by net savings (valuation - annual fee if available)
  const processedResults = results.map(item => {
    const annualFee = (item.card as any).fees?.annual_fee || 0;
    const isWaived = item.result.fee_waiver.waived;
    const finalFee = isWaived ? 0 : annualFee;
    const netSavings = item.result.summary.valuation_in_rupees - finalFee;
    
    return {
      ...item,
      finalFee,
      netSavings
    };
  }).sort((a, b) => b.netSavings - a.netSavings);

  const hasFees = results.some(r => (r.card as any).fees);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-zinc-500 text-sm font-medium">Here are the best cards for you</h2>
        <h1 className="text-2xl font-bold text-zinc-900">Sorted by Annual Savings</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-100">
        <button 
          onClick={() => setTab("quick")}
          className={clsx(
            "flex-1 py-3 text-sm font-bold transition-all border-b-2",
            tab === "quick" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-400"
          )}
        >
          Quick Insights
        </button>
        <button 
          onClick={() => setTab("detailed")}
          className={clsx(
            "flex-1 py-3 text-sm font-bold transition-all border-b-2",
            tab === "detailed" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-400"
          )}
        >
          Detailed Breakdown
        </button>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-zinc-50 text-[10px] uppercase tracking-wider text-zinc-500 font-bold border-y border-zinc-100">
              <th className="py-3 px-4 sticky left-0 bg-zinc-50 z-10">Credit Cards</th>
              {tab === "quick" ? (
                <>
                  <th className="py-3 px-4 text-center">Total Savings</th>
                  {hasFees && (
                    <>
                      <th className="py-3 px-2 text-center">-</th>
                      <th className="py-3 px-4 text-center">Fees</th>
                      <th className="py-3 px-2 text-center">=</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-center">{hasFees ? "Net Savings" : "Savings"}</th>
                </>
              ) : (
                categories.map(cat => (
                  <th key={cat} className="py-3 px-4 text-center capitalize">{cat.replace("_", " ")}</th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {processedResults.map((item, idx) => {
              const { card, result, finalFee, netSavings } = item;
              return (
                <tr 
                  key={card.card_id} 
                  onClick={() => onSelectCard(card.card_id)}
                  className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                >
                  <td className="py-5 px-4 sticky left-0 bg-white z-10 group-hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="relative">
                          <div className="w-12 h-8 bg-zinc-200 rounded-md overflow-hidden border border-zinc-100 shadow-sm relative">
                             {/* Placeholder for card image */}
                             <div className="absolute inset-0 bg-gradient-to-br from-zinc-300 to-zinc-400 opacity-50" />
                          </div>
                          <span className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 text-white rounded-full flex items-center justify-center text-[10px] font-black italic shadow-sm">
                             #{idx + 1}
                          </span>
                       </div>
                       <span className="text-xs font-bold text-zinc-700 whitespace-nowrap">{card.card_name}</span>
                    </div>
                  </td>

                  {tab === "quick" ? (
                    <>
                      <td className="py-5 px-4 text-center text-green-600 font-bold text-sm">
                         ₹{result.summary.valuation_in_rupees.toLocaleString()}
                      </td>
                      {hasFees && (
                        <>
                          <td className="py-5 px-2 text-center text-zinc-300">-</td>
                          <td className="py-5 px-4 text-center text-zinc-900 font-bold text-sm">
                             ₹{finalFee.toLocaleString()}
                          </td>
                          <td className="py-5 px-2 text-center text-zinc-300">=</td>
                        </>
                      )}
                      <td className="py-5 px-4 text-center text-green-600 font-black text-sm">
                         ₹{netSavings.toLocaleString()}
                      </td>
                    </>
                  ) : (
                    categories.map(cat => {
                      const intentsInSum = (SPEND_SUMS as any)[cat]?.sum_of || [];
                      let catSavings = 0;
                      
                      intentsInSum.forEach((intentKey: string) => {
                        const data = result.user_spend_breakdown[intentKey];
                        if (data) {
                          const valProfile = item.card.reward_program?.valuation_profiles.find(
                            (p: any) => p.id === item.card.reward_program.default_valuation_profile_id
                          ) || item.card.reward_program?.valuation_profiles[0];
                          const valuation = valProfile?.rupee_value_per_unit || 1;
                          
                          catSavings += data.rewards.additional_discount.amount_monthly + (data.rewards.total_points_monthly * valuation);
                        }
                      });
                      
                      return (
                        <td key={cat} className="py-5 px-4 text-center text-zinc-700 font-medium text-sm">
                           ₹{Math.round(catSavings * 12).toLocaleString()}
                        </td>
                      );
                    })
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-8 left-6 right-6 max-w-lg mx-auto">
        <button
          className="w-full py-4 rounded-2xl font-bold bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-lg">Edit Spends</span>
          <span className="bg-blue-500/50 px-2 py-0.5 rounded-lg text-[10px]">₹45.0K Monthly</span>
        </button>
      </div>
    </div>
  );
}
