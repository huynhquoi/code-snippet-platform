"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Snippet } from "@/types";
import { getSnippetBySlug } from "@/lib/firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { SnippetForm } from "@/components/features/snippet/SnippetForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditSnippetPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const slug = params.slug as string;
        const data = await getSnippetBySlug(slug);

        if (!data) {
          toast.error("Snippet not found");
          router.push("/");
          return;
        }

        // Authorization check
        if (!authLoading && user) {
          if (data.userId !== user.uid) {
            toast.error("You don't have permission to edit this snippet");
            router.push(`/snippets/${slug}`);
            return;
          }
        }

        setSnippet(data);
      } catch (error) {
        console.error("Error fetching snippet:", error);
        toast.error("Failed to load snippet");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        toast.error("You must be logged in to edit snippets");
        router.push("/login");
        return;
      }
      fetchSnippet();
    }
  }, [params.slug, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Snippet</h1>
        <p className="text-muted-foreground mt-2">
          Update your code snippet details
        </p>
      </div>

      <SnippetForm
        mode="edit"
        snippetId={snippet.id}
        defaultValues={{
          title: snippet.title,
          code: snippet.code,
          language: snippet.language,
          topic: snippet.topic,
          tags: snippet.tags,
          isPublic: snippet.isPublic,
        }}
      />
    </div>
  );
}
