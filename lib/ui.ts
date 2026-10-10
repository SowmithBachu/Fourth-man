import type { Bilingual, Lang, LensId } from "./types";

export const tr = (text: Bilingual, lang: Lang) => text[lang] ?? text.en;

export interface LensMeta {
  id: LensId;
  key: string;
  /** The lens name doubles as the persona's name everywhere in the UI. */
  name: string;
  /** "a Beginner", "a Fantasy Thinker": for "Watch as …" buttons. */
  withArticle: string;
  /** Short subheading describing who this lens is for. */
  role: Bilingual;
  quote: string;
  /** What this lens shows, in two or three words each. */
  features: string[];
  /** The one question this fan asks about every ball. */
  tagline: Bilingual;
  /** CSS colour token used for this lens's accent. */
  accent: string;
}

export const LENSES: LensMeta[] = [
  {
    id: "beginner",
    key: "1",
    name: "Beginner",
    withArticle: "a Beginner",
    role: { en: "New to cricket", hi: "Cricket mein naye" },
    quote: "Just tell me what happened, in plain words.",
    features: ["3D replay of the ball", "Plain-English answer", "Cricket words explained"],
    tagline: { en: "What just happened?", hi: "Abhi kya hua?" },
    accent: "var(--color-beginner)",
  },
  {
    id: "strategist",
    key: "2",
    name: "Strategist",
    withArticle: "a Strategist",
    role: { en: "Thinks like a captain", hi: "Captain ki soch" },
    quote: "What were the options, and was it the right call?",
    features: ["3D hand of options", "The one that was played", "The next move"],
    tagline: { en: "What are the options?", hi: "Ab options kya hain?" },
    accent: "var(--color-strategist)",
  },
  {
    id: "statistician",
    key: "3",
    name: "Statistician",
    withArticle: "a Statistician",
    role: { en: "Lives in the numbers", hi: "Numbers ka shauk" },
    quote: "Show me the numbers behind the noise.",
    features: ["Required-rate gauges", "3 numbers that matter", "Sourced records"],
    tagline: { en: "What do the numbers say?", hi: "Numbers kya kehte hain?" },
    accent: "var(--color-statistician)",
  },
  {
    id: "fantasy",
    key: "4",
    name: "Fantasy Thinker",
    withArticle: "a Fantasy Thinker",
    role: { en: "Plays Dream11", hi: "Dream11 player" },
    quote: "What did that ball do to my team?",
    features: ["3D player points cards", "Captain ×2 / VC ×1.5 switch", "Official Dream11 rules"],
    tagline: { en: "What did it do to my team?", hi: "Meri team pe kya asar?" },
    accent: "var(--color-fantasy)",
  },
];

export function lensMeta(id: LensId): LensMeta {
  return LENSES.find((l) => l.id === id) ?? LENSES[0];
}

export const UI = {
  need: { en: "Need", hi: "Chahiye" },
  target: { en: "Target", hi: "Target" },
  moment: { en: "Moment", hi: "Moment" },
  frozenAt: { en: "Frozen at", hi: "Yahin ruka" },
  prev: { en: "Previous moment", hi: "Pichhla moment" },
  next: { en: "Next moment", hi: "Agla moment" },
  sameBall: { en: "Same ball · same score · every lens", hi: "Har lens mein wahi ball, wahi score" },
} satisfies Record<string, Bilingual>;
