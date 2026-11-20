import type { Reliability } from "@/data/types";
import type { Locale } from "@/i18n/locale";

/**
 * Guides courts, rédigés par nos soins (jamais copiés), en français et en
 * anglais. Les deux versions d'un même guide partagent la même `key`.
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
  /** Identifiant commun aux traductions d'un même guide. */
  key: string;
  locale: Locale;
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
    key: "install",
    locale: "fr",
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
          "Ouvre Platine City dans Chrome.",
          "Touche le menu ⋮ en haut à droite.",
          "Choisis « Ajouter à l'écran d'accueil », puis « Installer ».",
        ],
      },
      { type: "h2", text: "Sur iPhone (Safari)" },
      {
        type: "steps",
        items: [
          "Ouvre Platine City dans Safari.",
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
    key: "install",
    locale: "en",
    slug: "install-app-offline",
    title: "Install Platine City on your phone and use it offline",
    description:
      "Add Platine City to your phone's home screen to track your GTA 6 100% progress with no connection, in two taps, no account needed.",
    updatedAt: "2026-11-20",
    reliability: { status: "verified", verifiedAt: "2026-11-20" },
    readingMinutes: 2,
    about: "site",
    draft: false,
    body: [
      {
        type: "p",
        text: "Platine City works like an app: once it's on your home screen, it opens full screen and keeps working without a network. No account, no app store.",
      },
      { type: "h2", text: "On Android (Chrome)" },
      {
        type: "steps",
        items: [
          "Open Platine City in Chrome.",
          "Tap the ⋮ menu in the top right corner.",
          "Choose “Add to Home screen”, then “Install”.",
        ],
      },
      { type: "h2", text: "On iPhone (Safari)" },
      {
        type: "steps",
        items: [
          "Open Platine City in Safari.",
          "Tap the Share button at the bottom of the screen.",
          "Choose “Add to Home Screen”, then “Add”.",
        ],
      },
      { type: "h2", text: "What works offline" },
      {
        type: "list",
        items: [
          "Every checklist page, once you've opened it online at least once.",
          "Ticking, unticking, the counter and undo.",
          "Your progress, saved on the phone.",
        ],
      },
      {
        type: "tip",
        text: "Your progress lives on this phone only. Before switching phones or clearing browser data, export it from “My backup”.",
      },
    ],
  },
  {
    key: "_modele",
    locale: "fr",
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

export const publishedGuides = (locale: Locale = "fr") =>
  guides
    .filter((g) => !g.draft && g.locale === locale)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

export const getGuide = (slug: string, locale: Locale = "fr") =>
  publishedGuides(locale).find((g) => g.slug === slug);

/** La version d'un guide dans une langue (via sa `key`). */
export const getGuideByKey = (key: string, locale: Locale) =>
  publishedGuides(locale).find((g) => g.key === key);
