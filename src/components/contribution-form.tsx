"use client";

import { useActionState } from "react";
import {
  submitContribution,
  type ContributionState,
} from "@/lib/contribute-action";
import { CONTRIBUTION_KINDS, LIMITS } from "@/lib/contribution";
import { useI18n } from "@/i18n/locale-context";
import { PhotoField } from "./photo-field";

const initial: ContributionState = {
  status: "idle",
  message: "",
  errors: {},
  values: {},
};

const field =
  "w-full rounded-[10px] border border-contour bg-surface px-3.5 text-base text-sable placeholder:text-brume";
const label = "text-[15px] font-semibold";
const help = "text-[13px] text-brume";
const err = "text-[13px] font-semibold text-soleil";

export function ContributionForm() {
  const [state, action, pending] = useActionState(submitContribution, initial);
  const { t, locale, game } = useI18n();
  const e = state.errors;
  const v = state.values;

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      <fieldset className="flex flex-col gap-2">
        <legend className={`${label} mb-2`}>
          {t("Tu veux…", "You want to…")}
        </legend>
        {Object.entries(CONTRIBUTION_KINDS).map(([value, [fr, en]], i) => (
          <label
            key={value}
            className="flex min-h-12 items-center gap-3 rounded-[10px] border border-contour px-3.5 has-[:checked]:border-rose"
          >
            <input
              type="radio"
              name="kind"
              value={value}
              defaultChecked={v.kind ? v.kind === value : i === 0}
              className="size-5 accent-[#ff5c93]"
            />
            <span className="text-[17px]">{t(fr, en)}</span>
          </label>
        ))}
        {e.kind && <p className={err}>{e.kind}</p>}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="categoryId" className={label}>
          {t("Catégorie", "Category")}
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={v.categoryId ?? ""}
          className={`${field} h-12`}
        >
          <option value="">
            {t("Aucune ou je ne sais pas", "None or not sure")}
          </option>
          {game.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {e.categoryId && <p className={err}>{e.categoryId}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="itemRef" className={label}>
          {t("Élément concerné", "Item")}
        </label>
        <input
          id="itemRef"
          name="itemRef"
          defaultValue={v.itemRef}
          maxLength={LIMITS.itemRef}
          placeholder={t("Ex. : Cascade 152", "E.g. Stunt 152")}
          className={`${field} h-12`}
          aria-describedby="itemRef-help"
        />
        <p id="itemRef-help" className={help}>
          {t("Facultatif.", "Optional.")}
        </p>
        {e.itemRef && <p className={err}>{e.itemRef}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={label}>
          {t("Ce que tu as vu en jeu", "What you saw in game")}
        </label>
        <textarea
          id="message"
          name="message"
          defaultValue={v.message}
          required
          rows={5}
          maxLength={LIMITS.message[1]}
          aria-invalid={!!e.message}
          aria-describedby="message-help"
          placeholder={t(
            "Où exactement, et comment y accéder. Décris avec tes mots, sans copier un autre site.",
            "Where exactly, and how to get there. Use your own words, don't copy another site.",
          )}
          className={`${field} py-3`}
        />
        <p id="message-help" className={help}>
          {t(
            `Entre ${LIMITS.message[0]} et ${LIMITS.message[1]} caractères.`,
            `Between ${LIMITS.message[0]} and ${LIMITS.message[1]} characters.`,
          )}
        </p>
        {e.message && <p className={err}>{e.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sourceUrl" className={label}>
          {t("Lien vers une preuve", "Link to proof")}
        </label>
        <input
          id="sourceUrl"
          name="sourceUrl"
          defaultValue={v.sourceUrl}
          type="url"
          inputMode="url"
          placeholder={t(
            "https://… (vidéo YouTube avec le moment exact)",
            "https://… (YouTube video at the exact moment)",
          )}
          className={`${field} h-12`}
          aria-describedby="sourceUrl-help"
        />
        <p id="sourceUrl-help" className={help}>
          {t(
            "Facultatif, mais ça accélère la vérification.",
            "Optional, but it speeds up the check.",
          )}
        </p>
        {e.sourceUrl && <p className={err}>{e.sourceUrl}</p>}
      </div>

      <PhotoField error={e.photo} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pseudo" className={label}>
          {t("Pseudo pour te remercier", "Nickname to credit you")}
        </label>
        <input
          id="pseudo"
          name="pseudo"
          defaultValue={v.pseudo}
          maxLength={LIMITS.pseudo}
          autoComplete="nickname"
          className={`${field} h-12`}
          aria-describedby="pseudo-help"
        />
        <p id="pseudo-help" className={help}>
          {t("Facultatif. Pas d'e-mail demandé.", "Optional. No email needed.")}
        </p>
        {e.pseudo && <p className={err}>{e.pseudo}</p>}
      </div>

      {/* Champ piège pour les robots, invisible pour les humains. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="website">{t("Ne pas remplir", "Leave empty")}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={v.consent === "on"}
            className="mt-0.5 size-5 shrink-0 accent-[#ff5c93]"
          />
          <span className="text-[15px]">
            {t(
              "J'accepte que ma contribution et ma capture soient relues puis publiées sur Platine City, reformulées ou recadrées si besoin, avec mon pseudo en crédit.",
              "I agree that my tip and screenshot may be reviewed, then published on Platine City, reworded or cropped if needed, credited with my nickname.",
            )}
          </span>
        </label>
        {e.consent && <p className={err}>{e.consent}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-[10px] bg-rose text-[17px] font-bold text-nuit active:scale-[0.97] disabled:opacity-50"
      >
        {pending
          ? t("Envoi…", "Sending…")
          : t("Envoyer ma contribution", "Send my tip")}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={
          state.status === "ok"
            ? "font-semibold text-lagon"
            : state.status === "error"
              ? err
              : "sr-only"
        }
      >
        {state.message}
      </p>
    </form>
  );
}
