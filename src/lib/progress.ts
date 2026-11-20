import type { Category, GameData } from "@/data/types";

/**
 * Progression d'un joueur. Fonctions pures, sans accès au stockage.
 *
 * Règle centrale : pour chaque catégorie, `counts[id]` est le nombre
 * d'éléments faits. Il vaut toujours au moins le nombre d'éléments cochés
 * dans la liste détaillée (la liste peut être incomplète) et au plus `total`.
 */
export type Progress = {
  v: 1;
  /** Ids des éléments cochés. */
  checked: Record<string, true>;
  /** Nombre d'éléments faits par catégorie. */
  counts: Record<string, number>;
  /** Dernière catégorie touchée, pour « Reprendre ». */
  lastCategoryId?: string;
  updatedAt: string;
};

export const emptyProgress = (now = new Date()): Progress => ({
  v: 1,
  checked: {},
  counts: {},
  updatedAt: now.toISOString(),
});

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export function checkedInCategory(p: Progress, cat: Category): number {
  return cat.items.reduce((acc, it) => acc + (p.checked[it.id] ? 1 : 0), 0);
}

export function doneInCategory(p: Progress, cat: Category): number {
  const min = checkedInCategory(p, cat);
  return clamp(p.counts[cat.id] ?? min, min, cat.total);
}

function findCategoryOfItem(data: GameData, itemId: string) {
  return data.categories.find((c) => c.items.some((i) => i.id === itemId));
}

export function toggleItem(
  data: GameData,
  p: Progress,
  itemId: string,
  now = new Date(),
): Progress {
  const cat = findCategoryOfItem(data, itemId);
  if (!cat) return p;
  const wasChecked = !!p.checked[itemId];
  const before = doneInCategory(p, cat);
  const checked = { ...p.checked };
  if (wasChecked) delete checked[itemId];
  else checked[itemId] = true;
  const next: Progress = { ...p, checked };
  const min = checkedInCategory(next, cat);
  const count = clamp(before + (wasChecked ? -1 : 1), min, cat.total);
  return {
    ...next,
    counts: { ...p.counts, [cat.id]: count },
    lastCategoryId: cat.id,
    updatedAt: now.toISOString(),
  };
}

export function setCount(
  cat: Category,
  p: Progress,
  value: number,
  now = new Date(),
): Progress {
  if (!Number.isFinite(value)) return p;
  const min = checkedInCategory(p, cat);
  return {
    ...p,
    counts: { ...p.counts, [cat.id]: clamp(Math.round(value), min, cat.total) },
    lastCategoryId: cat.id,
    updatedAt: now.toISOString(),
  };
}

export const increment = (
  cat: Category,
  p: Progress,
  by = 1,
  now = new Date(),
) => setCount(cat, p, doneInCategory(p, cat) + by, now);

export type Ratio = { done: number; total: number; percent: number };

const ratio = (done: number, total: number): Ratio => ({
  done,
  total,
  percent: total === 0 ? 0 : Math.floor((done / total) * 100),
});

/** Objectif du 100 % : `required`, jamais plus que ce qui existe. */
const goal = (cat: Category) => Math.min(cat.required, cat.total);

/**
 * Progression vers le 100 % : `done` plafonné à l'objectif, `total` = objectif.
 * `all` / `max` : compteur brut, jusqu'au total du jeu (bonus au-delà du requis).
 */
export const categoryProgress = (p: Progress, cat: Category) => {
  const all = doneInCategory(p, cat);
  return { ...ratio(Math.min(all, goal(cat)), goal(cat)), all, max: cat.total };
};

/** % global = objectifs atteints / objectifs requis, toutes catégories. */
export function globalProgress(data: GameData, p: Progress): Ratio {
  let done = 0;
  let total = 0;
  for (const cat of data.categories) {
    done += Math.min(doneInCategory(p, cat), goal(cat));
    total += goal(cat);
  }
  return ratio(done, total);
}
