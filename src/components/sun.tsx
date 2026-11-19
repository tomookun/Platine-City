/**
 * Signature de la direction A : un soleil à rayures qui se lève au-dessus
 * de l'horizon à mesure que la progression avance (0 % = couché, 100 % = levé).
 */
export function Sun({ percent }: { percent: number | null }) {
  const p = Math.min(100, Math.max(0, percent ?? 0)) / 100;
  // Disque de rayon 54 ; horizon à y = 92. À 0 %, le bord du soleil
  // dépasse déjà de l'horizon pour que l'écran ne soit jamais vide.
  const rise = 12 + 96 * p;
  return (
    <svg width="150" height="118" viewBox="0 0 150 118" aria-hidden="true" className="shrink-0">
      <defs>
        <clipPath id="ciel">
          <rect x="0" y="0" width="150" height="92" />
        </clipPath>
      </defs>
      <g clipPath="url(#ciel)">
        <circle
          cx="75"
          cy="146"
          r="54"
          className="fill-rose transition-transform duration-[900ms] ease-out"
          style={{ transform: `translateY(-${rise}px)` }}
        />
        <rect x="0" y="62" width="150" height="4" className="fill-nuit" />
        <rect x="0" y="72" width="150" height="5" className="fill-nuit" />
        <rect x="0" y="83" width="150" height="6" className="fill-nuit" />
      </g>
      <line x1="0" y1="92" x2="150" y2="92" strokeWidth="2" className="stroke-lagon" />
      <line x1="30" y1="101" x2="120" y2="101" strokeWidth="2" className="stroke-lagon" opacity="0.6" />
      <line x1="50" y1="110" x2="100" y2="110" strokeWidth="2" className="stroke-lagon" opacity="0.35" />
    </svg>
  );
}
