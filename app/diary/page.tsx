"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/client";
import { format } from "date-fns";
import CalendarGrid from "@/components/calendar-grid";
import DailyWriter from "@/components/daily-writer";
import StreakDisplay from "@/components/streak-display";
import UserHeader from "@/components/user-header";

export default function DiaryPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [entries, setEntries] = useState<{ entry_date: string }[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        redirect("/auth/login");
        return;
      }

      setUser(currentUser);

      const { data: entriesData } = await supabase
        .from("diary_entries")
        .select("entry_date")
        .eq("user_id", currentUser.id)
        .order("entry_date", { ascending: false });

      if (entriesData) {
        setEntries(entriesData);

        // Calculate streaks
        let tempCurrentStreak = 0;
        let tempLongestStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (entriesData.length > 0) {
          const entryDates = entriesData
            .map((e) => new Date(e.entry_date))
            .sort((a, b) => b.getTime() - a.getTime());

          const checkDate = new Date(today);
          let tempStreak = 0;
          let foundStreak = false;

          for (const entryDate of entryDates) {
            const diff = Math.floor(
              (checkDate.getTime() - entryDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            if (diff === 0) {
              tempStreak++;
              foundStreak = true;
              checkDate.setDate(checkDate.getDate() - 1);
            } else if (diff === 1 && tempStreak > 0) {
              tempStreak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              tempLongestStreak = Math.max(tempLongestStreak, tempStreak);
              tempStreak = 0;
              if (!foundStreak) break;
            }
          }
          tempLongestStreak = Math.max(tempLongestStreak, tempStreak);
          tempCurrentStreak = foundStreak ? tempStreak : 0;
        }

        setCurrentStreak(tempCurrentStreak);
        setLongestStreak(tempLongestStreak);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
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
      <UserHeader user={user} />

      <div className="flex-1 px-4 py-8 md:px-6 md:py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <StreakDisplay
              currentStreak={currentStreak}
              longestStreak={longestStreak}
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
