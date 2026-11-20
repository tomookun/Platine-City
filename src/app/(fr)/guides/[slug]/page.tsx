import { GuideView, guideMetadata, guideParams } from "@/views/pages";

export const generateStaticParams = () => guideParams("fr");

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">) {
  return guideMetadata("fr", (await params).slug);
}

export default async function Page({ params }: PageProps<"/guides/[slug]">) {
  return <GuideView locale="fr" slug={(await params).slug} />;
}
