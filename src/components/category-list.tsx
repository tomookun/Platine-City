"use client";

import Link from "next/link";
import { categoryPath, game } from "@/data/game";
import { categoryProgress } from "@/lib/progress";
import { useProgress } from "@/lib/progress-store";

export function CategoryList() {
  const progress = useProgress();
  return (
    <ul className="border-b border-ligne">
      {game.categories.map((cat) => {
        const r = progress ? categoryProgress(progress, cat) : null;
        const complete = r !== null && r.done === r.total;
        return (
          <li key={cat.id} className="border-t border-ligne">
            <Link
              href={categoryPath(cat.slug)}
              className="grid min-h-[64px] grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 py-3"
            >
              <span className="text-[17px] font-semibold">{cat.name}</span>
              <span className="tabular text-[15px] text-brume">
                {r ? `${r.done} / ${r.total}` : `– / ${cat.total}`}
              </span>
              <span className="col-span-2 h-1 rounded-full bg-ligne" aria-hidden="true">
                <span
                  className="block h-1 rounded-full bg-lagon transition-[width] duration-500"
                  style={{ width: `${r ? (r.done / r.total) * 100 : 0}%` }}
                />
              </span>
              {complete && <span className="sr-only">Terminé</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
