import { CategoryView, categoryMetadata, categoryParams } from "@/views/pages";

export const generateStaticParams = () => categoryParams("fr");

export async function generateMetadata({ params }: PageProps<"/gta-6/[slug]">) {
  return categoryMetadata("fr", (await params).slug);
}

export default async function Page({ params }: PageProps<"/gta-6/[slug]">) {
  return <CategoryView locale="fr" slug={(await params).slug} />;
}
