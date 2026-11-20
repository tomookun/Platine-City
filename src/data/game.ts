import type { Locale } from "@/i18n/locale";
import { CATEGORIES_EN, ITEMS_EN, NOTES_EN, SECTIONS_EN } from "./game-en";
import raw from "./game.json";
import type { Category, GameData } from "./types";

/** Données de référence (français). Les nombres et identifiants sont communs aux deux langues. */
export const game = raw as GameData;

function translateWhere(where: string | undefined): string | undefined {
  if (!where) return where;
  const [chapter, note] = where.split(" · ");
  const ch = chapter.replace(/^Chapitre (\d+)$/, "Chapter $1");
  return note ? `${ch} · ${NOTES_EN[note] ?? note}` : ch;
}

const english: GameData = {
  ...game,
  sections: game.sections.map((s) => ({
    ...s,
    name: SECTIONS_EN[s.id] ?? s.name,
  })),
  categories: game.categories.map((c) => {
    const t = CATEGORIES_EN[c.id];
    return {
      ...c,
      ...(t ?? {}),
      items: c.items.map((it) => ({
        ...it,
        title: ITEMS_EN[it.id]?.title ?? it.title,
        where: ITEMS_EN[it.id]?.where ?? translateWhere(it.where),
      })),
    };
  }),
};

export const getGame = (locale: Locale): GameData =>
  locale === "en" ? english : game;

export const getCategory = (
  slug: string,
  locale: Locale = "fr",
): Category | undefined =>
  getGame(locale).categories.find((c) => c.slug === slug);

/** Slug de la même catégorie dans l'autre langue (pour le sélecteur de langue). */
export const categorySlug = (id: string, locale: Locale) =>
  getGame(locale).categories.find((c) => c.id === id)?.slug;

export const SITE_NAME = "Platine City";

/** Le mot-clé du jeu est dans l'URL (SEO) : /gta-6/cascades. */
export const GAME_BASE = "/gta-6";
export const categoryPath = (slug: string) => `${GAME_BASE}/${slug}`;
/**
 * URL publique : NEXT_PUBLIC_SITE_URL (ton domaine) en priorité, sinon
 * l'adresse de production fournie par Vercel, sinon localhost en dev.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
export const LEGAL_NOTICE =
  "Site non officiel, non affilié à Rockstar Games ni à Take-Two Interactive.";
