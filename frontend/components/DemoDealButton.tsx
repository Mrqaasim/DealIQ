import { ChevronDown, Sparkles } from "lucide-react";

import { DemoDeal, demoDeals } from "@/lib/demo-deals";

interface Props {
  onLoad: (demo: DemoDeal) => void;
}

export function DemoDealButton({ onLoad }: Props) {
  return (
    <div className="relative">
      <select
        aria-label="Load a demo deal"
        defaultValue=""
        onChange={(event) => {
          const demo = demoDeals.find((item) => item.id === event.target.value);
          if (demo) onLoad(demo);
          event.target.value = "";
        }}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
      >
        <option value="" disabled>Load demo deal</option>
        {demoDeals.map((demo) => (
          <option key={demo.id} value={demo.id}>{demo.label}</option>
        ))}
      </select>
      <button type="button" className="flex items-center gap-2 rounded-xl border border-pine/20 bg-white px-4 py-2.5 text-sm font-semibold text-pine shadow-sm transition peer-hover:bg-emerald-50">
        <Sparkles size={16} />
        Load demo deal
        <ChevronDown size={15} />
      </button>
    </div>
  );
}

