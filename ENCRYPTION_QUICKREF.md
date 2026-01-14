# 🔒 Encryption Quick Reference

## What Was Implemented

✅ **AES-GCM 256-bit encryption** for all diary entries  
✅ **Client-side encryption** - happens in your browser  
✅ **User-specific keys** - each user has unique encryption  
✅ **Automatic encrypt/decrypt** - transparent to user experience

## Files Added

```
lib/
  ├── encryption.ts                  # Main encryption utilities
  ├── encryption.test.ts             # Testing functions
  ├── encryption.architecture.ts     # Technical documentation
  └── migrate-encryption.ts          # Migration script

ENCRYPTION.md                        # Full documentation
ENCRYPTION_TESTING.md                # Testing guide
ENCRYPTION_SUMMARY.md                # Implementation summary
```

## Files Modified

```
components/
  └── daily-writer.tsx                # Added encrypt/decrypt calls
```

## How to Test

### 1. Quick Visual Test

```bash
npm run dev
# Write an entry, then check Supabase database
# Content should look like: "k3mN9fKpQ2vX8hL6sY0jR4w..."
```

### 2. Console Test

Open browser console and run:

```javascript
const { encryptContent, decryptContent } = await import("./lib/encryption");
const secret = "My diary entry!";
const encrypted = await encryptContent(secret, "user-123");
console.log("Encrypted:", encrypted);
const decrypted = await decryptContent(encrypted, "user-123");
console.log("Decrypted:", decrypted);
console.log("Match:", secret === decrypted ? "✅" : "❌");
```

### 3. Database Check

1. Go to Supabase Dashboard
2. Open Table Editor → diary_entries
3. Look at content column
4. Should see base64 encrypted text, not plaintext

## Security Properties

| Property                  | Status | Details                                |
| ------------------------- | ------ | -------------------------------------- |
| Database Admin Can't Read | ✅ Yes | Content encrypted before storage       |
| User-Specific Keys        | ✅ Yes | Each user has unique key               |
| Unique Per Entry          | ✅ Yes | Random IV for each entry               |
| Integrity Protected       | ✅ Yes | AES-GCM provides authentication        |
| Cross-Device Sync         | ❌ No  | Salt in localStorage (device-specific) |
| Password Protected        | ❌ No  | Key derived from User ID, not password |

## Algorithm Details

```
Encryption: AES-GCM
Key Size:   256 bits
IV Size:    12 bytes (96 bits)
KDF:        PBKDF2
Iterations: 100,000
Hash:       SHA-256
```

## Common Tasks

### View Your Encryption Salt

```javascript
// In browser console
const userId = "your-user-id";
console.log(localStorage.getItem(`diary_salt_${userId}`));
```

### Check Migration Status

```javascript
await checkMigrationStatus();
```

### Migrate Old Entries

```javascript
await migrateExistingEntries();
```

### Backup Your Salt (Important!)

```javascript
// Save this somewhere safe!
const userId = "your-user-id";
const salt = localStorage.getItem(`diary_salt_${userId}`);
console.log("BACKUP THIS SALT:", salt);
```

## What Database Sees

| Column     | Encrypted? | Example Value                        |
| ---------- | ---------- | ------------------------------------ |
| id         | No         | 123e4567-e89b-12d3-a456-426614174000 |
| user_id    | No         | abc12345-6789-4def-0123-456789abcdef |
| entry_date | No         | 2026-01-14                           |
| content    | **✅ YES** | k3mN9fKpQ2vX8hL6sY0jR4wT7gZ1nA...    |
| word_count | No         | 42                                   |
| created_at | No         | 2026-01-14 10:30:00                  |

Only `content` is encrypted. Metadata remains visible for app functionality.

## Troubleshooting

### "Failed to decrypt content" error

- Salt was cleared from localStorage
- Entry was encrypted with different user ID
- Entry is corrupted

**Solution:** Check if salt exists in localStorage

### Can't read entries on new device

- Salt is device-specific (localStorage)
- Need to migrate salt to new device

**Solution:** Implement backend salt storage (future enhancement)

### Entries are plaintext in database

- Entry was created before encryption feature
- Encryption failed during save

**Solution:** Run migration script to encrypt existing entries

## Important Warnings

⚠️ **Don't clear localStorage** - You'll lose access to encrypted entries  
⚠️ **Backup your salt** - Store it securely outside the browser  
⚠️ **Device-specific** - Salt doesn't sync across devices  
⚠️ **No recovery** - If salt is lost, encrypted data is unrecoverable

## Production Enhancements

For production use, consider:

1. **Backend Salt Storage** - Store salt in Supabase, encrypted with user password
2. **Password-Based Keys** - Derive key from user password instead of user ID
3. **Cross-Device Sync** - Sync encryption keys across user devices
4. **Backup System** - Secure key backup and recovery mechanism
5. **2FA Protection** - Add two-factor authentication for salt access

## Resources

- [Web Crypto API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [AES-GCM Overview](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [PBKDF2 Spec](https://en.wikipedia.org/wiki/PBKDF2)

## Support

Questions? Check these files:

- `ENCRYPTION.md` - Full documentation
- `ENCRYPTION_TESTING.md` - Testing guide
- `lib/encryption.architecture.ts` - Technical details

---

**Status:** ✅ Encryption is active and protecting your diary entries!
