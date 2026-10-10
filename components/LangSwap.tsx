"use client";

import { useState, type ReactNode } from "react";

/**
 * Plays the Hinglish "commentary wipe" only when the language actually flips,
 * not when the wrapper mounts because the moment or lens changed.
 */
export default function LangSwap({
  pulse,
  children,
  className = "",
}: {
  pulse: number;
  children: ReactNode;
  className?: string;
}) {
  const [mountedAt] = useState(pulse);
  const animate = pulse !== mountedAt;

  return (
    <div className={`relative ${className}`}>
      <div key={pulse} className={animate ? "anim-wipe" : undefined}>
        {children}
      </div>
      {animate && <span key={`scan-${pulse}`} className="scan-bar" aria-hidden />}
    </div>
  );
}
