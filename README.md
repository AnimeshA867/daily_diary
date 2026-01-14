# Daily Diary 📔

A secure, encrypted personal diary application built with Next.js and Supabase.

## 🔒 Security Features

**End-to-End Encryption** - All diary entries are encrypted on your device before being saved to the database. Even database administrators cannot read your entries.

- **AES-GCM 256-bit encryption** using Web Crypto API
- **PBKDF2 key derivation** with 100,000 iterations
- **User-specific encryption keys** - each user has a unique key
- **Random IVs** - each entry has a unique initialization vector

📖 Read more: [ENCRYPTION.md](./ENCRYPTION.md) | [ENCRYPTION_TESTING.md](./ENCRYPTION_TESTING.md)

## ✨ Features

- 🔐 **Encrypted Storage** - Your diary is private and secure
- 📅 **Calendar View** - See all your entries at a glance
- 🔥 **Streak Tracking** - Build a daily writing habit
- 👀 **View History** - Read previous entries (read-only)
- ⌨️ **Auto-save** - Your writing is automatically saved
- 📊 **Word Count** - Track your writing progress
- 🌙 **Modern UI** - Clean and distraction-free interface

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd daily_diary
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   - Copy `.env.example` to `.env` (if available)
   - Or ensure your `.env` file has the required variables

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Setup

Run the SQL script to create the required tables:

```sql
-- See scripts/001_create_diary_schema.sql
```

## 📁 Project Structure

```
daily_diary/
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   ├── diary/               # Main diary page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── calendar-grid.tsx   # Calendar view
│   ├── daily-writer.tsx    # Editor component (with encryption)
│   ├── streak-display.tsx  # Streak tracker
│   └── user-header.tsx     # User info header
├── lib/                     # Utility libraries
│   ├── encryption.ts       # 🔒 Encryption utilities
│   ├── client.ts           # Supabase client
│   └── server.ts           # Server-side Supabase
└── scripts/                 # Database scripts
```

## 🔐 Encryption Details

All diary entries are encrypted using AES-GCM before storage:

```typescript
// When saving
const encrypted = await encryptContent(plaintext, userId);
await saveToDatabase(encrypted);

// When loading
const encrypted = await loadFromDatabase();
const plaintext = await decryptContent(encrypted, userId);
```

**What's encrypted:** Diary entry content  
**What's not encrypted:** User ID, entry date, word count (needed for app functionality)

For complete details, see [ENCRYPTION.md](./ENCRYPTION.md)

## 🔧 Migration

If you have existing diary entries from before encryption was implemented:

1. Open the app in your browser
2. Open Developer Tools (F12)
3. Run in console:

```javascript
await checkMigrationStatus(); // Check status
await migrateExistingEntries(); // Encrypt existing entries
```

See [lib/migrate-encryption.ts](./lib/migrate-encryption.ts) for details.

## 🎨 Technologies

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Encryption:** Web Crypto API (AES-GCM)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Date Handling:** date-fns
- **Icons:** Lucide React

## 📝 Usage

1. **Sign up/Login** - Create an account or sign in
2. **Write** - Start writing in today's entry
3. **Auto-save** - Your entry saves automatically every 2 seconds
4. **Navigate** - Use arrows or calendar to view past/future dates
5. **View History** - Click any date to view that day's entry (read-only for past dates)

## ⚠️ Important Notes

### localStorage Dependency

- Encryption salt is stored in browser localStorage
- Clearing browser data will prevent decrypting old entries
- Currently device-specific (no cross-device sync)

### Production Recommendations

- Implement secure salt storage in backend
- Add cross-device key synchronization
- Consider password-based key derivation
- Implement backup/recovery mechanism

## 📚 Documentation

- [ENCRYPTION.md](./ENCRYPTION.md) - Encryption system overview
- [ENCRYPTION_TESTING.md](./ENCRYPTION_TESTING.md) - How to verify encryption
- [ENCRYPTION_SUMMARY.md](./ENCRYPTION_SUMMARY.md) - Quick reference
- [lib/encryption.architecture.ts](./lib/encryption.architecture.ts) - Technical details

## 🤝 Contributing

This is a personal diary application. If you'd like to use it:

1. Fork the repository
2. Set up your own Supabase project
3. Update environment variables
4. Customize as needed

## 📄 License

This project is for personal use.

## 🔒 Security

Found a security issue? Please do not open a public issue. Contact the maintainer directly.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
