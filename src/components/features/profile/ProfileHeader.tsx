import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
interface ProfileHeaderProps {
  user: {
    uid: string;
    displayName: string;
    username: string;
    email: string;
    createdAt: Date;
    snippetCount: number;
  };
  isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const t = useTranslations("profile");
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-3xl">
              {user.displayName[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <p className="text-muted-foreground text-lg">@{user.username}</p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {isOwnProfile && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {t("join")}{" "}
                  {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <div>
                <p className="text-2xl font-bold">{user.snippetCount}</p>
                <p className="text-sm text-muted-foreground">{t("snippets")}</p>
              </div>
            </div>
          </div>

          {/* {isOwnProfile && (
            <Button variant="outline" asChild>
              <Link href={`/profile/${user.username}/edit`}>Edit Profile</Link>
            </Button>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
}
