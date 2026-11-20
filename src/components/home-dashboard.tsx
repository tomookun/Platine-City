"use client";

import Link from "next/link";
import { SITE_NAME } from "@/data/game";
import { useI18n } from "@/i18n/locale-context";
import { categoryProgress, globalProgress, increment } from "@/lib/progress";
import { isSaved, updateProgress, useProgress } from "@/lib/progress-store";
import { ShareButton } from "./share-button";
import { ViceSky } from "./vice-sky";

export function HomeDashboard() {
  const progress = useProgress();
  const { t, p: paths, game, nf } = useI18n();
  const global = progress ? globalProgress(game, progress) : null;

  const resume = progress
    ? (game.categories.find((c) => c.id === progress.lastCategoryId) ??
      game.categories.find(
        (c) =>
          categoryProgress(progress, c).done <
          categoryProgress(progress, c).total,
      ) ??
      game.categories[0])
    : game.categories[0];
  const r = progress ? categoryProgress(progress, resume) : null;

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="global"
        className="relative -mx-4 -mt-5 overflow-hidden bg-[linear-gradient(180deg,#0d1222_0%,#1b1436_38%,#3a1446_62%,#7a1d55_80%,#c2185b_100%)]"
      >
        <div className="relative z-10 flex flex-col gap-1 px-4 pt-4">
          <header className="flex items-center justify-between">
            <span className="font-display text-[26px] font-extrabold tracking-[0.5px] text-rose [text-shadow:0_0_18px_rgba(255,92,147,0.55)]">
              {SITE_NAME}
            </span>
            <Link
              href={paths.backup}
              className={`flex min-h-11 items-center text-[13px] underline-offset-4 hover:underline ${
                progress && !isSaved()
                  ? "font-semibold text-soleil"
                  : "text-brume"
              }`}
            >
              {progress === null
                ? t("Ma sauvegarde", "My backup")
                : isSaved()
                  ? t("Sauvegardé sur ce téléphone", "Saved on this phone")
                  : t(
                      "Sauvegarde bloquée, exporte-la",
                      "Saving blocked, export it",
                    )}
            </Link>
          </header>
          <h1
            id="global"
            className="mt-2 text-[13px] font-bold uppercase tracking-[0.18em] text-lagon"
          >
            {t("Ton 100 % GTA 6", "Your GTA 6 100%")}
          </h1>
          <p className="font-display tabular text-[96px] font-extrabold leading-[0.82] [text-shadow:0_4px_30px_rgba(13,18,34,0.6)]">
            {global ? t(`${global.percent} %`, `${global.percent}%`) : "–"}
          </p>
          <p className="text-[15px] text-sable/80">
            {global
              ? t(
                  `${nf.format(global.done)} objectifs sur ${nf.format(global.total)}`,
                  `${nf.format(global.done)} of ${nf.format(global.total)} goals`,
                )
              : t("Chargement de ta progression", "Loading your progress")}
          </p>
        </div>
        <div className="-mt-10">
          <ViceSky percent={global?.percent ?? 0} />
        </div>
      </section>

      {global && global.done > 0 && (
        <div className="-mt-3">
          <ShareButton stats={global} />
        </div>
      )}

      <section
        aria-labelledby="reprendre"
        className="flex flex-col gap-3 rounded-feuille border border-ligne bg-surface/80 p-4 shadow-[0_12px_40px_-16px_rgba(255,92,147,0.35)]"
      >
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brume">
          {t("Reprendre", "Pick up where you left off")}
        </p>
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="reprendre" className="text-xl font-bold leading-tight">
            <Link href={paths.category(resume.slug)}>{resume.name}</Link>
          </h2>
          <span className="shrink-0 whitespace-nowrap font-display tabular text-[26px] font-bold leading-none">
            {r ? `${r.done} / ${r.total}` : `– / ${resume.required}`}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-ligne" aria-hidden="true">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-rose to-soleil transition-[width] duration-300"
            style={{ width: `${r ? (r.done / r.total) * 100 : 0}%` }}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label={t(
              `Retirer 1 ${resume.unit}`,
              `Remove 1 ${resume.unit}`,
            )}
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
            className="h-12 flex-1 rounded-[10px] bg-rose text-[17px] font-bold text-nuit shadow-[0_8px_24px_-8px_rgba(255,92,147,0.8)] transition-transform active:scale-[0.97] disabled:opacity-40"
          >
            +1 {resume.unit}
          </button>
        </div>
      </section>
    </div>
  );
}
