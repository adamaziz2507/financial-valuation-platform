"use client";

import { useState } from "react";
import ValuationForm from "@/components/ValuationForm";
import ValuationResults from "@/components/ValuationResults";
import { fetchValuation } from "@/lib/api";
import { ValuationRequest, ValuationResponse } from "@/types/valuation";

export default function Home() {
  const [result, setResult] = useState<ValuationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(request: ValuationRequest) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetchValuation(request);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Valuation Platform
          </h1>
          <p className="text-gray-600 mt-1">
            Enter a ticker and your assumptions to run a 5-year DCF valuation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ValuationForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="md:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}
            {result && <ValuationResults result={result} />}
            {!result && !error && (
              <div className="text-gray-400 text-center py-12">
                Results will appear here after you run a valuation.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
