"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserByUsername,
  getUserStats,
  getSnippets,
} from "@/lib/firebase/firestore";
import { Snippet } from "@/types";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ProfileStats } from "@/components/features/profile/ProfileStats";
import { SnippetCard } from "@/components/features/snippet/SnippetCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const username = params.username as string;

        // Fetch user by username
        const userData = await getUserByUsername(username);
        if (!userData) {
          toast.error("User not found");
          router.push("/");
          return;
        }

        setProfileUser(userData);

        // Fetch user stats
        const userStats = await getUserStats(userData.uid);
        setStats(userStats);

        // Fetch user's snippets
        const isOwnProfile = currentUser?.uid === userData.uid;
        const snippetsData = await getSnippets({
          userId: userData.uid,
          isPublic: isOwnProfile ? undefined : true, // Show all if own profile
        });
        setSnippets(snippetsData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [params.username, currentUser, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser || !stats) {
    return null;
  }

  const isOwnProfile = currentUser?.uid === profileUser.uid;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Profile Header */}
        <ProfileHeader user={profileUser} isOwnProfile={isOwnProfile} />

        {/* Tabs */}
        <Tabs defaultValue="snippets" className="w-full">
          <TabsList>
            <TabsTrigger value="snippets">
              Snippets ({snippets.length})
            </TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Snippets Tab */}
          <TabsContent value="snippets" className="space-y-6">
            {snippets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isOwnProfile
                    ? "You haven't created any snippets yet."
                    : "This user hasn't created any public snippets yet."}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <ProfileStats stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
