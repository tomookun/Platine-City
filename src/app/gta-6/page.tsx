import type { Metadata } from "next";
import { CategoryList } from "@/components/category-list";
import { GAME_BASE } from "@/data/game";

export const metadata: Metadata = {
  title: "GTA 6 à 100 % : checklist complète en français",
  description:
    "Toutes les catégories du 100 % de GTA 6 : histoire, braquages, cascades, animaux, véhicules. Coche et suis ton pourcentage, même hors ligne.",
  alternates: { canonical: GAME_BASE },
};

export default function ChecklistIndex() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-[49px] font-extrabold leading-[0.9]">GTA 6 à 100 %</h1>
      <p className="text-brume">Choisis une catégorie. Ta progression reste sur ce téléphone, même hors ligne.</p>
      <CategoryList />
    </div>
  );
}
