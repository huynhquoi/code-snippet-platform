"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTags } from "@/lib/firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Hash } from "lucide-react";
import { toast } from "sonner";

interface Tag {
  name: string;
  slug: string;
  count: number;
}

interface TagCloudProps {
  limit?: number;
  title?: string;
}

export function TagCloud({
  limit = 20,
  title = "Popular Tags",
}: TagCloudProps) {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags(limit);
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to load tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [limit]);

  const getFontSize = (count: number) => {
    if (tags.length === 0) return 14;

    const maxCount = Math.max(...tags.map((t) => t.count));
    const minCount = Math.min(...tags.map((t) => t.count));
    const range = maxCount - minCount || 1;

    // Scale from 12px to 24px
    const minSize = 12;
    const maxSize = 24;
    const size = minSize + ((count - minCount) / range) * (maxSize - minSize);

    return Math.round(size);
  };

  const handleTagClick = (slug: string) => {
    router.push(`/tags/${slug}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Hash className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tags.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Hash className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No tags yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Hash className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.slug}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              style={{ fontSize: `${getFontSize(tag.count)}px` }}
              onClick={() => handleTagClick(tag.slug)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
