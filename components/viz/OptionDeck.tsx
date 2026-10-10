"use client";

import { useState } from "react";
import type { Lang, StrategyOption } from "@/lib/types";
import { tr } from "@/lib/ui";
import { useEntered } from "./hooks";

function risk(r: number) {
  if (r <= 35) return { level: 1, en: "Low risk", hi: "Kam risk", color: "#0ca30c" };
  if (r <= 60) return { level: 2, en: "Medium risk", hi: "Medium risk", color: "#fab219" };
  return { level: 3, en: "High risk", hi: "Zyada risk", color: "#d03b3b" };
}

const L = {
  played: { en: "Played", hi: "Khela gaya" },
  tap: { en: "Tap a card to bring it forward", hi: "Card pe tap karke aage lao" },
};

/**
 * The captain's hand: the options as 3D cards. The one actually played is dealt to the front;
 * tapping another swings it forward so the alternatives can be compared.
 */
export default function OptionDeck({ options, lang }: { options: StrategyOption[]; lang: Lang }) {
  const firstPlayed = Math.max(0, options.findIndex((o) => o.played));
  const [focus, setFocus] = useState(firstPlayed);
  const entered = useEntered();
  const others = options.map((_, i) => i).filter((i) => i !== focus);
  const slotOf = (i: number) => (i === focus ? "front" : i === others[0] ? "left" : "right");
  const focused = options[focus];

  return (
    <div>
      <div className="deck-stage" role="group" aria-label="Options">
        <span aria-hidden className="deck-floor" />
        {options.map((o, i) => {
          const r = risk(o.risk);
          const letter = String.fromCharCode(65 + i);
          return (
            <button
              key={o.label.en}
              type="button"
              onClick={() => setFocus(i)}
              aria-pressed={i === focus}
              aria-label={`${letter}: ${tr(o.label, lang)}${o.played ? `, ${tr(L.played, lang)}` : ""}. ${r[lang]}`}
              className={`deck-card slot-${slotOf(i)} ${entered ? "" : "dealing"} ${o.played ? "is-played" : ""}`}
              style={{ transitionDelay: entered ? `${i * 90}ms` : "0ms" }}
            >
              {o.played && <span aria-hidden className="deck-sheen" />}
              <span className="relative flex h-full flex-col p-4 text-left">
                <span className="flex items-start justify-between">
                  <span className="font-display text-[56px] font-extrabold leading-[0.8]">{letter}</span>
                  {o.played && (
                    <span className="rounded-md bg-ink px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-strategist">
                      ✓ {tr(L.played, lang)}
                    </span>
                  )}
                </span>
                <span className="mt-auto font-display text-[21px] font-extrabold uppercase leading-[1.02] tracking-wide">{tr(o.label, lang)}</span>
                <span className="mt-3 flex items-center gap-2">
                  <span className="flex gap-1" aria-hidden>
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className="h-2 w-5 rounded-full"
                        style={{ background: n <= r.level ? r.color : o.played ? "rgb(11 18 0 / 0.2)" : "rgb(255 255 255 / 0.12)" }}
                      />
                    ))}
                  </span>
                  <span className="text-[11.5px] font-bold">{r[lang]}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div key={focus} className="anim-rise mx-auto mt-2 max-w-[560px] text-center">
        <p className="text-[15px] leading-snug text-fg">
          <span className="font-display font-extrabold uppercase text-strategist">
            {String.fromCharCode(65 + focus)} · {tr(focused.label, lang)}:
          </span>{" "}
          {tr(focused.detail, lang)}
        </p>
        <p className="mt-1.5 text-[11.5px] text-muted">{tr(L.tap, lang)}</p>
      </div>
    </div>
  );
}
