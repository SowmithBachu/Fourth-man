"use client";

import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./hooks";

/** Wraps content in a card that tilts toward the pointer in 3D, with a soft glare. */
export default function TiltCard({ children, className = "", max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * max * 1.2).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--glare", "1");
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glare", "0");
  };

  return (
    <div className="tilt-stage h-full">
      <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt-card relative h-full ${className}`}>
        {children}
        <span aria-hidden className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit]" />
      </div>
    </div>
  );
}
