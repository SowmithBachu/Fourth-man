"use client";

import { useState, type CSSProperties } from "react";
import { groupColor, ruleGroup, shortLabel, signed, type LedgerResult, type PlayerLedger } from "@/lib/fantasy";
import type { Lang } from "@/lib/types";
import CountUp from "./CountUp";
import TiltCard from "./TiltCard";

type Mode = "base" | "c" | "vc";

const T = {
  en: { pick: "Pick them as", base: "Player", c: "Captain", vc: "Vice-captain", pts: "pts" },
  hi: { pick: "Inhe chuno as", base: "Player", c: "Captain", vc: "Vice-captain", pts: "pts" },
};

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function roleOf(p: PlayerLedger) {
  const groups = new Set(p.lines.map((l) => ruleGroup(l.ruleId)));
  if (groups.has("bowling")) return "BOWL";
  if (groups.has("fielding")) return "FIELD";
  return "BAT";
}

function PlayerCard({ p, mode, mult, teamColor, lang }: { p: PlayerLedger; mode: Mode; mult: number; teamColor: string; lang: Lang }) {
  const t = T[lang];
  const total = (p.total ?? 0) * mult;
  return (
    <TiltCard className="rounded-[26px]" max={12}>
      {/* Re-keyed on mode change: the card spins round and the total counts up again. */}
      <div key={mode} className="player-card" style={{ "--team": teamColor } as CSSProperties}>
        <span aria-hidden className="player-holo" />
        <div className="relative flex h-full flex-col items-center px-4 pb-4 pt-3.5 text-center">
          <div className="flex w-full items-center justify-between">
            <span className="rounded-md px-1.5 py-0.5 font-display text-[12px] font-extrabold tracking-wider text-white" style={{ background: teamColor }}>
              {p.team}
            </span>
            <span className="rounded-md border border-white/15 px-1.5 py-0.5 text-[10px] font-extrabold tracking-[0.14em] text-fg/80">{roleOf(p)}</span>
          </div>

          <div className="relative mt-3">
            <span
              className="flex h-[74px] w-[74px] items-center justify-center rounded-full border-[3px] bg-ink/70 font-display text-[30px] font-extrabold text-fg"
              style={{ borderColor: teamColor, boxShadow: `0 0 30px -6px ${teamColor}` }}
            >
              {initials(p.player)}
            </span>
            {mode !== "base" && (
              <span className="pop-badge absolute -right-3 -top-1 flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-ink bg-lime px-1 font-display text-[14px] font-extrabold text-lime-ink">
                {mode === "c" ? "C" : "VC"}
              </span>
            )}
          </div>

          <div className="mt-2.5 font-display text-[19px] font-extrabold uppercase leading-tight tracking-wide text-fg">{p.player}</div>

          <div className="mt-1 flex items-baseline gap-1">
            <CountUp value={total} signed decimals={Number.isInteger(total) ? 0 : 1} className="text-[52px] font-semibold leading-none text-lime" />
            <span className="text-[13px] font-semibold text-fg/60">{t.pts}</span>
          </div>

          <ul className="mt-3 w-full space-y-1 border-t border-white/10 pt-2.5 text-[12.5px]">
            {p.lines.map((l) => (
              <li key={l.ruleId} className="flex items-center justify-between gap-2" title={l.verbatim ? `Official Dream11 rule: "${l.verbatim}"` : undefined}>
                <span className="flex items-center gap-1.5 text-fg/80">
                  <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: groupColor(ruleGroup(l.ruleId)) }} />
                  {shortLabel(l.ruleId, l.label)}
                </span>
                <span className="tabular font-bold text-fg">{l.points === null ? "n/a" : signed(l.points)}</span>
              </li>
            ))}
            {mode !== "base" && (
              <li className="flex items-center justify-between gap-2 font-bold text-lime">
                <span>{mode === "c" ? `${t.c} ×${mult}` : `${t.vc} ×${mult}`}</span>
                <span className="tabular">{signed(total)}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </TiltCard>
  );
}

/** Collectible-style 3D cards: one per player this ball scored for, with a Captain / Vice-captain switch. */
export default function PlayerCards({ ledger, lang, teamColors }: { ledger: LedgerResult; lang: Lang; teamColors: Record<string, string> }) {
  const t = T[lang];
  const [mode, setMode] = useState<Mode>("base");
  const mult = mode === "c" ? (ledger.captain ?? 1) : mode === "vc" ? (ledger.viceCaptain ?? 1) : 1;
  const players = ledger.players.filter((p) => p.total !== null);

  const modes: { id: Mode; label: string; disabled: boolean }[] = [
    { id: "base", label: t.base, disabled: false },
    { id: "c", label: `${t.c} ×${ledger.captain ?? "–"}`, disabled: ledger.captain === null },
    { id: "vc", label: `${t.vc} ×${ledger.viceCaptain ?? "–"}`, disabled: ledger.viceCaptain === null },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">{t.pick}</span>
        <div role="radiogroup" aria-label="Multiplier" className="inline-flex rounded-full border border-line-strong bg-ink/60 p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              disabled={m.disabled}
              onClick={() => setMode(m.id)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition disabled:opacity-40 ${
                mode === m.id ? "bg-lime text-lime-ink shadow-[0_0_20px_rgba(198,244,50,0.45)]" : "text-fg/70 hover:text-fg"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="player-stage mt-5">
        <span aria-hidden className="player-floor" />
        <ul className="relative flex flex-wrap items-start justify-center gap-5">
          {players.map((p) => (
            <li key={p.player} className="w-[230px]">
              <PlayerCard p={p} mode={mode} mult={mult} teamColor={teamColors[p.team] ?? "#3987e5"} lang={lang} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
