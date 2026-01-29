/**
 * Redis cache client for diary entries
 * Caches immutable data (past dates that won't change)
 */

import { Redis } from "@upstash/redis";

// Initialize Redis client (only if env vars are available)
let redis: Redis | null = null;

if (typeof window !== "undefined") {
  // Client-side
  const url = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;
  const token = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    redis = new Redis({ url, token });
  } else {
    console.warn("Redis not configured - caching disabled");
  }
}

// Cache keys
const CACHE_PREFIX = "diary";
const ENCRYPTION_KEY_PREFIX = "enc_key";

/**
 * Generate cache key for diary entry
 */
function getDiaryEntryKey(userId: string, date: string): string {
  return `${CACHE_PREFIX}:${userId}:${date}`;
}

/**
 * Generate cache key for encryption salt
 */
function getEncryptionKeyKey(userId: string): string {
  return `${ENCRYPTION_KEY_PREFIX}:${userId}`;
}

/**
 * Check if a date is in the past (and thus cacheable)
 */
export function isDateCacheable(date: string): boolean {
  const entryDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  entryDate.setHours(0, 0, 0, 0);

  return entryDate < today;
}

/**
 * Get cached diary entry
 */
export async function getCachedDiaryEntry(
  userId: string,
  date: string
): Promise<{ content: string; word_count: number } | null> {
  if (!redis) return null;

  try {
    const key = getDiaryEntryKey(userId, date);
    const cached = await redis.get<{ content: string; word_count: number }>(
      key
    );

    if (cached) {
      console.log("✅ Cache HIT for diary entry:", date);
    }

    return cached;
  } catch (error) {
    console.error("Redis cache read error:", error);
    return null;
  }
}

/**
 * Cache diary entry (only if date is in the past)
 */
export async function cacheDiaryEntry(
  userId: string,
  date: string,
  content: string,
  wordCount: number
): Promise<void> {
  if (!redis) return;

  try {
    // Only cache past dates
    if (!isDateCacheable(date)) {
      console.log("⏭️  Skipping cache for current/future date:", date);
      return;
    }

    const key = getDiaryEntryKey(userId, date);
    const data = {
      content,
      word_count: wordCount,
    };

    // Cache for 30 days (past entries are immutable)
    await redis.setex(key, 30 * 24 * 60 * 60, JSON.stringify(data));
    console.log("💾 Cached diary entry:", date);
  } catch (error) {
    console.error("Redis cache write error:", error);
  }
}

/**
 * Invalidate cache for a specific date (use when entry is updated)
 */
export async function invalidateDiaryEntry(
  userId: string,
  date: string
): Promise<void> {
  if (!redis) return;

  try {
    const key = getDiaryEntryKey(userId, date);
    await redis.del(key);
    console.log("🗑️  Invalidated cache for:", date);
  } catch (error) {
    console.error("Redis cache invalidation error:", error);
  }
}

/**
 * Cache encryption salt
 */
export async function cacheEncryptionSalt(
  userId: string,
  salt: string
): Promise<void> {
  if (!redis) return;

  try {
    const key = getEncryptionKeyKey(userId);
    // Cache encryption salts for 7 days
    await redis.setex(key, 7 * 24 * 60 * 60, salt);
    console.log("💾 Cached encryption salt");
  } catch (error) {
    console.error("Redis cache write error (encryption salt):", error);
  }
}

/**
 * Get cached encryption salt
 */
export async function getCachedEncryptionSalt(
  userId: string
): Promise<string | null> {
  if (!redis) return null;

  try {
    const key = getEncryptionKeyKey(userId);
    const salt = await redis.get<string>(key);

    if (salt) {
      console.log("✅ Cache HIT for encryption salt");
    }

    return salt;
  } catch (error) {
    console.error("Redis cache read error (encryption salt):", error);
    return null;
  }
}

/**
 * Get cache statistics for a user
 */
export async function getCacheStats(userId: string): Promise<{
  totalKeys: number;
  diaryEntries: number;
}> {
  if (!redis) return { totalKeys: 0, diaryEntries: 0 };

  try {
    const pattern = `${CACHE_PREFIX}:${userId}:*`;
    const keys = await redis.keys(pattern);

    return {
      totalKeys: keys.length,
      diaryEntries: keys.length,
    };
  } catch (error) {
    console.error("Redis cache stats error:", error);
    return { totalKeys: 0, diaryEntries: 0 };
  }
}

/**
 * Clear all cache for a user
 */
export async function clearUserCache(userId: string): Promise<void> {
  if (!redis) return;

  try {
    const pattern = `${CACHE_PREFIX}:${userId}:*`;
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️  Cleared ${keys.length} cached entries for user`);
    }
  } catch (error) {
    console.error("Redis cache clear error:", error);
  }
}

export { redis };
