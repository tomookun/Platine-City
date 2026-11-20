import type { GameData } from "@/data/types";

/** Validation d'une contribution, sans dépendance au serveur (testable). */
export const CONTRIBUTION_KINDS = {
  emplacement: "Signaler un emplacement",
  correction: "Corriger une info",
  autre: "Autre",
} as const;

export type ContributionKind = keyof typeof CONTRIBUTION_KINDS;

export type Contribution = {
  kind: ContributionKind;
  categoryId: string | null;
  itemRef: string | null;
  message: string;
  sourceUrl: string | null;
  pseudo: string | null;
};

export type FieldErrors = Partial<
  Record<
    | "kind"
    | "categoryId"
    | "itemRef"
    | "message"
    | "sourceUrl"
    | "pseudo"
    | "consent"
    | "photo",
    string
  >
>;

export type ValidationResult =
  | { ok: true; value: Contribution }
  | { ok: false; errors: FieldErrors; spam?: boolean };

export const LIMITS = {
  message: [10, 1000],
  itemRef: 80,
  sourceUrl: 300,
  pseudo: 40,
} as const;

const text = (v: FormDataEntryValue | null) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";

export function validateContribution(
  form: FormData,
  data: GameData,
): ValidationResult {
  // Champ piège invisible : un humain le laisse vide.
  if (text(form.get("website"))) return { ok: false, errors: {}, spam: true };

  const errors: FieldErrors = {};

  const kind = text(form.get("kind"));
  if (!(kind in CONTRIBUTION_KINDS))
    errors.kind = "Choisis un type de contribution.";

  const categoryId = text(form.get("categoryId")) || null;
  if (categoryId && !data.categories.some((c) => c.id === categoryId)) {
    errors.categoryId = "Cette catégorie n'existe pas.";
  }

  const itemRef = text(form.get("itemRef")) || null;
  if (itemRef && itemRef.length > LIMITS.itemRef) {
    errors.itemRef = `${LIMITS.itemRef} caractères maximum.`;
  }

  const message =
    typeof form.get("message") === "string"
      ? (form.get("message") as string).trim()
      : "";
  const [min, max] = LIMITS.message;
  if (message.length < min)
    errors.message = `Décris ta contribution en ${min} caractères minimum.`;
  else if (message.length > max) errors.message = `${max} caractères maximum.`;

  const sourceUrl = text(form.get("sourceUrl")) || null;
  if (sourceUrl) {
    let valid = sourceUrl.length <= LIMITS.sourceUrl;
    try {
      const u = new URL(sourceUrl);
      valid &&= u.protocol === "https:" || u.protocol === "http:";
    } catch {
      valid = false;
    }
    if (!valid)
      errors.sourceUrl = "Colle un lien complet qui commence par https://.";
  }

  const pseudo = text(form.get("pseudo")) || null;
  if (pseudo && pseudo.length > LIMITS.pseudo)
    errors.pseudo = `${LIMITS.pseudo} caractères maximum.`;

  if (form.get("consent") !== "on") {
    errors.consent =
      "Coche la case pour accepter la relecture et la publication.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      kind: kind as ContributionKind,
      categoryId,
      itemRef,
      message,
      sourceUrl,
      pseudo,
    },
  };
}

/** Taille maximale d'une capture, après recompression sur le téléphone. */
export const PHOTO_MAX_BYTES = 3.5 * 1024 * 1024;

const PHOTO_TYPES = [
  {
    ext: "jpg",
    type: "image/jpeg",
    magic: (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: "png",
    type: "image/png",
    magic: (b: Uint8Array) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    ext: "webp",
    type: "image/webp",
    magic: (b: Uint8Array) =>
      String.fromCharCode(b[0], b[1], b[2], b[3]) === "RIFF" &&
      String.fromCharCode(b[8], b[9], b[10], b[11]) === "WEBP",
  },
] as const;

export type PhotoCheck =
  { ok: true; ext: string; type: string } | { ok: false; error: string };

/**
 * Vérifie une capture d'après son contenu réel (les premiers octets), pas
 * d'après son nom ou le type annoncé par le navigateur.
 */
export function checkPhoto(bytes: Uint8Array): PhotoCheck {
  if (bytes.length === 0) return { ok: false, error: "Le fichier est vide." };
  if (bytes.length > PHOTO_MAX_BYTES)
    return { ok: false, error: "Image trop lourde (3,5 Mo maximum)." };
  const t = PHOTO_TYPES.find((p) => bytes.length >= 12 && p.magic(bytes));
  if (!t) return { ok: false, error: "Envoie une image JPG, PNG ou WebP." };
  return { ok: true, ext: t.ext, type: t.type };
}
