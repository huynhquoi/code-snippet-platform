import { getTagBySlug } from "@/lib/firebase/firestore";
import { Metadata } from "next";

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  // Fetch tag data
  const tag = await getTagBySlug(slug); // Your fetch function

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  return {
    title: `${tag.name} - ${tag.count} Snippets | Code Snippet Platform`,
    description: `Browse ${tag.count} code snippets tagged with ${tag.name}`,
    keywords: [tag.name, "code snippets", "programming"],
  };
}

export default function TagDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
