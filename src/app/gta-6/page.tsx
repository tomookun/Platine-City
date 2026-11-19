import type { Metadata } from "next";
import { CategoryList } from "@/components/category-list";
import { GAME_BASE } from "@/data/game";

export const metadata: Metadata = {
  title: "GTA 6 à 100 % : checklist complète en français",
  description:
    "Les 32 objectifs du 100 % de GTA 6 en français : combien sont requis, combien existent, et ta progression cochée même hors ligne.",
  alternates: { canonical: GAME_BASE },
};

export default function ChecklistIndex() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-[49px] font-extrabold leading-[0.9]">GTA 6 à 100 %</h1>
      <p className="text-brume">
        Ce qu&apos;il faut vraiment faire pour le 100 %, catégorie par catégorie. Ta progression reste sur ce téléphone, même hors ligne.
      </p>
      <CategoryList />
    </div>
  );
}
