import type { Reliability } from "@/data/types";

/**
 * Guides courts, rédigés en français par nos soins (jamais copiés).
 * Pour ajouter un guide : copier le modèle `_modele` ci-dessous, changer
 * le slug, rédiger, vérifier en jeu, puis passer `draft` à false.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "list"; items: string[] }
  | { type: "tip"; text: string };

export type Guide = {
  slug: string;
  title: string;
  /** Résumé de 120–160 caractères, utilisé pour Google. */
  description: string;
  updatedAt: string;
  reliability: Reliability;
  /** Minutes de lecture, affichées dans la liste. */
  readingMinutes: number;
  /** « jeu » : contenu vérifié dans GTA 6. « site » : contenu sur Platine City. */
  about: "jeu" | "site";
  draft: boolean;
  body: Block[];
};

const guides: Guide[] = [
  {
    slug: "installer-application-hors-ligne",
    title: "Installer Platine City sur ton téléphone et l'utiliser hors ligne",
    description:
      "Ajoute Platine City à l'écran d'accueil de ton téléphone pour cocher ta progression GTA 6 sans connexion, en deux gestes, sans compte.",
    updatedAt: "2026-11-19",
    reliability: { status: "verified", verifiedAt: "2026-11-19" },
    readingMinutes: 2,
    about: "site",
    draft: false,
    body: [
      {
        type: "p",
        text: "Platine City fonctionne comme une application : une fois ajoutée à ton écran d'accueil, elle s'ouvre en plein écran et marche même sans réseau. Pas de compte, pas de magasin d'applications.",
      },
      { type: "h2", text: "Sur Android (Chrome)" },
      {
        type: "steps",
        items: [
          "Ouvre platinecity.fr dans Chrome.",
          "Touche le menu ⋮ en haut à droite.",
          "Choisis « Ajouter à l'écran d'accueil », puis « Installer ».",
        ],
      },
      { type: "h2", text: "Sur iPhone (Safari)" },
      {
        type: "steps",
        items: [
          "Ouvre platinecity.fr dans Safari.",
          "Touche le bouton Partager, en bas de l'écran.",
          "Choisis « Sur l'écran d'accueil », puis « Ajouter ».",
        ],
      },
      { type: "h2", text: "Ce qui marche sans connexion" },
      {
        type: "list",
        items: [
          "Toutes les pages de la checklist, une fois ouvertes au moins une fois en ligne.",
          "Cocher, décocher, le compteur et l'annulation.",
          "Ta progression, enregistrée sur le téléphone.",
        ],
      },
      {
        type: "tip",
        text: "Ta progression vit sur ce téléphone uniquement. Avant d'en changer ou de vider les données du navigateur, exporte-la depuis « Ma sauvegarde ».",
      },
    ],
  },
  {
    slug: "_modele",
    title: "Modèle de guide (non publié)",
    description:
      "Résumé en une phrase de 120 à 160 caractères, avec le mot-clé principal au début.",
    updatedAt: "2026-11-19",
    reliability: { status: "rumor" },
    readingMinutes: 3,
    about: "jeu",
    draft: true,
    body: [
      {
        type: "p",
        text: "Première phrase : la réponse directe à la question du joueur.",
      },
      { type: "h2", text: "Étapes" },
      { type: "steps", items: ["Étape vérifiée en jeu.", "Étape suivante."] },
      { type: "tip", text: "Astuce ou piège à éviter." },
    ],
  },
];

export const publishedGuides = () =>
  guides
    .filter((g) => !g.draft)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

export const getGuide = (slug: string) =>
  publishedGuides().find((g) => g.slug === slug);
