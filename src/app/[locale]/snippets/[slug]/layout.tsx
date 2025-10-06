import { getSnippetBySlug } from "@/lib/firebase/firestore";
import { Metadata } from "next";

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  // Fetch snippet data
  const snippet = await getSnippetBySlug(slug);

  if (!snippet) {
    return {
      title: "Snippet Not Found",
    };
  }

  const codePreview = snippet.code.substring(0, 160);

  return {
    title: `${snippet.title} | Code Snippet Platform`,
    description: codePreview,
    keywords: [snippet.language, snippet.topic, ...snippet.tags].filter(
      Boolean
    ),
    openGraph: {
      title: snippet.title,
      description: codePreview,
      type: "article",
      authors: [snippet.userDisplayName],
    },
  };
}

export default function DetailSnippetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
