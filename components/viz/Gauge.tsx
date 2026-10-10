"use client";

import type { Severity } from "@/lib/cricket";
import CountUp from "./CountUp";
import { useEntered } from "./hooks";

// Status colours carry severity; each always ships with an icon + text label, never colour alone.
const SEVERITY: Record<Severity, { color: string; icon: string }> = {
  won: { color: "#c6f432", icon: "✓" },
  good: { color: "#0ca30c", icon: "●" },
  warning: { color: "#fab219", icon: "▲" },
  critical: { color: "#d03b3b", icon: "◆" },
};

/** Semicircle meter for required run rate, 0–36 runs per over (6 a ball). */
export default function Gauge({
  caption,
  value,
  max = 36,
  severity,
  severityLabel,
  unit,
}: {
  caption: string;
  value: number | null;
  max?: number;
  severity: Severity;
  severityLabel: string;
  unit: string;
}) {
  const entered = useEntered();
  const pct = value === null ? (severity === "won" ? 100 : 0) : Math.min(100, (value / max) * 100);
  const { color, icon } = SEVERITY[severity];
  const arc = "M 14 86 A 66 66 0 0 1 146 86";

  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{caption}</div>
      <svg viewBox="0 0 160 96" className="mt-1 w-full max-w-[190px]" aria-hidden>
        <path d={arc} fill="none" stroke="var(--color-panel-3)" strokeWidth={12} strokeLinecap="round" />
        <path
          d={arc}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${entered ? pct : 0} 100`}
          style={{ transition: "stroke-dasharray 1000ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
        />
        {[0, 12, 18, 36].map((tick) => {
          const a = Math.PI - (tick / max) * Math.PI;
          // Trig results can differ in the last bits between server and browser; round so hydration matches.
          const r = (v: number) => v.toFixed(2);
          return (
            <line
              key={tick}
              x1={r(80 + Math.cos(a) * 52)}
              y1={r(86 - Math.sin(a) * 52)}
              x2={r(80 + Math.cos(a) * 46)}
              y2={r(86 - Math.sin(a) * 46)}
              stroke="var(--color-faint)"
              strokeWidth={1}
            />
          );
        })}
      </svg>
      <div className="-mt-11 text-center">
        {value === null ? (
          <div className="text-[30px] font-semibold leading-none text-fg">{severity === "won" ? "Won" : "—"}</div>
        ) : (
          <CountUp value={value} decimals={2} className="text-[30px] font-semibold leading-none text-fg" />
        )}
        <div className="mt-1 text-[11px] text-muted">{unit}</div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-0.5 text-[11.5px] font-semibold text-fg/90">
        <span aria-hidden style={{ color }}>
          {icon}
        </span>
        {severityLabel}
      </div>
    </div>
  );
}
