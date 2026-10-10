import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FourthMan from "@/components/FourthMan";
import { LENS_IDS, MATCHES, RULES, getMatch, isLensId } from "@/lib/data";
import { lensMeta } from "@/lib/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return LENS_IDS.flatMap((lens) => MATCHES.map((b) => ({ lens, match: b.match.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ lens: string; match: string }> }): Promise<Metadata> {
  const { lens, match } = await params;
  const bundle = getMatch(match);
  if (!bundle || !isLensId(lens)) return {};
  return {
    title: `${bundle.match.shortTitle} · ${lensMeta(lens).name} lens — Fourth Man`,
    description: bundle.match.hook.en,
  };
}

export default async function MatchPage({ params }: { params: Promise<{ lens: string; match: string }> }) {
  const { lens, match } = await params;
  const bundle = getMatch(match);
  if (!bundle || !isLensId(lens)) notFound();

  // Everything is local and deterministic: each lens × match page is prerendered at build time.
  return <FourthMan key={`${lens}:${match}`} bundle={bundle} rules={RULES} initialLens={lens} />;
}
