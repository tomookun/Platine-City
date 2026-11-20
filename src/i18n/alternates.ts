import type { Metadata } from "next";
import { getGuideByKey, publishedGuides } from "@/content/guides";
import { categorySlug, game } from "@/data/game";
import { LOCALES, paths, type Locale } from "./locale";

/** Une page « logique », identique dans les deux langues. */
export type PageKey =
  | { page: "home" | "checklist" | "news" | "guides" | "contribute" | "backup" }
  | { page: "category"; id: string }
  | { page: "guide"; key: string };

/** Adresse de cette page dans une langue donnée (undefined si elle n'existe pas). */
export function pathFor(key: PageKey, locale: Locale): string | undefined {
  const p = paths(locale);
  switch (key.page) {
    case "category": {
      const slug = categorySlug(key.id, locale);
      return slug ? p.category(slug) : undefined;
    }
    case "guide": {
      const g = getGuideByKey(key.key, locale);
      return g ? p.guide(g.slug) : undefined;
    }
    default:
      return p[key.page];
  }
}

/** canonical + hreflang (fr, en, x-default = fr). */
export function alternates(
  key: PageKey,
  locale: Locale,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const path = pathFor(key, l);
    if (path) languages[l] = path;
  }
  if (languages.fr) languages["x-default"] = languages.fr;
  return { canonical: pathFor(key, locale), languages };
}

/** Toutes les pages publiques du site, sous forme logique (sitemap, hors ligne). */
export function allPageKeys(): PageKey[] {
  const guideKeys = new Set(
    LOCALES.flatMap((l) => publishedGuides(l).map((g) => g.key)),
  );
  return [
    { page: "home" },
    { page: "checklist" },
    ...game.categories.map((c) => ({ page: "category" as const, id: c.id })),
    { page: "news" },
    { page: "guides" },
    ...[...guideKeys].map((key) => ({ page: "guide" as const, key })),
    { page: "contribute" },
  ];
}
