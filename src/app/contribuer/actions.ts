"use server";

import { game } from "@/data/game";
import {
  checkPhoto,
  validateContribution,
  type FieldErrors,
  type PhotoCheck,
} from "@/lib/contribution";

export type ContributionState = {
  status: "idle" | "ok" | "error";
  message: string;
  errors: FieldErrors;
  /** Valeurs saisies, renvoyées en cas d'erreur pour ne rien faire retaper. */
  values: Record<string, string>;
};

const FIELDS = [
  "kind",
  "categoryId",
  "itemRef",
  "message",
  "sourceUrl",
  "pseudo",
  "consent",
];

const keep = (form: FormData) =>
  Object.fromEntries(
    FIELDS.map((f) => [
      f,
      typeof form.get(f) === "string"
        ? (form.get(f) as string).slice(0, 1000)
        : "",
    ]),
  );

/**
 * Enregistre une contribution dans Supabase (table `contributions`, statut
 * « pending »). Sans configuration : en dev on l'affiche dans la console,
 * en prod on refuse proprement.
 */
export async function submitContribution(
  _prev: ContributionState,
  form: FormData,
): Promise<ContributionState> {
  const result = validateContribution(form, game);
  // Un robot reçoit un faux succès et rien n'est enregistré.
  if (!result.ok && result.spam)
    return {
      status: "ok",
      message: "Merci, ta contribution sera relue.",
      errors: {},
      values: {},
    };

  // Capture facultative, vérifiée d'après son contenu réel.
  const file = form.get("photo");
  let photo: {
    bytes: Uint8Array;
    check: Extract<PhotoCheck, { ok: true }>;
  } | null = null;
  if (file instanceof File && file.size > 0) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const check = checkPhoto(bytes);
    if (!check.ok) {
      const errors = {
        ...(result.ok ? {} : result.errors),
        photo: check.error,
      };
      return {
        status: "error",
        message: "Corrige les champs indiqués.",
        errors,
        values: keep(form),
      };
    }
    photo = { bytes, check };
  }

  if (!result.ok) {
    return {
      status: "error",
      message: "Corrige les champs indiqués.",
      errors: result.errors,
      values: keep(form),
    };
  }

  const c = result.value;
  const row = {
    kind: c.kind,
    category_id: c.categoryId,
    item_ref: c.itemRef,
    message: c.message,
    source_url: c.sourceUrl,
    pseudo: c.pseudo,
    data_version: game.version,
  };

  // Accepte « https://xxx.supabase.co » comme « https://xxx.supabase.co/rest/v1/ ».
  const url = process.env.SUPABASE_URL?.trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[contribution non enregistrée : Supabase non configuré]",
        row,
        photo ? `+ photo ${photo.check.ext} ${photo.bytes.length} o` : "",
      );
      return {
        status: "ok",
        message:
          "Merci, ta contribution sera relue. (Mode dev : affichée dans la console.)",
        errors: {},
        values: {},
      };
    }
    return {
      status: "error",
      message:
        "Les contributions ouvrent très bientôt. Réessaie dans quelques jours.",
      errors: {},
      values: keep(form),
    };
  }

  try {
    // 1. La capture va dans le stockage privé (jamais publique sans relecture).
    if (photo) {
      const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${photo.check.ext}`;
      const up = await fetch(
        `${url}/storage/v1/object/contributions-photos/${path}`,
        {
          method: "POST",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": photo.check.type,
            "x-upsert": "false",
          },
          body: Buffer.from(photo.bytes),
        },
      );
      if (!up.ok) {
        const detail = (await up.text().catch(() => "")).slice(0, 300);
        throw new Error(`Stockage Supabase ${up.status} ${detail}`);
      }
      Object.assign(row, { photo_path: path });
    }

    // 2. La contribution, en attente de relecture.
    const res = await fetch(`${url}/rest/v1/contributions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      // Message d'erreur Supabase (jamais la clé), pour diagnostiquer dans les logs Vercel.
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      // Type et longueur de la clé seulement (jamais sa valeur), pour repérer une mauvaise clé collée.
      const kind = /^sb_secret_/.test(key)
        ? "sb_secret"
        : /^sb_publishable_/.test(key)
          ? "sb_publishable"
          : /^eyJ/.test(key)
            ? "jwt"
            : "inconnu";
      throw new Error(
        `Supabase ${res.status} ${detail} [clé: ${kind}, ${key.length} car., hôte: ${new URL(url).host}]`,
      );
    }
  } catch (e) {
    console.error("Échec d'enregistrement d'une contribution", e);
    return {
      status: "error",
      message: "L’envoi a échoué. Vérifie ta connexion et réessaie.",
      errors: {},
      values: keep(form),
    };
  }

  return {
    status: "ok",
    message: "Merci, ta contribution sera relue avant publication.",
    errors: {},
    values: {},
  };
}
