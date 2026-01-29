"use client";

import { useEffect, useState, useCallback } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/client";
import { getStreakData, type StreakData } from "@/lib/streak";
import { isPinEnabled, isPinSessionValid, getUserSettings } from "@/lib/pin";
import { format } from "date-fns";
import CalendarGrid from "@/components/calendar-grid";
import DailyWriter from "@/components/daily-writer";
import StreakDisplay from "@/components/streak-display";
import UserHeader from "@/components/user-header";
import PinLockScreen from "@/components/pin-lock-screen";

// Skeleton loaders
function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`bg-muted animate-pulse rounded-lg ${className || ""}`}
    />
  );
}

function HeaderSkeleton() {
  return (
    <header className="border-b border-border bg-surface/50 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SkeletonBox className="w-9 h-9 rounded-xl" />
            <div className="hidden sm:block space-y-1">
              <SkeletonBox className="w-24 h-5" />
              <SkeletonBox className="w-16 h-3" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SkeletonBox className="w-16 h-8 rounded-full" />
            <SkeletonBox className="w-32 h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </header>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="lg:col-span-1 space-y-6">
      {/* Streak Skeleton */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-6 text-center">
          <SkeletonBox className="w-16 h-16 mx-auto mb-4 rounded-2xl" />
          <SkeletonBox className="w-16 h-12 mx-auto mb-2" />
          <SkeletonBox className="w-24 h-4 mx-auto" />
          <SkeletonBox className="w-32 h-4 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 border-t border-border">
          <div className="p-4 border-r border-border">
            <SkeletonBox className="w-8 h-8 mx-auto mb-2" />
            <SkeletonBox className="w-12 h-4 mx-auto" />
          </div>
          <div className="p-4">
            <SkeletonBox className="w-8 h-8 mx-auto mb-2" />
            <SkeletonBox className="w-12 h-4 mx-auto" />
          </div>
        </div>
      </div>
      {/* Calendar Skeleton */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <SkeletonBox className="w-24 h-5" />
          <SkeletonBox className="w-16 h-5" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <SkeletonBox key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    </aside>
  );
}

function WriterSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <SkeletonBox className="w-8 h-8 rounded" />
        <div className="text-center flex-1 px-4">
          <SkeletonBox className="w-48 h-6 mx-auto mb-2" />
          <SkeletonBox className="w-24 h-4 mx-auto" />
        </div>
        <SkeletonBox className="w-8 h-8 rounded" />
      </div>
      <SkeletonBox className="flex-1 rounded" />
      <div className="mt-6 flex items-center justify-between">
        <SkeletonBox className="w-16 h-4" />
        <SkeletonBox className="w-24 h-10 rounded" />
      </div>
    </div>
  );
}

export default function DiaryPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [entries, setEntries] = useState<{ entry_date: string }[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // PIN lock state
  const [requiresPin, setRequiresPin] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [checkingPin, setCheckingPin] = useState(true);

  const loadData = useCallback(async (userId: string) => {
    const supabase = createClient();

    // Load entries
    const { data: entriesData } = await supabase
      .from("diary_entries")
      .select("entry_date")
      .eq("user_id", userId)
      .order("entry_date", { ascending: false });

    if (entriesData) {
      setEntries(entriesData);
    }

    // Load streak data
    const streakResult = await getStreakData(userId);
    setStreakData(streakResult);

    // Load user settings
    const settings = await getUserSettings(userId);
    if (settings?.display_name) {
      setDisplayName(settings.display_name);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const initPage = async () => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        redirect("/auth/login");
        return;
      }

      setUser(currentUser);

      // Check if PIN is required
      const pinEnabled = await isPinEnabled(currentUser.id);

      if (pinEnabled) {
        // Check if session is already verified
        const sessionValid = isPinSessionValid();
        if (sessionValid) {
          setPinVerified(true);
          setRequiresPin(false);
        } else {
          setRequiresPin(true);
          setPinVerified(false);
        }
      } else {
        setRequiresPin(false);
        setPinVerified(true);
      }

      setCheckingPin(false);

      // Load data regardless (will show after PIN verification)
      await loadData(currentUser.id);
    };

    initPage();
  }, [loadData]);

  const handlePinUnlock = () => {
    setPinVerified(true);
    setRequiresPin(false);
  };

  // Show checking state
  if (checkingPin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </main>
    );
  }

  // Show PIN lock screen if required
  if (requiresPin && !pinVerified && user) {
    return <PinLockScreen userId={user.id} onUnlock={handlePinUnlock} />;
  }

  // Loading state with skeletons
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <HeaderSkeleton />
        <div className="flex-1 px-4 py-8 md:px-6 md:py-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SidebarSkeleton />
            <div className="lg:col-span-2">
              <WriterSkeleton />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const entryDates = new Set(
    entries?.map((e) => format(new Date(e.entry_date), "yyyy-MM-dd")) || []
  );

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <UserHeader
        user={user}
        displayName={displayName}
        currentStreak={streakData?.currentStreak ?? 0}
        streakActive={streakData?.streakActive ?? false}
      />

      <div className="flex-1 px-4 py-8 md:px-6 md:py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <StreakDisplay
              currentStreak={streakData?.currentStreak ?? 0}
              longestStreak={streakData?.longestStreak ?? 0}
              totalEntries={streakData?.totalEntries ?? 0}
              streakActive={streakData?.streakActive ?? false}
            />
            <CalendarGrid
              entryDates={entryDates}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </aside>

          <div className="lg:col-span-2">
            <DailyWriter
              user={user}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
