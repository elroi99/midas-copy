// @ts-nocheck
"use client"

import { useEffect, useState } from "react"
import { calculateCardRewards, HYPOTHETICAL_INFINIA_CONFIG, SPEND_INPUTS } from "../rewards-engine"

import RewardsTable from "../components/RewardsTable";

function HomePage() {
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        // Hardcoded generic spend to demonstrate the ledger
        const rawSpends = {
          amazon: 3000, 
          flipkart: 2000,
          mobile_phone_bills: 4000,
          electricity_bills: 6000,
          insurance_health_annual: 120000, // 10k monthly
          rent: 40000,
          flights_annual: 300000, // 25K monthly
          hotels_annual: 240000, // 20k monthly
          fuel : 20000,
        };
        
        const finalLedger = calculateCardRewards({ 
            cardConfig: HYPOTHETICAL_INFINIA_CONFIG,
            rawSpends: rawSpends,
            spendInputsConfig: SPEND_INPUTS
        });

        console.log("=== REWARDS ENGINE LEDGER ===", finalLedger);
        setResult(finalLedger);
    }, [])
    
    // hinding it temporarily
    return null;

    return (
        <div className="flex w-full flex-col gap-4">
            {result ? (
                <RewardsTable ledger={result} config={HDFC_SWIGGY_CONFIG} />
            ) : (
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-left">
                    <p className="text-sm text-zinc-500">Calculating Engine Ledger...</p>
                </div>
            )}
        </div>
    )
}

export default HomePage
