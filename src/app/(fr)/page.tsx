import { HomeView, homeMetadata } from "@/views/pages";

export const metadata = homeMetadata("fr");

export default function Page() {
  return <HomeView locale="fr" />;
}
