"use client";

import { useState } from "react";

/** A 3D card that flips on click/tap or Enter/Space: the term on the front, the meaning on the back. */
export default function FlipCard({ term, meaning, hint, accent }: { term: string; meaning: string; hint: string; accent: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${term}: ${flipped ? meaning : hint}`}
      className="flip-card group h-[118px] w-full text-left"
    >
      <span className={`flip-inner ${flipped ? "is-flipped" : ""}`}>
        <span
          className="flip-face flex flex-col justify-between rounded-2xl border p-4"
          style={{
            borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
            background: `linear-gradient(140deg, color-mix(in srgb, ${accent} 22%, var(--color-panel-2)), var(--color-panel-2) 70%)`,
          }}
        >
          <span className="font-display text-[26px] font-extrabold uppercase leading-none tracking-wide text-fg">{term}</span>
          <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: accent }}>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
              <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />
            </svg>
            {hint}
          </span>
        </span>
        <span className="flip-face flip-back flex items-center rounded-2xl border border-line-strong bg-panel-3 p-4">
          <span className="text-[14.5px] font-medium leading-snug text-fg">{meaning}</span>
        </span>
      </span>
    </button>
  );
}
