"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Lang, LensId, MatchBundle, ScoringRules } from "@/lib/types";
import { LENSES, lensMeta } from "@/lib/ui";
import HinglishToggle from "./HinglishToggle";
import LensPanel from "./LensPanel";
import LensTabs from "./LensTabs";
import MomentCard from "./MomentCard";
import { Stepper, TopBar } from "./Nav";

export default function FourthMan({
  bundle,
  rules,
  initialLens,
}: {
  bundle: MatchBundle;
  rules: ScoringRules | null;
  initialLens: LensId;
}) {
  const { match, moments, timeline } = bundle;

  const [index, setIndex] = useState(0);
  const [lens, setLens] = useState<LensId>(initialLens);
  const [compare, setCompare] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  // Pulses only drive animations: the lock flash on lens change and the Hinglish wipe.
  const [lensPulse, setLensPulse] = useState(0);
  const [langPulse, setLangPulse] = useState(0);

  const moment = moments[index];

  const selectLens = useCallback(
    (id: LensId) => {
      setCompare(false);
      if (id === lens) return;
      setLens(id);
      setLensPulse((p) => p + 1);
      // Keep the URL (and tab title) shareable without a navigation: /watch/<lens>/<match>.
      window.history.replaceState(null, "", `/watch/${id}/${match.id}`);
      document.title = `${match.shortTitle} · ${lensMeta(id).name} lens — Fourth Man`;
    },
    [lens, match.id, match.shortTitle],
  );

  const toggleCompare = useCallback(() => {
    setCompare((c) => !c);
    setLensPulse((p) => p + 1);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "en" ? "hi" : "en"));
    setLangPulse((p) => p + 1);
  }, []);

  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(moments.length - 1, Math.max(0, i + delta))),
    [moments.length],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;

      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "h" || e.key === "H") toggleLang();
      else if (e.key === "c" || e.key === "C") toggleCompare();
      else {
        const lensMatch = LENSES.find((l) => l.key === e.key);
        if (lensMatch) selectLens(lensMatch.id);
        else return;
      }
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, toggleLang, toggleCompare, selectLens]);

  const illustrative = match.dataNote.kind === "illustrative";

  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pitch-texture pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex max-w-[1380px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <TopBar
          center={
            <Stepper
              steps={[
                { label: `${lensMeta(lens).name} lens`, href: "/#personas", state: "done" },
                { label: match.shortTitle, href: `/watch/${lens}`, state: "done" },
                { label: lang === "en" ? "Freeze a moment" : "Moment chuno", state: "current" },
              ]}
            />
          }
          right={<HinglishToggle lang={lang} onToggle={toggleLang} />}
        />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px]">
          <Link href={`/watch/${lens}`} className="flex items-center gap-1 font-semibold text-muted transition hover:text-lime">
            ← {lang === "en" ? "All matches" : "Saare matches"}
          </Link>
          <span className="text-faint">/</span>
          <span className="font-semibold text-fg">
            {match.chasing.name} v {match.defending.name} · {match.dateLabel}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] ${
              illustrative ? "border-strategist/40 text-strategist" : "border-lime/30 text-lime"
            }`}
            title={`${match.demoLabel} · ${match.dataNote.label}`}
          >
            Demo · {illustrative ? "Illustrative data" : "Verified data"}
          </span>
        </div>

        {/* Two zones only: the frozen moment (left, pinned on desktop) and the lens that explains it (right). */}
        <main className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
          <div className="lg:sticky lg:top-4">
            <MomentCard
              match={match}
              timeline={timeline}
              moment={moment}
              moments={moments}
              index={index}
              lang={lang}
              langPulse={langPulse}
              onSelect={setIndex}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <LensTabs active={lens} compare={compare} onSelect={selectLens} onCompare={toggleCompare} lang={lang} />
            <LensPanel
              bundle={bundle}
              moment={moment}
              rules={rules}
              lens={lens}
              compare={compare}
              lang={lang}
              lensPulse={lensPulse}
              langPulse={langPulse}
              onOpenLens={selectLens}
            />
          </div>
        </main>

        <footer className="hidden justify-end border-t border-line pt-3 text-[12px] text-muted sm:flex">
          <p className="flex shrink-0 items-center gap-3">
            <span>
              <kbd className="rounded border border-line-strong px-1">←</kbd> <kbd className="rounded border border-line-strong px-1">→</kbd> moments
            </span>
            <span>
              <kbd className="rounded border border-line-strong px-1">1</kbd>–<kbd className="rounded border border-line-strong px-1">4</kbd> lenses
            </span>
            <span>
              <kbd className="rounded border border-line-strong px-1">C</kbd> compare
            </span>
            <span>
              <kbd className="rounded border border-line-strong px-1">H</kbd> Hinglish
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
