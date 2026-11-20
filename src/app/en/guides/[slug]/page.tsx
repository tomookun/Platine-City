import { GuideView, guideMetadata, guideParams } from "@/views/pages";

export const generateStaticParams = () => guideParams("en");

export async function generateMetadata({
  params,
}: PageProps<"/en/guides/[slug]">) {
  return guideMetadata("en", (await params).slug);
}

export default async function Page({ params }: PageProps<"/en/guides/[slug]">) {
  return <GuideView locale="en" slug={(await params).slug} />;
}
