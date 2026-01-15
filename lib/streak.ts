/**
 * Streak calculation and caching utilities
 */

import { createClient } from "./client";
import { redis } from "./redis";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
}

const STREAK_CACHE_PREFIX = "user_streak";
const STREAK_CACHE_TTL = 4 * 60 * 60; // 4 hours in seconds

/**
 * Get cache key for user streak
 */
function getStreakCacheKey(userId: string): string {
  return `${STREAK_CACHE_PREFIX}:${userId}`;
}

/**
 * Calculate streaks from diary entries
 */
async function calculateStreaks(userId: string): Promise<StreakData> {
  const supabase = createClient();
  
  // Fetch all entry dates for this user
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
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Convert entry dates to Date objects and sort
  const entryDates = entries
    .map((e) => {
      const date = new Date(e.entry_date);
      date.setHours(0, 0, 0, 0);
      return date;
    })
    .sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Check if there's an entry for today or yesterday
  const mostRecentEntry = entryDates[0];
  const daysSinceLastEntry = Math.floor(
    (today.getTime() - mostRecentEntry.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If last entry was more than 1 day ago, current streak is broken
  if (daysSinceLastEntry > 1) {
    currentStreak = 0;
  } else {
    // Calculate current streak from most recent entry backwards
    let checkDate = new Date(mostRecentEntry);
    
    for (const entryDate of entryDates) {
      const dayDiff = Math.floor(
        (checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 0) {
        // Same day, count it
        tempStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dayDiff === 1) {
        // Next consecutive day
        tempStreak++;
        checkDate = new Date(entryDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Gap found, streak broken
        break;
      }
    }

    currentStreak = tempStreak;
  }

  // Calculate longest streak by finding all consecutive sequences
  tempStreak = 1;
  longestStreak = 1;

  for (let i = 0; i < entryDates.length - 1; i++) {
    const dayDiff = Math.floor(
      (entryDates[i].getTime() - entryDates[i + 1].getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      // Consecutive day
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      // Gap found, reset temp streak
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    lastEntryDate: entries[0].entry_date,
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
