import momentsFile from "@/data/moments.json";
import scoringRules from "@/data/scoring-rules.json";
import type { LensId, MatchBundle, MomentsFile, ScoringRules } from "./types";

// The JSON's shape is enforced by scripts/validate-data.mjs before every build.
export const MATCHES: MatchBundle[] = (momentsFile as unknown as MomentsFile).matches;
export const RULES: ScoringRules = scoringRules as ScoringRules;

export const LENS_IDS: LensId[] = ["beginner", "strategist", "statistician", "fantasy"];

export function isLensId(value: string): value is LensId {
  return (LENS_IDS as string[]).includes(value);
}

export function getMatch(id: string): MatchBundle | undefined {
  return MATCHES.find((b) => b.match.id === id);
}
