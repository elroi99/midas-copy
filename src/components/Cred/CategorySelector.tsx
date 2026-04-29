"use client";

import React from "react";
import { SPEND_SUMS } from "../../rewards-engine";
import { 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Home, 
  GraduationCap, 
  Store, 
  UtensilsCrossed, 
  Fuel, 
  Plane, 
  Hotel,
  Wine
} from "lucide-react";
import { clsx } from "clsx";

const CATEGORY_MAP: Record<string, { icon: any, label: string }> = {
  shopping: { icon: ShoppingBag, label: "Shopping" },
  utilities: { icon: Zap, label: "Utilities" },
  insurance: { icon: ShieldCheck, label: "Insurance" },
  rent: { icon: Home, label: "Rent" },
  education: { icon: GraduationCap, label: "Education" },
  groceries: { icon: Store, label: "Groceries" },
  food_delivery: { icon: UtensilsCrossed, label: "Food Delivery" },
  fuel: { icon: Fuel, label: "Fuel" },
  dining: { icon: Wine, label: "Dining" },
  travel_flights: { icon: Plane, label: "Flights" },
  travel_hotels: { icon: Hotel, label: "Hotels" },
};

interface Props {
  selected: string[];
  onToggle: (cat: string) => void;
  onContinue: () => void;
}

export default function CategorySelector({ selected, onToggle, onContinue }: Props) {
  const categories = Object.keys(SPEND_SUMS);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">What do you spend on?</h2>
        <p className="text-zinc-500 text-sm">Select categories to calculate your optimized rewards.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => {
          const config = CATEGORY_MAP[cat] || { icon: ShoppingBag, label: cat };
          const Icon = config.icon;
          const isSelected = selected.includes(cat);

          return (
            <button
              key={cat}
              onClick={() => onToggle(cat)}
              className={clsx(
                "relative flex flex-col items-center justify-center p-6 rounded-[32px] transition-all duration-300 group",
                "border-[1.5px]",
                isSelected 
                  ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-100" 
                  : "bg-white border-zinc-100 hover:border-zinc-200"
              )}
            >
              <div className={clsx(
                "p-3 rounded-2xl mb-3 transition-colors duration-300",
                isSelected ? "bg-white/20 text-white" : "bg-zinc-50 text-zinc-400 group-hover:text-zinc-600"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={clsx(
                "text-sm font-bold transition-colors",
                isSelected ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"
              )}>
                {config.label}
              </span>

              {isSelected && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-8 left-6 right-6 max-w-lg mx-auto">
        <button
          onClick={onContinue}
          disabled={selected.length === 0}
          className={clsx(
            "w-full py-5 rounded-3xl font-bold text-lg transition-all duration-300 shadow-2xl",
            selected.length > 0 
              ? "bg-zinc-900 text-white shadow-zinc-200 active:scale-95" 
              : "bg-zinc-100 text-zinc-300 cursor-not-allowed shadow-none"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
