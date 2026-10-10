import type { LedgerEntry, RateBand, RateRule, ScoringRules, SettlementEntry } from "./types";

/**
 * Deterministic fantasy maths. Every point shown in the UI comes from a rule
 * in data/scoring-rules.json multiplied by a count in data/moments.json.
 * If a rule can't be found, the line is marked unavailable instead of guessed.
 */

export interface LedgerLine {
  ruleId: string;
  label: string;
  verbatim: string | null;
  perUnit: number | null;
  count: number;
  points: number | null;
}

export interface PlayerLedger {
  player: string;
  team: string;
  lines: LedgerLine[];
  /** Null when any line is unavailable, so a partial total is never shown as complete. */
  total: number | null;
}

export interface LedgerResult {
  available: boolean;
  players: PlayerLedger[];
  captain: number | null;
  viceCaptain: number | null;
}

export function rulesAvailable(rules: ScoringRules | null | undefined): rules is ScoringRules {
  return Boolean(rules && rules.meta?.verified === true && Array.isArray(rules.rules) && rules.rules.length > 0);
}

export function buildLedger(entries: LedgerEntry[], rules: ScoringRules | null | undefined): LedgerResult {
  if (!rulesAvailable(rules)) {
    return { available: false, players: [], captain: null, viceCaptain: null };
  }

  const byPlayer = new Map<string, PlayerLedger>();
  for (const entry of entries) {
    const rule = rules.rules.find((r) => r.id === entry.ruleId);
    const line: LedgerLine = {
      ruleId: entry.ruleId,
      label: rule?.label ?? entry.ruleId,
      verbatim: rule?.verbatim ?? null,
      perUnit: rule ? rule.points : null,
      count: entry.count,
      points: rule ? rule.points * entry.count : null,
    };
    const existing = byPlayer.get(entry.player);
    if (existing) {
      existing.lines.push(line);
    } else {
      byPlayer.set(entry.player, { player: entry.player, team: entry.team, lines: [line], total: 0 });
    }
  }

  const players = [...byPlayer.values()].map((p) => ({
    ...p,
    total: p.lines.some((l) => l.points === null) ? null : p.lines.reduce((sum, l) => sum + (l.points ?? 0), 0),
  }));

  return {
    available: true,
    players,
    captain: rules.multipliers?.captain?.value ?? null,
    viceCaptain: rules.multipliers?.viceCaptain?.value ?? null,
  };
}

/* ---------- Rule groups: the categorical colour of each points segment ---------- */

export type RuleGroup = "runs" | "boundary" | "milestone" | "bowling" | "fielding" | "other";

/** Fixed order and colours (validated for colour-blind separation on the dark panel). Colour follows the group, never rank. */
export const RULE_GROUPS: { id: RuleGroup; label: string; color: string }[] = [
  { id: "runs", label: "Runs", color: "#3987e5" },
  { id: "boundary", label: "Boundary & six bonus", color: "#d95926" },
  { id: "milestone", label: "Milestone bonus", color: "#199e70" },
  { id: "bowling", label: "Bowling", color: "#c98500" },
  { id: "fielding", label: "Fielding", color: "#d55181" },
  { id: "other", label: "Other", color: "#8e99a3" },
];

export function ruleGroup(ruleId: string): RuleGroup {
  if (ruleId === "bat.run") return "runs";
  if (ruleId === "bat.boundary_bonus" || ruleId === "bat.six_bonus") return "boundary";
  if (ruleId.startsWith("bat.")) return "milestone";
  if (ruleId.startsWith("bowl.")) return "bowling";
  if (ruleId.startsWith("field.")) return "fielding";
  return "other";
}

export const groupColor = (g: RuleGroup) => RULE_GROUPS.find((x) => x.id === g)?.color ?? "#8e99a3";

/** Short card labels. The official wording stays available as the tooltip (`verbatim`). */
const SHORT_LABEL: Record<string, string> = {
  "bat.run": "Runs",
  "bat.boundary_bonus": "Four bonus",
  "bat.six_bonus": "Six bonus",
  "bat.25_run_bonus": "25-run bonus",
  "bat.half_century_bonus": "50 bonus",
  "bat.75_run_bonus": "75-run bonus",
  "bat.century_bonus": "100 bonus",
  "bat.duck": "Duck",
  "bowl.dot_ball": "Dot ball",
  "bowl.wicket": "Wicket",
  "bowl.lbw_bowled_bonus": "LBW/Bowled bonus",
  "bowl.maiden": "Maiden",
  "field.catch": "Catch",
  "field.stumping": "Stumping",
  "field.run_out_direct": "Run out (direct)",
  "field.run_out_indirect": "Run out",
};

export const shortLabel = (ruleId: string, fallback: string) => SHORT_LABEL[ruleId] ?? fallback;

/* ---------- Innings-end rate settlement ---------- */

function bandMatches(band: RateBand, value: number): boolean {
  if (band.lt !== undefined && !(value < band.lt)) return false;
  if (band.lte !== undefined && !(value <= band.lte)) return false;
  if (band.gt !== undefined && !(value > band.gt)) return false;
  if (band.gte !== undefined && !(value >= band.gte)) return false;
  return true;
}

export interface SettlementLine {
  player: string;
  team: string;
  kind: SettlementEntry["kind"];
  rule: RateRule;
  ruleLabel: string;
  /** Rounded to 2 decimals before matching a band. */
  value: number;
  unit: string;
  figures: string;
  eligible: boolean;
  minimumVerbatim: string;
  band: RateBand | null;
  points: number | null;
}

export function settle(entry: SettlementEntry, rules: ScoringRules | null | undefined): SettlementLine | null {
  if (!rulesAvailable(rules)) return null;
  const rule: RateRule | undefined = entry.kind === "strikeRate" ? rules.strikeRate : rules.economyRate;
  if (!rule) return null;

  const raw = entry.kind === "strikeRate" ? (entry.runs / entry.balls) * 100 : (entry.runs / entry.balls) * 6;
  const value = Math.round(raw * 100) / 100;
  const eligible = entry.balls >= rule.minBalls;
  const band = eligible ? (rule.bands.find((b) => bandMatches(b, value)) ?? null) : null;
  const overs = `${Math.floor(entry.balls / 6)}${entry.balls % 6 ? "." + (entry.balls % 6) : ""}`;

  return {
    player: entry.player,
    team: entry.team,
    kind: entry.kind,
    rule,
    ruleLabel: rule.label,
    value,
    unit: rule.unit,
    figures: entry.kind === "strikeRate" ? `${entry.runs} (${entry.balls})` : `${overs} ov · ${entry.runs} runs`,
    eligible,
    minimumVerbatim: rule.minimumVerbatim,
    band,
    points: eligible ? (band?.points ?? 0) : null,
  };
}

export function signed(n: number): string {
  const rounded = Number.isInteger(n) ? String(Math.abs(n)) : Math.abs(n).toFixed(1);
  if (n > 0) return `+${rounded}`;
  if (n < 0) return `−${rounded}`;
  return "0";
}

/** Short lens-tab teaser, e.g. "+12 Kohli". Derived, never hand-written. */
export function fantasyTeaser(entries: LedgerEntry[], rules: ScoringRules | null | undefined): string {
  const ledger = buildLedger(entries, rules);
  if (!ledger.available) return "Unavailable";
  const top = [...ledger.players].filter((p) => p.total !== null).sort((a, b) => (b.total ?? 0) - (a.total ?? 0))[0];
  if (!top || top.total === null) return "0 pts on this ball";
  const surname = top.player.split(" ").slice(-1)[0];
  return `${signed(top.total)} ${surname}`;
}
