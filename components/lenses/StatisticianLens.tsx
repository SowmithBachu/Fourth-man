"use client";

import { equation, rateSeverity, type Severity } from "@/lib/cricket";
import type { Lang, Match, Moment } from "@/lib/types";
import { tr } from "@/lib/ui";
import { IconExternal } from "../icons";
import More from "../More";
import CountUp, { numericValue } from "../viz/CountUp";
import Gauge from "../viz/Gauge";

const L = {
  rate: { en: "Required run rate", hi: "Required run rate" },
  before: { en: "Before", hi: "Pehle" },
  after: { en: "After", hi: "Baad mein" },
  unit: { en: "runs per over", hi: "runs per over" },
  numbers: { en: "Numbers that matter", hi: "Kaam ke numbers" },
};

const SEVERITY_LABEL: Record<Severity, { en: string; hi: string }> = {
  won: { en: "Chase complete", hi: "Chase poora" },
  good: { en: "Gettable", hi: "Mumkin" },
  warning: { en: "Tough", hi: "Mushkil" },
  critical: { en: "Extreme", hi: "Bahut mushkil" },
};

/** Answer, then one before → after gauge pair. The supporting records wait behind a toggle. */
export default function StatisticianLens({ match, moment, lang }: { match: Match; moment: Moment; lang: Lang }) {
  const lens = moment.lenses.statistician;
  const before = equation(moment.before, match.target, match.totalBalls);
  const after = equation(moment.after, match.target, match.totalBalls);
  const sevBefore = rateSeverity(before.requiredRate, before.won);
  const sevAfter = rateSeverity(after.requiredRate, after.won);

  return (
    <div className="space-y-4">
      <p className="text-[21px] font-semibold leading-snug text-fg sm:text-[23px]">{tr(lens.headline, lang)}</p>

      <section className="rounded-2xl border border-statistician/30 bg-gradient-to-b from-statistician/[0.08] to-panel-2 px-4 pb-4 pt-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-statistician">{tr(L.rate, lang)}</h3>
        <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <Gauge
            caption={tr(L.before, lang)}
            value={before.requiredRate}
            severity={sevBefore}
            severityLabel={tr(SEVERITY_LABEL[sevBefore], lang)}
            unit={tr(L.unit, lang)}
          />
          <span aria-hidden className="text-[28px] font-semibold text-statistician">→</span>
          <Gauge
            caption={tr(L.after, lang)}
            value={after.requiredRate}
            severity={sevAfter}
            severityLabel={tr(SEVERITY_LABEL[sevAfter], lang)}
            unit={tr(L.unit, lang)}
          />
        </div>
      </section>

      <More label={`${tr(L.numbers, lang)} (${lens.facts.length})`}>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {lens.facts.map((f) => {
            const src = match.sources[f.source];
            const num = numericValue(f.value);
            return (
              <li key={f.value + f.label.en} className="flex flex-col rounded-2xl border border-line bg-panel-2 p-4">
                <span className="text-[28px] font-semibold leading-none text-statistician">
                  {num ? <CountUp value={num.value} decimals={num.decimals} prefix={num.prefix} /> : f.value}
                </span>
                <span className="mt-2 flex-1 text-[13.5px] leading-snug text-fg/90">{tr(f.label, lang)}</span>
                {src &&
                  (src.url ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-muted underline-offset-2 hover:text-statistician hover:underline"
                    >
                      {src.label}
                      <IconExternal className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="mt-2.5 text-[11px] text-muted">{src.label}</span>
                  ))}
              </li>
            );
          })}
        </ul>
      </More>
    </div>
  );
}
