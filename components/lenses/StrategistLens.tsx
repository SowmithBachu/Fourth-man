"use client";

import type { Lang, Moment } from "@/lib/types";
import { tr } from "@/lib/ui";
import { IconArrow } from "../icons";
import OptionDeck from "../viz/OptionDeck";

const L = {
  next: { en: "Next move", hi: "Agla move" },
};

/** Answer, then the 3D hand of options (the one played at the front), then one line on what comes next. */
export default function StrategistLens({ moment, lang }: { moment: Moment; lang: Lang }) {
  const lens = moment.lenses.strategist;

  return (
    <div className="space-y-4">
      <p className="text-[21px] font-semibold leading-snug text-fg sm:text-[23px]">{tr(lens.headline, lang)}</p>

      <div className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-strategist">{tr(lens.side, lang)}</div>
      <OptionDeck key={moment.id} options={lens.options} lang={lang} />

      <div className="flex items-center gap-3 rounded-2xl border border-strategist/40 bg-strategist/[0.08] px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-strategist text-ink">
          <IconArrow dir="right" className="h-4 w-4" />
        </span>
        <p className="text-[14.5px] leading-snug text-fg">
          <span className="font-bold text-strategist">{tr(L.next, lang)}: </span>
          {tr(lens.nextMove, lang)}
        </p>
      </div>
    </div>
  );
}
