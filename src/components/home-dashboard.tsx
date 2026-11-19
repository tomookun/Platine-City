"use client";

import Link from "next/link";
import { SITE_NAME, categoryPath, game } from "@/data/game";
import { categoryProgress, globalProgress, increment } from "@/lib/progress";
import { isSaved, updateProgress, useProgress } from "@/lib/progress-store";
import { Sun } from "./sun";

const nf = new Intl.NumberFormat("fr-FR");

export function HomeDashboard() {
  const progress = useProgress();
  const global = progress ? globalProgress(game, progress) : null;

  const resume = progress
    ? (game.categories.find((c) => c.id === progress.lastCategoryId) ??
      game.categories.find((c) => categoryProgress(progress, c).done < categoryProgress(progress, c).total) ??
      game.categories[0])
    : game.categories[0];
  const r = progress ? categoryProgress(progress, resume) : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <span className="font-display text-[26px] font-extrabold tracking-[0.5px] text-rose">{SITE_NAME}</span>
        <Link
          href="/sauvegarde"
          className={`flex min-h-11 items-center text-[13px] underline-offset-4 hover:underline ${
            progress && !isSaved() ? "font-semibold text-soleil" : "text-brume"
          }`}
        >
          {progress === null ? "Ma sauvegarde" : isSaved() ? "Sauvegardé sur ce téléphone" : "Sauvegarde bloquée, exporte-la"}
        </Link>
      </header>

      <section aria-labelledby="global" className="flex items-end gap-4">
        <Sun percent={global?.percent ?? 0} />
        <div className="flex flex-col gap-0.5 pb-1">
          <h1 id="global" className="sr-only">Progression globale</h1>
          <span className="font-display tabular text-[88px] font-extrabold leading-[0.85]">
            {global ? `${global.percent} %` : "– %"}
          </span>
          <span className="text-[15px] text-brume">
            {global ? `${nf.format(global.done)} objectifs sur ${nf.format(global.total)}` : "Chargement de ta progression"}
          </span>
        </div>
      </section>

      <section aria-labelledby="reprendre" className="flex flex-col gap-3 rounded-feuille bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <h2 id="reprendre" className="text-xl font-bold">
            <Link href={categoryPath(resume.slug)}>{resume.name}</Link>
          </h2>
          <span className="tabular text-xl font-bold">{r ? `${r.done} / ${r.total}` : `– / ${resume.required}`}</span>
        </div>
        <div className="h-1.5 rounded-full bg-ligne" aria-hidden="true">
          <div
            className="h-1.5 rounded-full bg-lagon transition-[width] duration-300"
            style={{ width: `${r ? (r.done / r.total) * 100 : 0}%` }}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label={`Retirer 1 ${resume.unit}`}
            disabled={!progress || r?.done === 0}
            onClick={() => updateProgress((p) => increment(resume, p, -1))}
            className="h-12 w-14 rounded-[10px] border border-contour text-2xl active:scale-95 disabled:opacity-40"
          >
            −
          </button>
          <button
            type="button"
            disabled={!progress || r?.all === r?.max}
            onClick={() => updateProgress((p) => increment(resume, p, 1))}
            className="h-12 flex-1 rounded-[10px] bg-rose text-[17px] font-bold text-nuit transition-transform active:scale-[0.97] disabled:opacity-40"
          >
            +1 {resume.unit}
          </button>
        </div>
      </section>
    </div>
  );
}
