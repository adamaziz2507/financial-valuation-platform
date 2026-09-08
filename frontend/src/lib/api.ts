import { ValuationRequest, ValuationResponse } from "@/types/valuation";

   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchValuation(
  request: ValuationRequest
): Promise<ValuationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/valuation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.detail ?? "Valuation request failed");
  }

  return response.json();
}