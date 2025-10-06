"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { SnippetForm } from "@/components/features/snippet/SnippetForm";
import { useTranslations } from "next-intl";

export default function NewSnippetPage() {
  const { user, loading } = useRequireAuth();
  const t = useTranslations("snippet");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("createNew")}</h1>
        <p className="text-muted-foreground">{t("shareNew")}</p>
      </div>
      <SnippetForm />
    </div>
  );
}
