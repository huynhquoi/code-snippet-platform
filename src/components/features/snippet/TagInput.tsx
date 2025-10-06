"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { X, Plus, Tag as TagIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getTags } from "@/lib/firebase/firestore";
import { Tag } from "@/types";
import { useTranslations } from "next-intl";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagInput({ value, onChange, maxTags = 5 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("tags");

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const tags = await getTags(20);
        setExistingTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag) return;

    if (value.length >= maxTags) {
      return;
    }

    if (value.includes(trimmedTag)) {
      return;
    }

    onChange([...value, trimmedTag]);
    setInputValue("");
    setOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const filteredTags = existingTags.filter(
    (tag) =>
      !value.includes(tag.name) &&
      tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // Delay to allow click on CommandItem
              setTimeout(() => setOpen(false), 200);
            }}
            placeholder={t("inputTagsPlaceholder")}
            disabled={value.length >= maxTags}
            className="pr-8"
          />
          <TagIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

          {open && (
            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
              <Command>
                <CommandList>
                  {loading ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      Loading tags...
                    </div>
                  ) : (
                    <>
                      {inputValue && (
                        <CommandGroup heading="Create New">
                          <CommandItem
                            onSelect={() => addTag(inputValue)}
                            className="cursor-pointer"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create &quot;{inputValue}&quot;
                          </CommandItem>
                        </CommandGroup>
                      )}

                      {filteredTags.length > 0 ? (
                        <CommandGroup heading={t("existTag")}>
                          {filteredTags.map((tag) => (
                            <CommandItem
                              key={tag.slug}
                              onSelect={() => addTag(tag.name)}
                              className="cursor-pointer"
                            >
                              <TagIcon className="mr-2 h-4 w-4" />
                              <span className="flex-1">{tag.name}</span>
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                {tag.count}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        !inputValue && (
                          <CommandEmpty>{t("noTagFound")}</CommandEmpty>
                        )
                      )}
                    </>
                  )}
                </CommandList>
              </Command>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim() || value.length >= maxTags}
        >
          Add
        </Button>
      </div>

      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => {
            const existingTag = existingTags.find((t) => t.name === tag);
            return (
              <Badge
                key={tag}
                variant="secondary"
                className="pl-3 pr-1 py-1.5 text-sm"
              >
                <span className="mr-2">{tag}</span>
                {existingTag && (
                  <span className="mr-1 text-xs text-muted-foreground">
                    ({existingTag.count})
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-secondary-foreground/20 rounded-full p-0.5 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {value.length}/{maxTags} tags selected
        </span>
        {value.length >= maxTags && (
          <span className="text-orange-500">Maximum tags reached</span>
        )}
      </div>
    </div>
  );
}
