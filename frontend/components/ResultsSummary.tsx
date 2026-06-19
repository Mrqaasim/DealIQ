import { ArrowUpRight, BadgeDollarSign, Scale, Target } from "lucide-react";

import { DealMemo } from "@/components/DealMemo";
import { FinancingBreakdown } from "@/components/FinancingBreakdown";
import { MetricCard } from "@/components/MetricCard";
import { SensitivityTable } from "@/components/SensitivityTable";
import { formatEps, formatMoney, formatPercent, formatShares } from "@/lib/format";
import { DealOutputs, DealRequest } from "@/types/deal";

export function ResultsSummary({ deal, outputs }: { deal: DealRequest; outputs: DealOutputs }) {
  const { calculation, sensitivity, memo } = outputs;
  const tone =
    calculation.verdict === "Accretive"
      ? "positive"
      : calculation.verdict === "Dilutive"
        ? "negative"
        : "neutral";

  return (
    <section id="results" className="scroll-mt-6 space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Base case output</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            {deal.acquirer.ticker} / {deal.target.ticker} transaction analysis
          </h2>
        </div>
        <span className={`w-fit rounded-full px-4 py-2 text-sm font-extrabold uppercase tracking-wider ${tone === "positive" ? "bg-emerald-700 text-white" : tone === "negative" ? "bg-rose-700 text-white" : "bg-amber-300 text-amber-950"}`}>
          {calculation.verdict}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Equity purchase price" value={formatMoney(calculation.equity_purchase_price)} detail={`${formatPercent(deal.assumptions.purchase_premium)} offer premium`} icon={<BadgeDollarSign size={17} />} />
        <MetricCard label="Pro forma EPS" value={formatEps(calculation.pro_forma_eps)} detail={`vs. ${formatEps(calculation.acquirer_standalone_eps)} standalone`} icon={<ArrowUpRight size={17} />} />
        <MetricCard label="Accretion / dilution" value={formatPercent(calculation.accretion_dilution_pct, 2)} detail="Year 1 modeled impact" icon={<Scale size={17} />} tone={tone} />
        <MetricCard label="Break-even synergies" value={calculation.break_even_pre_tax_synergies === null ? "Not reached" : formatMoney(calculation.break_even_pre_tax_synergies)} detail="Annual pre-tax requirement" icon={<Target size={17} />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FinancingBreakdown result={calculation} />
        <section className="rounded-2xl border border-line bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Pro forma bridge</p>
          <h3 className="mb-4 font-semibold text-ink">Transaction mechanics</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {[
              ["Offer price / share", `$${calculation.offer_price.toFixed(2)}`],
              ["New shares issued", formatShares(calculation.new_shares_issued)],
              ["New interest expense", formatMoney(calculation.new_interest_expense)],
              ["After-tax synergies", formatMoney(calculation.after_tax_synergies)],
              ["Pro forma net income", formatMoney(calculation.pro_forma_net_income)],
              ["Pro forma shares", formatShares(calculation.pro_forma_shares)],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-line pb-3">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-1 font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <SensitivityTable sensitivity={sensitivity} />
      <DealMemo memo={memo} />
    </section>
  );
}

