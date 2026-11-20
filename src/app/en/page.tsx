import { HomeView, homeMetadata } from "@/views/pages";

export const metadata = homeMetadata("en");

export default function Page() {
  return <HomeView locale="en" />;
}
