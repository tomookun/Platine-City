import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChecklistView } from "@/components/checklist-view";
import { SITE_URL, categoryPath, game, getCategory } from "@/data/game";

export function generateStaticParams() {
  return game.categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gta-6/[slug]">): Promise<Metadata> {
  const cat = getCategory((await params).slug);
  if (!cat) return {};
  return {
    title: `GTA 6 ${cat.name} : liste complète (${cat.total}) et checklist 100 %`,
    description: `Les ${cat.total} ${cat.name.toLowerCase()} de GTA 6 à cocher pour le 100 %. ${cat.description}`,
    alternates: { canonical: categoryPath(cat.slug) },
  };
}

export default async function CategoryPage({ params }: PageProps<"/gta-6/[slug]">) {
  const cat = getCategory((await params).slug);
  if (!cat) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} de GTA 6`,
    numberOfItems: cat.total,
    url: `${SITE_URL}${categoryPath(cat.slug)}`,
    itemListElement: cat.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ChecklistView slug={cat.slug} />
    </>
  );
}
