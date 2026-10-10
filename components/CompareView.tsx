"use client";

import { equation, fmt2 } from "@/lib/cricket";
import { fantasyTeaser } from "@/lib/fantasy";
import type { Lang, LensId, Match, Moment, ScoringRules } from "@/lib/types";
import { LENSES, tr } from "@/lib/ui";
import { IconArrow, LensIcon } from "./icons";

/** The one-glance proof of the idea: the same ball, answered four ways. */
export default function CompareView({
  match,
  moment,
  rules,
  lang,
  onOpen,
}: {
  match: Match;
  moment: Moment;
  rules: ScoringRules | null;
  lang: Lang;
  onOpen: (id: LensId) => void;
}) {
  const before = equation(moment.before, match.target, match.totalBalls);
  const after = equation(moment.after, match.target, match.totalBalls);
  const played = moment.lenses.strategist.options
    .map((o, i) => (o.played ? `${String.fromCharCode(65 + i)} · ${tr(o.label, lang)}` : null))
    .filter(Boolean)
    .join(" + ");

  const signature: Record<LensId, string> = {
    beginner: `${moment.event.impact.value} ${tr(moment.event.impact.label, lang)}`,
    strategist: `${lang === "en" ? "Played" : "Khela gaya"}: ${played}`,
    statistician: after.won
      ? `Req. rate ${fmt2(before.requiredRate)} → ${lang === "en" ? "won" : "jeet"}`
      : `Req. rate ${fmt2(before.requiredRate)} → ${fmt2(after.requiredRate)}`,
    fantasy: fantasyTeaser(moment.lenses.fantasy.ledger, rules),
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {LENSES.map((lens, i) => (
        <button
          key={lens.id}
          type="button"
          onClick={() => onOpen(lens.id)}
          className="compare-card group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel-2 p-4 text-left transition hover:-translate-y-0.5 hover:border-line-strong"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: lens.accent }} />
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `color-mix(in srgb, ${lens.accent} 18%, transparent)`, color: lens.accent }}
            >
              <LensIcon id={lens.id} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="font-display text-[18px] font-extrabold uppercase leading-tight" style={{ color: lens.accent }}>
                {lens.name}
              </div>
              <div className="text-[12.5px] font-semibold text-fg/70">“{tr(lens.tagline, lang)}”</div>
            </div>
          </div>
          <p className="mt-3 flex-1 text-[15.5px] font-semibold leading-snug text-fg">{tr(moment.lenses[lens.id].headline, lang)}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span
              className="truncate rounded-lg px-2.5 py-1 text-[12.5px] font-bold"
              style={{ background: `color-mix(in srgb, ${lens.accent} 16%, transparent)`, color: lens.accent }}
            >
              {signature[lens.id]}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-muted transition group-hover:text-fg">
              {lang === "en" ? "Open" : "Kholo"}
              <IconArrow dir="right" className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
