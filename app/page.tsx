import Link from "next/link";
import { LensIcon, IconArrow, IconCheck } from "@/components/icons";
import MiniPreview from "@/components/landing/MiniPreview";
import PersonaOrbit from "@/components/landing/PersonaOrbit";
import { Logo } from "@/components/Nav";
import TiltCard from "@/components/viz/TiltCard";
import { MATCHES } from "@/lib/data";
import { LENSES } from "@/lib/ui";

const STEPS = [
  { title: "Pick your lens", body: "Beginner, Strategist, Statistician or Fantasy Thinker. Choose the one that sounds like you." },
  { title: "Pick a match", body: "Famous last-over chases, replayed. Nothing live, nothing to sign up for." },
  { title: "Freeze a ball", body: "Step through the big moments. The ball and score stay locked while you switch lenses." },
];

export default function Landing() {
  const featured = MATCHES[0].match;

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <div aria-hidden className="pitch-texture pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[900px]" />
      <div aria-hidden className="flood-beam pointer-events-none absolute left-[60%] top-[-120px] h-[900px] w-[900px] -translate-x-1/2" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-5">
          <Logo />
          <nav className="flex items-center gap-2 text-[13.5px] font-semibold">
            <a href="#personas" className="hidden rounded-full px-3 py-1.5 text-fg/80 transition hover:text-fg sm:inline">
              The four lenses
            </a>
            <Link
              href="/watch/beginner"
              className="rounded-full border border-line-strong px-3.5 py-1.5 text-fg transition hover:border-lime hover:text-lime"
            >
              Matches
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="grid grid-cols-1 items-center gap-6 pb-10 pt-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pb-16 lg:pt-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.14em] text-lime">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
              T20 moments, explained four ways
            </span>
            <h1 className="mt-5 font-display text-[56px] font-extrabold uppercase leading-[0.88] tracking-tight sm:text-[84px] xl:text-[100px]">
              One ball.
              <br />
              Four fans.
              <br />
              <span className="bg-gradient-to-r from-lime via-[#e4ff8a] to-lime bg-clip-text text-transparent">Four stories.</span>
            </h1>
            <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-fg/85 sm:text-[18px]">
              Fourth Man freezes a single delivery and explains it four ways: for the Beginner, the Strategist, the
              Statistician and the Fantasy Thinker. Same ball, same score. Your lens.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#personas"
                className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-[15px] font-bold text-lime-ink shadow-[0_12px_40px_-10px_rgba(198,244,50,0.7)] transition hover:translate-y-[-1px]"
              >
                Choose your lens
                <IconArrow dir="right" className="h-4 w-4 rotate-90 transition group-hover:translate-y-0.5" />
              </a>
              <Link
                href={`/watch/beginner/${featured.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3.5 text-[15px] font-semibold text-fg transition hover:border-lime hover:text-lime"
              >
                Jump into {featured.shortTitle} 2022
                <IconArrow dir="right" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <PersonaOrbit />
        </section>

        {/* Personas */}
        <section id="personas" className="scroll-mt-6 py-12 lg:py-16">
          <div className="max-w-[720px]">
            <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime">Step 1 · Choose your lens</div>
            <h2 className="mt-2 font-display text-[44px] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-[56px]">The four lenses</h2>
            <p className="mt-3 text-[16.5px] leading-relaxed text-fg/80">
              Pick the one that sounds like you. You can switch lenses any time, and the moment never moves.
            </p>
          </div>

          <ul className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {LENSES.map((lens) => (
              <li key={lens.id} className="h-full">
                <TiltCard className="group flex flex-col rounded-3xl p-5" max={7}>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[inherit]"
                    style={{
                      background: `radial-gradient(130% 80% at 0% 0%, color-mix(in srgb, ${lens.accent} 20%, transparent), transparent 60%), var(--color-panel)`,
                      border: `1px solid color-mix(in srgb, ${lens.accent} 35%, transparent)`,
                      borderRadius: "inherit",
                    }}
                  />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-ink"
                        style={{ background: lens.accent, boxShadow: `0 10px 30px -8px ${lens.accent}` }}
                      >
                        <LensIcon id={lens.id} className="h-7 w-7" />
                      </span>
                      <span className="rounded-md border border-line-strong px-1.5 text-[11px] font-semibold text-muted">Lens {lens.key}</span>
                    </div>

                    <div className="mt-4 font-display text-[30px] font-extrabold uppercase leading-none tracking-tight" style={{ color: lens.accent }}>
                      {lens.name}
                    </div>
                    <div className="mt-1 text-[13px] text-fg/70">{lens.role.en}</div>
                    <p className="mt-3 text-[17px] font-semibold leading-snug text-fg">“{lens.quote}”</p>

                    <div className="mt-4">
                      <MiniPreview id={lens.id} accent={lens.accent} />
                    </div>

                    <ul className="mt-4 flex-1 space-y-1.5">
                      {lens.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[13.5px] text-fg/90">
                          <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/watch/${lens.id}`}
                      className="mt-5 inline-flex items-center justify-between rounded-2xl px-4 py-3 text-[14.5px] font-bold text-ink transition group-hover:brightness-110"
                      style={{ background: lens.accent }}
                    >
                      Watch as {lens.withArticle}
                      <IconArrow dir="right" className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                </TiltCard>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section className="py-12 lg:py-16">
          <h2 className="font-display text-[36px] font-extrabold uppercase leading-none tracking-tight sm:text-[44px]">How it works</h2>
          <ol className="relative mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <span aria-hidden className="absolute left-0 right-0 top-[27px] hidden h-px bg-gradient-to-r from-lime/0 via-lime/40 to-lime/0 md:block" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-3xl border border-line bg-panel/80 p-5 backdrop-blur">
                <span className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-lime font-display text-[28px] font-extrabold text-lime-ink">
                  {i + 1}
                </span>
                <div className="mt-4 font-display text-[24px] font-bold uppercase tracking-tight text-fg">{s.title}</div>
                <p className="mt-1.5 text-[15px] leading-relaxed text-fg/80">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Closing CTA */}
        <section className="mb-12 overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-br from-lime/15 via-panel to-panel p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-[620px]">
              <h2 className="mt-2 font-display text-[34px] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-[46px]">
                {MATCHES.length} famous chases. {MATCHES.reduce((n, b) => n + b.moments.length, 0)} frozen moments.
              </h2>
            </div>
            <Link
              href="/watch/beginner"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-[15px] font-bold text-lime-ink transition hover:brightness-110"
            >
              See the matches
              <IconArrow dir="right" className="h-4 w-4" />
            </Link>
          </div>
        </section>


      </div>
    </div>
  );
}
