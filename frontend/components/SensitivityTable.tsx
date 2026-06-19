import { formatMoney, formatPercent } from "@/lib/format";
import { SensitivityResponse } from "@/types/deal";

const cellTone = (value: number) => {
  if (value > 0.05) return "bg-emerald-700 text-white";
  if (value > 0) return "bg-emerald-100 text-emerald-900";
  if (value > -0.05) return "bg-rose-100 text-rose-900";
  return "bg-rose-700 text-white";
};

export function SensitivityTable({ sensitivity }: { sensitivity: SensitivityResponse }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="border-b border-line px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Scenario analysis</p>
        <h3 className="font-semibold text-ink">EPS accretion / (dilution)</h3>
        <p className="mt-1 text-xs text-slate-500">Rows show annual pre-tax synergies; columns show purchase premium.</p>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[540px] border-separate border-spacing-1.5 text-center text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left text-[10px] uppercase tracking-wider text-slate-400">Synergies</th>
              {sensitivity.purchase_premiums.map((premium) => (
                <th key={premium} className="p-2 text-[10px] uppercase tracking-wider text-slate-500">{formatPercent(premium, 0)} premium</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensitivity.grid.map((row, rowIndex) => (
              <tr key={sensitivity.synergy_values[rowIndex]}>
                <th className="whitespace-nowrap p-2 text-left font-semibold text-ink">{formatMoney(sensitivity.synergy_values[rowIndex], 0)}</th>
                {row.map((cell) => (
                  <td key={`${cell.purchase_premium}-${cell.pre_tax_synergies}`} className={`rounded-lg p-3 font-bold ${cellTone(cell.accretion_dilution_pct)}`}>
                    {formatPercent(cell.accretion_dilution_pct)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

