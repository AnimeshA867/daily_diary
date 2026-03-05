
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public", // Service worker basne thau
  cacheOnFrontEndNav: true, // Internal navigation fast garauna
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true, // File size sano banauna
  disable: process.env.NODE_ENV === "development", // Dev mode ma error naaos bhannalai
  workboxOptions: {
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days cache
    },
  },
});

export default withPWA({
  // Tapaiko aru normal Next.js configs yaha hunchhan
  reactStrictMode: true,
});

