/**
 * Streak calculation and caching utilities
 * Optimized for speed with proper streak logic
 */

import { createClient } from "./client";
import { redis } from "./redis";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  totalEntries: number;
  streakActive: boolean; // true if user wrote today or yesterday
}

const STREAK_CACHE_PREFIX = "user_streak";
const STREAK_CACHE_TTL = 2 * 60 * 60; // 2 hours in seconds (faster refresh)

/**
 * Get cache key for user streak
 */
function getStreakCacheKey(userId: string): string {
  return `${STREAK_CACHE_PREFIX}:${userId}`;
}

/**
 * Calculate the number of days between two dates (ignoring time)
 */
function daysBetween(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate streaks from diary entries - optimized version
 */
async function calculateStreaks(userId: string): Promise<StreakData> {
  const supabase = createClient();

  // Fetch all entry dates for this user (only dates, ordered descending)
  const { data: entries, error } = await supabase
    .from("diary_entries")
    .select("entry_date")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false });

  if (error || !entries || entries.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastEntryDate: null,
      totalEntries: 0,
      streakActive: false,
    };
  }

  // Remove duplicate dates and convert to unique date strings
  const uniqueDateStrings = [...new Set(entries.map((e) => e.entry_date))];
  const totalEntries = entries.length;

  // Parse dates properly (entry_date is in YYYY-MM-DD format)
  const entryDates = uniqueDateStrings.map((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  });

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecentEntry = entryDates[0];
  const daysSinceLastEntry = daysBetween(today, mostRecentEntry);

  // Determine if streak is active (wrote today or yesterday)
  const streakActive = daysSinceLastEntry <= 1;

  // Calculate current streak
  let currentStreak = 0;
  
  if (daysSinceLastEntry > 1) {
    // Streak is broken - no entry today or yesterday
    currentStreak = 0;
  } else {
    // Start counting from the most recent entry
    currentStreak = 1;
    
    for (let i = 0; i < entryDates.length - 1; i++) {
      const diff = daysBetween(entryDates[i], entryDates[i + 1]);
      
      if (diff === 1) {
        // Consecutive days
        currentStreak++;
      } else if (diff === 0) {
        // Same day (shouldn't happen with unique dates, but safety check)
        continue;
      } else {
        // Gap found, streak ends here
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 0; i < entryDates.length - 1; i++) {
    const diff = daysBetween(entryDates[i], entryDates[i + 1]);
    
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (diff > 1) {
      tempStreak = 1;
    }
  }

  // Ensure longest streak is at least as long as current streak
  longestStreak = Math.max(longestStreak, currentStreak);

  // Edge case: if only one entry, both streaks are 1 (if active) or 0 (if broken)
  if (entryDates.length === 1) {
    longestStreak = 1;
    currentStreak = streakActive ? 1 : 0;
  }

  return {
    currentStreak,
    longestStreak,
    lastEntryDate: uniqueDateStrings[0],
    totalEntries,
    streakActive,
  };
}

/**
 * Get user streak data with Redis caching
 */
export async function getStreakData(userId: string): Promise<StreakData> {
  // Try cache first
  if (redis) {
    try {
      const cacheKey = getStreakCacheKey(userId);
      const cached = await redis.get<StreakData>(cacheKey);

      if (cached) {
        console.log("✅ Cache HIT for streak data");
        return cached;
      }
    } catch (error) {
      console.error("Redis cache read error (streak):", error);
    }
  }

  // Calculate from database
  console.log("Calculating streak from database entries...");
  const streakData = await calculateStreaks(userId);

  // Cache the result
  if (redis) {
    try {
      const cacheKey = getStreakCacheKey(userId);
      await redis.setex(cacheKey, STREAK_CACHE_TTL, JSON.stringify(streakData));
      console.log("💾 Cached streak data for 4 hours");
    } catch (error) {
      console.error("Redis cache write error (streak):", error);
    }
  }

  return streakData;
}

/**
 * Invalidate streak cache when a new entry is created
 */
export async function invalidateStreakCache(userId: string): Promise<void> {
  if (!redis) return;

  try {
    const cacheKey = getStreakCacheKey(userId);
    await redis.del(cacheKey);
    console.log("🗑️  Invalidated streak cache");
  } catch (error) {
    console.error("Redis cache invalidation error (streak):", error);
  }
}

/**
 * Update streak when a new entry is saved
 * Call this after saving a diary entry
 */
export async function updateStreakOnEntrySave(
  userId: string,
  entryDate: string
): Promise<void> {
  // Invalidate cache so next fetch recalculates
  await invalidateStreakCache(userId);

  // Optionally pre-calculate and cache the new streak
  await getStreakData(userId);
}
