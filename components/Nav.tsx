import Link from "next/link";
import type { ReactNode } from "react";
import { IconCheck } from "./icons";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Fourth Man home">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-lime font-display text-[26px] font-extrabold text-lime-ink transition group-hover:rotate-[-6deg]">
        4
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-ink bg-danger" />
      </span>
      {!compact && (
        <span className="font-display text-[24px] font-extrabold uppercase leading-none tracking-tight">
          Fourth <span className="text-lime">Man</span>
        </span>
      )}
    </Link>
  );
}

export interface Step {
  label: string;
  href?: string;
  state: "done" | "current" | "todo";
}

/** The three-step flow: lens → match → moment. */
export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex items-center gap-1.5 text-[12px] font-semibold sm:gap-2">
      {steps.map((s, i) => {
        const dot = (
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
              s.state === "current"
                ? "bg-lime text-lime-ink shadow-[0_0_16px_rgba(198,244,50,0.5)]"
                : s.state === "done"
                  ? "bg-lime/20 text-lime"
                  : "border border-line-strong text-muted"
            }`}
          >
            {s.state === "done" ? <IconCheck className="h-3.5 w-3.5" /> : i + 1}
          </span>
        );
        const body = (
          <span className="flex items-center gap-1.5">
            {dot}
            <span className={`hidden sm:inline ${s.state === "todo" ? "text-muted" : "text-fg"}`}>{s.label}</span>
          </span>
        );
        return (
          <li key={s.label} className="flex items-center gap-1.5 sm:gap-2" aria-current={s.state === "current" ? "step" : undefined}>
            {s.href && s.state === "done" ? (
              <Link href={s.href} className="rounded-full transition hover:opacity-80">
                {body}
              </Link>
            ) : (
              body
            )}
            {i < steps.length - 1 && <span aria-hidden className={`h-px w-4 sm:w-8 ${s.state === "done" ? "bg-lime/50" : "bg-line-strong"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

export function TopBar({ center, right }: { center?: ReactNode; right?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <Logo />
      {center}
      {right && <div className="flex flex-wrap items-center gap-3">{right}</div>}
    </header>
  );
}
