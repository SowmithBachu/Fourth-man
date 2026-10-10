"use client";

import { useId, useState, type ReactNode } from "react";

/** Secondary detail stays folded away so each lens leads with one answer and one visual. */
export default function More({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-[12.5px] font-semibold text-fg/80 transition hover:border-fg/60 hover:text-fg"
      >
        <span
          aria-hidden
          className={`flex h-4 w-4 items-center justify-center rounded-full bg-fg/10 text-[13px] leading-none transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
        {label}
      </button>
      {open && (
        <div id={id} className="anim-rise mt-3">
          {children}
        </div>
      )}
    </div>
  );
}
