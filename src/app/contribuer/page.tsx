import type { Metadata } from "next";
import { ContributionForm } from "@/components/contribution-form";

export const metadata: Metadata = {
  title: "Contribuer : signaler un emplacement GTA 6",
  description:
    "Signale un emplacement ou corrige une info sur GTA 6. Chaque proposition est relue avant publication.",
  alternates: { canonical: "/contribuer" },
};

export default function Contribuer() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-[49px] font-extrabold leading-[0.9]">
        Contribuer
      </h1>
      <p className="text-brume">
        Tu as trouvé un emplacement ou une erreur ? Dis-le-nous. Chaque
        proposition est relue et vérifiée en jeu avant d&apos;être publiée.
      </p>
      <ContributionForm />
    </div>
  );
}
