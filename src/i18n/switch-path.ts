import { publishedGuides } from "@/content/guides";
import { getGame } from "@/data/game";
import { pathFor, type PageKey } from "./alternates";
import { LOCALES, paths, type Locale } from "./locale";

/** Retrouve quelle page logique correspond à une adresse, et dans quelle langue. */
export function parsePath(
  pathname: string,
): { locale: Locale; key: PageKey } | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const locale of LOCALES) {
    const p = paths(locale);
    for (const page of [
      "home",
      "checklist",
      "news",
      "guides",
      "contribute",
      "backup",
    ] as const) {
      if (clean === p[page]) return { locale, key: { page } };
    }
    const cat = getGame(locale).categories.find(
      (c) => clean === p.category(c.slug),
    );
    if (cat) return { locale, key: { page: "category", id: cat.id } };
    const guide = publishedGuides(locale).find(
      (g) => clean === p.guide(g.slug),
    );
    if (guide) return { locale, key: { page: "guide", key: guide.key } };
  }
  return null;
}

/** Adresse de la même page dans l'autre langue (accueil si elle n'existe pas). */
export function switchPath(pathname: string, to: Locale): string {
  const parsed = parsePath(pathname);
  return (parsed && pathFor(parsed.key, to)) ?? paths(to).home;
}
