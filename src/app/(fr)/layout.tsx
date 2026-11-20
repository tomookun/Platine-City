import { SiteShell, siteMetadata, siteViewport } from "@/components/site-shell";

export const metadata = siteMetadata("fr");
export const viewport = siteViewport;

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell locale="fr">{children}</SiteShell>;
}
