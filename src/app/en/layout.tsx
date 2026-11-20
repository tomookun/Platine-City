import { SiteShell, siteMetadata, siteViewport } from "@/components/site-shell";

export const metadata = siteMetadata("en");
export const viewport = siteViewport;

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
