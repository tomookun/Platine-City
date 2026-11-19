/**
 * Emplacement publicitaire réservé, désactivé par défaut.
 * Règle DESIGN.md : jamais avant le premier contenu sur mobile.
 * Activer l'aperçu avec NEXT_PUBLIC_SHOW_AD_SLOTS=1.
 */
export function AdSlot({ id }: { id: string }) {
  if (process.env.NEXT_PUBLIC_SHOW_AD_SLOTS !== "1") return null;
  return (
    <aside
      aria-label="Publicité"
      data-ad-slot={id}
      className="flex h-[100px] items-center justify-center rounded-[10px] bg-surface text-[13px] text-brume"
    >
      Publicité
    </aside>
  );
}
