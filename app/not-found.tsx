import Link from "next/link";
import Ball3D from "@/components/landing/Ball3D";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Ball3D />
      <h1 className="font-display text-[48px] font-extrabold uppercase leading-none tracking-tight">Dropped catch</h1>
      <p className="max-w-[420px] text-[16px] text-fg/80">That page went straight through the fielder&apos;s hands. Let&apos;s get you back to the middle.</p>
      <Link href="/" className="rounded-full bg-lime px-6 py-3 text-[15px] font-bold text-lime-ink transition hover:brightness-110">
        Back to Fourth Man
      </Link>
    </div>
  );
}
