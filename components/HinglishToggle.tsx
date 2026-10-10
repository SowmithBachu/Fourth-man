"use client";

import type { Lang } from "@/lib/types";
import { CricketBall } from "./icons";

export default function HinglishToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  const on = lang === "hi";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Hinglish commentary"
      onClick={onToggle}
      className="group flex items-center gap-2.5 rounded-full border border-line-strong bg-panel/80 py-1.5 pl-3.5 pr-1.5 backdrop-blur transition-colors hover:border-lime/60"
    >
      <span
        className={`font-display text-[15px] font-bold uppercase tracking-wider transition-colors ${
          on ? "text-faint" : "text-fg"
        }`}
      >
        Eng
      </span>
      <span
        className={`relative h-[30px] w-[62px] rounded-full border transition-colors duration-300 ${
          on ? "border-lime bg-lime" : "border-line-strong bg-panel-3"
        }`}
      >
        {/* Crease marks on the track */}
        <span
          className={`absolute inset-y-[6px] left-1/2 w-px -translate-x-1/2 ${on ? "bg-lime-ink/25" : "bg-white/10"}`}
        />
        <span
          className="ball-knob absolute left-[2px] top-[2px] h-6 w-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          style={{ transform: on ? "translateX(32px) rotate(360deg)" : "translateX(0) rotate(0deg)" }}
        >
          <CricketBall className="h-6 w-6" />
        </span>
      </span>
      <span
        className={`font-display text-[15px] font-bold uppercase tracking-wider transition-colors ${
          on ? "text-lime" : "text-faint"
        }`}
      >
        Hinglish
      </span>
      <kbd className="ml-0.5 hidden rounded-md border border-line-strong px-1.5 py-0.5 font-sans text-[10px] text-muted sm:inline">
        H
      </kbd>
    </button>
  );
}
