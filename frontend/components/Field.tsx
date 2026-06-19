interface FieldProps {
  label: string;
  value: string | number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min,
}: FieldProps) {
  return (
    <label className="group block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      <span className="flex items-center rounded-xl border border-line bg-white px-3 transition focus-within:border-pine focus-within:ring-2 focus-within:ring-pine/10">
        {prefix && <span className="text-sm text-slate-400">{prefix}</span>}
        <input
          className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm font-medium text-ink outline-none"
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {suffix && <span className="text-xs font-medium text-slate-400">{suffix}</span>}
      </span>
    </label>
  );
}

