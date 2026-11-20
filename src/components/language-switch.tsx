"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/locale-context";
import { switchPath } from "@/i18n/switch-path";

/**
 * Lien vers la même page dans l'autre langue. Lien classique (<a>) : les deux
 * langues ont chacune leur racine <html lang>, la page se recharge.
 */
export function LanguageSwitch() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const to = locale === "fr" ? "en" : "fr";
  return (
    <a
      href={switchPath(pathname, to)}
      hrefLang={to}
      lang={to}
      className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-contour px-4 text-[15px] font-semibold text-sable"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.8 2.5 15.2 0 18M12 3c-2.5 2.8-2.5 15.2 0 18" />
      </svg>
      {to === "en" ? "English version" : "Version française"}
    </a>
  );
}
