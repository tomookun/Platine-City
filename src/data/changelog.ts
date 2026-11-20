/**
 * Journal des nouveautés, affiché sur l'accueil et sur /nouveautes (/en/news).
 *
 * À chaque mise à jour des données : ajouter une entrée EN HAUT de la liste,
 * avec l'heure (les pastilles « Nouveau » comparent à la dernière visite du
 * joueur), les catégories touchées (elles reçoivent une pastille) et le texte
 * en français ET en anglais.
 */
export type ChangeKind = "ajout" | "verification" | "correction";

type Text = { title: string; body?: string };

export type Change = Text & {
  /** Identifiant stable, jamais réutilisé. */
  id: string;
  /** Date et heure ISO de publication. */
  at: string;
  kind: ChangeKind;
  /** Version anglaise du titre et du texte. */
  en: Text;
  /** Ids des catégories concernées (pastille « Nouveau » sur chacune). */
  categories?: string[];
  /** Page à ouvrir, si ce n'est pas une catégorie. */
  link?: "checklist" | "contribute" | "guides" | "news";
};

export const KIND_LABEL: Record<ChangeKind, [fr: string, en: string]> = {
  ajout: ["Ajout", "Added"],
  verification: ["Vérifié", "Verified"],
  correction: ["Correction", "Fix"],
};

const entries: Change[] = [
  {
    id: "2026-11-20-anglais",
    at: "2026-11-20T10:00:00Z",
    kind: "ajout",
    title: "Platine City existe aussi en anglais",
    body: "Partage le lien à tes potes anglophones : ta progression reste la même dans les deux langues.",
    en: {
      title: "Platine City is now in English",
      body: "The full GTA 6 100% checklist, now in English. Your progress is shared across both languages.",
    },
    link: "checklist",
  },
  {
    id: "2026-11-19-missions",
    at: "2026-11-19T17:10:00Z",
    kind: "ajout",
    title: "Les 94 missions de l'histoire, chapitre par chapitre",
    body: "Les titres des chapitres 4 et 5 restent masqués tant que l'anti-spoiler est actif. 4 titres ne figurent que dans une partie des listes : ils sont signalés.",
    en: {
      title: "All 94 story missions, chapter by chapter",
      body: "Chapter 4 and 5 titles stay hidden while spoiler-free mode is on. 4 titles only show up in some lists: they're flagged.",
    },
    categories: ["histoire"],
  },
  {
    id: "2026-11-19-objectifs",
    at: "2026-11-19T17:10:00Z",
    kind: "ajout",
    title: "Les 32 objectifs du 100 %, avec le requis et le total",
    body: "Exemple : 100 flamants à cocaïne suffisent sur les 125 du jeu. Au-delà, ton compteur affiche le bonus.",
    en: {
      title: "All 32 100% requirements, with required and total counts",
      body: "Example: 100 cocaine flamingos are enough out of the 125 in the game. Go further and your counter shows the bonus.",
    },
    link: "checklist",
  },
  {
    id: "2026-11-19-contributions",
    at: "2026-11-19T16:55:00Z",
    kind: "ajout",
    title: "Les contributions sont ouvertes",
    body: "Tu as trouvé un emplacement ou une erreur ? Signale-le : chaque info est relue avant publication.",
    en: {
      title: "Contributions are open",
      body: "Found a location or a mistake? Report it: every tip is reviewed before it goes live.",
    },
    link: "contribute",
  },
];

/** Du plus récent au plus ancien. */
export const changelog: Change[] = [...entries].sort((a, b) =>
  b.at.localeCompare(a.at),
);
