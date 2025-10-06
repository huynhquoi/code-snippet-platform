"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTags } from "@/lib/firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Hash } from "lucide-react";
import { toast } from "sonner";

interface Tag {
  name: string;
  slug: string;
  count: number;
}

export default function TagsPage() {
  const router = useRouter();
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"count" | "name">("count");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags(); // Get all tags (no limit)
        setAllTags(data);
        setFilteredTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to load tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    let filtered = [...allTags];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "count") {
      filtered.sort((a, b) => b.count - a.count);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredTags(filtered);
  }, [searchQuery, sortBy, allTags]);

  const handleTagClick = (slug: string) => {
    router.push(`/tags/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading tags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">All Tags</h1>
          <p className="text-muted-foreground">
            Browse snippets by tags ({allTags.length} tags total)
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Most Used</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tags Grid */}
        {filteredTags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <Card
                key={tag.slug}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleTagClick(tag.slug)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg">{tag.name}</span>
                    </div>
                    <Badge variant="secondary">{tag.count}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {tag.count} {tag.count === 1 ? "snippet" : "snippets"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? `No tags found matching "${searchQuery}"`
                  : "No tags available yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
