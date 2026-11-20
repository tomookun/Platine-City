import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | Platine City",
  robots: { index: false },
};

/** Page introuvable, commune aux deux langues (le site a deux racines). */
export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[64px] font-extrabold leading-none text-rose">404</p>
        <h1 className="text-xl font-bold">Page introuvable</h1>
        <p className="text-brume" lang="en">
          Page not found
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-[10px] bg-rose px-4 py-3 font-bold text-nuit"
          >
            Accueil
          </Link>
          <Link
            href="/en"
            lang="en"
            className="rounded-[10px] border border-contour px-4 py-3 font-bold"
          >
            Home
          </Link>
        </div>
      </body>
    </html>
  );
}
