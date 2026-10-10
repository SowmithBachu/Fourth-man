import type { ScoreState, TimelineBall } from "./types";

/** 113 legal balls -> "18.5"; 120 -> "20". */
export function oversLabel(balls: number): string {
  const overs = Math.floor(balls / 6);
  const rem = balls % 6;
  return rem === 0 ? String(overs) : `${overs}.${rem}`;
}

export interface Equation {
  need: number;
  ballsLeft: number;
  /** Required runs per over; null once the chase is won or no balls remain. */
  requiredRate: number | null;
  /** Required runs per ball; null once the chase is won or no balls remain. */
  perBall: number | null;
  won: boolean;
}

export function equation(state: ScoreState, target: number, totalBalls: number): Equation {
  const need = Math.max(0, target - state.runs);
  const ballsLeft = Math.max(0, totalBalls - state.balls);
  const won = need === 0;
  const live = !won && ballsLeft > 0;
  return {
    need,
    ballsLeft,
    requiredRate: live ? (need / ballsLeft) * 6 : null,
    perBall: live ? need / ballsLeft : null,
    won,
  };
}

export function currentRate(state: ScoreState): number {
  return state.balls === 0 ? 0 : (state.runs / state.balls) * 6;
}

export function fmt2(n: number | null): string {
  return n === null ? "—" : n.toFixed(2);
}

export function strikeRate(runs: number, balls: number): number {
  return balls === 0 ? 0 : (runs / balls) * 100;
}

export type Severity = "won" | "good" | "warning" | "critical";

/** Required-rate pressure band used by the gauges. */
export function rateSeverity(requiredRate: number | null, won: boolean): Severity {
  if (won) return "won";
  if (requiredRate === null) return "critical";
  if (requiredRate < 12) return "good";
  if (requiredRate < 18) return "warning";
  return "critical";
}

export interface ReplayPoint {
  ball: TimelineBall;
  /** State after this delivery. */
  after: ScoreState;
  need: number;
  ballsLeft: number;
}

/** Replays the timeline so charts can plot the chase delivery by delivery. */
export function replay(timeline: TimelineBall[], start: ScoreState, target: number, totalBalls: number): ReplayPoint[] {
  let s = { ...start };
  return timeline.map((ball) => {
    s = {
      runs: s.runs + ball.runs,
      wickets: s.wickets + (ball.kind === "wicket" ? 1 : 0),
      balls: s.balls + (ball.legal ? 1 : 0),
    };
    return { ball, after: { ...s }, need: Math.max(0, target - s.runs), ballsLeft: Math.max(0, totalBalls - s.balls) };
  });
}
