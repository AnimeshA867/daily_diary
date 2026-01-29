/**
 * Encryption utility for diary entries using AES-GCM
 * Each user's content is encrypted with a key derived from their user ID
 */

import { createClient } from "./client";
import { getCachedEncryptionSalt, cacheEncryptionSalt } from "./redis";

// Generate a consistent encryption key for a user based on their user ID
async function deriveKey(userId: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(userId + salt),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Get or generate a salt for the user (store in database + cache in Redis)
async function getUserSalt(userId: string): Promise<string> {
  // Try Redis cache first
  const cachedSalt = await getCachedEncryptionSalt(userId);
  if (cachedSalt) {
    return cachedSalt;
  }

  const supabase = createClient();

  // Try to fetch existing salt from database
  const { data, error } = await supabase
    .from("user_encryption_keys")
    .select("encryption_salt")
    .eq("user_id", userId)
    .single();

  if (data && data.encryption_salt) {
    console.log("Retrieved existing salt from database");
    // Cache it for next time
    await cacheEncryptionSalt(userId, data.encryption_salt);
    return data.encryption_salt;
  }

  // If no salt exists, generate a new one
  console.log("Generating new salt for user");
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const salt = Array.from(array, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  // Store the new salt in database
  const { error: insertError } = await supabase
    .from("user_encryption_keys")
    .insert({
      user_id: userId,
      encryption_salt: salt,
    });

  if (insertError) {
    console.error("Failed to store salt in database:", insertError);
    throw new Error("Failed to initialize encryption key");
  }

  console.log("New salt stored in database");

  // Cache the new salt
  await cacheEncryptionSalt(userId, salt);

  return salt;
}

/**
 * Encrypt content using AES-GCM
 * @param content The plaintext content to encrypt
 * @param userId The user's ID (used for key derivation)
 * @returns Base64 encoded encrypted content with IV
 */
export async function encryptContent(
  content: string,
  userId: string
): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const salt = await getUserSalt(userId);
    const key = await deriveKey(userId, salt);

    // Generate a random IV for this encryption
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the content
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoder.encode(content)
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt content");
  }
}

/**
 * Decrypt content using AES-GCM
 * @param encryptedContent Base64 encoded encrypted content with IV
 * @param userId The user's ID (used for key derivation)
 * @returns The decrypted plaintext content
 */
export async function decryptContent(
  encryptedContent: string,
  userId: string
): Promise<string> {
  try {
    console.log("Decryption attempt:", {
      contentLength: encryptedContent.length,
      userId: userId.substring(0, 8) + "...",
      isBase64: /^[A-Za-z0-9+/]+=*$/.test(encryptedContent),
    });

    const salt = await getUserSalt(userId);
    console.log("Salt retrieved:", salt.substring(0, 8) + "...");

    const key = await deriveKey(userId, salt);
    console.log("Key derived successfully");

    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedContent), (c) =>
      c.charCodeAt(0)
    );
    console.log("Base64 decoded, total bytes:", combined.length);

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    console.log(
      "IV extracted:",
      iv.length,
      "bytes, Encrypted data:",
      encrypted.length,
      "bytes"
    );

    // Decrypt the content
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );
    console.log("Decryption successful");

    const decoder = new TextDecoder();
    const result = decoder.decode(decrypted);
    console.log("Content decoded, length:", result.length);
    return result;
  } catch (error) {
    console.error("Decryption failed with error:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.name : typeof error
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("Failed to decrypt content");
  }
}

/**
 * Check if content appears to be encrypted (base64 format)
 * More robust checking to avoid false positives
 */
export function isEncrypted(content: string): boolean {
  if (!content || content.length < 20) return false;

  // Check if it looks like base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  if (!base64Regex.test(content)) return false;

  // Check if it has spaces or newlines (encrypted base64 shouldn't have these)
  if (content.includes(" ") || content.includes("\n")) return false;

  // Our encryption: 12-byte IV + encrypted content, then base64 encoded
  // Minimum realistic encrypted content would be ~50 chars in base64
  if (content.length < 50) return false;

  // Check entropy - encrypted content should have relatively even distribution of characters
  // If it's mostly one character or has obvious patterns, it's probably not encrypted
  const charCounts = new Map<string, number>();
  for (const char of content.substring(0, 100)) {
    charCounts.set(char, (charCounts.get(char) || 0) + 1);
  }

  // If any single character appears more than 30% of the time in first 100 chars, probably not encrypted
  const maxCount = Math.max(...charCounts.values());
  if (maxCount > 30) return false;

  // Looks encrypted!
  return true;
}
