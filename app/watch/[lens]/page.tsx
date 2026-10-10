import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LensIcon } from "@/components/icons";
import MatchCard from "@/components/MatchCard";
import { Stepper, TopBar } from "@/components/Nav";
import { LENS_IDS, MATCHES, isLensId } from "@/lib/data";
import { LENSES, lensMeta } from "@/lib/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return LENS_IDS.map((lens) => ({ lens }));
}

export async function generateMetadata({ params }: { params: Promise<{ lens: string }> }): Promise<Metadata> {
  const { lens } = await params;
  if (!isLensId(lens)) return {};
  const meta = lensMeta(lens);
  return { title: `Pick a match · ${meta.name} lens — Fourth Man` };
}

export default async function MatchesPage({ params }: { params: Promise<{ lens: string }> }) {
  const { lens } = await params;
  if (!isLensId(lens)) notFound();
  const meta = lensMeta(lens);

  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pitch-texture pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[600px]" />

      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <TopBar
          center={
            <Stepper
              steps={[
                { label: `${meta.name} lens`, href: "/#personas", state: "done" },
                { label: "Pick a match", state: "current" },
                { label: "Freeze a moment", state: "todo" },
              ]}
            />
          }
        />

        <section className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <div className="text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: meta.accent }}>
              Step 2 · Pick a match
            </div>
            <h1 className="mt-2 font-display text-[44px] font-extrabold uppercase leading-[0.92] tracking-tight sm:text-[60px]">
              Pick a chase to watch as <span style={{ color: meta.accent }}>{meta.withArticle}</span>
            </h1>
            <p className="mt-3 text-[16px] leading-relaxed text-fg/80">
              Famous last-over finishes, replayed ball by ball. You can switch lens at any time.
            </p>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Watching as</div>
            <nav aria-label="Switch lens" className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-panel p-1.5">
              {LENSES.map((l) => {
                const active = l.id === lens;
                return (
                  <Link
                    key={l.id}
                    href={`/watch/${l.id}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                      active ? "text-ink" : "text-fg/75 hover:bg-panel-2 hover:text-fg"
                    }`}
                    style={active ? { background: l.accent } : undefined}
                  >
                    <LensIcon id={l.id} className="h-4 w-4" />
                    {l.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {MATCHES.map((bundle) => (
            <li key={bundle.match.id} className="h-full">
              <MatchCard bundle={bundle} lens={lens} />
            </li>
          ))}
        </ul>

        <p className="border-t border-line pt-5 text-[12.5px] text-muted">
          “Verified data” matches use ESPNcricinfo ball-by-ball records. “Illustrative” replays use simplified demo data. Fantasy points
          everywhere come from the official Dream11 T20 points table.
        </p>
      </div>
    </div>
  );
}
