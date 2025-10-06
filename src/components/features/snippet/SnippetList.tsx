"use client";

import { useEffect, useState } from "react";
import { Snippet } from "@/types";
import { getSnippets } from "@/lib/firebase/firestore";
import { SnippetCard } from "./SnippetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";

interface SnippetListProps {
  filters: {
    search: string;
    language: string;
    tag: string;
    sort: string;
  };
}

export function SnippetList({ filters }: SnippetListProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("snippet");

  useEffect(() => {
    const fetchSnippets = async () => {
      setLoading(true);
      setError(null);

      try {
        const options: any = {
          isPublic: true,
          limitCount: 12,
        };

        if (filters.language) {
          options.language = filters.language;
        }

        if (filters.tag) {
          options.tag = filters.tag;
        }

        if (filters.sort === "oldest") {
          options.orderByField = "createdAt";
          // Note: Will need to modify getSnippets to support asc/desc
        }

        let fetchedSnippets = await getSnippets(options);

        // Client-side search filter (since Firestore doesn't support LIKE queries)
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          fetchedSnippets = fetchedSnippets.filter(
            (snippet) =>
              snippet.title.toLowerCase().includes(searchLower) ||
              snippet.code.toLowerCase().includes(searchLower) ||
              snippet.topic?.toLowerCase().includes(searchLower)
          );
        }

        setSnippets(fetchedSnippets);
      } catch (err) {
        console.error("Error fetching snippets:", err);
        setError("Failed to load snippets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg">{t("noSnippets")}</p>
          <p className="text-sm">{t("adjustFilter")}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        {t("found")} {snippets.length} {snippets.length !== 1 ? t("snippets") : t("snippet")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center gap-2 pt-3 border-t">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
