import type { CSSProperties } from "react";
import { LENSES } from "@/lib/ui";
import { LensIcon } from "../icons";
import Ball3D from "./Ball3D";

const SPIN_SECONDS = 28;

// What each lens asks about the same delivery: Kohli's straight six off Haris Rauf (MCG, 2022).
const REACTIONS: Record<string, string> = {
  beginner: "Wait, why is that worth six?",
  strategist: "Why bowl a length there?",
  statistician: "3.50 → 3.14 runs a ball.",
  fantasy: "+24 for my captain!",
};

function ReactionCard({ id }: { id: (typeof LENSES)[number]["id"] }) {
  const lens = LENSES.find((l) => l.id === id)!;
  return (
    <div
      className="rounded-2xl border bg-panel p-3.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)]"
      style={{ borderColor: `color-mix(in srgb, ${lens.accent} 55%, transparent)` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in srgb, ${lens.accent} 20%, transparent)`, color: lens.accent }}
        >
          <LensIcon id={lens.id} className="h-4 w-4" />
        </span>
        <span className="font-display text-[14px] font-extrabold uppercase leading-tight tracking-wide" style={{ color: lens.accent }}>
          {lens.name}
        </span>
      </div>
      <p className="mt-2 text-[13.5px] font-semibold leading-snug text-fg sm:text-[15px]">“{REACTIONS[lens.id]}”</p>
    </div>
  );
}

/** The four lenses orbit one ball in 3D, each card always turned to face you. */
export default function PersonaOrbit() {
  return (
    <div className="relative">
      <div className="orbit-stage" role="img" aria-label="Four lenses react to the same ball in four different ways">
        <div className="orbit-tilt">
          <div className="orbit-center">
            <Ball3D />
          </div>
          <div className="orbit-ring">
            {LENSES.map((lens, i) => {
              const angle = i * 90;
              const style = {
                "--a": `${angle}deg`,
                "--delay": `${(-(angle / 360) * SPIN_SECONDS).toFixed(2)}s`,
              } as CSSProperties;
              return (
                <div key={lens.id} className="orbit-slot" style={style}>
                  <div className="orbit-card" style={style}>
                    <ReactionCard id={lens.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reduced-motion fallback: the same four reactions, laid flat. */}
      <div className="orbit-static grid-cols-2 gap-3">
        {LENSES.map((lens) => (
          <ReactionCard key={lens.id} id={lens.id} />
        ))}
      </div>

      <p className="mt-2 text-center text-[12px] text-muted">
        Same ball: Kohli&apos;s straight six off Haris Rauf, MCG 2022. Hover to pause.
      </p>
    </div>
  );
}
