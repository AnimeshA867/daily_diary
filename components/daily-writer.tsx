"use client";

import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { Save, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/client";
import { encryptContent, decryptContent, isEncrypted } from "@/lib/encryption";
import {
  getCachedDiaryEntry,
  cacheDiaryEntry,
  isDateCacheable,
  invalidateDiaryEntry,
} from "@/lib/redis";
import { invalidateStreakCache } from "@/lib/streak";

interface DailyWriterProps {
  user: {
    id: string;
  };
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export default function DailyWriter({
  user,
  selectedDate,
  onDateChange,
}: DailyWriterProps) {
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [decryptionError, setDecryptionError] = useState(false);

  const today = new Date();
  const currentDate = selectedDate ? new Date(selectedDate) : today;
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const isReadOnly = !!(selectedDate && !isToday(currentDate));

  useEffect(() => {
    const loadEntry = async () => {
      setIsLoading(true);

      // Try cache first for past dates
      if (isDateCacheable(dateStr)) {
        const cached = await getCachedDiaryEntry(user.id, dateStr);
        if (cached) {
          console.log("📦 Loaded from cache:", dateStr);
          try {
            if (isEncrypted(cached.content)) {
              const decryptedContent = await decryptContent(
                cached.content,
                user.id
              );
              setContent(decryptedContent);
              setDecryptionError(false);
              setIsLoading(false);
              return;
            } else {
              setContent(cached.content);
              setDecryptionError(false);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error(
              "Cache decryption failed, will fetch from DB:",
              error
            );
            // Continue to database fetch
          }
        }
      }

      // Fetch from database
      const supabase = createClient();
      const { data } = await supabase
        .from("diary_entries")
        .select("content, word_count")
        .eq("user_id", user.id)
        .eq("entry_date", dateStr)
        .single();

      if (data && data.content) {
        console.log("Content loaded from DB:", {
          length: data.content.length,
          firstChars: data.content.substring(0, 50),
          isLikelyEncrypted: isEncrypted(data.content),
        });

        try {
          // Check if content is encrypted
          if (isEncrypted(data.content)) {
            console.log("Content appears encrypted, attempting decryption...");
            // Decrypt the content before displaying
            const decryptedContent = await decryptContent(
              data.content,
              user.id
            );
            console.log("Decryption successful!");
            setContent(decryptedContent);
            setDecryptionError(false);

            // Cache the entry if it's a past date
            if (isDateCacheable(dateStr)) {
              await cacheDiaryEntry(
                user.id,
                dateStr,
                data.content,
                data.word_count || 0
              );
            }
          } else {
            // Content is plaintext (old entry from before encryption)
            console.log(
              "Loading plaintext entry (created before encryption was enabled)"
            );
            setContent(data.content);
            setDecryptionError(false);

            // Cache plaintext entries too
            if (isDateCacheable(dateStr)) {
              await cacheDiaryEntry(
                user.id,
                dateStr,
                data.content,
                data.word_count || 0
              );
            }
          }
        } catch (error) {
          console.error("Failed to decrypt content:", error);
          // If decryption fails, show error and don't display encrypted content
          setContent("");
          setDecryptionError(true);
        }
      } else {
        console.log("No entry found for this date");
        setContent("");
        setDecryptionError(false);
      }
      setIsLoading(false);
    };

    loadEntry();
  }, [user.id, dateStr]);

  // Update word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(content.trim() ? words : 0);
  }, [content]);

  useEffect(() => {
    if (!content || isLoading || isReadOnly) return;

    const timer = setTimeout(async () => {
      const supabase = createClient();
      const words = content.trim().split(/\s+/).filter(Boolean).length;

      try {
        // Encrypt the content before saving
        const encryptedContent = await encryptContent(content, user.id);

        await supabase.from("diary_entries").upsert(
          {
            user_id: user.id,
            entry_date: dateStr,
            content: encryptedContent,
            word_count: words,
          },
          {
            onConflict: "user_id,entry_date",
          }
        );

        // Invalidate caches
        if (isDateCacheable(dateStr)) {
          await invalidateDiaryEntry(user.id, dateStr);
        }
        // Always invalidate streak cache when saving an entry
        await invalidateStreakCache(user.id);
      } catch (error) {
        console.error("Failed to save encrypted content:", error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, user.id, dateStr, isLoading, isReadOnly]);

  const handleSave = async () => {
    if (content.trim().length === 0 || isReadOnly) return;

    setIsSaving(true);
    const supabase = createClient();
    const words = content.trim().split(/\s+/).filter(Boolean).length;

    try {
      // Encrypt the content before saving
      const encryptedContent = await encryptContent(content, user.id);

      await supabase.from("diary_entries").upsert(
        {
          user_id: user.id,
          entry_date: dateStr,
          content: encryptedContent,
          word_count: words,
        },
        {
          onConflict: "user_id,entry_date",
        }
      );

      // Invalidate caches
      if (isDateCacheable(dateStr)) {
        await invalidateDiaryEntry(user.id, dateStr);
      }
      // Always invalidate streak cache when saving an entry
      await invalidateStreakCache(user.id);

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save encrypted content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange?.(format(prevDay, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange?.(format(nextDay, "yyyy-MM-dd"));
  };

  const dateDisplayStr = format(currentDate, "EEEE, MMMM d, yyyy");
  const todayStr = format(today, "yyyy-MM-dd");

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 flex flex-col h-full">
      {/* Decryption Error Warning */}
      {decryptionError && (
        <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 dark:text-amber-400 text-xl">
              ⚠️
            </span>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Decryption Failed
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                This entry appears to be encrypted but couldn&apos;t be
                decrypted. This may happen if:
              </p>
              <ul className="text-sm text-amber-800 dark:text-amber-200 list-disc pl-5 mt-2 space-y-1">
                <li>You cleared your browser data (encryption keys lost)</li>
                <li>
                  You&apos;re accessing from a different device or browser
                </li>
                <li>The encryption salt is missing from localStorage</li>
              </ul>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-2">
                The encrypted content is shown below. To recover it, you&apos;ll
                need to restore your encryption salt.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handlePreviousDay}
            className="p-2 hover:bg-muted rounded transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="text-center flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {dateDisplayStr}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {dateStr === todayStr
                ? "Today's Entry"
                : isReadOnly
                ? "View Only"
                : "Past Entry"}
            </p>
          </div>
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-muted rounded transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          isReadOnly ? "No entry for this day" : "Write your thoughts here..."
        }
        disabled={isReadOnly}
        className={`
          flex-1 p-4 bg-background border border-border rounded resize-none
          text-foreground placeholder-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-accent
          font-serif text-base leading-relaxed
          ${isReadOnly && "cursor-not-allowed opacity-75"}
        `}
      />

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {wordCount > 0 && <span>{wordCount} words</span>}
        </div>

        {!isReadOnly && (
          <button
            onClick={handleSave}
            disabled={content.trim().length === 0 || isSaving}
            className={`
              flex items-center gap-2 px-4 py-2 rounded font-medium text-sm
              transition-all duration-200
              ${
                isSaved
                  ? "bg-accent/20 text-accent border border-accent"
                  : "bg-accent text-accent-foreground border border-accent hover:opacity-90"
              }
              ${content.trim().length === 0 && "opacity-50 cursor-not-allowed"}
            `}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Entry"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
