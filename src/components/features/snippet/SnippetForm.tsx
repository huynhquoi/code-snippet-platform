"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { createSnippet } from "@/lib/firebase/firestore";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { TagInput } from "./TagInput";

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

const snippetSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  code: z.string().min(1, "Code is required"),
  language: z.string().min(1, "Please select a language"),
  topic: z.string().optional(),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
  isPublic: z.boolean(),
});

type SnippetFormData = z.infer<typeof snippetSchema>;

interface SnippetFormProps {
  mode?: "create" | "edit";
  defaultValues?: Partial<SnippetFormData>;
  snippetId?: string;
  onSubmit?: (data: SnippetFormData) => Promise<void>;
}

export function SnippetForm({
  mode = "create",
  defaultValues,
}: SnippetFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      code: defaultValues?.code || "",
      language: defaultValues?.language || "",
      topic: defaultValues?.topic || "",
      tags: defaultValues?.tags || [],
      isPublic: defaultValues?.isPublic ?? true,
    },
  });

  const onSubmit = async (data: SnippetFormData) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setIsSubmitting(true);

    try {
      const { slug } = await createSnippet({
        title: data.title,
        code: data.code,
        language: data.language,
        topic: data.topic || "",
        tags: data.tags,
        userId: user.uid,
        userDisplayName: user.displayName || "Anonymous",
        isPublic: data.isPublic,
      });

      toast.success("Snippet created successfully!");
      router.push(`/snippets/${slug}`);
    } catch (error) {
      console.error("Error creating snippet:", error);
      toast.error("Failed to create snippet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Binary Search Implementation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language & Topic Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Algorithms, Data Structures"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Code Editor */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code *</FormLabel>
                  <FormControl>
                    <div className="border rounded-md overflow-hidden">
                      <CodeEditor
                        value={field.value}
                        language={form.watch("language").toLowerCase()}
                        placeholder="Paste your code here..."
                        onChange={(e) => field.onChange(e.target.value)}
                        padding={15}
                        style={{
                          fontSize: 14,
                          fontFamily:
                            "ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace",
                          minHeight: "300px",
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Max 5)</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      maxTags={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Public/Private Switch */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Snippet</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this snippet visible to everyone
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === "create" ? "Create Snippet" : "Update Snippet"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
