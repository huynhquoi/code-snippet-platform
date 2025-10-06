"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Snippet } from "@/types";
import {
  getSnippetBySlug,
  incrementViewCount,
  deleteSnippet,
} from "@/lib/firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Copy,
  Share2,
  Eye,
  Calendar,
  Edit,
  Trash2,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";

export default function SnippetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const slug = params.slug as string;
        const data = await getSnippetBySlug(slug);

        if (!data) {
          router.push("/404");
          return;
        }

        setSnippet(data);

        // Increment view count if not owner
        if (!user || user.uid !== data.userId) {
          await incrementViewCount(data.id);
        }
      } catch (error) {
        console.error("Error fetching snippet:", error);
        toast.error("Failed to load snippet");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [params.slug, user, router]);

  const handleCopyCode = async () => {
    if (!snippet) return;

    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code " + error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link " + error);
    }
  };

  const handleDelete = async () => {
    if (!snippet) return;

    setDeleting(true);
    try {
      await deleteSnippet(snippet);
      toast.success("Snippet deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast.error("Failed to delete snippet");
    } finally {
      setDeleting(false);
    }
  };

  const getComplexityVariant = (complexity?: string) => {
    if (!complexity) return "outline";
    if (complexity === "O(1)" || complexity === "O(log n)") return "default";
    if (complexity === "O(n)" || complexity === "O(n log n)")
      return "secondary";
    if (complexity === "O(n²)") return "outline";
    return "destructive";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  const isOwner = user?.uid === snippet.userId;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">{snippet.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{snippet.language}</Badge>
            {snippet.topic && <Badge variant="outline">{snippet.topic}</Badge>}
            {snippet.complexity && (
              <Badge variant={getComplexityVariant(snippet.complexity)}>
                {snippet.complexity}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1">
              <Eye className="h-3 w-3" />
              {snippet.viewCount} views
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(snippet.createdAt), {
                addSuffix: true,
              })}
            </Badge>
          </div>

          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <SyntaxHighlighter
                language={snippet.language.toLowerCase()}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                }}
                showLineNumbers
              >
                {snippet.code}
              </SyntaxHighlighter>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-4 right-4"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          {isOwner && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/snippets/${snippet.slug}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your snippet.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>

        <Link href={`/profile/${snippet.username}`}>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {snippet.userDisplayName[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{snippet.userDisplayName}</p>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(snippet.createdAt))}{" "}
                    ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
