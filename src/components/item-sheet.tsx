"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { getDetails } from "@/data/details";
import type { Category, ChecklistItem } from "@/data/types";
import { CategoryIcon } from "./category-icon";
import { ReliabilityBadge } from "./reliability-badge";
import { YouTubeEmbed } from "./youtube-embed";

/**
 * Fiche d'un objet, en feuille qui monte du bas : lieu, accès, vidéos,
 * photos. Sans contenu, elle invite à contribuer.
 */
export function ItemSheet({
  cat,
  item,
  done,
  hidden,
  onToggle,
  onClose,
}: {
  cat: Category;
  item: ChecklistItem | null;
  done: boolean;
  hidden: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  const details = item ? getDetails(item.id) : undefined;
  const media = hidden ? [] : (details?.media ?? []);
  const title = item
    ? hidden
      ? `${cat.unit[0].toUpperCase()}${cat.unit.slice(1)} ${item.n} (titre masqué)`
      : item.title
    : "";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Toucher le fond ferme la fiche.
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      aria-labelledby="fiche-titre"
      className="mx-auto mb-0 mt-auto max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-t-[20px] bg-surface p-0 text-sable backdrop:bg-nuit/80"
    >
      {item && (
        <div className="flex flex-col gap-4 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3">
          <span
            className="mx-auto h-1.5 w-10 rounded-full bg-contour"
            aria-hidden="true"
          />
          <div className="flex items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-feuille bg-nuit text-rose">
              <CategoryIcon id={cat.id} size={28} />
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <h2
                id="fiche-titre"
                className="font-display text-[31px] font-bold leading-[0.95]"
              >
                {title}
              </h2>
              {item.where && (
                <p className="text-[15px] text-brume">{item.where}</p>
              )}
              <ReliabilityBadge value={item.reliability} />
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Fermer la fiche"
              className="-mr-2 -mt-1 flex size-11 shrink-0 items-center justify-center rounded-full text-brume"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {hidden ? (
            <p className="rounded-feuille border border-ligne p-4 text-brume">
              Détails masqués par l&apos;anti-spoiler. Désactive-le (œil en bas
              de la liste) pour les voir.
            </p>
          ) : (
            <>
              {details?.how && (
                <section
                  aria-label="Comment y aller"
                  className="flex flex-col gap-1"
                >
                  <h3 className="text-[13px] font-semibold uppercase tracking-wide text-lagon">
                    Comment y aller
                  </h3>
                  <p className="text-[17px] leading-relaxed">{details.how}</p>
                </section>
              )}
              {media.map((m, i) =>
                "youtube" in m ? (
                  <YouTubeEmbed
                    key={i}
                    link={m.youtube}
                    credit={m.credit}
                    title={item.title}
                  />
                ) : (
                  <figure key={i} className="flex flex-col gap-1.5">
                    <Image
                      src={m.image}
                      alt={m.alt}
                      width={1280}
                      height={720}
                      sizes="(max-width: 640px) 100vw, 576px"
                      className="aspect-video w-full rounded-case object-cover"
                    />
                    <figcaption className="text-[13px] text-brume">
                      Photo : {m.credit}
                    </figcaption>
                  </figure>
                ),
              )}
              {media.length === 0 && !details?.how && (
                <p className="rounded-feuille border border-ligne p-4 text-brume">
                  Pas encore de vidéo ni de photo pour cet objet. Tu sais où il
                  est ?{" "}
                  <Link
                    href="/contribuer"
                    className="text-rose underline underline-offset-4"
                  >
                    Envoie l&apos;emplacement
                  </Link>
                  , tu seras crédité.
                </p>
              )}
              {media.length > 0 && (
                <Link
                  href="/contribuer"
                  className="text-[15px] text-rose underline underline-offset-4"
                >
                  Une erreur, une meilleure photo ? Propose-la
                </Link>
              )}
            </>
          )}

          <button
            type="button"
            onClick={onToggle}
            aria-pressed={done}
            className={`h-12 rounded-[10px] text-[17px] font-bold active:scale-[0.97] ${
              done ? "border border-contour text-sable" : "bg-rose text-nuit"
            }`}
          >
            {done ? "Décocher" : "Cocher comme fait"}
          </button>
        </div>
      )}
    </dialog>
  );
}
