"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SnippetFilters } from "@/components/features/snippet/SnippetFilters";
import { SnippetList } from "@/components/features/snippet/SnippetList";

export default function HomePage() {
  const { user } = useAuth();
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
              <h1 className="text-4xl font-bold">Code Snippet Platform</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Share code snippets, tag them by language and topic, and discover
              solutions from the community
            </p>
            {user ? (
              <Button asChild size="lg">
                <Link href="/snippets/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Snippet
                </Link>
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button asChild size="lg">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <SnippetFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Main Content - Snippet List */}
          <main className="lg:col-span-3">
            <SnippetList filters={filters} />
          </main>
        </div>
      </div>
    </div>
  );
}
