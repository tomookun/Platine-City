import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { CategoryList } from "@/components/category-list";
import { GuideList } from "@/components/guide-list";
import { HomeDashboard } from "@/components/home-dashboard";
import { NewsFeed } from "@/components/news-feed";
import { game } from "@/data/game";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <HomeDashboard />

      <section aria-labelledby="neuf" className="flex flex-col gap-1">
        <h2 id="neuf" className="font-display text-[25px] font-bold">
          Quoi de neuf
        </h2>
        <NewsFeed limit={3} />
        <Link
          href="/nouveautes"
          className="inline-flex min-h-11 items-center text-[15px] text-rose underline underline-offset-4"
        >
          Toutes les nouveautés
        </Link>
      </section>

      <section aria-labelledby="cent" className="flex flex-col">
        <h2 id="cent" className="mb-2 font-display text-[25px] font-bold">
          Ton 100 %
        </h2>
        <CategoryList />
      </section>

      <section aria-labelledby="guides" className="flex flex-col gap-2">
        <h2 id="guides" className="font-display text-[25px] font-bold">
          Guides vérifiés
        </h2>
        <GuideList limit={3} />
        <Link
          href="/contribuer"
          className="text-[15px] text-rose underline underline-offset-4"
        >
          Tu as une info ? Propose-la
        </Link>
      </section>

      <AdSlot id="home-bas" />

      <p className="rounded-case border border-soleil/60 px-3 py-2 text-[13px] text-soleil">
        {game.sample
          ? "Données d'exemple : la liste réelle sera saisie après vérification en jeu."
          : `Données mises à jour le ${game.updatedAt.split("-").reverse().join("/")}. Le jeu vient de sortir : les chiffres sont recoupés entre plusieurs sources et confirmés en jeu au fur et à mesure.`}
      </p>
    </div>
  );
}
