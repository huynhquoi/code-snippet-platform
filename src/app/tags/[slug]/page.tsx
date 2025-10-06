"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTagBySlug, getSnippets } from "@/lib/firebase/firestore";
import { Snippet } from "@/types";
import { SnippetCard } from "@/components/features/snippet/SnippetCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Hash, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function TagDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tag, setTag] = useState<any>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const slug = params.slug as string;

        // Fetch tag info
        const tagData = await getTagBySlug(slug);
        if (!tagData) {
          toast.error("Tag not found");
          router.push("/tags");
          return;
        }

        setTag(tagData);

        // Fetch snippets with this tag
        const snippetsData = await getSnippets({
          tag: tagData.name, // Use tag name for array-contains query
          isPublic: true,
        });

        setSnippets(snippetsData);
      } catch (error) {
        console.error("Error fetching tag data:", error);
        toast.error("Failed to load tag");
      } finally {
        setLoading(false);
      }
    };

    fetchTagData();
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!tag) {
    return null;
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => router.push("/tags")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tags
        </Button>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Hash className="h-8 w-8 text-muted-foreground" />
            <h1 className="text-4xl font-bold">{tag.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base px-3 py-1">
              {tag.count} {tag.count === 1 ? "snippet" : "snippets"}
            </Badge>
          </div>
        </div>

        {/* Snippets Grid */}
        {snippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Hash className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              No public snippets with this tag yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
