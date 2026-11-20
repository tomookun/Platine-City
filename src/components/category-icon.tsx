/**
 * Pictogrammes des catégories : dessins au trait originaux (24×24),
 * aucun visuel du jeu. Couleur héritée du texte (`currentColor`).
 */
const paths: Record<string, string> = {
  histoire:
    "M4 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z",
  taches: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  gangs: "M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM9 12l2 2 4-4",
  braquages: "M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M3 10l9-6 9 6z",
  prets:
    "M3 7h18v10H3zM12 9.5v5M10 10.5c0-.8.9-1 2-1s2 .4 2 1.2-1 1.1-2 1.3-2 .5-2 1.3.9 1.2 2 1.2 2-.3 2-1",
  "casses-eclair": "M6 4h12l3 5-9 11L3 9zM3 9h18M9 4l-1 5 4 11 4-11-1-5",
  "hold-up":
    "M4 9l1-5h14l1 5M4 9h16v11H4zM4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M10 20v-5h4v5",
  coffres:
    "M4 4h16v15H4zM6 19v2M18 19v2M12 8.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 8.5V7M15 11.5h1.5",
  kenton: "M5 9h3a2 2 0 1 1 4 0h3v4a2 2 0 1 1 0 4v3H5v-4a2 2 0 1 0 0-4z",
  cartes:
    "M8 3h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM7 6H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2M13 8l1.5 2.5L13 13l-1.5-2.5z",
  waink:
    "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 9V7h2M15 7h2v2M17 13v2h-2M11 15H9v-2M11 18h2",
  "sous-marin":
    "M2 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M12 11v10M8 17a4 4 0 0 0 8 0M9 13h6",
  magazines: "M5 3h11l3 3v15H5zM16 3v3h3M8 9h8M8 13h8M8 17h5",
  meditation:
    "M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM6 20c2-1 4-1.5 6-1.5s4 .5 6 1.5M12 10v5M8 13l4 2 4-2M5 17l3-4M19 17l-3-4",
  flamants:
    "M10 21v-6M10 15c-4 0-5-3-5-5s2-4 5-4c2 0 3-1 3-2.5S12 1 11 1.5M10 6c3 0 7 1 7 5 0 2.5-2 4-7 4M13 3.5l3 1M10 21l3 0",
  playlists:
    "M9 18V6l11-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM9 10l11-2",
  styles: "M8 3l-5 3 2 5 2-1v11h10V10l2 1 2-5-5-3c0 1.7-1.3 3-3 3s-3-1.3-3-3z",
  courses: "M5 21V4M5 4h13l-2 4 2 4H5M9 4v8M13 4v8",
  "defis-course":
    "M8 3h8l-2 6h-4zM12 9a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM12 12.5l1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 14.8l2-.3z",
  tir: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  "jeux-video":
    "M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6L14 14h-4l-1 1.6A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4zM7 10.5v3M5.5 12h3M16 11h.01M18 13h.01",
  billard:
    "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 8a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM12 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 12a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z",
  "mini-golf": "M9 20V3l8 3.5L9 10M4 20c0-1.7 3.6-3 8-3s8 1.3 8 3M15 18.5h.01",
  basket:
    "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3v18M5.6 5.6c3 2.7 3 10.1 0 12.8M18.4 5.6c-3 2.7-3 10.1 0 12.8",
  drones:
    "M9 10h6v4H9zM9 10L6 7M15 10l3-3M9 14l-3 3M15 14l3 3M3.5 7h5M15.5 7h5M3.5 17h5M15.5 17h5",
  cascades: "M2 20h20M4 20l10-7h4M14 13v7M17 9l1.5-2M20 10l1.5-1M16 6l.5-2.5",
  defis:
    "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
  bret: "M4 6h11v14H4zM15 9l4-1 2 12-6 1M9.5 10a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM9.5 12.5v1",
  vehicules:
    "M3 16v-3l2-5h14l2 5v3zM3 16v2h3v-2M18 16v2h3v-2M5 13h14M7.5 13.5h.01M16.5 13.5h.01",
  armes: "M12 2v5M12 17v5M2 12h5M17 12h5M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z",
  animaux:
    "M12 13c-3 0-5 2.5-5 5 0 1.5 1.2 2.5 2.7 2.5 1 0 1.5-.5 2.3-.5s1.3.5 2.3.5c1.5 0 2.7-1 2.7-2.5 0-2.5-2-5-5-5zM6 7.5a1.8 2.3 0 1 0 0 .1zM10 4.5a1.8 2.3 0 1 0 0 .1zM14 4.5a1.8 2.3 0 1 0 0 .1zM18 7.5a1.8 2.3 0 1 0 0 .1z",
  reventes:
    "M12 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12 5.5v5M10.5 6.5c0-.5.6-.8 1.5-.8s1.5.3 1.5.9-.6.8-1.5.9-1.5.4-1.5 1 .6.9 1.5.9 1.5-.2 1.5-.8M3 16h4l3 2h5a1.5 1.5 0 0 1 0 3H9M3 21h15l3-4",
};

const fallback = "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9 12l2 2 4-4";

export function CategoryIcon({
  id,
  size = 24,
  className = "",
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d={paths[id] ?? fallback} />
    </svg>
  );
}

/** Ids qui ont un pictogramme dédié (pour les tests). */
export const ICON_IDS = Object.keys(paths);
