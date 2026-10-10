"use client";

import type { Lang, LensId } from "@/lib/types";
import { LENSES, tr } from "@/lib/ui";
import { LensIcon } from "./icons";

export default function LensTabs({
  active,
  compare,
  onSelect,
  onCompare,
  lang,
}: {
  active: LensId;
  compare: boolean;
  onSelect: (id: LensId) => void;
  onCompare: () => void;
  lang: Lang;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
      <div role="tablist" aria-label="Explanation lens" className="contents">
        {LENSES.map((lens) => {
          const selected = !compare && lens.id === active;
          return (
            <button
              key={lens.id}
              id={`tab-${lens.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="lens-panel"
              onClick={() => onSelect(lens.id)}
              className={`group relative flex min-h-[58px] items-center gap-2 overflow-hidden rounded-2xl border px-2.5 py-2 text-left transition duration-200 ${
                selected
                  ? "border-lime bg-lime text-lime-ink shadow-[0_10px_34px_-12px_rgba(198,244,50,0.6)]"
                  : "border-line bg-panel hover:-translate-y-0.5 hover:border-line-strong"
              }`}
            >
              {!selected && <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: lens.accent }} />}
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-lime-ink/10" : ""}`}
                style={selected ? undefined : { background: `color-mix(in srgb, ${lens.accent} 16%, transparent)`, color: lens.accent }}
              >
                <LensIcon id={lens.id} className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[15px] font-extrabold uppercase leading-[1.05] tracking-wide">{lens.name}</span>
                <span className={`mt-0.5 block truncate text-[11.5px] leading-tight ${selected ? "text-lime-ink/75" : "text-muted"}`}>
                  {tr(lens.role, lang)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onCompare}
        aria-pressed={compare}
        title={lang === "en" ? "See all four answers side by side (C)" : "Chaaron jawaab ek saath (C)"}
        className={`col-span-2 flex min-h-[58px] items-center justify-center gap-2 rounded-2xl border px-3.5 py-2 text-[12.5px] font-bold leading-tight transition sm:col-span-1 ${
          compare ? "border-fg bg-fg text-ink" : "border-dashed border-line-strong text-fg/85 hover:border-fg hover:text-fg"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
        </svg>
        <span className="text-left">
          {lang === "en" ? "Compare" : "Compare"}
          <span className="block text-[11px] font-semibold opacity-70">{lang === "en" ? "all 4" : "chaaron"}</span>
        </span>
      </button>
    </div>
  );
}
