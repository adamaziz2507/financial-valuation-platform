import { SensitivityResponse } from "@/types/valuation";

interface SensitivityTableProps {
  sensitivity: SensitivityResponse;
}

export default function SensitivityTable({ sensitivity }: SensitivityTableProps) {
  const waccValues = Array.from(new Set(sensitivity.grid.map((cell) => cell.wacc))).sort(
    (a, b) => a - b
  );
  const growthValues = Array.from(
    new Set(sensitivity.grid.map((cell) => cell.terminal_growth_rate))
  ).sort((a, b) => a - b);

  function priceFor(wacc: number, growth: number): number | undefined {
    return sensitivity.grid.find(
      (cell) => cell.wacc === wacc && cell.terminal_growth_rate === growth
    )?.implied_share_price;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Implied Share Price — WACC vs. Terminal Growth Rate
      </h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left text-gray-500">WACC \ Terminal Growth</th>
            {growthValues.map((growth) => (
              <th key={growth} className="p-2 text-center text-gray-500">
                {(growth * 100).toFixed(1)}%
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {waccValues.map((wacc) => (
            <tr key={wacc} className="border-t border-gray-100">
              <td className="p-2 font-semibold text-gray-700">{(wacc * 100).toFixed(1)}%</td>
              {growthValues.map((growth) => {
                const price = priceFor(wacc, growth);
                return (
                  <td key={growth} className="p-2 text-center text-gray-900 font-semibold">
                    {price !== undefined ? `$${price.toFixed(2)}` : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}