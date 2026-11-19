import type { Metadata } from "next";
import { NewsFeed } from "@/components/news-feed";

export const metadata: Metadata = {
  title: "Nouveautés GTA 6 : mises à jour du 100 % et des missions",
  description:
    "Tout ce qui change sur Platine City : nouveaux objectifs du 100 % de GTA 6, emplacements vérifiés en jeu, corrections. Mis à jour chaque jour.",
  alternates: { canonical: "/nouveautes" },
};

export default function NouveautesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-[49px] font-extrabold leading-[0.9]">Quoi de neuf</h1>
      <p className="text-brume">
        Chaque ajout, vérification en jeu ou correction, du plus récent au plus ancien.
      </p>
      <NewsFeed />
    </div>
  );
}
