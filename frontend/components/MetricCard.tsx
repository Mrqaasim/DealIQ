import { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: "default" | "positive" | "negative" | "neutral";
}

export function MetricCard({ label, value, detail, icon, tone = "default" }: Props) {
  const tones = {
    default: "border-line bg-white",
    positive: "border-emerald-200 bg-emerald-50",
    negative: "border-rose-200 bg-rose-50",
    neutral: "border-amber-200 bg-amber-50",
  };
  return (
    <article className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="mb-3 flex items-center justify-between text-slate-500">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em]">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </article>
  );
}

