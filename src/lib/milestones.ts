/** Paliers de progression globale à fêter. Fonctions pures. */
export const MILESTONES = [25, 50, 75, 100] as const;

export type Milestone = (typeof MILESTONES)[number];

/** Paliers déjà fêtés (ou déjà dépassés avant que la fonction existe). */
export type Celebrated = Milestone[];

/** Paliers atteints à ce pourcentage. */
export const reached = (percent: number): Milestone[] =>
  MILESTONES.filter((m) => percent >= m);

/**
 * Palier à fêter maintenant : le plus haut atteint et pas encore fêté.
 * Les paliers intermédiaires sautés d'un coup (import d'une sauvegarde)
 * ne sont pas fêtés un par un.
 */
export function milestoneToCelebrate(
  percent: number,
  celebrated: Celebrated,
): Milestone | null {
  const pending = reached(percent).filter((m) => !celebrated.includes(m));
  return pending.length ? pending[pending.length - 1] : null;
}

/** Marque comme fêtés tous les paliers jusqu'à `m` compris. */
export const celebrate = (celebrated: Celebrated, m: Milestone): Celebrated =>
  MILESTONES.filter((x) => x <= m || celebrated.includes(x));

/** Lit la valeur stockée ; null si absente ou invalide. */
export function parseCelebrated(
  raw: string | null | undefined,
): Celebrated | null {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    return MILESTONES.filter((m) => arr.includes(m));
  } catch {
    return null;
  }
}

/** Message affiché pour chaque palier, par langue. */
export const MILESTONE_TEXT: Record<
  "fr" | "en",
  Record<Milestone, { title: string; body: string }>
> = {
  fr: {
    25: {
      title: "Un quart du chemin",
      body: "Le soleil pointe à l'horizon. Les gros morceaux t'attendent encore.",
    },
    50: {
      title: "La moitié de Leonida",
      body: "Tu as fait plus de la moitié des objectifs du 100 %.",
    },
    75: {
      title: "Plus que la dernière ligne droite",
      body: "Trois quarts bouclés. C'est le moment de traquer les derniers objets.",
    },
    100: {
      title: "100 %. Respect.",
      body: "Tous les objectifs requis sont faits. Le soleil est levé.",
    },
  },
  en: {
    25: {
      title: "A quarter of the way",
      body: "The sun is peeking over the horizon. The big stuff is still ahead.",
    },
    50: {
      title: "Halfway across Leonida",
      body: "You've done more than half of the 100% requirements.",
    },
    75: {
      title: "Final stretch",
      body: "Three quarters done. Time to hunt down the last few.",
    },
    100: {
      title: "100%. Respect.",
      body: "Every required goal is done. The sun is fully up.",
    },
  },
};
