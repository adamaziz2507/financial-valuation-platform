import { ValuationResponse } from "@/types/valuation";

interface ValuationResultsProps {
  result: ValuationResponse;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ValuationResults({ result }: ValuationResultsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Enterprise Value</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(result.enterprise_value)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Equity Value</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(result.equity_value)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Implied Share Price</p>
          <p className="text-2xl font-bold text-green-600">
            ${result.implied_share_price.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Year
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Revenue
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Unlevered FCF
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Discounted CF
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {result.projections.map((projection) => (
              <tr key={projection.year}>
                <td className="px-4 py-2 text-sm text-gray-900">{projection.year}</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {formatCurrency(projection.revenue)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {formatCurrency(projection.unlevered_free_cash_flow)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {formatCurrency(projection.discounted_cash_flow)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}