import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tags" });

  return {
    title: `${t("allTags")} | Code Snippet Platform`,
    description: "Browse all tags and discover code snippets by topic",
    keywords: ["tags", "topics", "code categories"],
  };
}

export default function TagsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
