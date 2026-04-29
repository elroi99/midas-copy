"use client";

import React, { useState, useMemo } from "react";
import { ALL_CARDS, SPEND_SUMS, SPEND_INPUTS, calculateCardRewards } from "../rewards-engine";
import CategorySelector from "./Cred/CategorySelector";
import SpendInputStep from "./Cred/SpendInputStep";
import ComparisonDashboard from "./Cred/ComparisonDashboard";
import CardDetailView from "./Cred/CardDetailView";
import { ChevronLeft } from "lucide-react";

type Step = "categories" | "spends" | "comparison" | "detail";

export default function ExperienceWizard() {
  const [step, setStep] = useState<Step>("categories");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [spends, setSpends] = useState<Record<string, number>>({});
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSpendChange = (intent: string, value: number) => {
    setSpends(prev => ({ ...prev, [intent]: value }));
  };

  const results = useMemo(() => {
    if (step !== "comparison" && step !== "detail") return [];
    return ALL_CARDS.map(card => {
      try {
        return {
          card,
          result: calculateCardRewards({
            cardConfig: card,
            rawSpends: spends,
            spendInputsConfig: SPEND_INPUTS
          })
        };
      } catch (e) {
        console.error(`Error calculating rewards for ${card.card_name}`, e);
        return null;
      }
    }).filter(Boolean);
  }, [spends, step]);

  const activeResult = useMemo(() => {
    return results.find(r => r?.card.card_id === activeCardId);
  }, [results, activeCardId]);

  const goBack = () => {
    if (step === "spends") setStep("categories");
    if (step === "comparison") setStep("spends");
    if (step === "detail") setStep("comparison");
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {step !== "categories" && (
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-zinc-100 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-zinc-400" />
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            {step === "categories" && "Select Categories"}
            {step === "spends" && "Monthly Spend"}
            {step === "comparison" && "Card Genius"}
            {step === "detail" && activeResult?.card.card_name}
          </h1>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
           Midas
        </div>
      </header>

      <main className="px-6 py-8 pb-32 max-w-lg mx-auto">
        {step === "categories" && (
          <CategorySelector 
            selected={selectedCategories} 
            onToggle={handleCategoryToggle} 
            onContinue={() => setStep("spends")}
          />
        )}

        {step === "spends" && (
          <SpendInputStep 
            categories={selectedCategories} 
            spends={spends}
            onChange={handleSpendChange}
            onContinue={() => setStep("comparison")}
          />
        )}

        {step === "comparison" && (
          <ComparisonDashboard 
            results={results} 
            categories={selectedCategories}
            onSelectCard={(id: string) => {
              setActiveCardId(id);
              setStep("detail");
            }}
          />
        )}

        {step === "detail" && activeResult && (
          <CardDetailView 
            card={activeResult.card} 
            result={activeResult.result} 
          />
        )}
      </main>
    </div>
  );
}
