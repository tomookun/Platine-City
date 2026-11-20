"use client";

import { useState } from "react";
import { formatTime, parseYouTube } from "@/lib/youtube";
import { useI18n } from "@/i18n/locale-context";

/**
 * Vidéo YouTube « légère » : seule la miniature est chargée ; le lecteur
 * (et YouTube) ne se charge qu'au toucher, en mode sans cookies.
 * La vidéo reste chez son créateur : intégration, pas copie.
 */
export function YouTubeEmbed({
  link,
  credit,
  title,
}: {
  link: string;
  credit: string;
  title: string;
}) {
  const { t } = useI18n();
  const ref = parseYouTube(link);
  const [playing, setPlaying] = useState(false);
  if (!ref) return null;
  const { id, start } = ref;
  const at = start
    ? t(` à ${formatTime(start)}`, ` at ${formatTime(start)}`)
    : "";

  return (
    <figure className="flex flex-col gap-1.5">
      <div className="relative aspect-video overflow-hidden rounded-case bg-nuit">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?start=${start}&autoplay=1&rel=0&playsinline=1`}
            title={t(`Vidéo : ${title}`, `Video: ${title}`)}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t(
              `Lire la vidéo de ${credit}${at}`,
              `Play the video by ${credit}${at}`,
            )}
            className="group absolute inset-0 size-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- miniature externe, chargée à la demande */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose text-nuit shadow-lg">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {start > 0 && (
              <span className="tabular absolute bottom-2 right-2 rounded-case bg-nuit/90 px-2 py-0.5 text-[13px] font-semibold text-sable">
                {formatTime(start)}
              </span>
            )}
          </button>
        )}
      </div>
      <figcaption className="flex flex-wrap justify-between gap-x-3 text-[13px] text-brume">
        <span>
          {t("Vidéo : ", "Video: ")}
          {credit}
          {at}
        </span>
        <a
          href={`https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lagon underline-offset-4 hover:underline"
        >
          {t("Voir sur YouTube", "Watch on YouTube")}
        </a>
      </figcaption>
    </figure>
  );
}
