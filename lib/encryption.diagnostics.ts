/**
 * Diagnostic Tool for Encryption Issues
 *
 * Run this in your browser console to diagnose decryption problems
 *
 * Usage:
 * 1. Open your diary app
 * 2. Open browser console (F12)
 * 3. Copy and paste this code
 * 4. Run: await diagnoseEncryption()
 */

// Check localStorage for encryption salts
export function checkLocalStorage() {
  console.log("\n📦 CHECKING LOCALSTORAGE\n" + "=".repeat(50));

  const keys = Object.keys(localStorage);
  const saltKeys = keys.filter((k) => k.startsWith("diary_salt_"));

  if (saltKeys.length === 0) {
    console.log("❌ No encryption salts found in localStorage");
    console.log("   This means no encryption keys exist for any user.");
    console.log("   Encrypted entries cannot be decrypted without the salt.");
  } else {
    console.log(`✅ Found ${saltKeys.length} encryption salt(s):`);
    saltKeys.forEach((key) => {
      const salt = localStorage.getItem(key);
      const userId = key.replace("diary_salt_", "");
      console.log(`   User: ${userId.substring(0, 12)}...`);
      console.log(`   Salt: ${salt?.substring(0, 16)}...`);
    });
  }

  return saltKeys.length > 0;
}

// Check if content looks encrypted
export function analyzeContent(content: string) {
  console.log("\n🔍 ANALYZING CONTENT\n" + "=".repeat(50));
  console.log("Length:", content.length);
  console.log("First 50 chars:", content.substring(0, 50));
  console.log("Last 50 chars:", content.substring(content.length - 50));

  // Check if base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  const isBase64 = base64Regex.test(content);
  console.log("Is valid base64:", isBase64 ? "✅ Yes" : "❌ No");

  // Check for spaces/newlines
  const hasSpaces = content.includes(" ");
  const hasNewlines = content.includes("\n");
  console.log("Has spaces:", hasSpaces ? "✅ Yes (likely plaintext)" : "❌ No");
  console.log(
    "Has newlines:",
    hasNewlines ? "✅ Yes (likely plaintext)" : "❌ No"
  );

  // Try to decode base64
  if (isBase64) {
    try {
      const decoded = atob(content);
      console.log("Base64 decodes to:", decoded.length, "bytes");
      console.log(
        "First decoded bytes:",
        Array.from(decoded.substring(0, 12))
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(" ")
      );
    } catch (e) {
      console.log("❌ Failed to decode base64");
    }
  }

  // Detect likely content type
  if (!isBase64 || hasSpaces || hasNewlines) {
    console.log("\n📄 VERDICT: This appears to be PLAINTEXT");
  } else if (isBase64 && content.length > 30) {
    console.log("\n🔒 VERDICT: This appears to be ENCRYPTED");
  } else {
    console.log("\n❓ VERDICT: Unclear - too short or invalid format");
  }
}

// Test encryption/decryption with current user
export async function testEncryptionCycle(userId: string) {
  console.log("\n🧪 TESTING ENCRYPTION CYCLE\n" + "=".repeat(50));
  console.log("User ID:", userId);

  const testContent = "This is a test diary entry!";
  console.log("Original:", testContent);

  try {
    // Import functions (this assumes you're in the browser with the app loaded)
    const { encryptContent, decryptContent } = await import("./encryption");

    // Test encryption
    console.log("\n1️⃣ Encrypting...");
    const encrypted = await encryptContent(testContent, userId);
    console.log("   ✅ Encrypted:", encrypted.substring(0, 50) + "...");
    console.log("   Length:", encrypted.length);

    // Test decryption
    console.log("\n2️⃣ Decrypting...");
    const decrypted = await decryptContent(encrypted, userId);
    console.log("   ✅ Decrypted:", decrypted);

    // Verify
    if (decrypted === testContent) {
      console.log("\n✅ SUCCESS! Encryption/decryption working correctly");
      return true;
    } else {
      console.log("\n❌ FAILURE! Decrypted content does not match original");
      return false;
    }
  } catch (error) {
    console.error("\n❌ ERROR during encryption cycle:", error);
    return false;
  }
}

// Main diagnostic function
export async function diagnoseEncryption(
  userId?: string,
  sampleContent?: string
) {
  console.log("\n" + "=".repeat(60));
  console.log("🔐 ENCRYPTION DIAGNOSTICS");
  console.log("=".repeat(60));

  // Step 1: Check localStorage
  const hasSalts = checkLocalStorage();

  // Step 2: Analyze content if provided
  if (sampleContent) {
    analyzeContent(sampleContent);
  }

  // Step 3: Test encryption if user ID provided
  if (userId) {
    await testEncryptionCycle(userId);
  } else {
    console.log("\n💡 TIP: Provide your user ID to test encryption:");
    console.log('   await diagnoseEncryption("your-user-id-here")');
  }

  // Step 4: Recommendations
  console.log("\n" + "=".repeat(60));
  console.log("📋 RECOMMENDATIONS");
  console.log("=".repeat(60));

  if (!hasSalts) {
    console.log("⚠️  No encryption salts found!");
    console.log("   - If you had encrypted entries, they cannot be decrypted");
    console.log("   - New entries will create a new salt and be encrypted");
    console.log("   - Old encrypted entries will show as garbled text");
    console.log("\n   To recover old entries:");
    console.log("   1. If you have a backup of your salt, restore it:");
    console.log(
      '      localStorage.setItem("diary_salt_YOUR_USER_ID", "YOUR_SALT_VALUE")'
    );
    console.log("   2. If not, old encrypted entries cannot be recovered");
  } else {
    console.log("✅ Encryption salts found - encryption should work");
    console.log("   If decryption is still failing:");
    console.log("   1. The content may be from a different user/device");
    console.log("   2. The content may have been corrupted");
    console.log("   3. The salt may have been regenerated");
  }

  console.log("\n" + "=".repeat(60));
}

// Quick check function you can call from console
if (typeof window !== "undefined") {
  (
    window as Window &
      typeof globalThis & {
        diagnoseEncryption: typeof diagnoseEncryption;
        checkLocalStorage: typeof checkLocalStorage;
        analyzeContent: typeof analyzeContent;
        testEncryptionCycle: typeof testEncryptionCycle;
      }
  ).diagnoseEncryption = diagnoseEncryption;
  (
    window as Window &
      typeof globalThis & {
        diagnoseEncryption: typeof diagnoseEncryption;
        checkLocalStorage: typeof checkLocalStorage;
        analyzeContent: typeof analyzeContent;
        testEncryptionCycle: typeof testEncryptionCycle;
      }
  ).checkLocalStorage = checkLocalStorage;
  (
    window as Window &
      typeof globalThis & {
        diagnoseEncryption: typeof diagnoseEncryption;
        checkLocalStorage: typeof checkLocalStorage;
        analyzeContent: typeof analyzeContent;
        testEncryptionCycle: typeof testEncryptionCycle;
      }
  ).analyzeContent = analyzeContent;
  (
    window as Window &
      typeof globalThis & {
        diagnoseEncryption: typeof diagnoseEncryption;
        checkLocalStorage: typeof checkLocalStorage;
        analyzeContent: typeof analyzeContent;
        testEncryptionCycle: typeof testEncryptionCycle;
      }
  ).testEncryptionCycle = testEncryptionCycle;
}
