import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "snippet" });

  return {
    title: `${t("createNew")} | Code Snippet Platform`,
    description: "Create and share a new code snippet",
  };
}

export default function DetailSnippetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
