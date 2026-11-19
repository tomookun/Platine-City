import type { MetadataRoute } from "next";
import { publishedGuides } from "@/content/guides";
import { GAME_BASE, SITE_URL, categoryPath, game } from "@/data/game";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}${GAME_BASE}`, changeFrequency: "daily", priority: 0.9 },
    ...game.categories.map((c) => ({
      url: `${SITE_URL}${categoryPath(c.slug)}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/nouveautes`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.6 },
    ...publishedGuides().map((g) => ({
      url: `${SITE_URL}/guides/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
