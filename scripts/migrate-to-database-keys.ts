/**
 * Migration script to move encryption salts from localStorage to database
 * Run this script to migrate existing users' encryption keys
 */

import { createClient } from "../lib/client";

async function migrateEncryptionKeys() {
  console.log("Starting encryption key migration...");

  const supabase = createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Failed to get user:", userError);
    return;
  }

  console.log(`Migrating keys for user: ${user.id}`);

  // Check if user already has a key in database
  const { data: existing } = await supabase
    .from("user_encryption_keys")
    .select("encryption_salt")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    console.log("✓ User already has encryption key in database");
    return;
  }

  // Check localStorage for existing salt
  const localStorageKey = `diary_salt_${user.id}`;
  const localSalt = localStorage.getItem(localStorageKey);

  if (localSalt) {
    console.log("Found salt in localStorage, migrating to database...");

    // Store in database
    const { error: insertError } = await supabase
      .from("user_encryption_keys")
      .insert({
        user_id: user.id,
        encryption_salt: localSalt,
      });

    if (insertError) {
      console.error("Failed to migrate salt to database:", insertError);
      return;
    }

    console.log("✓ Successfully migrated salt to database");
    console.log("Note: localStorage salt will remain as backup");
  } else {
    console.log(
      "No localStorage salt found - new key will be generated on first use"
    );
  }

  console.log("Migration complete!");
}

// Run migration if this script is executed directly
if (typeof window !== "undefined") {
  migrateEncryptionKeys().catch(console.error);
}

export { migrateEncryptionKeys };
