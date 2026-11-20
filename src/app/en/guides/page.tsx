import { GuidesView, guidesMetadata } from "@/views/pages";

export const metadata = guidesMetadata("en");

export default function Page() {
  return <GuidesView locale="en" />;
}
