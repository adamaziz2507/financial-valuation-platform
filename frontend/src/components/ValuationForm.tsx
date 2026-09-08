"use client";

import { useState } from "react";
import { ValuationRequest } from "@/types/valuation";

interface ValuationFormProps {
  onSubmit: (request: ValuationRequest) => void;
  isLoading: boolean;
}

export default function ValuationForm({ onSubmit, isLoading }: ValuationFormProps) {
  const [ticker, setTicker] = useState("AAPL");
  const [revenueGrowthPct, setRevenueGrowthPct] = useState("8");
  const [operatingMarginPct, setOperatingMarginPct] = useState("30");
  const [waccPct, setWaccPct] = useState("9");
  const [terminalGrowthPct, setTerminalGrowthPct] = useState("2.5");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({
      ticker: ticker.toUpperCase(),
      revenue_growth_rate: Number(revenueGrowthPct) / 100,
      operating_margin: Number(operatingMarginPct) / 100,
      wacc: Number(waccPct) / 100,
      terminal_growth_rate: Number(terminalGrowthPct) / 100,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Ticker</label>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Revenue Growth Rate (%)
        </label>
        <input
          type="number"
          step="0.1"
          value={revenueGrowthPct}
          onChange={(e) => setRevenueGrowthPct(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Operating Margin (%)
        </label>
        <input
          type="number"
          step="0.1"
          value={operatingMarginPct}
          onChange={(e) => setOperatingMarginPct(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">WACC (%)</label>
        <input
          type="number"
          step="0.1"
          value={waccPct}
          onChange={(e) => setWaccPct(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Terminal Growth Rate (%)
        </label>
        <input
          type="number"
          step="0.1"
          value={terminalGrowthPct}
          onChange={(e) => setTerminalGrowthPct(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Calculating..." : "Run Valuation"}
      </button>
    </form>
  );
}