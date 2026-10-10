"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** False on the first paint, true one frame later: lets CSS transitions animate from their start state. */
export function useEntered(): boolean {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(id);
  }, []);
  return entered;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Counts from the previous value to `target`. The server HTML carries the real value;
 * on the client the count starts from 0 before the first paint. Jumps straight there when motion is reduced.
 */
export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(target);
  // Last value actually shown, so a re-target (e.g. Captain ×2) animates from where the number is.
  const shown = useRef(0);
  const reduced = usePrefersReducedMotion();

  useBeforePaint(() => {
    if (reduced) {
      shown.current = target;
      setValue(target);
      return;
    }
    const origin = shown.current;
    setValue(origin);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const v = origin + (target - origin) * easeOutCubic(t);
      shown.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return value;
}
