import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Eye, Hash } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileStatsProps {
  stats: {
    totalSnippets: number;
    totalViews: number;
    languages: Array<{ name: string; count: number }>;
    topTags: Array<{ name: string; count: number }>;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const t = useTranslations("profile");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("overview")}</CardTitle>
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
              <span className="text-sm text-muted-foreground">{t("totalView")}</span>
            </div>
            <span className="text-2xl font-bold">{stats.totalViews}</span>
          </div>
        </CardContent>
      </Card>

      {/* Languages Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("languageUsed")}</CardTitle>
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
            <p className="text-sm text-muted-foreground">{t("noSnippets")}</p>
          )}
        </CardContent>
      </Card>

      {/* Top Tags Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Hash className="h-5 w-5" />
            {t("mostTags")}
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
            <p className="text-sm text-muted-foreground">{t("noTags")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
