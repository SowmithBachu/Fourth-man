import type { LensId } from "@/lib/types";

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function IconBeginner({ className }: IconProps) {
  // Light bulb: "make it click".
  return (
    <svg {...base} className={className}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function IconStrategist({ className }: IconProps) {
  // Tactics board: field oval, a cross and an arrow.
  return (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="12" rx="9.5" ry="8" />
      <path d="M7 9l2 2M9 9l-2 2" />
      <path d="M10.5 15.5c2.5-.2 4.6-1.8 5.6-4.4" />
      <path d="M14.4 10.6l1.8.4.3-1.9" />
    </svg>
  );
}

export function IconStatistician({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20h16" />
      <rect x="5.5" y="11" width="3" height="6.5" rx="0.6" />
      <rect x="10.5" y="6" width="3" height="11.5" rx="0.6" />
      <rect x="15.5" y="13.5" width="3" height="4" rx="0.6" />
    </svg>
  );
}

export function IconFantasy({ className }: IconProps) {
  // Trophy.
  return (
    <svg {...base} className={className}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H5a3 3 0 0 0 3 3.5M16 6h3a3 3 0 0 1-3 3.5" />
      <path d="M12 13v3.5M8.5 20h7M10 16.5h4l.5 3.5h-5l.5-3.5Z" />
    </svg>
  );
}

export function LensIcon({ id, className }: { id: LensId; className?: string }) {
  switch (id) {
    case "beginner":
      return <IconBeginner className={className} />;
    case "strategist":
      return <IconStrategist className={className} />;
    case "statistician":
      return <IconStatistician className={className} />;
    case "fantasy":
      return <IconFantasy className={className} />;
  }
}

export function IconLock({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconPause({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

export function IconArrow({ className, dir }: IconProps & { dir: "left" | "right" }) {
  return (
    <svg {...base} className={className}>
      {dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

export function IconInfo({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconBlock({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  );
}

export function IconExternal({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Red leather ball with a stitched seam: used as the Hinglish switch knob. */
export function CricketBall({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <radialGradient id="fm-ball" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="55%" stopColor="#d3202f" />
          <stop offset="100%" stopColor="#7d0c16" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="url(#fm-ball)" />
      <path d="M9 3.5c4.5 7 4.5 18 0 25" fill="none" stroke="#f6e7d0" strokeWidth="1.2" />
      <path d="M23 3.5c-4.5 7-4.5 18 0 25" fill="none" stroke="#f6e7d0" strokeWidth="1.2" />
      <path
        d="M9.8 6.5l1.8-.6M11 10l1.9-.3M11.6 14l1.9-.1M11.6 18l1.9.1M11 22l1.9.3M9.8 25.5l1.8.6M22.2 6.5l-1.8-.6M21 10l-1.9-.3M20.4 14l-1.9-.1M20.4 18l-1.9.1M21 22l-1.9.3M22.2 25.5l-1.8.6"
        stroke="#f6e7d0"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
