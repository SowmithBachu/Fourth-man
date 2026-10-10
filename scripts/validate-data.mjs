// Guards the "no invented numbers" promise. Runs before every build (npm run prebuild),
// so a Vercel deploy fails instead of shipping inconsistent scores or unknown rules.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const data = load("data/moments.json");
const rules = load("data/scoring-rules.json");
const errors = [];
const fail = (msg) => errors.push(msg);

// ---- Scoring rules ----
if (rules.meta?.verified !== true) fail("scoring-rules.json: meta.verified must be true");
const ruleIds = new Set();
for (const r of rules.rules ?? []) {
  if (ruleIds.has(r.id)) fail(`scoring-rules.json: duplicate rule id ${r.id}`);
  ruleIds.add(r.id);
  if (typeof r.points !== "number") fail(`scoring-rules.json: ${r.id} has no numeric points`);
  if (!r.verbatim) fail(`scoring-rules.json: ${r.id} is missing its verbatim source text`);
}
for (const key of ["economyRate", "strikeRate"]) {
  const rr = rules[key];
  if (!rr?.bands?.length || typeof rr.minBalls !== "number") fail(`scoring-rules.json: ${key} is incomplete`);
}
if (rules.multipliers?.captain?.value !== 2 || rules.multipliers?.viceCaptain?.value !== 1.5) {
  fail("scoring-rules.json: captain/vice-captain multipliers differ from the official 2x / 1.5x");
}

// ---- Matches ----
const same = (a, b) => a && b && a.runs === b.runs && a.wickets === b.wickets && a.balls === b.balls;
const fmt = (x) => (x ? `${x.runs}/${x.wickets} (${x.balls}b)` : "∅");
const SHOT_RESULTS = new Set(["six", "four", "caught", "freehit-byes", "runs"]);
const BALL_KINDS = new Set(["run", "dot", "six", "four", "wicket", "noball", "wide", "byes"]);

function walkBilingual(node, path) {
  if (Array.isArray(node)) return node.forEach((n, i) => walkBilingual(n, `${path}[${i}]`));
  if (node && typeof node === "object") {
    const keys = Object.keys(node);
    if (keys.includes("en") || keys.includes("hi")) {
      for (const lang of ["en", "hi"]) {
        if (typeof node[lang] !== "string" || !node[lang].trim()) fail(`${path}: missing "${lang}" text`);
      }
      return;
    }
    for (const k of keys) walkBilingual(node[k], `${path}.${k}`);
  }
}

if (!Array.isArray(data.matches) || data.matches.length === 0) fail("moments.json: matches[] is empty");
const matchIds = new Set();
let momentCount = 0;

for (const bundle of data.matches ?? []) {
  const { match, timeline, timelineStart, moments } = bundle;
  const tag = match?.id ?? "?";
  if (!/^[a-z0-9-]+$/.test(tag)) fail(`${tag}: match id must be URL-safe`);
  if (matchIds.has(tag)) fail(`${tag}: duplicate match id`);
  matchIds.add(tag);
  for (const side of ["chasing", "defending"]) {
    if (!/^#[0-9a-f]{6}$/i.test(match[side]?.color ?? "")) fail(`${tag}: ${side}.color must be #rrggbb`);
  }
  if (!["verified", "illustrative"].includes(match.dataNote?.kind)) fail(`${tag}: dataNote.kind must be verified|illustrative`);
  walkBilingual({ hook: match.hook, resultBanner: match.resultBanner }, `${tag}.match`);

  // Replay the ball-by-ball: every moment's before/after must fall out of it.
  const stateBefore = new Map();
  const stateAfter = new Map();
  const ballIds = new Set();
  let s = { ...timelineStart };
  for (const ball of timeline) {
    if (ballIds.has(ball.id)) fail(`${tag}: duplicate timeline id ${ball.id}`);
    ballIds.add(ball.id);
    if (!BALL_KINDS.has(ball.kind)) fail(`${tag}: ball ${ball.id} has unknown kind ${ball.kind}`);
    stateBefore.set(ball.id, { ...s });
    s = {
      runs: s.runs + ball.runs,
      wickets: s.wickets + (ball.kind === "wicket" ? 1 : 0),
      balls: s.balls + (ball.legal ? 1 : 0),
    };
    stateAfter.set(ball.id, { ...s });
  }
  const last = timeline[timeline.length - 1];
  if (s.runs < match.target) fail(`${tag}: timeline ends on ${s.runs}, short of the target ${match.target}`);
  if (s.balls > match.totalBalls) fail(`${tag}: timeline uses ${s.balls} balls, more than ${match.totalBalls}`);
  if (last && stateBefore.get(last.id).runs >= match.target) fail(`${tag}: target reached before the final ball`);

  for (const m of moments) {
    momentCount++;
    const where = `${tag}/${m.id}`;
    const ball = timeline.find((b) => b.id === m.timelineId);
    if (!ball) {
      fail(`${where}: timelineId ${m.timelineId} not in timeline`);
      continue;
    }
    if (ball.momentId !== m.id) fail(`${where}: timeline ball ${ball.id} points to ${ball.momentId}`);
    if (!same(m.before, stateBefore.get(ball.id))) fail(`${where}: before ${fmt(m.before)} ≠ replay ${fmt(stateBefore.get(ball.id))}`);
    if (!same(m.after, stateAfter.get(ball.id))) fail(`${where}: after ${fmt(m.after)} ≠ replay ${fmt(stateAfter.get(ball.id))}`);

    // Batter's own runs must match the Run points we award them.
    const batRuns = m.lenses.fantasy.ledger
      .filter((e) => e.player === m.striker.name && e.ruleId === "bat.run")
      .reduce((sum, e) => sum + e.count, 0);
    const delta = m.striker.after.runs - m.striker.before.runs;
    if (batRuns !== delta) fail(`${where}: striker scored ${delta} but ledger awards Run ×${batRuns}`);

    for (const e of m.lenses.fantasy.ledger) {
      if (!ruleIds.has(e.ruleId)) fail(`${where}: ledger uses unknown rule ${e.ruleId}`);
      if (!Number.isInteger(e.count) || e.count < 1) fail(`${where}: ledger count for ${e.ruleId} must be a positive integer`);
    }
    for (const st of m.lenses.fantasy.settlement ?? []) {
      if (!["strikeRate", "economy"].includes(st.kind) || !(st.balls > 0)) fail(`${where}: bad settlement entry for ${st.player}`);
    }
    for (const f of m.lenses.statistician.facts) {
      if (!match.sources[f.source]) fail(`${where}: fact "${f.value}" cites unknown source ${f.source}`);
    }
    for (const o of m.lenses.strategist.options) {
      for (const k of ["risk", "reward"]) {
        if (!(o[k] >= 0 && o[k] <= 100)) fail(`${where}: option "${o.label.en}" ${k} must be 0–100`);
      }
    }
    if (!m.lenses.strategist.options.some((o) => o.played)) fail(`${where}: no strategist option is marked played`);
    if (!SHOT_RESULTS.has(m.shot?.result)) fail(`${where}: shot.result must be one of ${[...SHOT_RESULTS].join(", ")}`);
    if (typeof m.shot?.angle !== "number" || typeof m.shot?.distance !== "number") fail(`${where}: shot needs numeric angle and distance`);
    walkBilingual(m, where);
  }
}

if (errors.length) {
  console.error(`\n✗ Data validation failed (${errors.length}):\n  - ${errors.join("\n  - ")}\n`);
  process.exit(1);
}
console.log(
  `✓ Data valid: ${data.matches.length} matches, ${momentCount} moments replay cleanly from their ball-by-ball; ${ruleIds.size} verified rules.`,
);
