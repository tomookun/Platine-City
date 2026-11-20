"use client";

import { useState } from "react";
import { game } from "@/data/game";
import { emptyProgress, globalProgress, type Progress } from "@/lib/progress";
import { isSaved, setProgress, useProgress } from "@/lib/progress-store";
import { serializeProgress, tryParseProgress } from "@/lib/storage";

const btn =
  "flex h-12 items-center justify-center rounded-[10px] px-4 text-[17px] font-bold active:scale-[0.97] disabled:opacity-40";
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

export function BackupPanel() {
  const progress = useProgress();
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
    a.download = `platinecity-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMessage({
      tone: "ok",
      text: "Fichier téléchargé. Garde-le dans un endroit sûr.",
    });
  }

  async function pickFile(file: File | undefined) {
    setMessage(null);
    if (!file) return;
    if (file.size > 1_000_000) {
      setMessage({
        tone: "error",
        text: "Ce fichier est trop gros pour être une sauvegarde.",
      });
      return;
    }
    const parsed = tryParseProgress(await file.text());
    if (!parsed) {
      setMessage({
        tone: "error",
        text: "Ce fichier n'est pas une sauvegarde Platine City.",
      });
      return;
    }
    setPending(parsed);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-1 rounded-feuille bg-surface p-4">
        <h2 className="text-xl font-bold">Sur ce téléphone</h2>
        <p className="text-brume" role="status">
          {progress === null
            ? "Lecture de ta sauvegarde…"
            : `${done} éléments faits, dernière modification le ${fmtDate(progress.updatedAt)}.`}
        </p>
        {progress && !isSaved() && (
          <p className="font-semibold text-soleil">
            Ce navigateur bloque la sauvegarde (navigation privée ?). Exporte ta
            progression avant de fermer l&apos;onglet.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-[25px] font-bold">Exporter</h2>
        <p className="text-brume">
          Télécharge un fichier pour changer de téléphone ou garder une copie.
        </p>
        <button
          type="button"
          onClick={exportFile}
          disabled={!progress}
          className={`${btn} bg-rose text-nuit`}
        >
          Télécharger ma sauvegarde
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-[25px] font-bold">Importer</h2>
        <p className="text-brume">
          Reprends une sauvegarde exportée. Elle remplace la progression de ce
          téléphone.
        </p>
        <label
          className={`${btn} cursor-pointer border border-contour has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rose`}
        >
          Choisir un fichier
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
              Remplacer ta progression actuelle par celle du fichier (
              {globalProgress(game, pending).done} éléments faits, enregistrée
              le {fmtDate(pending.updatedAt)}) ?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className={`${btn} flex-1 bg-rose text-nuit`}
                onClick={() => {
                  setProgress(pending);
                  setPending(null);
                  setMessage({ tone: "ok", text: "Sauvegarde importée." });
                }}
              >
                Remplacer
              </button>
              <button
                type="button"
                className={`${btn} flex-1 border border-contour`}
                onClick={() => setPending(null)}
              >
                Garder l&apos;actuelle
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-ligne pt-5">
        <h2 className="font-display text-[25px] font-bold">Tout effacer</h2>
        {confirmReset ? (
          <div
            className="flex flex-col gap-3"
            role="alertdialog"
            aria-labelledby="confirm-reset"
          >
            <p id="confirm-reset">
              Effacer toute ta progression sur ce téléphone ? Ce n&apos;est pas
              réversible sans fichier exporté.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className={`${btn} flex-1 bg-sable text-nuit`}
                onClick={() => {
                  setProgress(emptyProgress());
                  setConfirmReset(false);
                  setMessage({ tone: "ok", text: "Progression effacée." });
                }}
              >
                Effacer
              </button>
              <button
                type="button"
                className={`${btn} flex-1 border border-contour`}
                onClick={() => setConfirmReset(false)}
              >
                Annuler
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
            Effacer ma progression
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
