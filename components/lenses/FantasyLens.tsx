"use client";

import { buildLedger, rulesAvailable, settle, signed } from "@/lib/fantasy";
import type { Lang, Match, Moment, ScoringRules } from "@/lib/types";
import { tr } from "@/lib/ui";
import { IconBlock, IconClock, IconExternal, IconInfo } from "../icons";
import More from "../More";
import CountUp from "../viz/CountUp";
import PlayerCards from "../viz/PlayerCards";

const L = {
  zero: { en: "fantasy points from this ball", hi: "fantasy points is ball se" },
  settled: { en: "Innings-end points", hi: "Innings-end points" },
  players: { en: "players", hi: "players" },
  how: { en: "How it's scored", hi: "Kaise score hua" },
  sr: { en: "Strike rate", hi: "Strike rate" },
  econ: { en: "Economy", hi: "Economy" },
  belowMin: { en: "under the 10-ball minimum", hi: "10 ball ke minimum se kam" },
  rules: { en: "Official Dream11 T20 points table", hi: "Official Dream11 T20 points table" },
  unavailableTitle: { en: "Fantasy impact unavailable", hi: "Fantasy impact uplabdh nahi" },
  unavailableBody: {
    en: "Verified Dream11 scoring rules could not be loaded, so Fourth Man won't estimate points.",
    hi: "Verified Dream11 scoring rules load nahi hue, isliye Fourth Man points ka andaaza nahi lagayega.",
  },
};

/** Answer, then the points card. Settlement and scoring notes wait behind toggles. */
export default function FantasyLens({ match, moment, rules, lang }: { match: Match; moment: Moment; rules: ScoringRules | null; lang: Lang }) {
  const lens = moment.lenses.fantasy;

  if (!rulesAvailable(rules)) {
    return (
      <div className="rounded-2xl border border-dashed border-danger/50 bg-danger/[0.06] p-6">
        <div className="flex items-center gap-2 font-display text-2xl font-bold uppercase text-danger">
          <IconBlock className="h-6 w-6" /> {tr(L.unavailableTitle, lang)}
        </div>
        <p className="mt-2 text-[15px] text-fg/90">{tr(L.unavailableBody, lang)}</p>
      </div>
    );
  }

  const ledger = buildLedger(lens.ledger, rules);
  const settlement = (lens.settlement ?? []).map((e) => settle(e, rules)).filter((x) => x !== null);
  const teamColors = { [match.chasing.code]: match.chasing.color, [match.defending.code]: match.defending.color };
  const zero = ledger.players.length === 0;
  // In the zero case the notes ARE the answer, so they're shown; otherwise they're scoring detail.
  const detailNotes = zero ? [] : lens.notes;

  return (
    <div className="space-y-4">
      <p className="text-[21px] font-semibold leading-snug text-fg sm:text-[23px]">{tr(lens.headline, lang)}</p>

      {zero ? (
        <section className="zero-card rounded-2xl border border-fantasy/40 p-5">
          <div className="flex items-center gap-4">
            <span className="zero-coin flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-fantasy/60 bg-ink text-[44px] font-semibold text-fantasy">
              <CountUp value={0} />
            </span>
            <span className="text-[18px] font-semibold text-fg">{tr(L.zero, lang)}</span>
          </div>
          <ul className="mt-4 space-y-2">
            {lens.notes.map((n) => (
              <li key={n.en} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-fg">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fantasy text-[11px] font-extrabold text-lime-ink">0</span>
                {tr(n, lang)}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <PlayerCards key={moment.id} ledger={ledger} lang={lang} teamColors={teamColors} />
      )}

      <div className="space-y-2.5">
        {settlement.length > 0 && (
          <More label={`${tr(L.settled, lang)} (${settlement.length} ${tr(L.players, lang)})`}>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-panel-2 px-4">
              {settlement.map((s) => (
                <li key={s.player} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded px-1.5 py-0.5 font-display text-[11px] font-extrabold tracking-wider text-white"
                        style={{ background: teamColors[s.team] ?? "var(--color-panel-3)" }}
                      >
                        {s.team}
                      </span>
                      <span className="truncate text-[14px] font-semibold text-fg">{s.player}</span>
                    </div>
                    <div className="tabular mt-0.5 text-[12.5px] text-muted">
                      {s.kind === "strikeRate" ? tr(L.sr, lang) : tr(L.econ, lang)} {s.value.toFixed(2)}
                      {!s.eligible && ` · ${tr(L.belowMin, lang)}`}
                    </div>
                  </div>
                  <span
                    title={s.band?.verbatim ?? s.minimumVerbatim}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[16px] font-bold ${
                      s.points === null
                        ? "bg-panel-3 text-muted"
                        : s.points > 0
                          ? "bg-fantasy text-lime-ink"
                          : s.points < 0
                            ? "bg-danger/20 text-danger"
                            : "bg-panel-3 text-fg/80"
                    }`}
                  >
                    {s.points === null ? "n/a" : signed(s.points)}
                  </span>
                </li>
              ))}
            </ul>
          </More>
        )}

        <More label={tr(L.how, lang)}>
          <ul className="space-y-2 rounded-2xl border border-line bg-panel-2 p-4">
            {detailNotes.map((n) => (
              <li key={n.en} className="flex items-start gap-2 text-[13.5px] leading-snug text-fg/90">
                <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-fantasy" />
                {tr(n, lang)}
              </li>
            ))}
            {lens.caveats.map((c) => (
              <li key={c.text.en} className="flex items-start gap-2 text-[13px] leading-snug text-fg/75">
                {c.kind === "unavailable" ? (
                  <IconBlock className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                ) : (
                  <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-strategist" />
                )}
                {tr(c.text, lang)}
              </li>
            ))}
            <li>
              <a
                href={rules.meta.archivedCopyUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`${rules.meta.retrievalNote} ${rules.meta.scopeNote}`}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted underline-offset-2 hover:text-fantasy hover:underline"
              >
                ✓ {tr(L.rules, lang)}
                <IconExternal className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </More>
      </div>
    </div>
  );
}
