"use client";

import Link from "next/link";
import { useEffect } from "react";
import { KIND_LABEL, changelog, type Change } from "@/data/changelog";
import { categoryPath, game } from "@/data/game";
import { isChangeNew, markFeedSeen } from "@/lib/seen";
import { updateSeen, useSeen } from "@/lib/seen-store";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  });

function target(c: Change): string | undefined {
  if (c.href) return c.href;
  const first = c.categories?.[0];
  const cat = first ? game.categories.find((x) => x.id === first) : undefined;
  return cat ? categoryPath(cat.slug) : undefined;
}

/**
 * Fil « Quoi de neuf ». Les entrées publiées depuis la visite précédente
 * portent une pastille « Nouveau » ; ouvrir le fil compte comme une visite.
 */
export function NewsFeed({ limit }: { limit?: number }) {
  const seen = useSeen();
  const entries = changelog.slice(0, limit);

  useEffect(() => {
    updateSeen((s) => markFeedSeen(s));
  }, []);

  return (
    <ol className="flex flex-col">
      {entries.map((c) => {
        const isNew = seen !== null && isChangeNew(seen, c);
        const href = target(c);
        const content = (
          <>
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
              {isNew && (
                <span className="rounded-full bg-rose px-2 py-0.5 font-bold text-nuit">
                  Nouveau
                </span>
              )}
              <span
                className={
                  c.kind === "verification"
                    ? "font-semibold text-lagon"
                    : "font-semibold text-soleil"
                }
              >
                {KIND_LABEL[c.kind]}
              </span>
              <time dateTime={c.at} className="text-brume">
                {fmt(c.at)}
              </time>
            </span>
            <span className="text-[17px] font-semibold">{c.title}</span>
            {c.body && <span className="text-[15px] text-brume">{c.body}</span>}
          </>
        );
        return (
          <li key={c.id} className="border-t border-ligne first:border-t-0">
            {href ? (
              <Link href={href} className="flex min-h-16 flex-col gap-1 py-3">
                {content}
              </Link>
            ) : (
              <div className="flex flex-col gap-1 py-3">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
