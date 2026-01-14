/**
 * Encryption Test Utility
 *
 * This file can be run in the browser console to test encryption/decryption
 *
 * Usage:
 * 1. Open your diary app
 * 2. Open browser developer tools (F12)
 * 3. Copy and paste this code into the console
 * 4. Run: await testEncryption()
 */

import { encryptContent, decryptContent } from "./encryption";

export async function testEncryption() {
  const testUserId = "test-user-123";
  const testContent = "This is my secret diary entry!";

  console.log("🔐 Testing Encryption...\n");
  console.log("Original content:", testContent);
  console.log("User ID:", testUserId);
  console.log("\n" + "=".repeat(50) + "\n");

  try {
    // Test encryption
    const encrypted = await encryptContent(testContent, testUserId);
    console.log("✅ Encryption successful!");
    console.log("Encrypted content:", encrypted);
    console.log("Length:", encrypted.length, "characters");
    console.log("\n" + "=".repeat(50) + "\n");

    // Test decryption
    const decrypted = await decryptContent(encrypted, testUserId);
    console.log("✅ Decryption successful!");
    console.log("Decrypted content:", decrypted);
    console.log("\n" + "=".repeat(50) + "\n");

    // Verify
    if (decrypted === testContent) {
      console.log("✅ SUCCESS: Content matches after encryption/decryption!");
    } else {
      console.log("❌ FAILED: Content does not match!");
    }

    // Test with wrong user ID
    console.log("\n" + "=".repeat(50) + "\n");
    console.log("Testing with wrong user ID...");
    try {
      await decryptContent(encrypted, "wrong-user-id");
      console.log(
        "❌ SECURITY ISSUE: Decryption succeeded with wrong user ID!"
      );
    } catch (error) {
      console.log(
        "✅ GOOD: Decryption failed with wrong user ID (as expected)"
      );
      console.log(
        "Error:",
        error instanceof Error ? error.message : String(error)
      );
    }

    return {
      success: true,
      encrypted,
      decrypted,
      matches: decrypted === testContent,
    };
  } catch (error) {
    console.error("❌ Test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Example of what encrypted content looks like in the database
export function demonstrateEncryption() {
  console.log(`
📊 Encryption Example
=====================

BEFORE (Plaintext in database):
---------------------------------
content: "Today I felt really happy about my progress!"

AFTER (Encrypted in database):
---------------------------------
content: "k3mN9fKpQ2vX8hL6sY0jR4wT7gZ1nA5qE3uI9oP2cV8bM4xW6kD1fH3lJ5rN7tY0=="

What database admins see: 
Just random-looking base64 text that cannot be decoded without your encryption key!

Your app automatically:
✅ Encrypts when you save
✅ Decrypts when you view
✅ Keeps your secrets safe
  `);
}
