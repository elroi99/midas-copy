"use client";

import React, { useState } from "react";
import { SPEND_SUMS, SPEND_INPUTS } from "../../rewards-engine";
import { clsx } from "clsx";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  categories: string[];
  spends: Record<string, number>;
  onChange: (intent: string, value: number) => void;
  onContinue: () => void;
}

export default function SpendInputStep({ categories, spends, onChange, onContinue }: Props) {
  const [currentCatIndex, setCurrentCatIndex] = useState(0);
  const activeCat = categories[currentCatIndex];
  const activeIntents = SPEND_SUMS[activeCat as keyof typeof SPEND_SUMS]?.sum_of || [];

  const handleNext = () => {
    if (currentCatIndex < categories.length - 1) {
      setCurrentCatIndex(prev => prev + 1);
    } else {
      onContinue();
    }
  };

  const handleBack = () => {
    if (currentCatIndex > 0) {
      setCurrentCatIndex(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-black capitalize text-zinc-900">
            {activeCat.replace("_", " ")}
          </h2>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
            Step {currentCatIndex + 1} of {categories.length}
          </span>
        </div>
        <p className="text-zinc-500 text-sm font-medium">Enter your approximate monthly spend for these items.</p>
      </div>

      <div className="space-y-8">
        {activeIntents.map((intentKey) => {
          const inputConfig = SPEND_INPUTS[intentKey];
          const value = spends[intentKey] || 0;

          return (
            <div key={intentKey} className="space-y-3">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                {inputConfig?.display_name || intentKey}
              </label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-zinc-300 group-focus-within:text-blue-500 transition-colors">
                  ₹
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={value || ""}
                  onChange={(e) => onChange(intentKey, Number(e.target.value))}
                  placeholder="0"
                  className={clsx(
                    "w-full bg-zinc-50 border border-zinc-100 rounded-[32px] py-6 pl-14 pr-8 text-2xl font-black text-zinc-900",
                    "group-focus-within:bg-white group-focus-within:border-blue-200 group-focus-within:shadow-xl group-focus-within:shadow-blue-50 transition-all duration-300",
                    "placeholder:text-zinc-200"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-8 left-6 right-6 max-w-lg mx-auto flex gap-4">
        {currentCatIndex > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 py-5 rounded-[24px] font-bold text-lg bg-zinc-50 text-zinc-500 border border-zinc-100 active:scale-95 transition-all"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-[2] py-5 rounded-[24px] font-bold text-lg bg-zinc-900 text-white shadow-2xl shadow-zinc-200 active:scale-95 transition-all"
        >
          {currentCatIndex === categories.length - 1 ? "Calculate Results" : "Next Category"}
        </button>
      </div>
    </div>
  );
}
