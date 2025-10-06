import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Eye, Hash } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    totalSnippets: number;
    totalViews: number;
    languages: Array<{ name: string; count: number }>;
    topTags: Array<{ name: string; count: number }>;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total Snippets
              </span>
            </div>
            <span className="text-2xl font-bold">{stats.totalSnippets}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Views</span>
            </div>
            <span className="text-2xl font-bold">{stats.totalViews}</span>
          </div>
        </CardContent>
      </Card>

      {/* Languages Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Languages Used</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.languages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.languages.map((lang) => (
                <Badge key={lang.name} variant="secondary">
                  {lang.name} ({lang.count})
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No snippets yet</p>
          )}
        </CardContent>
      </Card>

      {/* Top Tags Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Most Used Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.topTags.map((tag) => (
                <Badge key={tag.name} variant="outline" className="text-sm">
                  {tag.name} ({tag.count})
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tags yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
