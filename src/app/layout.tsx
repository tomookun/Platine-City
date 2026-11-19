import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Figtree } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { RegisterServiceWorker } from "@/components/register-sw";
import { LEGAL_NOTICE, SITE_NAME, SITE_URL } from "@/data/game";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} : checklist 100 % de GTA 6 en français`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Coche ta progression 100 % de GTA 6 d'une main, même hors ligne, sans spoilers et avec des infos vérifiées en jeu.",
  applicationName: SITE_NAME,
  openGraph: { type: "website", locale: "fr_FR", siteName: SITE_NAME },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0d1222",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${shoulders.variable} ${figtree.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-case focus:bg-sable focus:px-4 focus:py-2 focus:text-nuit"
        >
          Aller au contenu
        </a>
        <div className="mx-auto flex min-h-dvh max-w-xl flex-col pb-[calc(72px+env(safe-area-inset-bottom))]">
          <main id="contenu" className="flex-1 px-4 pt-5 pb-6">
            {children}
          </main>
          <footer className="px-4 pb-6 text-[13px] leading-normal text-brume">
            <p>{LEGAL_NOTICE}</p>
            <p>Les marques citées appartiennent à leurs propriétaires.</p>
          </footer>
        </div>
        <BottomNav />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
