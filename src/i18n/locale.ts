/**
 * Deux langues : le français à la racine (/gta-6), l'anglais sous /en.
 * Les textes sont écrits côte à côte : tr(locale)("Bonjour", "Hello").
 */
export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const HTML_LANG: Record<Locale, string> = { fr: "fr", en: "en" };
export const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

export const tr =
  (locale: Locale) =>
  (fr: string, en: string): string =>
    locale === "en" ? en : fr;

const BASE: Record<Locale, string> = { fr: "", en: "/en" };

/** Adresses de chaque page, par langue. */
export function paths(locale: Locale) {
  const b = BASE[locale];
  const en = locale === "en";
  return {
    home: b || "/",
    checklist: `${b}/gta-6`,
    category: (slug: string) => `${b}/gta-6/${slug}`,
    news: en ? `${b}/news` : "/nouveautes",
    guides: `${b}/guides`,
    guide: (slug: string) => `${b}/guides/${slug}`,
    contribute: en ? `${b}/contribute` : "/contribuer",
    backup: en ? `${b}/backup` : "/sauvegarde",
  };
}

export type Paths = ReturnType<typeof paths>;

export const numberFormat = (locale: Locale) =>
  new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR");

/** « 19 novembre » / « November 19 ». */
export const formatDay = (locale: Locale, iso: string) =>
  new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  });

/** « 19/11/2026 » / « 11/19/2026 » à partir d'une date AAAA-MM-JJ. */
export function formatShortDate(locale: Locale, ymd: string) {
  const [y, m, d] = ymd.split("-");
  return locale === "en" ? `${m}/${d}/${y}` : `${d}/${m}/${y}`;
}

export const LEGAL_NOTICE: Record<Locale, string> = {
  fr: "Site non officiel, non affilié à Rockstar Games ni à Take-Two Interactive.",
  en: "Unofficial fan site, not affiliated with Rockstar Games or Take-Two Interactive.",
};
