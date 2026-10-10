"use client";

import { equation, oversLabel } from "@/lib/cricket";
import type { BallKind, Lang, Match, Moment, TimelineBall } from "@/lib/types";
import { UI, tr } from "@/lib/ui";
import LangSwap from "./LangSwap";
import { IconArrow, IconPause } from "./icons";

const chipStyle: Record<BallKind, string> = {
  dot: "bg-panel-3 text-fg",
  run: "bg-panel-3 text-fg",
  four: "bg-ind text-white",
  six: "bg-lime text-lime-ink",
  wicket: "bg-danger text-white",
  noball: "bg-strategist text-lime-ink",
  wide: "bg-strategist text-lime-ink",
  byes: "bg-strategist text-lime-ink",
};

const tagStyle: Record<string, string> = {
  six: "bg-lime text-lime-ink",
  four: "bg-ind text-white",
  wicket: "bg-danger text-white",
  noball: "bg-strategist text-lime-ink",
  byes: "bg-strategist text-lime-ink",
  win: "bg-lime text-lime-ink",
};

/**
 * The frozen moment, in one card: pick a moment, see what the ball was, and the score it left.
 * Everything else (rates, records, points) lives in the lenses.
 */
export default function MomentCard({
  match,
  timeline,
  moment,
  moments,
  index,
  lang,
  langPulse,
  onSelect,
  onPrev,
  onNext,
}: {
  match: Match;
  timeline: TimelineBall[];
  moment: Moment;
  moments: Moment[];
  index: number;
  lang: Lang;
  langPulse: number;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const s = moment.after;
  const eq = equation(s, match.target, match.totalBalls);

  return (
    <section aria-label="Selected moment" className="overflow-hidden rounded-2xl border border-line bg-panel">
      {/* Moment picker: one chip per frozen ball */}
      <nav aria-label="Moments" className="flex items-center gap-2 border-b border-line bg-panel-2 px-3 py-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label={tr(UI.prev, lang)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-lime transition hover:border-lime disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line-strong"
        >
          <IconArrow dir="left" className="h-4 w-4" />
        </button>
        <ol className="flex flex-1 items-start justify-center gap-1.5 sm:gap-2.5">
          {moments.map((m, i) => {
            const ball = timeline.find((b) => b.id === m.timelineId);
            const current = i === index;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-current={current ? "step" : undefined}
                  title={tr(m.title, lang)}
                  className="group flex flex-col items-center gap-1"
                >
                  <span
                    className={`flex h-9 min-w-9 items-center justify-center rounded-full px-1.5 font-display text-[15px] font-extrabold transition ${
                      ball ? chipStyle[ball.kind] : "bg-panel-3 text-fg"
                    } ${current ? "ring-2 ring-lime ring-offset-2 ring-offset-panel-2" : "opacity-45 group-hover:opacity-90"}`}
                  >
                    {ball?.label ?? i + 1}
                  </span>
                  <span className={`tabular text-[10.5px] ${current ? "font-semibold text-fg" : "text-faint"}`}>{m.ball.split(" ")[0]}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={onNext}
          disabled={index === moments.length - 1}
          aria-label={tr(UI.next, lang)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-lime transition hover:border-lime disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line-strong"
        >
          <IconArrow dir="right" className="h-4 w-4" />
        </button>
      </nav>

      <div key={moment.id} className="anim-rise px-5 pb-5 pt-4">
        <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          <span>
            {tr(UI.moment, lang)} {index + 1}/{moments.length}
          </span>
          <span className="flex items-center gap-1.5 text-lime">
            <IconPause className="h-3 w-3" />
            {tr(UI.frozenAt, lang)} {moment.ball}
          </span>
        </div>

        <LangSwap pulse={langPulse}>
          <h2 className="mt-2 font-display text-[32px] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-[38px]">
            {tr(moment.title, lang)}
          </h2>
        </LangSwap>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-md px-2 py-0.5 font-display text-[14px] font-extrabold uppercase tracking-wider ${tagStyle[moment.event.kind] ?? "bg-panel-3 text-fg"}`}
          >
            {moment.event.tag}
          </span>
          <span className="text-[13.5px] text-muted">
            {moment.bowler} <span className="text-faint">to</span> <span className="text-fg/90">{moment.striker.name}</span>
          </span>
        </div>

        {/* The score this ball left behind */}
        <div className="mt-5 rounded-2xl border border-line bg-panel-2 p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span
                className="inline-flex h-6 items-center rounded-md px-1.5 font-display text-[13px] font-extrabold tracking-wider text-white"
                style={{ background: match.chasing.color }}
              >
                {match.chasing.code}
              </span>
              <div className="mt-1 flex items-baseline gap-2 whitespace-nowrap">
                <span className="tabular font-display text-[46px] font-extrabold leading-none tracking-tight">
                  {s.runs}/{s.wickets}
                </span>
                <span className="tabular font-display text-lg font-semibold text-muted">({oversLabel(s.balls)} ov)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted">{tr(UI.target, lang)}</div>
              <div className="tabular font-display text-[32px] font-extrabold leading-none text-lime">{match.target}</div>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-lime px-3 py-2 text-center font-display text-[20px] font-extrabold uppercase tracking-wide text-lime-ink">
            {eq.won ? (
              tr(match.resultBanner, lang)
            ) : (
              <>
                {tr(UI.need, lang)} <span className="tabular">{eq.need}</span> off <span className="tabular">{eq.ballsLeft}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
