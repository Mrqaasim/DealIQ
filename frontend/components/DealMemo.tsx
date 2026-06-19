import { FileText } from "lucide-react";

import { MemoResponse } from "@/types/deal";

export function DealMemo({ memo }: { memo: MemoResponse }) {
  return (
    <section className="rounded-2xl border border-line bg-[#13271f] p-6 text-white shadow-card">
      <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-signal text-ink">
          <FileText size={18} />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mint">Deal committee output</p>
          <h3 className="font-semibold">Transaction memo</h3>
        </div>
      </div>
      <div className="space-y-5">
        {Object.entries(memo.sections).map(([title, text]) => (
          <div key={title}>
            <h4 className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-signal">{title}</h4>
            <p className="text-sm leading-6 text-white/75">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

