"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";

import { CompanyInputCard } from "@/components/CompanyInputCard";
import { DealAssumptionsForm } from "@/components/DealAssumptionsForm";
import { DemoDealButton } from "@/components/DemoDealButton";
import { ResultsSummary } from "@/components/ResultsSummary";
import { runDeal } from "@/lib/api";
import { DemoDeal, demoDeals } from "@/lib/demo-deals";
import { DealOutputs, DealRequest } from "@/types/deal";

export function DealWorkspace() {
  const [deal, setDeal] = useState<DealRequest>(structuredClone(demoDeals[0].deal));
  const [outputs, setOutputs] = useState<DealOutputs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const financingTotal =
    deal.assumptions.cash_financing_pct +
    deal.assumptions.debt_financing_pct +
    deal.assumptions.stock_financing_pct;
  const purchasePrice =
    deal.target.share_price *
    (1 + deal.assumptions.purchase_premium) *
    deal.target.shares_outstanding;
  const cashRequired = purchasePrice * deal.assumptions.cash_financing_pct;
  const validationMessage =
    Math.abs(financingTotal - 1) > 0.000001
      ? "Financing must total 100%."
      : deal.acquirer.ticker.trim().toUpperCase() ===
          deal.target.ticker.trim().toUpperCase()
        ? "Acquirer and target must be different companies."
        : cashRequired > deal.acquirer.cash_balance
          ? `Cash financing requires $${cashRequired.toLocaleString(undefined, { maximumFractionDigits: 1 })}mm, above available cash.`
          : deal.acquirer.share_price <= 0 ||
              deal.target.share_price <= 0 ||
              deal.acquirer.shares_outstanding <= 0 ||
              deal.target.shares_outstanding <= 0
            ? "Share prices and shares outstanding must be positive."
            : null;

  const updateDeal = (nextDeal: DealRequest) => {
    setDeal(nextDeal);
    setOutputs(null);
    setError(null);
  };

  const loadDemo = (demo: DemoDeal) => {
    updateDeal(structuredClone(demo.deal));
    setOutputs(null);
    setError(null);
  };

  const calculate = async () => {
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await runDeal(deal);
      setOutputs(result);
      window.setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to model this deal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas">
      <div className="border-b border-line bg-[#10251d] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal text-sm text-ink">D</span>
            DealIQ
          </a>
          <div className="hidden items-center gap-2 text-xs text-white/60 sm:flex">
            <ShieldCheck size={14} className="text-signal" />
            Deterministic finance engine
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">New transaction</p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">Build the accretion case.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Model consideration, financing, EPS impact, and the synergy threshold required to make the deal work.</p>
          </div>
          <DemoDealButton onLoad={loadDemo} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <CompanyInputCard title="Acquirer" eyebrow="Buyer profile" company={deal.acquirer} onChange={(company) => updateDeal({ ...deal, acquirer: company as DealRequest["acquirer"] })} />
          <CompanyInputCard title="Target" eyebrow="Target profile" company={deal.target} isTarget onChange={(company) => updateDeal({ ...deal, target: company as DealRequest["target"] })} />
          <div className="lg:col-span-2">
            <DealAssumptionsForm assumptions={deal.assumptions} onChange={(assumptions) => updateDeal({ ...deal, assumptions })} />
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {error}
          </div>
        )}

        <div className="my-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-pine/10 bg-mint/35 p-4 sm:flex-row">
          <p className={`text-sm ${validationMessage ? "text-rose-700" : "text-pine"}`}>
            <strong>{validationMessage ? "Review assumptions." : "Ready to underwrite."}</strong>{" "}
            {validationMessage ?? "Calculation, sensitivity, and memo generation run together."}
          </p>
          <button
            type="button"
            onClick={calculate}
            disabled={isLoading || Boolean(validationMessage)}
            className="flex min-w-48 items-center justify-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0e3e2d] disabled:cursor-wait disabled:opacity-70"
          >
            {isLoading ? <><LoaderCircle size={17} className="animate-spin" /> Running model</> : <>Calculate deal <ArrowRight size={17} /></>}
          </button>
        </div>

        {outputs && <ResultsSummary deal={deal} outputs={outputs} />}
      </div>
    </main>
  );
}
