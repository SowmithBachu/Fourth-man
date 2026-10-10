"use client";

import { useCountUp } from "./hooks";

/**
 * Animated number. Renders `display` verbatim when the value isn't purely numeric
 * (e.g. "12 (21)" or "4-1-21-1"), so text values are never mangled.
 */
export default function CountUp({
  value,
  decimals,
  prefix = "",
  suffix = "",
  signed = false,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  signed?: boolean;
  className?: string;
}) {
  const v = useCountUp(value);
  const places = decimals ?? (Number.isInteger(value) ? 0 : 2);
  const rounded = Number(v.toFixed(places));
  const sign = signed ? (rounded > 0 ? "+" : rounded < 0 ? "−" : "") : rounded < 0 ? "−" : "";
  return (
    <span className={className}>
      {prefix}
      {sign}
      {Math.abs(rounded).toFixed(places)}
      {suffix}
    </span>
  );
}

/** Parses "362.50", "+6", "3794" into a number; returns null for mixed values like "12 (21)". */
export function numericValue(text: string): { value: number; decimals: number; prefix: string } | null {
  const m = /^([+]?)(\d+(?:\.(\d+))?)$/.exec(text.trim());
  if (!m) return null;
  return { value: Number(m[2]), decimals: m[3]?.length ?? 0, prefix: m[1] };
}
