import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { CategoryList } from "@/components/category-list";
import { GuideList } from "@/components/guide-list";
import { HomeDashboard } from "@/components/home-dashboard";
import { NewsFeed } from "@/components/news-feed";
import { OfficialTrailers } from "@/components/official-trailers";
import { SectionTitle } from "@/components/section-title";
import { game } from "@/data/game";

const more =
  "inline-flex min-h-11 items-center text-[15px] font-semibold text-rose";

export default function Home() {
  return (
    <div className="flex flex-col gap-9">
      <HomeDashboard />

      <section aria-labelledby="neuf" className="flex flex-col gap-2">
        <SectionTitle
          id="neuf"
          action={
            <Link href="/nouveautes" className={more}>
              Tout voir →
            </Link>
          }
        >
          Quoi de neuf
        </SectionTitle>
        <NewsFeed limit={3} />
      </section>

      <section aria-labelledby="objectifs" className="flex flex-col gap-4">
        <SectionTitle
          id="objectifs"
          action={
            <Link href="/gta-6" className={more}>
              Checklist →
            </Link>
          }
        >
          Tous les objectifs
        </SectionTitle>
        <CategoryList />
      </section>

      <section aria-labelledby="trailers" className="flex flex-col gap-3">
        <SectionTitle id="trailers">Les trailers officiels</SectionTitle>
        <OfficialTrailers />
      </section>

      <section aria-labelledby="guides" className="flex flex-col gap-2">
        <SectionTitle id="guides">Guides vérifiés</SectionTitle>
        <GuideList limit={3} />
        <Link href="/contribuer" className={more}>
          Tu as une info ? Propose-la →
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
