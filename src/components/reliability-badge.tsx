"use client";

import type { Reliability } from "@/data/types";
import { formatShortDate } from "@/i18n/locale";
import { useI18n } from "@/i18n/locale-context";

/**
 * `about` : « jeu » pour une info vérifiée dans GTA 6, « site » pour un
 * contenu sur Platine City lui-même (pas de « vérifié en jeu » trompeur).
 */
export function ReliabilityBadge({
  value,
  about = "jeu",
}: {
  value: Reliability;
  about?: "jeu" | "site";
}) {
  const { t, locale } = useI18n();
  if (value.status === "verified") {
    const label =
      about === "jeu"
        ? t("Vérifié en jeu le", "Verified in game on")
        : t("Mis à jour le", "Updated on");
    return (
      <span className="text-[13px] font-semibold text-lagon">
        {label} {formatShortDate(locale, value.verifiedAt)}
      </span>
    );
  }
  return (
    <span className="text-[13px] font-semibold text-soleil">
      {t("Rumeur, à confirmer", "Rumor, to be confirmed")}
    </span>
  );
}
