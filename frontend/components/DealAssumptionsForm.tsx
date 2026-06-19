import { SlidersHorizontal } from "lucide-react";

import { NumberField } from "@/components/Field";
import { DealAssumptions } from "@/types/deal";

interface Props {
  assumptions: DealAssumptions;
  onChange: (assumptions: DealAssumptions) => void;
}

export function DealAssumptionsForm({ assumptions, onChange }: Props) {
  const setPercent = (key: keyof DealAssumptions, value: number) =>
    onChange({ ...assumptions, [key]: value / 100 });
  const financingTotal =
    assumptions.cash_financing_pct +
    assumptions.debt_financing_pct +
    assumptions.stock_financing_pct;
  const isBalanced = Math.abs(financingTotal - 1) < 0.000001;

  return (
    <section className="rounded-2xl border border-line bg-panel p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-pine text-white">
            <SlidersHorizontal size={18} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Transaction
            </p>
            <h2 className="font-semibold text-ink">Deal assumptions</h2>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${isBalanced ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>
          Financing {(financingTotal * 100).toFixed(0)}%
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NumberField label="Purchase premium" suffix="%" min={0} step={1} value={assumptions.purchase_premium * 100} onChange={(v) => setPercent("purchase_premium", v)} />
        <NumberField label="Cash financing" suffix="%" min={0} step={1} value={assumptions.cash_financing_pct * 100} onChange={(v) => setPercent("cash_financing_pct", v)} />
        <NumberField label="Debt financing" suffix="%" min={0} step={1} value={assumptions.debt_financing_pct * 100} onChange={(v) => setPercent("debt_financing_pct", v)} />
        <NumberField label="Stock financing" suffix="%" min={0} step={1} value={assumptions.stock_financing_pct * 100} onChange={(v) => setPercent("stock_financing_pct", v)} />
        <NumberField label="Interest rate" suffix="%" min={0} step={0.25} value={assumptions.interest_rate * 100} onChange={(v) => setPercent("interest_rate", v)} />
        <NumberField label="Tax rate" suffix="%" min={0} step={1} value={assumptions.tax_rate * 100} onChange={(v) => setPercent("tax_rate", v)} />
        <div className="sm:col-span-2">
          <NumberField label="Annual pre-tax synergies" prefix="$" suffix="mm" min={0} step={25} value={assumptions.annual_pre_tax_synergies} onChange={(v) => onChange({ ...assumptions, annual_pre_tax_synergies: v })} />
        </div>
      </div>
    </section>
  );
}

