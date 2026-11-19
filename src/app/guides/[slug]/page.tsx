import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { ReliabilityBadge } from "@/components/reliability-badge";
import { getGuide, publishedGuides, type Block } from "@/content/guides";
import { SITE_NAME, SITE_URL } from "@/data/game";

export function generateStaticParams() {
  return publishedGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { type: "article", modifiedTime: g.updatedAt },
  };
}

function Render({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[17px] leading-relaxed">{block.text}</p>;
    case "h2":
      return <h2 className="mt-2 font-display text-[25px] font-bold">{block.text}</h2>;
    case "steps":
      return (
        <ol className="flex list-decimal flex-col gap-2 pl-6 text-[17px] marker:font-bold marker:text-rose">
          {block.items.map((t) => <li key={t}>{t}</li>)}
        </ol>
      );
    case "list":
      return (
        <ul className="flex list-disc flex-col gap-2 pl-6 text-[17px] marker:text-lagon">
          {block.items.map((t) => <li key={t}>{t}</li>)}
        </ul>
      );
    case "tip":
      return <p className="rounded-feuille bg-surface p-4 text-[17px]">{block.text}</p>;
  }
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = getGuide((await params).slug);
  if (!g) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    dateModified: g.updatedAt,
    inLanguage: "fr-FR",
    url: `${SITE_URL}/guides/${g.slug}`,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <article className="flex flex-col gap-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/guides" className="-my-2 inline-flex min-h-11 items-center self-start text-[15px] text-brume">← Guides</Link>
      <h1 className="font-display text-[39px] font-extrabold leading-[0.95]">{g.title}</h1>
      <ReliabilityBadge value={g.reliability} about={g.about} />
      {g.body.map((b, i) => <Render key={i} block={b} />)}
      <AdSlot id={`guide-${g.slug}`} />
    </article>
  );
}
