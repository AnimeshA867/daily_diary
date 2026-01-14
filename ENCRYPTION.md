# Diary Entry Encryption

## Overview

All diary entries are now **end-to-end encrypted** using AES-GCM encryption before being stored in the database. This ensures that even database administrators cannot read the content of user entries.

## How It Works

### Encryption Process

1. **Key Derivation**: Each user gets a unique encryption key derived from:

   - Their user ID
   - A random salt (generated once per user and stored in browser localStorage)
   - PBKDF2 with 100,000 iterations and SHA-256 hashing

2. **Content Encryption**:

   - Uses AES-GCM (256-bit) encryption
   - Each entry gets a unique random Initialization Vector (IV)
   - Content is encrypted in the browser before sending to database

3. **Storage Format**:
   - Encrypted content is stored as base64-encoded string
   - Format: `[12-byte IV][encrypted data]`

### Decryption Process

1. When loading an entry, the encrypted content is fetched from the database
2. The same user-specific key is derived using their ID and stored salt
3. Content is decrypted in the browser and displayed to the user

## Security Features

✅ **Client-Side Encryption**: All encryption/decryption happens in the browser  
✅ **User-Specific Keys**: Each user has a unique encryption key  
✅ **Random IVs**: Each entry uses a unique initialization vector  
✅ **Strong Algorithm**: AES-GCM 256-bit encryption with authenticated encryption  
✅ **Key Derivation**: PBKDF2 with 100,000 iterations prevents brute force attacks  
✅ **No Plaintext Storage**: Content is never stored in plaintext in the database

## What This Means

### For Users:

- Your diary entries are private and secure
- Even if the database is compromised, your entries remain encrypted
- Only you can decrypt and read your entries (as long as you use the same browser/device)

### For Database Administrators:

- Cannot read diary entry content directly from the database
- Can only see encrypted base64 strings
- Metadata (user_id, entry_date, word_count) is still visible for administrative purposes

## Important Notes

### Browser/Device Dependency

- The encryption salt is stored in browser localStorage
- **If you clear browser data or switch devices**, you will need the same salt to decrypt your entries
- Consider implementing a backup/sync mechanism for the salt in production

### Current Limitations

1. **No Cross-Device Sync**: Since the salt is in localStorage, entries encrypted on one device cannot be decrypted on another device without manually transferring the salt
2. **No Password Protection**: The key is derived from the user ID, not a password
3. **Recovery**: If localStorage is cleared, old encrypted entries cannot be decrypted

## Production Recommendations

For a production application, consider:

1. **User Password-Based Encryption**: Derive keys from a user-provided password instead of user ID
2. **Secure Salt Storage**: Store the salt in a secure backend associated with the user account
3. **Key Backup/Recovery**: Implement a secure key backup and recovery mechanism
4. **Multi-Device Support**: Sync encryption keys across user devices securely
5. **Hardware Security**: Use Web Crypto API with hardware-backed keys where available

## Technical Details

**Algorithm**: AES-GCM  
**Key Size**: 256 bits  
**IV Size**: 12 bytes (96 bits)  
**KDF**: PBKDF2  
**Hash**: SHA-256  
**Iterations**: 100,000

## Testing

To verify encryption is working:

1. Write a diary entry
2. Check the database directly - the content should be a long base64 string
3. Try to decode the base64 - it should be unreadable binary data
4. View the entry in the app - it should be readable (decrypted)

## Files Modified

- `lib/encryption.ts` - New encryption utility functions
- `components/daily-writer.tsx` - Updated to encrypt/decrypt content

## Code Example

```typescript
// Encrypt before saving
const encryptedContent = await encryptContent(plaintext, userId);
await saveToDatabase(encryptedContent);

// Decrypt after loading
const encryptedContent = await loadFromDatabase();
const plaintext = await decryptContent(encryptedContent, userId);
```
