import raw from "./game.json";
import type { Category, GameData } from "./types";

export const game = raw as GameData;

export const getCategory = (slug: string): Category | undefined =>
  game.categories.find((c) => c.slug === slug);

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
