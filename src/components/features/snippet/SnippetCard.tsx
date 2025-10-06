"use client";

import { Snippet } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const getComplexityVariant = (complexity?: string) => {
    if (!complexity) return "outline";
    if (complexity === "O(1)" || complexity === "O(log n)") return "default";
    if (complexity === "O(n)" || complexity === "O(n log n)")
      return "secondary";
    if (complexity === "O(n²)") return "outline";
    return "destructive";
  };

  return (
    <Link href={`/snippets/${snippet.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-lg">
            {snippet.title}
          </CardTitle>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="secondary">{snippet.language}</Badge>
            {snippet.topic && <Badge variant="outline">{snippet.topic}</Badge>}
            {snippet.complexity && (
              <Badge variant={getComplexityVariant(snippet.complexity)}>
                {snippet.complexity}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Code Preview */}
          <pre className="text-sm bg-muted p-3 rounded overflow-hidden line-clamp-4 font-mono">
            <code>{snippet.code}</code>
          </pre>

          {/* Tags */}
          {snippet.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-3">
              {snippet.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    // Will be handled by filter click later
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {snippet.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{snippet.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">
                {snippet.userDisplayName[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground flex-1 truncate">
              {snippet.userDisplayName}
            </span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {snippet.viewCount}
              </span>
              <span>
                {formatDistanceToNow(new Date(snippet.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
