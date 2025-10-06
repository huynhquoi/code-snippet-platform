"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SnippetFilters } from "@/components/features/snippet/SnippetFilters";
import { SnippetList } from "@/components/features/snippet/SnippetList";
import { TagCloud } from "@/components/features/tag/TagCloud";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  const { user } = useAuth();
  const t = useTranslations("home");
  const [filters, setFilters] = useState({
    search: "",
    language: "",
    tag: "",
    sort: "newest",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">{t("title")}</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              {t("subtitle")}
            </p>
            {user ? (
              <Button asChild size="lg">
                <Link href="/snippets/new">
                  <Plus className="mr-2 h-5 w-5" />
                  {t("createSnippet")}
                </Link>
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button asChild size="lg">
                  <Link href="/register">{t("getStarted")}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">{t("login")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 order-1">
            <div className="sticky top-20 space-y-6">
              <SnippetFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>
          <main className="lg:col-span-6 order-3 lg:order-2">
            <SnippetList filters={filters} />
          </main>

          <aside className="lg:col-span-3 order-2 lg:order-3">
            <div className="sticky top-20">
              <TagCloud limit={15} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
