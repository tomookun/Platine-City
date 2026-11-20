"use client";

import Link from "next/link";
import { useEffect } from "react";
import { KIND_LABEL, changelog, type Change } from "@/data/changelog";
import { formatDay, type Paths } from "@/i18n/locale";
import { useI18n } from "@/i18n/locale-context";
import type { GameData } from "@/data/types";
import { isChangeNew, markFeedSeen } from "@/lib/seen";
import { updateSeen, useSeen } from "@/lib/seen-store";

function target(c: Change, p: Paths, game: GameData): string | undefined {
  if (c.link) return p[c.link];
  const first = c.categories?.[0];
  const cat = first ? game.categories.find((x) => x.id === first) : undefined;
  return cat ? p.category(cat.slug) : undefined;
}

/**
 * Fil « Quoi de neuf ». Les entrées publiées depuis la visite précédente
 * portent une pastille « Nouveau » ; ouvrir le fil compte comme une visite.
 */
export function NewsFeed({ limit }: { limit?: number }) {
  const seen = useSeen();
  const { t, p, game, locale } = useI18n();
  const entries = changelog.slice(0, limit);

  useEffect(() => {
    updateSeen((s) => markFeedSeen(s));
  }, []);

  return (
    <ol className="flex flex-col">
      {entries.map((c) => {
        const isNew = seen !== null && isChangeNew(seen, c);
        const href = target(c, p, game);
        const text = locale === "en" ? c.en : c;
        const content = (
          <>
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
              {isNew && (
                <span className="rounded-full bg-rose px-2 py-0.5 font-bold text-nuit">
                  {t("Nouveau", "New")}
                </span>
              )}
              <span
                className={
                  c.kind === "verification"
                    ? "font-semibold text-lagon"
                    : "font-semibold text-soleil"
                }
              >
                {t(...KIND_LABEL[c.kind])}
              </span>
              <time dateTime={c.at} className="text-brume">
                {formatDay(locale, c.at)}
              </time>
            </span>
            <span className="text-[17px] font-semibold">{text.title}</span>
            {text.body && (
              <span className="text-[15px] text-brume">{text.body}</span>
            )}
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
