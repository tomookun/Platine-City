/** Fiabilité d'une donnée : vérifiée en jeu (avec date) ou rumeur. */
export type Reliability =
  | { status: "verified"; verifiedAt: string; source?: string }
  | { status: "rumor"; source?: string };

export type ChecklistItem = {
  /** Identifiant stable, jamais réutilisé (clé de sauvegarde). */
  id: string;
  /** Numéro affiché (« Cascade 148 »). */
  n: number;
  title: string;
  /** Lieu en clair. Masqué si `spoiler` et anti-spoiler actif. */
  where?: string;
  spoiler?: boolean;
  reliability: Reliability;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  /** Nom d'un élément au singulier (« cascade »), pour les compteurs. */
  unit: string;
  /** Rubrique d'affichage sur la page « Ton 100 % ». */
  section: SectionId;
  /** Nombre à atteindre pour le 100 % (souvent moins que le total). */
  required: number;
  /** Nombre disponible dans le jeu (= required si inconnu). */
  total: number;
  /** false si le total réel n'est pas encore connu. */
  totalKnown?: boolean;
  /** Nom de l'objectif dans le jeu (anglais), pour s'y retrouver. */
  gameLabel?: string;
  description: string;
  reliability: Reliability;
  /**
   * Liste détaillée si connue. Si absente ou incomplète, la catégorie
   * se suit aussi avec un compteur.
   */
  items: ChecklistItem[];
};

export type SectionId = "histoire" | "activites" | "decouverte";

export type Section = { id: SectionId; name: string };

export type GameData = {
  version: string;
  /** true tant que les données sont des exemples à remplacer. */
  sample: boolean;
  /** Date de la dernière mise à jour des données (AAAA-MM-JJ). */
  updatedAt: string;
  sections: Section[];
  categories: Category[];
};
