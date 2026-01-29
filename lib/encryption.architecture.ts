/**
 * Encryption Architecture Overview
 *
 * This document explains the encryption implementation at a technical level
 */

/**
 * KEY DERIVATION PROCESS
 * ----------------------
 *
 * Input: User ID + Salt
 *   ↓
 * PBKDF2 Algorithm
 *   ├─ 100,000 iterations
 *   ├─ SHA-256 hash
 *   └─ 256-bit output
 *   ↓
 * AES-GCM Encryption Key
 *
 * Why PBKDF2?
 * - Computationally expensive (prevents brute force)
 * - Industry standard for key derivation
 * - Configurable iteration count
 */

/**
 * ENCRYPTION FLOW
 * ---------------
 *
 * Plaintext: "Today was a great day!"
 *   ↓
 * [1] Generate Random IV (12 bytes)
 *   Example: [0x1a, 0x2b, 0x3c, ..., 0xde]
 *   ↓
 * [2] Encrypt with AES-GCM
 *   Key: Derived from User ID + Salt
 *   IV: Random (from step 1)
 *   Data: Plaintext
 *   ↓
 * [3] Combine IV + Encrypted Data
 *   Format: [IV][Encrypted Data]
 *   Bytes: [12 bytes IV][N bytes encrypted]
 *   ↓
 * [4] Encode as Base64
 *   Result: "k3mN9fKpQ2vX8hL6sY0jR4wT7gZ1nA..."
 *   ↓
 * [5] Store in Database
 */

/**
 * DECRYPTION FLOW
 * ---------------
 *
 * Database Value: "k3mN9fKpQ2vX8hL6sY0jR4wT7gZ1nA..."
 *   ↓
 * [1] Decode from Base64
 *   Result: Byte array [IV + Encrypted Data]
 *   ↓
 * [2] Extract IV (first 12 bytes)
 *   IV: [0x1a, 0x2b, 0x3c, ..., 0xde]
 *   ↓
 * [3] Extract Encrypted Data (remaining bytes)
 *   ↓
 * [4] Derive Key (same as encryption)
 *   Key: Derived from User ID + Salt
 *   ↓
 * [5] Decrypt with AES-GCM
 *   Key: Derived key
 *   IV: Extracted IV
 *   Data: Encrypted data
 *   ↓
 * [6] Return Plaintext
 *   Result: "Today was a great day!"
 */

/**
 * SECURITY PROPERTIES
 * -------------------
 *
 * ✅ Confidentiality
 * - Only the user with the correct key can decrypt
 * - Database admin sees only encrypted data
 *
 * ✅ Integrity (AES-GCM feature)
 * - Detects if encrypted data has been tampered with
 * - Decryption fails if data is modified
 *
 * ✅ Unique Encryption per Entry
 * - Each entry uses a different random IV
 * - Same plaintext encrypts to different ciphertext each time
 *
 * ✅ Forward Secrecy (partial)
 * - Each entry can be decrypted independently
 * - Compromising one entry doesn't compromise others
 *
 * ❌ Cross-Device Sync
 * - Salt stored in localStorage (device-specific)
 * - Would need backend salt storage for multi-device
 *
 * ❌ Password Protection
 * - Key derived from User ID (not a password)
 * - Consider adding password-based key derivation
 */

/**
 * DATA STRUCTURE IN DATABASE
 * ---------------------------
 *
 * Table: diary_entries
 *
 * | Column      | Type      | Description                    | Example                      |
 * |-------------|-----------|--------------------------------|------------------------------|
 * | id          | uuid      | Entry ID                       | 123e4567-e89b-12d3-...       |
 * | user_id     | uuid      | User who owns entry            | abc12345-6789-...            |
 * | entry_date  | date      | Date of entry                  | 2026-01-14                   |
 * | content     | text      | ENCRYPTED diary entry          | k3mN9fKpQ2vX8hL6sY0j...      |
 * | word_count  | integer   | Number of words (plaintext)    | 42                           |
 * | created_at  | timestamp | When entry was created         | 2026-01-14 10:30:00          |
 * | updated_at  | timestamp | Last update time               | 2026-01-14 15:45:00          |
 *
 * Note: Only 'content' is encrypted. Metadata remains in plaintext for:
 * - Calendar functionality (entry_date)
 * - Statistics (word_count)
 * - User management (user_id)
 */

/**
 * SALT STORAGE
 * ------------
 *
 * Location: Browser localStorage
 * Key Format: diary_salt_${userId}
 * Value: 32-character hex string (16 random bytes)
 *
 * Example:
 *   Key: "diary_salt_abc12345-6789-4def-0123-456789abcdef"
 *   Value: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"
 *
 * Security Considerations:
 * - localStorage is origin-specific (safe from other websites)
 * - localStorage persists across sessions
 * - localStorage can be cleared by user (data loss risk)
 * - localStorage is device-specific (no cross-device sync)
 *
 * Production Alternative:
 * - Store encrypted salt in backend database
 * - Decrypt salt using user's password
 * - Enables cross-device access
 */

/**
 * ALGORITHM CHOICES
 * -----------------
 *
 * AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
 * ✓ Industry standard
 * ✓ Authenticated encryption (integrity + confidentiality)
 * ✓ Fast performance
 * ✓ Supported by Web Crypto API
 * ✓ NIST approved
 *
 * PBKDF2 (Password-Based Key Derivation Function 2)
 * ✓ Widely used standard
 * ✓ Configurable iteration count
 * ✓ Supported by Web Crypto API
 * ✓ Prevents rainbow table attacks
 * ✓ NIST recommended
 *
 * Alternative Considerations:
 * - Argon2: Better than PBKDF2 but not in Web Crypto API
 * - Scrypt: Memory-hard function, not in Web Crypto API
 * - ChaCha20-Poly1305: Alternative to AES-GCM, not in Web Crypto API
 */

export const ENCRYPTION_CONSTANTS = {
  ALGORITHM: "AES-GCM",
  KEY_SIZE: 256, // bits
  IV_SIZE: 12, // bytes (96 bits)
  KDF: "PBKDF2",
  KDF_ITERATIONS: 100000,
  HASH_ALGORITHM: "SHA-256",
  SALT_SIZE: 16, // bytes
};

/**
 * THREAT MODEL
 * ------------
 *
 * Protected Against:
 * ✅ Database Administrator reading entries
 * ✅ Database breach/leak
 * ✅ Man-in-the-middle (HTTPS assumed)
 * ✅ Server-side logging of content
 * ✅ Backup/snapshot exposure
 *
 * NOT Protected Against:
 * ❌ XSS attacks in the application
 * ❌ Malicious browser extensions
 * ❌ Compromised user device
 * ❌ Keyloggers
 * ❌ User clearing localStorage (data loss)
 * ❌ Physical access to unlocked device
 */
