/**
 * PIN management utilities for app lock functionality
 * Uses Web Crypto API for secure hashing (no server-side bcrypt needed for PIN)
 */

import { createClient } from "./client";

export interface UserSettings {
  id: string;
  user_id: string;
  pin_hash: string | null;
  pin_enabled: boolean;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

const PIN_SESSION_KEY = "diary_pin_unlocked";
const PIN_SESSION_EXPIRY = 30 * 60 * 1000; // 30 minutes

/**
 * Hash a PIN using Web Crypto API (SHA-256 + salt)
 */
async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a random salt
 */
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Get user settings from database
 */
export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    // PGRST116 = no rows found (not an error)
    // 42P01 = table doesn't exist
    if (error) {
      if (error.code === "PGRST116") {
        // No settings yet, return null (not an error)
        return null;
      }
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("user_settings table does not exist. Please run the migration.");
        return null;
      }
      console.error("Error fetching user settings:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Failed to fetch user settings:", err);
    return null;
  }
}

/**
 * Create or update user settings
 */
export async function upsertUserSettings(
  userId: string,
  settings: Partial<Omit<UserSettings, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<UserSettings | null> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: userId,
          ...settings,
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("user_settings table does not exist. Please run the migration.");
        return null;
      }
      console.error("Error upserting user settings:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Failed to upsert user settings:", err);
    return null;
  }
}

/**
 * Set a new PIN for the user
 */
export async function setUserPin(
  userId: string,
  pin: string
): Promise<boolean> {
  const salt = generateSalt();
  const hash = await hashPin(pin, salt);
  // Store salt:hash format
  const pinHash = `${salt}:${hash}`;

  const result = await upsertUserSettings(userId, {
    pin_hash: pinHash,
    pin_enabled: true,
  });

  return result !== null;
}

/**
 * Verify a PIN against stored hash
 */
export async function verifyPin(
  userId: string,
  pin: string
): Promise<boolean> {
  const settings = await getUserSettings(userId);

  if (!settings || !settings.pin_hash || !settings.pin_enabled) {
    return false;
  }

  const [salt, storedHash] = settings.pin_hash.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const hash = await hashPin(pin, salt);
  return hash === storedHash;
}

/**
 * Disable PIN for user
 */
export async function disablePin(userId: string): Promise<boolean> {
  const result = await upsertUserSettings(userId, {
    pin_hash: null,
    pin_enabled: false,
  });

  // Clear session
  clearPinSession();

  return result !== null;
}

/**
 * Check if user has PIN enabled
 */
export async function isPinEnabled(userId: string): Promise<boolean> {
  const settings = await getUserSettings(userId);
  return settings?.pin_enabled ?? false;
}

/**
 * Store PIN unlock session in localStorage
 */
export function setPinSession(): void {
  if (typeof window === "undefined") return;

  const expiry = Date.now() + PIN_SESSION_EXPIRY;
  sessionStorage.setItem(
    PIN_SESSION_KEY,
    JSON.stringify({ unlocked: true, expiry })
  );
}

/**
 * Check if PIN session is valid
 */
export function isPinSessionValid(): boolean {
  if (typeof window === "undefined") return false;

  const session = sessionStorage.getItem(PIN_SESSION_KEY);
  if (!session) return false;

  try {
    const { unlocked, expiry } = JSON.parse(session);
    if (unlocked && expiry > Date.now()) {
      return true;
    }
  } catch {
    // Invalid session data
  }

  clearPinSession();
  return false;
}

/**
 * Clear PIN session
 */
export function clearPinSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PIN_SESSION_KEY);
}

/**
 * Update display name
 */
export async function updateDisplayName(
  userId: string,
  displayName: string
): Promise<boolean> {
  const result = await upsertUserSettings(userId, {
    display_name: displayName || null,
  });
  return result !== null;
}
