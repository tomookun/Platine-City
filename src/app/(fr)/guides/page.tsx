import { GuidesView, guidesMetadata } from "@/views/pages";

export const metadata = guidesMetadata("fr");

export default function Page() {
  return <GuidesView locale="fr" />;
}
