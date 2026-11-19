import type { Reliability } from "@/data/types";

const fmt = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/**
 * `about` : « jeu » pour une info vérifiée dans GTA 6, « site » pour un
 * contenu sur Platine City lui-même (pas de « vérifié en jeu » trompeur).
 */
export function ReliabilityBadge({ value, about = "jeu" }: { value: Reliability; about?: "jeu" | "site" }) {
  if (value.status === "verified") {
    const label = about === "jeu" ? "Vérifié en jeu le" : "Mis à jour le";
    return <span className="text-[13px] font-semibold text-lagon">{label} {fmt(value.verifiedAt)}</span>;
  }
  return <span className="text-[13px] font-semibold text-soleil">Rumeur, à confirmer</span>;
}
