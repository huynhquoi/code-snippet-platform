"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { getTags } from "@/lib/firebase/firestore";
import { Tag } from "@/types";
import { useTranslations } from "next-intl";

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "SQL",
  "HTML",
  "CSS",
];

interface SnippetFiltersProps {
  filters: {
    search: string;
    language: string;
    tag: string;
    sort: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function SnippetFilters({
  filters,
  onFiltersChange,
}: SnippetFiltersProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("filters");
  const tTags = useTranslations("tags");

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const fetchedTags = await getTags(20);
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      language: "",
      tag: "",
      sort: "newest",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.language ||
    filters.tag ||
    filters.sort !== "newest";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{t("filters")}</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">{t("search")}</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder={t("searchSnippet")}
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{t("language")}</Label>
          <Select
            value={filters.language || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                language: value === "all" ? "" : value,
              })
            }
          >
            <SelectTrigger id="language">
              <SelectValue placeholder={t("allLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLanguage")}</SelectItem>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label htmlFor="sort">{t("sort")}</Label>
          <Select
            value={filters.sort}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, sort: value })
            }
          >
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("newest")}</SelectItem>
              <SelectItem value="oldest">{t("oldest")}</SelectItem>
              <SelectItem value="views">{t("mostViewed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>{tTags("popularTags")}</Label>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading tags...</p>
          ) : tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.slug}
                  variant={filters.tag === tag.name ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      tag: filters.tag === tag.name ? "" : tag.name,
                    })
                  }
                >
                  {tag.name} ({tag.count})
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{tTags("noTagFound")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
