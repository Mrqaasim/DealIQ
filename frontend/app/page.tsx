import Link from "next/link";
import { ArrowRight, BarChart3, FileText, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Accretion engine", text: "Translate offer terms and financing into a transparent Year 1 EPS bridge." },
  { icon: Sparkles, title: "Sensitivity matrix", text: "Pressure-test purchase premium and annual synergy assumptions in seconds." },
  { icon: FileText, title: "Deal memo", text: "Generate a deterministic committee-ready summary of transaction economics." },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#10251d] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-signal text-ink">D</span>
          DealIQ
        </div>
        <Link href="/new-deal" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/10">
          Open workspace
        </Link>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-3 py-1.5 text-xs font-semibold text-mint">
            <ShieldCheck size={14} />
            M&A underwriting, made legible
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Know what makes the deal <span className="text-signal">work.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
            Model consideration, financing, EPS impact, and the synergy case in one focused transaction workspace.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/new-deal" className="inline-flex items-center gap-2 rounded-xl bg-signal px-5 py-3.5 text-sm font-extrabold text-ink transition hover:brightness-95">
              Model a transaction <ArrowRight size={17} />
            </Link>
            <span className="text-xs text-white/45">No login · No paid data · Fully transparent math</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-20 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative rotate-1 rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-[#f5f7f3] p-5 text-ink">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Base case output</p>
                  <p className="font-semibold">NSS / VCLD</p>
                </div>
                <span className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white">ACCRETIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Purchase price</p>
                  <p className="mt-2 text-xl font-semibold">$20.38bn</p>
                </div>
                <div className="rounded-xl bg-emerald-100 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">EPS impact</p>
                  <p className="mt-2 text-xl font-semibold text-emerald-900">+4.7%</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#13271f] p-4 text-white">
                <p className="text-[9px] font-bold uppercase tracking-wider text-signal">What needs to be true</p>
                <p className="mt-2 text-sm leading-5 text-white/70">Annual pre-tax synergies must exceed the modeled break-even threshold while financing costs remain protected.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-3 lg:px-8">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <Icon className="mb-4 text-signal" size={20} />
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

