import { NewsView, newsMetadata } from "@/views/pages";

export const metadata = newsMetadata("fr");

export default function Page() {
  return <NewsView locale="fr" />;
}
