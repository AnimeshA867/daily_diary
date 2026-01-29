/**
 * Migration Script: Encrypt Existing Plaintext Entries
 *
 * ⚠️ WARNING: Use this script ONLY if you have existing diary entries
 * that were created BEFORE the encryption feature was implemented.
 *
 * This script will:
 * 1. Fetch all your existing diary entries
 * 2. Check if they are already encrypted
 * 3. Encrypt any plaintext entries
 * 4. Update them in the database
 *
 * HOW TO USE:
 * -----------
 * 1. Open your diary app while logged in
 * 2. Open browser developer tools (F12)
 * 3. Go to the Console tab
 * 4. Copy and paste this entire script
 * 5. Run: await migrateExistingEntries()
 *
 * SAFETY:
 * -------
 * - Creates a backup in console before migrating
 * - Checks if entries are already encrypted
 * - Can be run multiple times safely (idempotent)
 * - Only affects your own entries (uses your user ID)
 */

import { createClient } from "./client";
import { encryptContent, isEncrypted } from "./encryption";

interface DiaryEntry {
  id: string;
  user_id: string;
  entry_date: string;
  content: string;
  word_count: number;
}

export async function migrateExistingEntries() {
  console.log("🔄 Starting migration of existing entries...\n");

  try {
    // Get current user
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("❌ Not logged in. Please log in first.");
      return { success: false, error: "Not authenticated" };
    }

    console.log("✅ User authenticated:", user.email);
    console.log("User ID:", user.id, "\n");

    // Fetch all entries for this user
    const { data: entries, error } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: true });

    if (error) {
      console.error("❌ Failed to fetch entries:", error);
      return { success: false, error: error.message };
    }

    if (!entries || entries.length === 0) {
      console.log("ℹ️ No entries found. Nothing to migrate.");
      return { success: true, migratedCount: 0 };
    }

    console.log(`📊 Found ${entries.length} total entries\n`);

    // Analyze entries
    const plaintextEntries: DiaryEntry[] = [];
    const encryptedEntries: DiaryEntry[] = [];

    for (const entry of entries) {
      if (isEncrypted(entry.content)) {
        encryptedEntries.push(entry);
      } else {
        plaintextEntries.push(entry);
      }
    }

    console.log(`✅ Already encrypted: ${encryptedEntries.length}`);
    console.log(`⚠️  Need encryption: ${plaintextEntries.length}\n`);

    if (plaintextEntries.length === 0) {
      console.log("✨ All entries are already encrypted. No migration needed!");
      return {
        success: true,
        migratedCount: 0,
        alreadyEncrypted: encryptedEntries.length,
      };
    }

    // Create backup log
    console.log("💾 BACKUP - Save this in case something goes wrong:");
    console.log("=".repeat(60));
    console.table(
      plaintextEntries.map((e) => ({
        date: e.entry_date,
        preview: e.content.substring(0, 50) + "...",
        words: e.word_count,
      }))
    );
    console.log("=".repeat(60));
    console.log("\n");

    // Ask for confirmation
    const confirmed = confirm(
      `⚠️ MIGRATION CONFIRMATION\n\n` +
        `This will encrypt ${plaintextEntries.length} entries.\n` +
        `After encryption, the entries can only be read through this app.\n\n` +
        `Continue with migration?`
    );

    if (!confirmed) {
      console.log("❌ Migration cancelled by user.");
      return { success: false, error: "Cancelled by user" };
    }

    console.log("🔄 Starting encryption...\n");

    // Migrate each entry
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < plaintextEntries.length; i++) {
      const entry = plaintextEntries[i];

      try {
        console.log(
          `[${i + 1}/${plaintextEntries.length}] Encrypting entry from ${
            entry.entry_date
          }...`
        );

        // Encrypt the content
        const encryptedContent = await encryptContent(entry.content, user.id);

        // Update in database
        const { error: updateError } = await supabase
          .from("diary_entries")
          .update({ content: encryptedContent })
          .eq("id", entry.id);

        if (updateError) {
          console.error(`  ❌ Failed: ${updateError.message}`);
          failCount++;
        } else {
          console.log(`  ✅ Success`);
          successCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `  ❌ Error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        failCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 MIGRATION COMPLETE");
    console.log("=".repeat(60));
    console.log(`✅ Successfully encrypted: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total entries: ${entries.length}`);
    console.log(`🔒 Now encrypted: ${encryptedEntries.length + successCount}`);
    console.log("=".repeat(60));

    if (failCount > 0) {
      console.warn(
        "\n⚠️ Some entries failed to encrypt. Check the backup log above."
      );
    } else {
      console.log("\n✨ All entries successfully encrypted!");
      console.log("🔄 Refresh the page to see your encrypted entries.");
    }

    return {
      success: failCount === 0,
      migratedCount: successCount,
      failedCount: failCount,
      totalEntries: entries.length,
      alreadyEncrypted: encryptedEntries.length,
    };
  } catch (error) {
    console.error("❌ Migration failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Dry run - Check what would be migrated without making changes
 */
export async function checkMigrationStatus() {
  console.log("🔍 Checking migration status...\n");

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("❌ Not logged in.");
      return;
    }

    const { data: entries } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("user_id", user.id);

    if (!entries || entries.length === 0) {
      console.log("ℹ️ No entries found.");
      return;
    }

    const plaintextCount = entries.filter(
      (e) => !isEncrypted(e.content)
    ).length;
    const encryptedCount = entries.filter((e) => isEncrypted(e.content)).length;

    console.log("📊 Migration Status:");
    console.log("=".repeat(40));
    console.log(`Total entries: ${entries.length}`);
    console.log(
      `Already encrypted: ${encryptedCount} (${Math.round(
        (encryptedCount / entries.length) * 100
      )}%)`
    );
    console.log(
      `Need encryption: ${plaintextCount} (${Math.round(
        (plaintextCount / entries.length) * 100
      )}%)`
    );
    console.log("=".repeat(40));

    if (plaintextCount > 0) {
      console.log("\n⚠️ You have plaintext entries that should be encrypted.");
      console.log("Run: await migrateExistingEntries()");
    } else {
      console.log("\n✅ All entries are encrypted!");
    }
  } catch (error) {
    console.error("❌ Check failed:", error);
  }
}

// Export for console use
if (typeof window !== "undefined") {
  (
    window as Window &
      typeof globalThis & {
        migrateExistingEntries: typeof migrateExistingEntries;
        checkMigrationStatus: typeof checkMigrationStatus;
      }
  ).migrateExistingEntries = migrateExistingEntries;
  (
    window as Window &
      typeof globalThis & {
        migrateExistingEntries: typeof migrateExistingEntries;
        checkMigrationStatus: typeof checkMigrationStatus;
      }
  ).checkMigrationStatus = checkMigrationStatus;
}
