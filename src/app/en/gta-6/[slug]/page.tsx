import { CategoryView, categoryMetadata, categoryParams } from "@/views/pages";

export const generateStaticParams = () => categoryParams("en");

export async function generateMetadata({
  params,
}: PageProps<"/en/gta-6/[slug]">) {
  return categoryMetadata("en", (await params).slug);
}

export default async function Page({ params }: PageProps<"/en/gta-6/[slug]">) {
  return <CategoryView locale="en" slug={(await params).slug} />;
}
