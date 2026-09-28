"use client";

import ValuationForm from "@/components/ValuationForm";
import ValuationResults from "@/components/ValuationResults";
import SensitivityTable from "@/components/SensitivityTable";
import { fetchValuation, fetchSensitivity } from "@/lib/api";
import { ValuationRequest, ValuationResponse, SensitivityResponse } from "@/types/valuation";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [result, setResult] = useState<ValuationResponse | null>(null);
  const [sensitivity, setSensitivity] = useState<SensitivityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false);
  const slowLoadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

async function handleSubmit(request: ValuationRequest) {
  setIsLoading(true);
  setError(null);
  setResult(null);
  setSensitivity(null);
  setShowSlowLoadMessage(false);

  slowLoadTimerRef.current = setTimeout(() => {
    setShowSlowLoadMessage(true);
  }, 4000);

  try {
    const response = await fetchValuation(request);
    setResult(response);

    try {
      const sensitivityResponse = await fetchSensitivity(request);
      setSensitivity(sensitivityResponse);
    } catch {
      // Sensitivity analysis is a bonus feature — don't block the main result if it fails
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong");
  } finally {
    setIsLoading(false);
    setShowSlowLoadMessage(false);
    if (slowLoadTimerRef.current) {
      clearTimeout(slowLoadTimerRef.current);
    }
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

            {isLoading && showSlowLoadMessage && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
               Still working — the server may be waking up from idle, which can take up to a minute on the first request.
          </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}
               {result && <ValuationResults result={result} />}
               {sensitivity && <SensitivityTable sensitivity={sensitivity} />}
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
