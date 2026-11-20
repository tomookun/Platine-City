import type { Metadata } from "next";
import Link from "next/link";
import { GuideList } from "@/components/guide-list";

export const metadata: Metadata = {
  title: "Guides GTA 6 en français, vérifiés en jeu",
  description:
    "Guides courts en français pour GTA 6, vérifiés en jeu et datés. Astuces, emplacements et 100 %.",
  alternates: { canonical: "/guides" },
};

export default function Guides() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-[49px] font-extrabold leading-[0.9]">
        Guides
      </h1>
      <p className="text-brume">
        Chaque guide est court, écrit en français et daté de sa dernière
        vérification en jeu.
      </p>
      <GuideList />
      <Link
        href="/contribuer"
        className="flex h-12 items-center justify-center rounded-[10px] border border-contour font-bold"
      >
        Proposer une info
      </Link>
    </div>
  );
}
