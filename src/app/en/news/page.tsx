import { NewsView, newsMetadata } from "@/views/pages";

export const metadata = newsMetadata("en");

export default function Page() {
  return <NewsView locale="en" />;
}
