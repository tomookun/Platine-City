"use client";

import Link from "next/link";
import { changelog } from "@/data/changelog";
import { categoryPath, game } from "@/data/game";
import { categoryProgress } from "@/lib/progress";
import { CategoryIcon } from "./category-icon";
import { useProgress } from "@/lib/progress-store";
import { isCategoryNew } from "@/lib/seen";
import { useSeen } from "@/lib/seen-store";

export function CategoryList() {
  const progress = useProgress();
  const seen = useSeen();
  return (
    <div className="flex flex-col gap-6">
      {game.sections.map((section) => {
        const cats = game.categories.filter((c) => c.section === section.id);
        if (cats.length === 0) return null;
        return (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <h2
              id={`section-${section.id}`}
              className="mb-1 font-display text-[25px] font-bold"
            >
              {section.name}
            </h2>
            <ul className="border-b border-ligne">
              {cats.map((cat) => {
                const r = progress ? categoryProgress(progress, cat) : null;
                const complete = r !== null && r.done === r.total;
                const bonus = r !== null && r.all > r.total;
                const fresh =
                  seen !== null && isCategoryNew(seen, cat.id, changelog);
                return (
                  <li key={cat.id} className="border-t border-ligne">
                    <Link
                      href={categoryPath(cat.slug)}
                      className="grid min-h-[64px] grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 py-3"
                    >
                      <span className="flex items-center gap-2.5 text-[17px] font-semibold">
                        <CategoryIcon
                          id={cat.id}
                          className={complete ? "text-lagon" : "text-rose"}
                        />
                        {cat.name}
                        {fresh && (
                          <span className="rounded-full bg-rose px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-nuit">
                            Nouveau
                          </span>
                        )}
                      </span>
                      <span
                        className={`tabular text-[15px] ${complete ? "font-bold text-lagon" : "text-brume"}`}
                      >
                        {r ? `${r.done} / ${r.total}` : `– / ${cat.required}`}
                        {bonus && (
                          <span className="text-[13px] font-normal text-brume">
                            {" "}
                            (+{r.all - r.total})
                          </span>
                        )}
                      </span>
                      <span
                        className="col-span-2 h-1 rounded-full bg-ligne"
                        aria-hidden="true"
                      >
                        <span
                          className="block h-1 rounded-full bg-lagon transition-[width] duration-500"
                          style={{
                            width: `${r ? (r.done / r.total) * 100 : 0}%`,
                          }}
                        />
                      </span>
                      {complete && <span className="sr-only">Terminé</span>}
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
