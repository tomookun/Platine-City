import { useId } from "react";

/**
 * Scène signature : crépuscule sur la côte, soleil à rayures qui se lève
 * avec la progression (0 % = à l'horizon, 100 % = haut dans le ciel),
 * palmiers, mer et grille néon. Dessin original, aucun visuel du jeu.
 */
const FRONDS = [
  "M12 -110 Q -20 -122 -48 -94 Q -16 -112 12 -105 Z",
  "M12 -110 Q 46 -126 72 -96 Q 40 -114 12 -105 Z",
  "M12 -110 Q -6 -142 -34 -140 Q -4 -128 12 -107 Z",
  "M12 -110 Q 32 -144 58 -136 Q 28 -128 12 -107 Z",
  "M12 -110 Q -2 -98 -24 -70 Q 0 -96 14 -105 Z",
  "M12 -110 Q 32 -98 48 -68 Q 26 -96 12 -105 Z",
];

function Palm({
  x,
  y,
  scale,
  flip = false,
}: {
  x: number;
  y: number;
  scale: number;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
      className="fill-nuit stroke-nuit"
    >
      <path
        d="M0 0 C 2 -40, 3 -80, 12 -110"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {FRONDS.map((d) => (
        <path key={d} d={d} stroke="none" />
      ))}
    </g>
  );
}

export function ViceSky({ percent }: { percent: number | null }) {
  const uid = useId().replace(/:/g, "");
  const p = Math.min(100, Math.max(0, percent ?? 0)) / 100;
  const horizon = 128;
  const r = 66;
  // À 0 % on voit déjà le haut du disque ; à 100 % il est entièrement levé.
  const rise = 22 + (2 * r + 10 - 22) * p;

  return (
    <svg
      viewBox="0 0 400 210"
      preserveAspectRatio="xMidYMax slice"
      className="block h-[190px] w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`soleil-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb861" />
          <stop offset="0.55" stopColor="#ff7a8a" />
          <stop offset="1" stopColor="#ff5c93" />
        </linearGradient>
        <linearGradient id={`mer-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24163f" />
          <stop offset="1" stopColor="#0d1222" />
        </linearGradient>
        <clipPath id={`ciel-${uid}`}>
          <rect x="0" y="0" width="400" height={horizon} />
        </clipPath>
        {/* Rayures : bandes transparentes de plus en plus larges vers l'horizon */}
        <mask
          id={`rayures-${uid}`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="400"
          height="210"
        >
          <rect x="0" y="0" width="400" height="210" fill="white" />
          <rect x="0" y={horizon - 44} width="400" height="3" fill="black" />
          <rect x="0" y={horizon - 33} width="400" height="4.5" fill="black" />
          <rect x="0" y={horizon - 21} width="400" height="6" fill="black" />
          <rect x="0" y={horizon - 9} width="400" height="7.5" fill="black" />
        </mask>
      </defs>

      {/* Étoiles */}
      {[
        [34, 18],
        [92, 40],
        [150, 12],
        [262, 26],
        [318, 10],
        [372, 44],
        [222, 50],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="1.1"
          className="fill-sable"
          opacity="0.55"
        />
      ))}

      {/* Soleil */}
      <g clipPath={`url(#ciel-${uid})`} mask={`url(#rayures-${uid})`}>
        <circle
          cx="200"
          cy={horizon + r}
          r={r}
          fill={`url(#soleil-${uid})`}
          className="transition-transform duration-[1200ms] ease-out"
          style={{ transform: `translateY(-${rise}px)` }}
        />
      </g>

      {/* Mer */}
      <rect
        x="0"
        y={horizon}
        width="400"
        height={210 - horizon}
        fill={`url(#mer-${uid})`}
      />

      {/* Grille néon en perspective */}
      <g className="stroke-lagon" strokeWidth="0.8" opacity="0.28">
        {Array.from({ length: 17 }, (_, i) => -400 + i * 75).map((x) => (
          <line key={x} x1="200" y1={horizon} x2={x} y2="210" />
        ))}
        {[134, 142, 154, 170, 192].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>

      {/* Reflet du soleil */}
      {[
        [horizon + 6, 118, 0.7],
        [horizon + 14, 86, 0.5],
        [horizon + 24, 56, 0.35],
        [horizon + 37, 28, 0.2],
      ].map(([y, w, o]) => (
        <rect
          key={y}
          x={200 - w / 2}
          y={y}
          width={w}
          height="2.4"
          rx="1.2"
          className="fill-rose"
          opacity={o * (0.35 + 0.65 * p)}
        />
      ))}

      <line
        x1="0"
        y1={horizon}
        x2="400"
        y2={horizon}
        strokeWidth="1.5"
        className="stroke-lagon"
      />

      {/* Palmiers */}
      <Palm x={38} y={horizon + 8} scale={1.05} />
      <Palm x={78} y={horizon + 10} scale={0.62} flip />
      <Palm x={364} y={horizon + 8} scale={0.85} flip />
    </svg>
  );
}
