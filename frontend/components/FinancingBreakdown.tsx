"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { formatMoney } from "@/lib/format";
import { DealCalculationResult } from "@/types/deal";

const colors = ["#174f3b", "#4d8d72", "#c8ff43"];

export function FinancingBreakdown({ result }: { result: DealCalculationResult }) {
  const data = [
    { name: "Cash", value: result.cash_used },
    { name: "Debt", value: result.debt_issued },
    { name: "Stock", value: result.stock_issued_value },
  ];
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Sources</p>
        <h3 className="font-semibold text-ink">Financing breakdown</h3>
      </div>
      <div className="grid items-center sm:grid-cols-[180px_1fr]">
        <div className="flex h-44 items-center justify-center">
          <PieChart width={180} height={176}>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
              {data.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}
            </Pie>
            <Tooltip formatter={(value) => formatMoney(Number(value ?? 0))} />
          </PieChart>
        </div>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between border-b border-line pb-2 text-sm last:border-0">
              <span className="flex items-center gap-2 text-slate-600">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: colors[index] }} />
                {item.name}
              </span>
              <strong className="text-ink">{formatMoney(item.value)}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
