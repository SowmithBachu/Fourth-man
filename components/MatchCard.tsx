import Link from "next/link";
import { replay } from "@/lib/cricket";
import type { LensId, MatchBundle } from "@/lib/types";
import { lensMeta } from "@/lib/ui";
import { IconArrow } from "./icons";
import TiltCard from "./viz/TiltCard";

/** Runs-needed trend over the replayed deliveries, with the frozen moments marked. Decorative summary. */
function Sparkline({ bundle, accent }: { bundle: MatchBundle; accent: string }) {
  const { match, timeline, timelineStart, moments } = bundle;
  const pts = replay(timeline, timelineStart, match.target, match.totalBalls);
  const start = match.target - timelineStart.runs;
  const W = 300;
  const H = 70;
  const step = W / pts.length;
  const y = (v: number) => 8 + (1 - v / start) * (H - 16);
  const line = [`0 ${y(start)}`, ...pts.map((p, i) => `${(i + 1) * step} ${y(p.need)}`)].join("L");
  const momentIds = new Set(moments.map((m) => m.timelineId));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" aria-hidden>
      <path d={`M${line}L${W} ${H}L0 ${H}Z`} fill="#3987e5" opacity={0.1} />
      <path d={`M${line}`} fill="none" stroke="#3987e5" strokeWidth={2} strokeLinejoin="round" />
      {pts.map((p, i) =>
        momentIds.has(p.ball.id) ? (
          <circle key={p.ball.id} cx={(i + 1) * step} cy={y(p.need)} r={4.5} fill={accent} stroke="var(--color-panel)" strokeWidth={2} />
        ) : null,
      )}
    </svg>
  );
}

export default function MatchCard({ bundle, lens }: { bundle: MatchBundle; lens: LensId }) {
  const { match, moments, timelineStart } = bundle;
  const meta = lensMeta(lens);
  const verified = match.dataNote.kind === "verified";
  const need = match.target - timelineStart.runs;
  const balls = match.totalBalls - timelineStart.balls;

  return (
    <TiltCard className="group rounded-3xl" max={6}>
      <Link
        href={`/watch/${lens}/${match.id}`}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel p-5 transition hover:border-line-strong"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: `linear-gradient(90deg, ${match.defending.color}, ${match.chasing.color})` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl transition group-hover:opacity-40"
          style={{ background: match.chasing.color }}
        />

        <div className="relative flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {match.competition} · {match.stage}
          </span>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
              verified ? "border-lime/30 bg-lime/10 text-lime" : "border-strategist/40 bg-strategist/10 text-strategist"
            }`}
          >
            {verified ? "Verified data" : "Illustrative"}
          </span>
        </div>

        <div className="relative mt-4 flex items-center gap-2.5">
          <span className="rounded-md px-2 py-1 font-display text-[16px] font-extrabold tracking-wider text-white" style={{ background: match.chasing.color }}>
            {match.chasing.code}
          </span>
          <span className="text-[13px] font-semibold text-muted">chasing {match.target} v</span>
          <span className="rounded-md px-2 py-1 font-display text-[16px] font-extrabold tracking-wider text-white" style={{ background: match.defending.color }}>
            {match.defending.code}
          </span>
        </div>

        <p className="relative mt-4 font-display text-[26px] font-extrabold uppercase leading-[1.02] tracking-tight text-fg">{match.hook.en}</p>

        <div className="relative mt-4 rounded-2xl border border-line bg-panel-2 px-3 pb-2 pt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
            <span>
              Runs needed: <b className="text-fg">{need}</b> off {balls} → won
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: meta.accent }} /> moments
            </span>
          </div>
          <Sparkline bundle={bundle} accent={meta.accent} />
        </div>

        <div className="relative mt-auto flex items-center justify-between gap-2 pt-5">
          <span className="text-[12.5px] text-muted">
            <b className="text-fg">{moments.length}</b> moments · {match.venueShort} · {match.dateLabel}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-bold text-ink transition group-hover:brightness-110" style={{ background: meta.accent }}>
            Watch as {meta.withArticle}
            <IconArrow dir="right" className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
