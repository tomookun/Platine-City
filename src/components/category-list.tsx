"use client";

import Link from "next/link";
import { changelog } from "@/data/changelog";
import { useI18n } from "@/i18n/locale-context";
import { categoryProgress } from "@/lib/progress";
import { useProgress } from "@/lib/progress-store";
import { isCategoryNew } from "@/lib/seen";
import { useSeen } from "@/lib/seen-store";
import { CategoryIcon } from "./category-icon";
import { SectionTitle } from "./section-title";

export function CategoryList() {
  const progress = useProgress();
  const seen = useSeen();
  const { t, p, game } = useI18n();
  return (
    <div className="flex flex-col gap-7">
      {game.sections.map((section) => {
        const cats = game.categories.filter((c) => c.section === section.id);
        if (cats.length === 0) return null;
        return (
          <section
            key={section.id}
            aria-labelledby={`section-${section.id}`}
            className="flex flex-col gap-3"
          >
            <SectionTitle id={`section-${section.id}`} level={3}>
              {section.name}
            </SectionTitle>
            <ul className="grid grid-cols-2 gap-2.5">
              {cats.map((cat) => {
                const r = progress ? categoryProgress(progress, cat) : null;
                const complete = r !== null && r.done === r.total;
                const bonus = r !== null && r.all > r.total;
                const fresh =
                  seen !== null && isCategoryNew(seen, cat.id, changelog);
                return (
                  <li key={cat.id}>
                    <Link
                      href={p.category(cat.slug)}
                      className={`group relative flex h-full min-h-[136px] flex-col justify-between gap-3 overflow-hidden rounded-feuille border bg-surface p-3 transition-colors active:scale-[0.98] ${
                        complete
                          ? "border-lagon/70"
                          : "border-ligne hover:border-rose/60"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                            complete
                              ? "bg-lagon text-nuit"
                              : "bg-nuit text-rose"
                          }`}
                        >
                          <CategoryIcon id={cat.id} size={22} />
                        </span>
                        {fresh && (
                          <span className="rounded-full bg-rose px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-nuit">
                            {t("Nouveau", "New")}
                          </span>
                        )}
                      </span>
                      <span className="text-[15px] font-semibold leading-tight">
                        {cat.name}
                      </span>
                      <span className="flex flex-col gap-1.5">
                        <span className="flex items-baseline justify-between gap-1">
                          <span
                            className={`font-display tabular text-[24px] font-bold leading-none ${complete ? "text-lagon" : ""}`}
                          >
                            {r ? r.done : "–"}
                            <span className="text-[15px] font-semibold text-brume">
                              {" "}
                              / {cat.required}
                            </span>
                          </span>
                          {bonus && (
                            <span className="text-[12px] font-semibold text-soleil">
                              +{r.all - r.total}
                            </span>
                          )}
                        </span>
                        <span
                          className="h-1 rounded-full bg-ligne"
                          aria-hidden="true"
                        >
                          <span
                            className={`block h-1 rounded-full transition-[width] duration-500 ${complete ? "bg-lagon" : "bg-gradient-to-r from-rose to-soleil"}`}
                            style={{
                              width: `${r ? (r.done / r.total) * 100 : 0}%`,
                            }}
                          />
                        </span>
                      </span>
                      {complete && (
                        <span className="sr-only">{t("Terminé", "Done")}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
