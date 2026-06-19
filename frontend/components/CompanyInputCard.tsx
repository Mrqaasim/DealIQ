import { useState } from "react";
import { Building2, CheckCircle2, LoaderCircle, Search } from "lucide-react";

import { NumberField } from "@/components/Field";
import { lookupCompany } from "@/lib/api";
import { AcquirerInput, CompanyLookupResult, TargetInput } from "@/types/deal";

interface Props {
  title: string;
  eyebrow: string;
  company: AcquirerInput | TargetInput;
  isTarget?: boolean;
  onChange: (company: AcquirerInput | TargetInput) => void;
}

export function CompanyInputCard({
  title,
  eyebrow,
  company,
  isTarget = false,
  onChange,
}: Props) {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<CompanyLookupResult | null>(null);

  const setText = (key: "name" | "ticker", value: string) =>
    onChange({ ...company, [key]: value });
  const setNumber = (key: keyof TargetInput, value: number) =>
    onChange({ ...company, [key]: value } as AcquirerInput | TargetInput);

  const loadTicker = async () => {
    if (!company.ticker.trim()) {
      setLookupError("Enter a ticker first.");
      return;
    }
    setIsLookingUp(true);
    setLookupError(null);
    try {
      const result = await lookupCompany(company.ticker);
      const updated = {
        ...company,
        name: result.name,
        ticker: result.ticker,
        ...(result.share_price !== null && { share_price: result.share_price }),
        ...(result.shares_outstanding !== null && {
          shares_outstanding: result.shares_outstanding,
        }),
        ...(result.net_income !== null && { net_income: result.net_income }),
        ...(result.cash_balance !== null && { cash_balance: result.cash_balance }),
        ...(result.debt_balance !== null && { debt_balance: result.debt_balance }),
        ...(isTarget && result.revenue !== null && { revenue: result.revenue }),
      } as AcquirerInput | TargetInput;
      onChange(updated);
      setLookupResult(result);
    } catch (error) {
      setLookupResult(null);
      setLookupError(
        error instanceof Error ? error.message : "Company data could not be loaded.",
      );
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-panel p-5 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-pine text-white">
          <Building2 size={18} />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            {eyebrow}
          </p>
          <h2 className="font-semibold text-ink">{title}</h2>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_230px]">
        <label>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Company name
          </span>
          <input
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/10"
            value={company.name}
            onChange={(event) => setText("name", event.target.value)}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Ticker
          </span>
          <span className="flex overflow-hidden rounded-xl border border-line bg-white transition focus-within:border-pine focus-within:ring-2 focus-within:ring-pine/10">
            <input
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-bold uppercase outline-none"
              value={company.ticker}
              maxLength={20}
              onChange={(event) => {
                setLookupResult(null);
                setLookupError(null);
                setText("ticker", event.target.value.toUpperCase());
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void loadTicker();
                }
              }}
            />
            <button
              type="button"
              onClick={() => void loadTicker()}
              disabled={isLookingUp}
              className="flex items-center gap-1.5 border-l border-line bg-emerald-50 px-3 text-xs font-bold text-pine transition hover:bg-mint disabled:cursor-wait disabled:opacity-60"
              aria-label={`Load ${title.toLowerCase()} company data`}
            >
              {isLookingUp ? <LoaderCircle size={14} className="animate-spin" /> : <Search size={14} />}
              Load
            </button>
          </span>
        </label>
      </div>

      {(lookupResult || lookupError) && (
        <div
          className={`mb-4 rounded-xl border px-3 py-2.5 text-xs ${
            lookupError
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
          role={lookupError ? "alert" : "status"}
        >
          {lookupError ? (
            <>{lookupError} Manual entry remains available.</>
          ) : (
            <div className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
              <span>
                Loaded {lookupResult?.ticker} from {lookupResult?.exchange ?? "the market"} in{" "}
                {lookupResult?.currency}, as of {lookupResult?.as_of}.
                {lookupResult && lookupResult.missing_fields.length > 0 && (
                  <> Review manually: {lookupResult.missing_fields.join(", ").replaceAll("_", " ")}.</>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField label="Share price" prefix="$" min={0.01} step={0.01} value={company.share_price} onChange={(v) => setNumber("share_price", v)} />
        <NumberField label="Shares outstanding" suffix="mm" min={0.01} step={0.1} value={company.shares_outstanding} onChange={(v) => setNumber("shares_outstanding", v)} />
        <NumberField label="Net income" prefix="$" suffix="mm" step={10} value={company.net_income} onChange={(v) => setNumber("net_income", v)} />
        {isTarget && (
          <NumberField label="Revenue" prefix="$" suffix="mm" min={0} step={10} value={(company as TargetInput).revenue} onChange={(v) => setNumber("revenue", v)} />
        )}
        <NumberField label="Cash balance" prefix="$" suffix="mm" min={0} step={10} value={company.cash_balance} onChange={(v) => setNumber("cash_balance", v)} />
        <NumberField label="Debt balance" prefix="$" suffix="mm" min={0} step={10} value={company.debt_balance} onChange={(v) => setNumber("debt_balance", v)} />
      </div>
    </section>
  );
}
