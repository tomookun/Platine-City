import { ContributeView, contributeMetadata } from "@/views/pages";

export const metadata = contributeMetadata("fr");

export default function Page() {
  return <ContributeView locale="fr" />;
}
