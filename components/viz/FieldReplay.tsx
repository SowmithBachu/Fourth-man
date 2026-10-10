"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Shot } from "@/lib/types";
import { usePrefersReducedMotion } from "./hooks";

/*
 * A tiny perspective renderer for an illustrative ball replay.
 * Field coordinates: a unit circle (the rope), batter at the near end (+y, bottom of the screen),
 * bowler at the far end. Height h lifts the ball off the turf; its shadow stays on the ground.
 */

const W = 420;
const H = 250;
const CX = 210;
const CY = 124;
const RX = 178;
const RY = 96;
const LIFT = 105;

type P = { x: number; y: number };

// Rounded so server-rendered SVG attributes match the browser exactly (trig can differ in the last bits).
const round2 = (v: number) => Math.round(v * 100) / 100;

function project(fx: number, fy: number, h = 0): P {
  const depth = (fy + 1) / 2; // 0 far → 1 near
  const s = 0.8 + 0.2 * depth;
  return { x: round2(CX + fx * RX * s), y: round2(CY + fy * RY - h * LIFT * (0.85 + 0.15 * depth)) };
}

function ring(r: number, steps = 120): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const p = project(Math.cos(t) * r, Math.sin(t) * r);
    d += `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d + "Z";
}

function quad(points: [number, number][]): string {
  return points.map(([fx, fy], i) => {
    const p = project(fx, fy);
    return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join("") + "Z";
}

const BAT = { x: 0.012, y: 0.15 };
const STUMPS = { x: 0, y: 0.172 };
const RELEASE = { x: -0.01, y: -0.15 };

const DELIVERY_MS = 720;
const PAUSE_MS = 110;
const SHOT_MS: Record<Shot["result"], number> = { six: 1550, four: 1250, caught: 1350, runs: 1150, "freehit-byes": 1050 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.4);

function shotPath(shot: Shot) {
  const rad = (shot.angle * Math.PI) / 180;
  const dir = { x: Math.sin(rad), y: -Math.cos(rad) };
  const start = shot.result === "freehit-byes" ? STUMPS : BAT;
  let dist = shot.distance;
  if (shot.result === "six" || shot.result === "four") {
    // Solve |start + t·dir| = 1 so boundaries always land on (or just over) the rope.
    const b = start.x * dir.x + start.y * dir.y;
    const c = start.x * start.x + start.y * start.y - 1;
    const toRope = -b + Math.sqrt(b * b - c);
    dist = shot.result === "six" ? toRope + 0.1 : toRope - 0.015;
  }
  return { start, end: { x: start.x + dir.x * dist, y: start.y + dir.y * dist } };
}

interface Frame {
  fx: number;
  fy: number;
  h: number;
  phase: "delivery" | "shot" | "done";
}

function frameAt(ms: number, shot: Shot, path: ReturnType<typeof shotPath>): Frame {
  const endOfDelivery = shot.result === "freehit-byes" ? STUMPS : { x: BAT.x - 0.012, y: BAT.y - 0.012 };
  if (ms < DELIVERY_MS) {
    const u = ms / DELIVERY_MS;
    const h = shot.fullToss
      ? lerp(0.11, 0.06, u)
      : u < 0.7
        ? 0.11 * (1 - Math.pow(u / 0.7, 2))
        : 0.06 * Math.sin(((u - 0.7) / 0.3) * (Math.PI / 2));
    return { fx: lerp(RELEASE.x, endOfDelivery.x, u), fy: lerp(RELEASE.y, endOfDelivery.y, u), h, phase: "delivery" };
  }
  const shotStart = DELIVERY_MS + PAUSE_MS;
  if (ms < shotStart) return { fx: endOfDelivery.x, fy: endOfDelivery.y, h: 0.04, phase: "delivery" };

  const v = Math.min(1, (ms - shotStart) / SHOT_MS[shot.result]);
  const { start, end } = path;
  const ground = shot.result === "four" || shot.result === "freehit-byes";
  const k = ground ? easeOut(v) : v;
  let h = 0;
  if (shot.result === "six") h = 4 * 0.58 * v * (1 - v) + 0.04 * (1 - v);
  else if (shot.result === "runs") h = 4 * 0.3 * v * (1 - v) + 0.04 * (1 - v);
  else if (shot.result === "caught") h = 4 * 0.42 * v * (1 - v) + 0.07 * v;
  else if (shot.result === "four") h = v < 0.32 ? 4 * 0.14 * (v / 0.32) * (1 - v / 0.32) : 0;
  return { fx: lerp(start.x, end.x, k), fy: lerp(start.y, end.y, k), h, phase: v >= 1 ? "done" : "shot" };
}

function Stumps({ at, hot = false }: { at: P; hot?: boolean }) {
  return (
    <g stroke={hot ? "#ff5d5d" : "#f4ead2"} strokeWidth={1.4} strokeLinecap="round">
      {[-2.6, 0, 2.6].map((dx) => (
        <line key={dx} x1={at.x + dx} y1={at.y} x2={at.x + dx} y2={at.y - 9} />
      ))}
      {hot && <circle cx={at.x} cy={at.y - 6} r={9} fill="#ff5d5d" opacity={0.25} stroke="none" />}
    </g>
  );
}

function Figure({ at, color, scale = 1 }: { at: P; color: string; scale?: number }) {
  return (
    <g transform={`translate(${at.x} ${at.y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={5} ry={1.8} fill="#000" opacity={0.35} />
      <rect x={-2.2} y={-11} width={4.4} height={9} rx={2.2} fill={color} />
      <circle cx={0} cy={-13.5} r={2.6} fill={color} />
    </g>
  );
}

export default function FieldReplay({ shot, impact, impactLabel }: { shot: Shot; impact: string; impactLabel: string }) {
  const reduced = usePrefersReducedMotion();
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Frame["phase"]>("delivery");
  const ballRef = useRef<SVGCircleElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  const path = useMemo(() => shotPath(shot), [shot]);
  const endP = project(path.end.x, path.end.y);
  const statics = useMemo(
    () => ({
      stands: ring(1.2),
      rope: ring(1),
      inner: ring(0.45),
      pitch: quad([
        [-0.034, -0.19],
        [0.034, -0.19],
        [0.034, 0.19],
        [-0.034, 0.19],
      ]),
      stumpsNear: project(STUMPS.x, STUMPS.y),
      stumpsFar: project(0, -0.172),
      batter: project(BAT.x + 0.03, BAT.y + 0.005),
      bowler: project(RELEASE.x - 0.03, RELEASE.y - 0.06),
      keeper: project(0, 0.3),
    }),
    [],
  );

  useEffect(() => {
    const ball = ballRef.current;
    const shadow = shadowRef.current;
    const trail = trailRef.current;
    if (!ball || !shadow || !trail) return;

    const total = DELIVERY_MS + PAUSE_MS + SHOT_MS[shot.result];
    const shotStart = DELIVERY_MS + PAUSE_MS;

    // The trail is recomputed from the flight path up to `ms`, so skipped frames never leave gaps.
    const trailUpTo = (ms: number) => {
      if (ms <= shotStart) return "";
      const pts: string[] = [];
      for (let t = shotStart; t < ms; t += 25) {
        const f = frameAt(t, shot, path);
        const p = project(f.fx, f.fy, f.h);
        pts.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      }
      const f = frameAt(ms, shot, path);
      const p = project(f.fx, f.fy, f.h);
      pts.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      return pts.length > 1 ? "M" + pts.join("L") : "";
    };

    const draw = (ms: number) => {
      const f = frameAt(ms, shot, path);
      const p = project(f.fx, f.fy, f.h);
      const g = project(f.fx, f.fy, 0);
      const depth = (f.fy + 1) / 2;
      ball.setAttribute("cx", p.x.toFixed(1));
      ball.setAttribute("cy", p.y.toFixed(1));
      ball.setAttribute("r", (3.4 + depth * 1.6 + f.h * 2.2).toFixed(2));
      shadow.setAttribute("cx", g.x.toFixed(1));
      shadow.setAttribute("cy", g.y.toFixed(1));
      shadow.setAttribute("rx", Math.max(1.2, 4.2 - f.h * 4).toFixed(2));
      shadow.setAttribute("opacity", Math.max(0.12, 0.45 - f.h * 0.5).toFixed(2));
      trail.setAttribute("d", trailUpTo(ms));
      return f;
    };

    if (reduced) {
      draw(total);
      setPhase("done");
      return;
    }

    setPhase("delivery");
    draw(0);
    // The clock starts on the first painted frame, so the replay plays when it is actually visible.
    let t0: number | null = null;
    let raf = 0;
    let last: Frame["phase"] = "delivery";
    const tick = (now: number) => {
      if (t0 === null) t0 = now;
      const ms = Math.min(total, now - t0);
      const f = draw(ms);
      if (f.phase !== last) {
        last = f.phase;
        setPhase(f.phase);
      }
      if (ms < total) raf = requestAnimationFrame(tick);
      else setPhase("done");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, shot, path, reduced]);

  const done = phase === "done";
  const labelP = { x: Math.min(W - 60, Math.max(60, endP.x)), y: Math.min(H - 16, Math.max(30, endP.y - 18)) };
  const isBoundary = shot.result === "six" || shot.result === "four";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-[#05090a]">
      <div className="field-cam">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Illustrative replay: ${shot.label}`}>
          <defs>
            <radialGradient id="fm-turf" cx="50%" cy="55%" r="60%">
              <stop offset="0%" stopColor="#1f6a3f" />
              <stop offset="70%" stopColor="#134a2c" />
              <stop offset="100%" stopColor="#0c331f" />
            </radialGradient>
            <radialGradient id="fm-stands" cx="50%" cy="50%" r="55%">
              <stop offset="80%" stopColor="#121a22" />
              <stop offset="100%" stopColor="#05090a" />
            </radialGradient>
            <radialGradient id="fm-flood" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbe0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#fffbe0" stopOpacity="0" />
            </radialGradient>
            <clipPath id="fm-oval">
              <path d={statics.rope} />
            </clipPath>
          </defs>

          {/* Floodlight glows */}
          {[
            [24, 18],
            [W - 24, 18],
            [18, H - 20],
            [W - 18, H - 20],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={46} fill="url(#fm-flood)" />
          ))}

          <path d={statics.stands} fill="url(#fm-stands)" />
          <path d={statics.rope} fill="url(#fm-turf)" />
          {/* Mowing stripes */}
          <g clipPath="url(#fm-oval)" opacity={0.5}>
            {Array.from({ length: 12 }, (_, i) => {
              const a = project(-1.2, -1 + i * (2 / 12)).y;
              const b = project(-1.2, -1 + (i + 1) * (2 / 12)).y;
              return i % 2 ? <rect key={i} x={0} y={a} width={W} height={b - a} fill="#ffffff" opacity={0.05} /> : null;
            })}
          </g>
          <path d={statics.inner} fill="none" stroke="#ffffff" strokeOpacity={0.18} strokeDasharray="3 4" />
          <path d={statics.rope} fill="none" stroke="#e8f8b8" strokeOpacity={0.7} strokeWidth={1.6} />
          <path d={statics.pitch} fill="#c7b17f" opacity={0.85} />

          <Stumps at={statics.stumpsFar} />
          <Figure at={statics.bowler} color="#c9d2da" scale={0.8} />
          <Figure at={statics.keeper} color="#c9d2da" scale={1.05} />
          <Figure at={statics.batter} color="#c6f432" scale={1.05} />
          <Stumps at={statics.stumpsNear} hot={shot.result === "freehit-byes" && phase !== "delivery"} />

          {shot.result === "caught" && <Figure at={endP} color="#ff8a8a" scale={0.95} />}

          {/* Shot trail, shadow, ball */}
          <path ref={trailRef} fill="none" stroke="#c6f432" strokeWidth={2} strokeLinecap="round" strokeDasharray="1 5" opacity={0.85} />
          <ellipse ref={shadowRef} rx={4} ry={1.6} fill="#000" />
          <circle ref={ballRef} r={4.5} fill="#e23a46" stroke="#fff3f3" strokeWidth={1} className="replay-ball" />

          {done && isBoundary && (
            <circle cx={endP.x} cy={endP.y} r={14} fill="none" stroke="#c6f432" strokeWidth={2} className="burst" />
          )}

          {shot.noBall && (
            <g className={phase === "delivery" ? "opacity-0" : "pop-in"}>
              <rect x={statics.bowler.x - 34} y={statics.bowler.y - 40} width={68} height={18} rx={9} fill="#ff5d5d" />
              <text x={statics.bowler.x} y={statics.bowler.y - 27.5} textAnchor="middle" fontSize={10.5} fontWeight={800} fill="#fff">
                NO-BALL
              </text>
            </g>
          )}

          {done && (
            <g className="pop-in">
              <text
                x={labelP.x}
                y={labelP.y}
                textAnchor="middle"
                fontSize={shot.label.length > 10 ? 17 : 24}
                fontWeight={800}
                fill="#c6f432"
                stroke="#05090a"
                strokeWidth={4}
                paintOrder="stroke"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
              >
                {shot.label}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Impact overlay: the one number a beginner needs */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2.5 rounded-xl border border-white/10 bg-ink/75 px-3 py-2 backdrop-blur">
        <span className="text-[28px] font-semibold leading-none text-lime">{impact}</span>
        <span className="max-w-[140px] text-[12px] leading-tight text-fg/85">{impactLabel}</span>
      </div>

      <div className="absolute bottom-2.5 left-3 text-[10.5px] text-fg/50">Illustrative replay · not to scale</div>
      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="absolute bottom-2 right-2.5 flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/80 px-3 py-1.5 text-[12px] font-semibold text-fg backdrop-blur transition hover:border-lime hover:text-lime"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
          <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" />
        </svg>
        Replay
      </button>
    </div>
  );
}
