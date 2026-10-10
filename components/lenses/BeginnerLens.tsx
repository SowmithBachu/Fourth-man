"use client";

import type { Lang, Moment } from "@/lib/types";
import { tr } from "@/lib/ui";
import More from "../More";
import FieldReplay from "../viz/FieldReplay";
import FlipCard from "../viz/FlipCard";

const L = {
  thinkOfIt: { en: "Think of it like", hi: "Aise samjho" },
  words: { en: "Explain the cricket words", hi: "Cricket words samjhao" },
  flip: { en: "Tap to flip", hi: "Tap karo" },
};

/** Answer, then the replay, then one everyday analogy. The jargon waits behind a toggle. */
export default function BeginnerLens({ moment, lang }: { moment: Moment; lang: Lang }) {
  const lens = moment.lenses.beginner;

  return (
    <div className="space-y-4">
      <p className="text-[21px] font-semibold leading-snug text-fg sm:text-[23px]">{tr(lens.headline, lang)}</p>

      <FieldReplay shot={moment.shot} impact={moment.event.impact.value} impactLabel={tr(moment.event.impact.label, lang)} />

      <p className="text-[15px] leading-snug text-fg/85">
        <span className="font-semibold text-beginner">{tr(L.thinkOfIt, lang)}: </span>
        {tr(lens.analogy, lang)}
      </p>

      <More label={`${tr(L.words, lang)} (${lens.decoder.length})`}>
        <div className={`grid grid-cols-1 gap-2.5 ${lens.decoder.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {lens.decoder.map((d) => (
            <FlipCard key={d.term} term={d.term} meaning={tr(d.meaning, lang)} hint={tr(L.flip, lang)} accent="var(--color-beginner)" />
          ))}
        </div>
      </More>
    </div>
  );
}
