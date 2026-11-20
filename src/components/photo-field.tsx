"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/locale-context";

const MAX_SIDE = 1920;

/**
 * Redimensionne et réencode l'image sur le téléphone : fichier plus léger,
 * et métadonnées (position GPS, modèle d'appareil…) supprimées.
 */
async function compress(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, "image/jpeg", 0.85),
  );
  if (!blob) throw new Error("Compression impossible");
  return new File([blob], "capture.jpg", { type: "image/jpeg" });
}

const kb = (n: number, en: boolean) =>
  `${Math.max(1, Math.round(n / 1024))} ${en ? "KB" : "Ko"}`;

export function PhotoField({ error }: { error?: string }) {
  const { t, locale } = useI18n();
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ url: string; size: number } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  // Le formulaire est vidé après un envoi réussi : on vide aussi l'aperçu.
  useEffect(() => {
    const form = input.current?.form;
    const clear = () => setPreview(null);
    form?.addEventListener("reset", clear);
    return () => form?.removeEventListener("reset", clear);
  }, []);

  // Libère l'aperçu précédent quand il change.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview]);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return setPreview(null);
    setBusy(true);
    let final = file;
    try {
      final = await compress(file);
      const dt = new DataTransfer();
      dt.items.add(final);
      e.target.files = dt.files;
    } catch {
      /* format non lisible ici : le serveur vérifiera le fichier d'origine */
    }
    setPreview({ url: URL.createObjectURL(final), size: final.size });
    setBusy(false);
  }

  function remove() {
    if (input.current) input.current.value = "";
    setPreview(null);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="photo" className="text-[15px] font-semibold">
        {t("Capture d'écran", "Screenshot")}
      </label>
      <input
        ref={input}
        id="photo"
        name="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby="photo-help"
        className="text-[15px] text-brume file:mr-3 file:h-12 file:rounded-[10px] file:border file:border-contour file:bg-surface file:px-4 file:font-semibold file:text-sable"
      />
      <p id="photo-help" className="text-[13px] text-brume">
        {t("Facultatif. Une capture faite ", "Optional. A screenshot taken ")}
        <strong className="text-sable">
          {t("dans ton jeu", "in your own game")}
        </strong>
        {t(
          " (jamais celle d'un autre site). Elle est allégée sur ton téléphone avant l'envoi, puis relue avant publication.",
          " (never one from another site). It's shrunk on your phone before sending, then reviewed before publication.",
        )}
      </p>
      {busy && (
        <p className="text-[13px] text-brume">
          {t("Préparation de l'image…", "Preparing the image…")}
        </p>
      )}
      {preview && !busy && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:) */}
          <img
            src={preview.url}
            alt={t("Aperçu de ta capture", "Preview of your screenshot")}
            className="h-20 w-auto rounded-case object-cover"
          />
          <span className="flex-1 text-[13px] text-brume">
            {kb(preview.size, locale === "en")}
          </span>
          <button
            type="button"
            onClick={remove}
            className="min-h-11 px-2 text-[15px] font-semibold text-rose"
          >
            {t("Retirer", "Remove")}
          </button>
        </div>
      )}
      {error && (
        <p className="text-[13px] font-semibold text-soleil">{error}</p>
      )}
    </div>
  );
}
