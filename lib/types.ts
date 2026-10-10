export type Lang = "en" | "hi";
export type Bilingual = Record<Lang, string>;

export type LensId = "beginner" | "strategist" | "statistician" | "fantasy";

export interface ScoreState {
  runs: number;
  wickets: number;
  /** Legal balls bowled so far in the innings. */
  balls: number;
}

export interface BatterLine {
  runs: number;
  balls: number;
}

export interface SourceRef {
  label: string;
  url?: string;
}

export interface TeamRef {
  code: string;
  name: string;
  /** Team chip colour (white text sits on it). */
  color: string;
}

export interface Match {
  id: string;
  shortTitle: string;
  demoLabel: string;
  dataNote: { kind: "verified" | "illustrative"; label: string };
  competition: string;
  stage: string;
  venue: string;
  venueShort: string;
  dateLabel: string;
  chasing: TeamRef;
  defending: TeamRef;
  firstInnings: { code: string; runs: number; wickets: number; overs: string };
  target: number;
  totalBalls: number;
  result: string;
  resultBanner: Bilingual;
  hook: Bilingual;
  sources: Record<string, SourceRef>;
}

export type BallKind = "run" | "dot" | "six" | "four" | "wicket" | "noball" | "wide" | "byes";

export interface TimelineBall {
  id: string;
  over: number;
  bowler: string;
  label: string;
  kind: BallKind;
  runs: number;
  legal: boolean;
  desc: string;
  momentId?: string;
}

export interface DecoderTerm {
  term: string;
  meaning: Bilingual;
}

export interface StrategyOption {
  label: Bilingual;
  detail: Bilingual;
  played: boolean;
  /** 0–100, our read of how likely the option backfires. */
  risk: number;
  /** 0–100, our read of the payoff if it works. */
  reward: number;
}

export interface StatFact {
  value: string;
  label: Bilingual;
  source: string;
}

export interface LedgerEntry {
  player: string;
  team: string;
  ruleId: string;
  count: number;
}

export interface SettlementEntry {
  player: string;
  team: string;
  kind: "strikeRate" | "economy";
  runs: number;
  balls: number;
}

export interface Caveat {
  kind: "pending" | "unavailable";
  text: Bilingual;
}

export type ShotResult = "six" | "four" | "caught" | "freehit-byes" | "runs";

/** Drives the Beginner lens's illustrative field replay. */
export interface Shot {
  result: ShotResult;
  /** Degrees from straight back past the bowler; positive = off side (right of screen) for a right-hander. */
  angle: number;
  /** In boundary radii. Ignored for fours and sixes, which are solved against the rope. */
  distance: number;
  fullToss?: boolean;
  noBall?: boolean;
  label: string;
}

export interface Moment {
  id: string;
  ball: string;
  timelineId: string;
  title: Bilingual;
  bowler: string;
  striker: { name: string; before: BatterLine; after: BatterLine; out?: boolean };
  nonStriker: { name: string; score: BatterLine };
  event: { tag: string; kind: string; summary: Bilingual; impact: { value: string; label: Bilingual } };
  shot: Shot;
  before: ScoreState;
  after: ScoreState;
  lenses: {
    beginner: {
      /** Short preview line, kept in the data for reuse. */
      teaser: Bilingual;
      headline: Bilingual;
      body: Bilingual;
      analogy: Bilingual;
      watchNext: Bilingual;
      decoder: DecoderTerm[];
    };
    strategist: {
      teaser: Bilingual;
      headline: Bilingual;
      body: Bilingual;
      side: Bilingual;
      options: StrategyOption[];
      nextMove: Bilingual;
    };
    statistician: {
      teaser: Bilingual;
      headline: Bilingual;
      body: Bilingual;
      facts: StatFact[];
    };
    fantasy: {
      headline: Bilingual;
      body: Bilingual;
      ledger: LedgerEntry[];
      settlement?: SettlementEntry[];
      notes: Bilingual[];
      caveats: Caveat[];
    };
  };
}

export interface MatchBundle {
  match: Match;
  timeline: TimelineBall[];
  timelineStart: ScoreState;
  moments: Moment[];
}

export interface MomentsFile {
  matches: MatchBundle[];
}

export interface ScoringRule {
  id: string;
  category: string;
  label: string;
  points: number;
  verbatim: string;
  appliesTo?: string;
}

export interface RateBand {
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  points: number;
  verbatim: string;
}

export interface RateRule {
  id: string;
  label: string;
  minBalls: number;
  minimumVerbatim: string;
  unit: string;
  bands: RateBand[];
  noteVerbatim?: string;
}

export interface ScoringRules {
  meta: {
    verified: boolean;
    format: string;
    title: string;
    officialUrl: string;
    archivedCopyUrl: string;
    archivedCopyCapturedOn: string;
    retrievedOn: string;
    retrievalNote: string;
    scopeNote: string;
  };
  rules: ScoringRule[];
  multipliers: {
    captain: { label: string; value: number; verbatim: string };
    viceCaptain: { label: string; value: number; verbatim: string };
  };
  economyRate: RateRule;
  strikeRate: RateRule;
  officialNotesVerbatim: string[];
  howFourthManAppliesThem: { topic: string; reading: string }[];
  notDefinedOnPage: { id: string; topic: string; decision: string }[];
}
