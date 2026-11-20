import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChecklistView } from "@/components/checklist-view";
import { SITE_URL, categoryPath, game, getCategory } from "@/data/game";

export function generateStaticParams() {
  return game.categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/gta-6/[slug]">): Promise<Metadata> {
  const cat = getCategory((await params).slug);
  if (!cat) return {};
  return {
    title:
      cat.items.length > 0
        ? `GTA 6 ${cat.name} : liste complète (${cat.items.length}) et checklist 100 %`
        : `GTA 6 ${cat.name} : combien pour le 100 % ? (${cat.required} requis)`,
    description:
      `${cat.name} dans GTA 6 : ${cat.required} requis pour le 100 %${cat.required < cat.total ? ` sur ${cat.total}` : ""}. ${cat.description}`.slice(
        0,
        160,
      ),
    alternates: { canonical: categoryPath(cat.slug) },
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/gta-6/[slug]">) {
  const cat = getCategory((await params).slug);
  if (!cat) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} de GTA 6`,
    numberOfItems: cat.items.length,
    url: `${SITE_URL}${categoryPath(cat.slug)}`,
    itemListElement: cat.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.title,
    })),
  };

  return (
    <>
      {cat.items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <ChecklistView slug={cat.slug} />
    </>
  );
}
