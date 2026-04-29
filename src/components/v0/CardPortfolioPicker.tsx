"use client";

import { useEffect, useRef, useState } from "react";
import type { CardConfigV0 } from "@/src/rewards-engine-v0";
import { ALL_GENERATED_CARDS } from "@/src/rewards-engine-v0/generated_configs";

export const MAX_PORTFOLIO_CARDS = 3;

interface CardPortfolioPickerProps {
  selected: CardConfigV0[];
  onChange: (cards: CardConfigV0[]) => void;
}

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

export default function CardPortfolioPicker({ selected, onChange }: CardPortfolioPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedIds = new Set(selected.map((c) => c.card_id));
  const atCap = selected.length >= MAX_PORTFOLIO_CARDS;

  const matches = ALL_GENERATED_CARDS.filter(
    (c) => !selectedIds.has(c.card_id) && fuzzyMatch(query, c.display_name)
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(card: CardConfigV0) {
    if (atCap) return;
    onChange([...selected, card]);
    setQuery("");
    setOpen(false);
  }

  function handleRemove(cardId: string) {
    onChange(selected.filter((c) => c.card_id !== cardId));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs text-zinc-400 uppercase tracking-wide">Your cards</label>
        <span className="text-xs text-zinc-600">
          {selected.length} / {MAX_PORTFOLIO_CARDS}
        </span>
      </div>

      {/* Search input + dropdown */}
      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={atCap ? "Maximum cards selected" : "Search for a card…"}
          disabled={atCap}
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed"
        />

        {open && query && matches.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden shadow-xl">
            {matches.map((card) => {
              const disabled = atCap;
              return (
                <li
                  key={card.card_id}
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent input blur before click registers
                    if (!disabled) handleSelect(card);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    disabled
                      ? "text-zinc-600 cursor-not-allowed"
                      : "text-zinc-200 hover:bg-zinc-700"
                  }`}
                >
                  {card.display_name}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((card) => (
            <span
              key={card.card_id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950 border border-blue-800 text-blue-200 rounded-full text-xs font-medium"
            >
              {card.display_name}
              <button
                onClick={() => handleRemove(card.card_id)}
                className="text-blue-400 hover:text-white transition-colors leading-none"
                aria-label={`Remove ${card.display_name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
