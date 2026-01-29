# How to Verify Encryption is Working

## Quick Test

1. **Start your application**:

   ```powershell
   npm run dev
   ```

2. **Write a diary entry** with some text like "This is my secret diary!"

3. **Check the database** to see the encrypted content:

   - Open Supabase dashboard
   - Go to Table Editor > diary_entries
   - Look at the `content` column
   - You should see something like: `k3mN9fKpQ2vX8hL6sY0jR4wT7gZ1nA5qE3uI9oP2cV8bM4xW6kD1fH3lJ5rN7tY0zBxC...`

4. **Try to decode it** (it won't work without the key):

   ```javascript
   // This will just give you binary gibberish, not your actual text
   atob(
     "k3mN9fKpQ2vX8hL6sY0jR4wT7gZ1nA5qE3uI9oP2cV8bM4xW6kD1fH3lJ5rN7tY0zBxC..."
   );
   ```

5. **View in your app** - it should display correctly (decrypted automatically)

## What Database Admins See

### Before Encryption:

```
| user_id | entry_date | content                                    |
|---------|------------|-------------------------------------------|
| abc123  | 2026-01-14 | Today I felt really happy about my work!  |
```

### After Encryption (Current Implementation):

```
| user_id | entry_date | content                                                              |
|---------|------------|----------------------------------------------------------------------|
| abc123  | 2026-01-14 | k3mN9fKpQ2vX8hL6sY0jR4wT7gZ1nA5qE3uI9oP2cV8bM4xW6kD1fH3lJ5rN7tY0... |
```

The content is completely unreadable without your encryption key! 🔒

## Browser Console Test

Open your diary app and run this in the browser console:

```javascript
// Test encryption
(async () => {
  const { encryptContent, decryptContent } = await import("./lib/encryption");
  const userId = "test-user";
  const secret = "My super secret diary entry!";

  console.log("Original:", secret);
  const encrypted = await encryptContent(secret, userId);
  console.log("Encrypted:", encrypted);
  const decrypted = await decryptContent(encrypted, userId);
  console.log("Decrypted:", decrypted);
  console.log("Match:", secret === decrypted ? "✅" : "❌");
})();
```

## Security Check

Try this to verify that different users can't decrypt each other's content:

```javascript
(async () => {
  const { encryptContent, decryptContent } = await import("./lib/encryption");

  // User 1 encrypts
  const user1Id = "user-1";
  const secret = "User 1 secret";
  const encrypted = await encryptContent(secret, user1Id);

  // User 2 tries to decrypt
  try {
    const user2Id = "user-2";
    await decryptContent(encrypted, user2Id);
    console.log("❌ SECURITY ISSUE: Wrong user could decrypt!");
  } catch (error) {
    console.log("✅ SECURE: Wrong user cannot decrypt");
  }
})();
```

## Checking Your Encryption Salt

Your encryption salt is stored in browser localStorage. To see it:

```javascript
// In browser console
const userId = "your-user-id-here";
const salt = localStorage.getItem(`diary_salt_${userId}`);
console.log("Your encryption salt:", salt);
```

**Important**: If you clear localStorage, you'll lose access to previously encrypted entries!

## Migration Note

If you had existing diary entries BEFORE implementing encryption, they are stored in plaintext.

To encrypt existing entries, you would need to:

1. Read all existing entries
2. Encrypt each one
3. Update the database

This is NOT done automatically to prevent data loss. Contact the developer if you need help with this migration.
