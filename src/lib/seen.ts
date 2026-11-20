import type { Change } from "@/data/changelog";

/**
 * Ce que le joueur a déjà vu, pour les pastilles « Nouveau ». Fonctions pures.
 *
 * - `since` : première visite. Rien de plus ancien n'est « nouveau » (un
 *   nouveau venu n'est pas noyé sous les pastilles).
 * - `feed` / `feedPrev` : visite actuelle et précédente du fil. Pendant une
 *   visite, on compare à `feedPrev`, pour que les pastilles restent affichées.
 * - `categories[id]` : dernière ouverture de chaque catégorie.
 */
export type Seen = {
  v: 1;
  since: string;
  feed?: string;
  feedPrev?: string;
  categories: Record<string, string>;
};

/** Écart au-delà duquel un retour sur l'accueil compte comme une nouvelle visite. */
export const VISIT_GAP_MS = 30 * 60 * 1000;

export const emptySeen = (now = new Date()): Seen => ({
  v: 1,
  since: now.toISOString(),
  categories: {},
});

const isIso = (s: unknown): s is string =>
  typeof s === "string" && !Number.isNaN(Date.parse(s));

/** Lit une valeur stockée ; null si absente ou invalide. */
export function parseSeen(raw: string | null | undefined): Seen | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    if (o?.v !== 1 || !isIso(o.since)) return null;
    const categories: Record<string, string> = {};
    if (o.categories && typeof o.categories === "object") {
      for (const [k, val] of Object.entries(o.categories))
        if (isIso(val)) categories[k] = val;
    }
    return {
      v: 1,
      since: o.since,
      ...(isIso(o.feed) ? { feed: o.feed } : {}),
      ...(isIso(o.feedPrev) ? { feedPrev: o.feedPrev } : {}),
      categories,
    };
  } catch {
    return null;
  }
}

/** Seuil du fil pour la visite en cours. */
const feedThreshold = (s: Seen) => s.feedPrev ?? s.since;

export const isChangeNew = (s: Seen, c: Change) => c.at > feedThreshold(s);

export const newChanges = (s: Seen, log: Change[]) =>
  log.filter((c) => isChangeNew(s, c));

/** Une catégorie a du nouveau si une entrée la cite après sa dernière ouverture. */
export const isCategoryNew = (s: Seen, categoryId: string, log: Change[]) => {
  const last = s.categories[categoryId] ?? s.since;
  return log.some((c) => c.categories?.includes(categoryId) && c.at > last);
};

/** Dernière entrée qui concerne une catégorie. */
export const latestChangeFor = (categoryId: string, log: Change[]) =>
  log.find((c) => c.categories?.includes(categoryId));

/**
 * Enregistre l'ouverture du fil. Dans la même visite (moins de 30 min),
 * rien ne bouge : les pastilles restent jusqu'à la visite suivante.
 */
export function markFeedSeen(s: Seen, now = new Date()): Seen {
  if (s.feed && now.getTime() - Date.parse(s.feed) < VISIT_GAP_MS) return s;
  return { ...s, feedPrev: s.feed ?? s.since, feed: now.toISOString() };
}

export const markCategorySeen = (
  s: Seen,
  categoryId: string,
  now = new Date(),
): Seen => ({
  ...s,
  categories: { ...s.categories, [categoryId]: now.toISOString() },
});
