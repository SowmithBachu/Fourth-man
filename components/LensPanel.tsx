"use client";

import type { Lang, LensId, MatchBundle, Moment, ScoringRules } from "@/lib/types";
import { UI, lensMeta, tr } from "@/lib/ui";
import { oversLabel } from "@/lib/cricket";
import CompareView from "./CompareView";
import LangSwap from "./LangSwap";
import { IconLock, LensIcon } from "./icons";
import BeginnerLens from "./lenses/BeginnerLens";
import StrategistLens from "./lenses/StrategistLens";
import StatisticianLens from "./lenses/StatisticianLens";
import FantasyLens from "./lenses/FantasyLens";

export default function LensPanel({
  bundle,
  moment,
  rules,
  lens,
  compare,
  lang,
  lensPulse,
  langPulse,
  onOpenLens,
}: {
  bundle: MatchBundle;
  moment: Moment;
  rules: ScoringRules | null;
  lens: LensId;
  compare: boolean;
  lang: Lang;
  lensPulse: number;
  langPulse: number;
  onOpenLens: (id: LensId) => void;
}) {
  const { match } = bundle;
  const meta = lensMeta(lens);
  const s = moment.after;
  const accent = compare ? "var(--color-fg)" : meta.accent;

  return (
    <section
      id="lens-panel"
      role="tabpanel"
      aria-labelledby={compare ? undefined : `tab-${lens}`}
      aria-label={compare ? "All four lenses" : undefined}
      className="relative overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      {!compare && (
        <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: accent }} />
      )}

      <header className="relative flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        {compare ? (
          <div>
            <div className="text-[12px] font-semibold text-muted">{lang === "en" ? "Four lenses, one ball" : "Chaar lens, ek ball"}</div>
            <div className="font-display text-[26px] font-extrabold uppercase leading-tight text-fg">
              {lang === "en" ? "Same moment, four answers" : "Wahi moment, chaar jawaab"}
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-ink" style={{ background: meta.accent }}>
              <LensIcon id={lens} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-muted">
                <span className="font-display text-[14px] font-extrabold uppercase tracking-wide" style={{ color: meta.accent }}>
                  {meta.name}
                </span>{" "}
                · {tr(meta.role, lang)}
              </div>
              <div className="font-display text-[28px] font-extrabold uppercase leading-[1.05] tracking-tight text-fg">
                “{tr(meta.tagline, lang)}”
              </div>
            </div>
          </div>
        )}

        {/* Re-keyed on every lens change: the flash shows the ball and score did NOT move. */}
        <div
          key={lensPulse}
          className={`flex items-center gap-1.5 rounded-full border border-line-strong bg-panel-2 px-2.5 py-1 ${lensPulse > 0 ? "lock-flash" : ""}`}
          title={tr(UI.sameBall, lang)}
        >
          <IconLock className="h-3.5 w-3.5 text-lime" />
          <span className="tabular text-[12px] font-semibold">
            {moment.ball} · {s.runs}/{s.wickets} ({oversLabel(s.balls)})
          </span>
        </div>
      </header>

      <div key={`${moment.id}:${compare ? "compare" : lens}`} className="lens-enter relative px-4 pb-6 pt-5 sm:px-5">
        <LangSwap pulse={langPulse}>
          {compare ? (
            <CompareView match={match} moment={moment} rules={rules} lang={lang} onOpen={onOpenLens} />
          ) : (
            <>
              {lens === "beginner" && <BeginnerLens moment={moment} lang={lang} />}
              {lens === "strategist" && <StrategistLens moment={moment} lang={lang} />}
              {lens === "statistician" && <StatisticianLens match={match} moment={moment} lang={lang} />}
              {lens === "fantasy" && <FantasyLens match={match} moment={moment} rules={rules} lang={lang} />}
            </>
          )}
        </LangSwap>
      </div>
    </section>
  );
}
