"use client";

import { useState } from "react";
import { game } from "@/data/game";
import { tr, type Locale } from "@/i18n/locale";
import { useI18n } from "@/i18n/locale-context";
import { emptyProgress, globalProgress, type Progress } from "@/lib/progress";
import { isSaved, setProgress, useProgress } from "@/lib/progress-store";
import { serializeProgress, tryParseProgress } from "@/lib/storage";

const btn =
  "flex h-12 items-center justify-center rounded-[10px] px-4 text-[17px] font-bold active:scale-[0.97] disabled:opacity-40";
const fmtDate = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleString(locale === "en" ? "en-US" : "fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

export function BackupPanel() {
  const progress = useProgress();
  const { t, locale } = useI18n();
  const date = (iso: string) => fmtDate(iso, locale);
  const [pending, setPending] = useState<Progress | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState<{
    tone: "ok" | "error";
    text: string;
  } | null>(null);

  const done = progress ? globalProgress(game, progress).done : null;

  function exportFile() {
    if (!progress) return;
    const blob = new Blob([serializeProgress(progress)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `platinecity-${tr(locale)("sauvegarde", "backup")}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMessage({
      tone: "ok",
      text: t(
        "Fichier téléchargé. Garde-le dans un endroit sûr.",
        "File downloaded. Keep it somewhere safe.",
      ),
    });
  }

  async function pickFile(file: File | undefined) {
    setMessage(null);
    if (!file) return;
    if (file.size > 1_000_000) {
      setMessage({
        tone: "error",
        text: t(
          "Ce fichier est trop gros pour être une sauvegarde.",
          "This file is too big to be a backup.",
        ),
      });
      return;
    }
    const parsed = tryParseProgress(await file.text());
    if (!parsed) {
      setMessage({
        tone: "error",
        text: t(
          "Ce fichier n'est pas une sauvegarde Platine City.",
          "This file isn't a Platine City backup.",
        ),
      });
      return;
    }
    setPending(parsed);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-1 rounded-feuille bg-surface p-4">
        <h2 className="text-xl font-bold">
          {t("Sur ce téléphone", "On this phone")}
        </h2>
        <p className="text-brume" role="status">
          {progress === null
            ? t("Lecture de ta sauvegarde…", "Reading your backup…")
            : t(
                `${done} objectifs faits, dernière modification le ${date(progress.updatedAt)}.`,
                `${done} goals done, last changed on ${date(progress.updatedAt)}.`,
              )}
        </p>
        {progress && !isSaved() && (
          <p className="font-semibold text-soleil">
            {t(
              "Ce navigateur bloque la sauvegarde (navigation privée ?). Exporte ta progression avant de fermer l'onglet.",
              "This browser is blocking saving (private mode?). Export your progress before closing the tab.",
            )}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-[25px] font-bold">
          {t("Exporter", "Export")}
        </h2>
        <p className="text-brume">
          {t(
            "Télécharge un fichier pour changer de téléphone ou garder une copie.",
            "Download a file to switch phones or keep a copy.",
          )}
        </p>
        <button
          type="button"
          onClick={exportFile}
          disabled={!progress}
          className={`${btn} bg-rose text-nuit`}
        >
          {t("Télécharger ma sauvegarde", "Download my backup")}
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-[25px] font-bold">
          {t("Importer", "Import")}
        </h2>
        <p className="text-brume">
          {t(
            "Reprends une sauvegarde exportée. Elle remplace la progression de ce téléphone.",
            "Restore an exported backup. It replaces the progress on this phone.",
          )}
        </p>
        <label
          className={`${btn} cursor-pointer border border-contour has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rose`}
        >
          {t("Choisir un fichier", "Choose a file")}
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              pickFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {pending && (
          <div
            className="flex flex-col gap-3 rounded-feuille border border-rose p-4"
            role="alertdialog"
            aria-labelledby="confirm-import"
          >
            <p id="confirm-import">
              {t(
                `Remplacer ta progression actuelle par celle du fichier (${globalProgress(game, pending).done} objectifs faits, enregistrée le ${date(pending.updatedAt)}) ?`,
                `Replace your current progress with the file's (${globalProgress(game, pending).done} goals done, saved on ${date(pending.updatedAt)})?`,
              )}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className={`${btn} flex-1 bg-rose text-nuit`}
                onClick={() => {
                  setProgress(pending);
                  setPending(null);
                  setMessage({
                    tone: "ok",
                    text: t("Sauvegarde importée.", "Backup imported."),
                  });
                }}
              >
                {t("Remplacer", "Replace")}
              </button>
              <button
                type="button"
                className={`${btn} flex-1 border border-contour`}
                onClick={() => setPending(null)}
              >
                {t("Garder l'actuelle", "Keep current")}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-ligne pt-5">
        <h2 className="font-display text-[25px] font-bold">
          {t("Tout effacer", "Erase everything")}
        </h2>
        {confirmReset ? (
          <div
            className="flex flex-col gap-3"
            role="alertdialog"
            aria-labelledby="confirm-reset"
          >
            <p id="confirm-reset">
              {t(
                "Effacer toute ta progression sur ce téléphone ? Ce n'est pas réversible sans fichier exporté.",
                "Erase all your progress on this phone? This can't be undone without an exported file.",
              )}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className={`${btn} flex-1 bg-sable text-nuit`}
                onClick={() => {
                  setProgress(emptyProgress());
                  setConfirmReset(false);
                  setMessage({
                    tone: "ok",
                    text: t("Progression effacée.", "Progress erased."),
                  });
                }}
              >
                {t("Effacer", "Erase")}
              </button>
              <button
                type="button"
                className={`${btn} flex-1 border border-contour`}
                onClick={() => setConfirmReset(false)}
              >
                {t("Annuler", "Cancel")}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            disabled={!progress}
            className={`${btn} border border-contour`}
          >
            {t("Effacer ma progression", "Erase my progress")}
          </button>
        )}
      </section>

      <p
        aria-live="polite"
        className={
          message?.tone === "error"
            ? "font-semibold text-soleil"
            : "font-semibold text-lagon"
        }
      >
        {message?.text}
      </p>
    </div>
  );
}
