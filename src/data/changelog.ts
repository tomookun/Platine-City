/**
 * Journal des nouveautés, affiché sur l'accueil et sur /nouveautes.
 *
 * À chaque mise à jour des données : ajouter une entrée EN HAUT de la liste,
 * avec l'heure (les pastilles « Nouveau » comparent à la dernière visite du
 * joueur) et les catégories touchées (elles reçoivent une pastille).
 */
export type ChangeKind = "ajout" | "verification" | "correction";

export type Change = {
  /** Identifiant stable, jamais réutilisé. */
  id: string;
  /** Date et heure ISO de publication. */
  at: string;
  kind: ChangeKind;
  title: string;
  body?: string;
  /** Ids des catégories concernées (pastille « Nouveau » sur chacune). */
  categories?: string[];
  /** Lien vers la page à voir, si ce n'est pas une catégorie. */
  href?: string;
};

export const KIND_LABEL: Record<ChangeKind, string> = {
  ajout: "Ajout",
  verification: "Vérifié",
  correction: "Correction",
};

const entries: Change[] = [
  {
    id: "2026-11-19-missions",
    at: "2026-11-19T17:10:00Z",
    kind: "ajout",
    title: "Les 94 missions de l'histoire, chapitre par chapitre",
    body: "Les titres des chapitres 4 et 5 restent masqués tant que l'anti-spoiler est actif. 4 titres ne figurent que dans une partie des listes : ils sont signalés.",
    categories: ["histoire"],
  },
  {
    id: "2026-11-19-objectifs",
    at: "2026-11-19T17:10:00Z",
    kind: "ajout",
    title: "Les 32 objectifs du 100 %, avec le requis et le total",
    body: "Exemple : 100 flamants à cocaïne suffisent sur les 125 du jeu. Au-delà, ton compteur affiche le bonus.",
    href: "/gta-6",
  },
  {
    id: "2026-11-19-contributions",
    at: "2026-11-19T16:55:00Z",
    kind: "ajout",
    title: "Les contributions sont ouvertes",
    body: "Tu as trouvé un emplacement ou une erreur ? Signale-le : chaque info est relue avant publication.",
    href: "/contribuer",
  },
];

/** Du plus récent au plus ancien. */
export const changelog: Change[] = [...entries].sort((a, b) =>
  b.at.localeCompare(a.at),
);
