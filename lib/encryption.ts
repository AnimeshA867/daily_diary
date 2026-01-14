/**
 * Encryption utility for diary entries using AES-GCM
 * Each user's content is encrypted with a key derived from their user ID
 */

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

// Get or generate a salt for the user (store in localStorage)
function getUserSalt(userId: string): string {
  const saltKey = `diary_salt_${userId}`;
  let salt = localStorage.getItem(saltKey);

  if (!salt) {
    // Generate a random salt for this user
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    salt = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
    localStorage.setItem(saltKey, salt);
  }

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
    const salt = getUserSalt(userId);
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
    const salt = getUserSalt(userId);
    const key = await deriveKey(userId, salt);

    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedContent), (c) =>
      c.charCodeAt(0)
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Decrypt the content
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt content");
  }
}

/**
 * Check if content appears to be encrypted (base64 format)
 */
export function isEncrypted(content: string): boolean {
  if (!content) return false;
  // Check if it looks like base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  return base64Regex.test(content) && content.length > 20;
}
