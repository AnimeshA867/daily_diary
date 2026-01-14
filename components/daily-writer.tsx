"use client";

import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { Save, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/client";
import { encryptContent, decryptContent } from "@/lib/encryption";

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

  const today = new Date();
  const currentDate = selectedDate ? new Date(selectedDate) : today;
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const isReadOnly = !!(selectedDate && !isToday(currentDate));

  useEffect(() => {
    const loadEntry = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("diary_entries")
        .select("content")
        .eq("user_id", user.id)
        .eq("entry_date", dateStr)
        .single();

      if (data && data.content) {
        try {
          // Decrypt the content before displaying
          const decryptedContent = await decryptContent(data.content, user.id);
          setContent(decryptedContent);
        } catch (error) {
          console.error("Failed to decrypt content:", error);
          setContent(""); // Show empty if decryption fails
        }
      } else {
        setContent("");
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
