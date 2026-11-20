"use client";

import Link from "next/link";
import { publishedGuides } from "@/content/guides";
import { useI18n } from "@/i18n/locale-context";
import { ReliabilityBadge } from "./reliability-badge";

export function GuideList({ limit }: { limit?: number }) {
  const { t, p, locale } = useI18n();
  const guides = publishedGuides(locale).slice(0, limit);
  return (
    <ul className="flex flex-col">
      {guides.map((g) => (
        <li
          key={g.slug}
          className="border-t border-ligne py-3 first:border-t-0 first:pt-0"
        >
          <Link href={p.guide(g.slug)} className="flex flex-col gap-1">
            <span className="text-[17px] font-semibold">{g.title}</span>
            <span className="flex flex-wrap gap-x-3">
              <ReliabilityBadge value={g.reliability} about={g.about} />
              <span className="text-[13px] text-brume">
                {t(
                  `${g.readingMinutes} min de lecture`,
                  `${g.readingMinutes} min read`,
                )}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
