import { YouTubeEmbed } from "./youtube-embed";

/**
 * Trailers officiels, intégrés depuis la chaîne YouTube de Rockstar Games
 * (vérifié : auteur « Rockstar Games »). Intégration, pas copie : la vidéo
 * reste chez Rockstar et ne se charge qu'au toucher.
 */
const TRAILERS = [
  { title: "Trailer 2", link: "https://www.youtube.com/watch?v=VQRLujxTm3c" },
  { title: "Trailer 1", link: "https://www.youtube.com/watch?v=QdBZY2fkU-0" },
];

export function OfficialTrailers() {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      {TRAILERS.map((t) => (
        <div key={t.link} className="w-[85%] shrink-0 snap-center">
          <YouTubeEmbed
            link={t.link}
            credit={`Rockstar Games, ${t.title}`}
            title={`GTA 6 ${t.title}`}
          />
        </div>
      ))}
    </div>
  );
}
