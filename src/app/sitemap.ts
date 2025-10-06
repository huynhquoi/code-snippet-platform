// app/sitemap.ts
import { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://code-snippet-platform-one.vercel.app";

  const snippetsSnapshot = await getDocs(collection(db, "snippets"));
  const snippets = snippetsSnapshot.docs.map((doc) => ({
    url: `${baseUrl}/snippets/${doc.data().slug}`,
    lastModified: doc.data().updatedAt?.toDate() || new Date(),
  }));

  const tagsSnapshot = await getDocs(collection(db, "tags"));
  const tags = tagsSnapshot.docs.map((doc) => ({
    url: `${baseUrl}/tags/${doc.data().slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/snippets`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      priority: 0.8,
    },
    ...snippets,
    ...tags,
  ];
}
