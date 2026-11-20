import { ContributeView, contributeMetadata } from "@/views/pages";

export const metadata = contributeMetadata("en");

export default function Page() {
  return <ContributeView locale="en" />;
}
