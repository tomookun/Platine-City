"use server";

import { game } from "@/data/game";
import { validateContribution, type FieldErrors } from "@/lib/contribution";

export type ContributionState = {
  status: "idle" | "ok" | "error";
  message: string;
  errors: FieldErrors;
  /** Valeurs saisies, renvoyées en cas d'erreur pour ne rien faire retaper. */
  values: Record<string, string>;
};

const FIELDS = ["kind", "categoryId", "itemRef", "message", "sourceUrl", "pseudo", "consent"];

const keep = (form: FormData) =>
  Object.fromEntries(
    FIELDS.map((f) => [f, typeof form.get(f) === "string" ? (form.get(f) as string).slice(0, 1000) : ""]),
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
  if (!result.ok && result.spam) return { status: "ok", message: "Merci, ta contribution sera relue.", errors: {}, values: {} };
  if (!result.ok) {
    return { status: "error", message: "Corrige les champs indiqués.", errors: result.errors, values: keep(form) };
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

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contribution non enregistrée : Supabase non configuré]", row);
      return { status: "ok", message: "Merci, ta contribution sera relue. (Mode dev : affichée dans la console.)", errors: {}, values: {} };
    }
    return { status: "error", message: "Les contributions ouvrent très bientôt. Réessaie dans quelques jours.", errors: {}, values: keep(form) };
  }

  try {
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
      throw new Error(`Supabase ${res.status} ${detail}`);
    }
  } catch (e) {
    console.error("Échec d'enregistrement d'une contribution", e);
    return { status: "error", message: "L’envoi a échoué. Vérifie ta connexion et réessaie.", errors: {}, values: keep(form) };
  }

  return { status: "ok", message: "Merci, ta contribution sera relue avant publication.", errors: {}, values: {} };
}
