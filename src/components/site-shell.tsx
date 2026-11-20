import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Figtree } from "next/font/google";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { LanguageSwitch } from "@/components/language-switch";
import { MilestoneCelebration } from "@/components/milestone-celebration";
import { RegisterServiceWorker } from "@/components/register-sw";
import { SITE_NAME, SITE_URL } from "@/data/game";
import { LocaleProvider } from "@/i18n/locale-context";
import {
  HTML_LANG,
  LEGAL_NOTICE,
  OG_LOCALE,
  tr,
  type Locale,
} from "@/i18n/locale";
import "@/app/globals.css";

const shoulders = Big_Shoulders({
  variable: "--font-shoulders",
  subsets: ["latin"],
  weight: ["700", "800"],
  fallback: ["Arial Narrow", "sans-serif"],
  adjustFontFallback: false,
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export function siteMetadata(locale: Locale): Metadata {
  const t = tr(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t(
        `${SITE_NAME} : checklist 100 % de GTA 6 en français`,
        `${SITE_NAME}: GTA 6 100% completion checklist`,
      ),
      template: `%s | ${SITE_NAME}`,
    },
    description: t(
      "Coche ta progression 100 % de GTA 6 d'une main, même hors ligne, sans spoilers et avec des infos vérifiées en jeu.",
      "Track your GTA 6 100% completion one-handed, even offline, spoiler-free, with info checked in game.",
    ),
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      siteName: SITE_NAME,
    },
    appleWebApp: {
      capable: true,
      title: SITE_NAME,
      statusBarStyle: "black-translucent",
    },
  };
}

export const siteViewport: Viewport = {
  themeColor: "#0d1222",
  colorScheme: "dark",
  viewportFit: "cover",
};

/** Coquille HTML commune aux deux langues (chaque langue a sa racine <html lang>). */
export function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const t = tr(locale);
  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${shoulders.variable} ${figtree.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <LocaleProvider locale={locale}>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-case focus:bg-sable focus:px-4 focus:py-2 focus:text-nuit"
          >
            {t("Aller au contenu", "Skip to content")}
          </a>
          <div className="mx-auto flex min-h-dvh max-w-xl flex-col pb-[calc(72px+env(safe-area-inset-bottom))]">
            <main id="contenu" className="flex-1 px-4 pt-5 pb-6">
              {children}
            </main>
            <footer className="flex flex-col gap-3 px-4 pb-6 text-[13px] leading-normal text-brume">
              <LanguageSwitch />
              <div>
                <p>{LEGAL_NOTICE[locale]}</p>
                <p>
                  {t(
                    "Les marques citées appartiennent à leurs propriétaires.",
                    "All trademarks belong to their respective owners.",
                  )}
                </p>
              </div>
            </footer>
          </div>
          <BottomNav />
          <MilestoneCelebration />
          <RegisterServiceWorker />
        </LocaleProvider>
      </body>
    </html>
  );
}
