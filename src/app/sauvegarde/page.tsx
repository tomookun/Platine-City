import type { Metadata } from "next";
import { BackupPanel } from "@/components/backup-panel";

export const metadata: Metadata = {
  title: "Ma sauvegarde",
  description: "Exporte ou importe ta progression 100 % sans compte.",
  robots: { index: false },
};

export default function Sauvegarde() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-[49px] font-extrabold leading-[0.9]">Ma sauvegarde</h1>
      <p className="text-brume">Pas de compte : ta progression reste sur ce téléphone. Exporte-la pour la garder ou la transférer.</p>
      <BackupPanel />
    </div>
  );
}
