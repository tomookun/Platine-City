/**
 * Détails des objets : comment y aller, vidéos, photos.
 * Séparé de game.json pour ne jamais être écrasé quand on régénère les données.
 *
 * Pour ajouter une vidéo : coller le lien YouTube AVEC le moment où l'objet
 * apparaît (bouton « Partager » > « Commencer à 4:32 » sur YouTube), et le
 * nom de la chaîne. La vidéo reste chez son créateur : on l'intègre, on ne la
 * copie pas.
 *
 * Photos : uniquement des captures faites par toi ou envoyées par la
 * communauté (jamais celles d'un autre site). Fichier dans public/photos/.
 *
 * Exemple :
 *   "flamant-37": {
 *     how: "Sur le toit du motel, accès par l'escalier de secours côté plage.",
 *     media: [
 *       { youtube: "https://youtu.be/XXXXXXXXXXX?t=272", credit: "NomDeLaChaîne" },
 *       { image: "/photos/flamant-37.webp", alt: "Le flamant sur le toit du motel", credit: "Kev13" },
 *     ],
 *   },
 */
export type Media =
  | { youtube: string; credit: string }
  | { image: string; alt: string; altEn?: string; credit: string };

export type ItemDetails = {
  /** Comment y accéder, en 1 ou 2 phrases, avec nos mots. */
  how?: string;
  /** La même chose en anglais (sinon le texte français est affiché). */
  howEn?: string;
  media?: Media[];
};

export const details: Record<string, ItemDetails> = {};

export const getDetails = (itemId: string): ItemDetails | undefined =>
  details[itemId];
