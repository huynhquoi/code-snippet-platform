"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function NewSnippetPage() {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Create New Snippet</h1>
      <p className="text-muted-foreground mt-2">
        Form coming soon... (Phase 3)
      </p>
    </div>
  );
}
