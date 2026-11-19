"use client";

import { useState } from "react";
import { shareProgress, type ShareStats } from "@/lib/share-card";

const messages = {
  partage: "Partagé. Merci !",
  telecharge: "Image téléchargée.",
  erreur: "Partage impossible sur cet appareil.",
};

/** Bouton « Partager ma progression » : image + lien. */
export function ShareButton({
  stats,
  label = "Partager ma progression",
  primary = false,
}: {
  stats: ShareStats | null;
  label?: string;
  primary?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<keyof typeof messages | null>(null);

  async function onClick() {
    if (!stats) return;
    setBusy(true);
    setStatus(null);
    try {
      const r = await shareProgress(stats);
      if (r !== "annule") setStatus(r);
    } catch {
      setStatus("erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={!stats || busy}
        className={
          primary
            ? "h-12 rounded-[10px] bg-rose px-4 text-[17px] font-bold text-nuit active:scale-[0.97] disabled:opacity-40"
            : "flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-lagon disabled:opacity-40"
        }
      >
        {!primary && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
          </svg>
        )}
        {busy ? "Préparation de l'image…" : label}
      </button>
      <span role="status" className="text-[13px] text-brume">
        {status ? messages[status] : ""}
      </span>
    </div>
  );
}
