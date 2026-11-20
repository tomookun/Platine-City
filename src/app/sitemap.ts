import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/game";
import { allPageKeys, pathFor, type PageKey } from "@/i18n/alternates";
import { LOCALES } from "@/i18n/locale";

const priority: Record<PageKey["page"], number> = {
  home: 1,
  checklist: 0.9,
  category: 0.8,
  news: 0.7,
  guide: 0.7,
  guides: 0.6,
  contribute: 0.4,
  backup: 0,
};

/** Chaque page dans les deux langues, avec ses liens hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  return allPageKeys().flatMap((key) => {
    const languages = Object.fromEntries(
      LOCALES.flatMap((l) => {
        const path = pathFor(key, l);
        return path ? [[l, `${SITE_URL}${path}`]] : [];
      }),
    );
    return Object.values(languages).map((url) => ({
      url,
      changeFrequency:
        key.page === "guide" || key.page === "guides"
          ? ("weekly" as const)
          : ("daily" as const),
      priority: priority[key.page],
      alternates: { languages },
    }));
  });
}
