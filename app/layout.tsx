import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Krypt",
    default: "Krypt - Your Private, Encrypted Journal",
  },
  description:
    "A secure, end-to-end encrypted personal diary application. Write freely, knowing your thoughts are protected by military-grade encryption.",
  keywords: ["diary", "journal", "encrypted", "private", "secure", "personal"],
  authors: [{ name: "Krypt" }],
  creator: "Krypt",
  publisher: "Krypt",
  manifest: "/manifest.json",
  metadataBase: new URL("https://krypt.app"),
  openGraph: {
    title: "Krypt - Your Private, Encrypted Journal",
    description:
      "Write freely in your private, encrypted diary. Your thoughts are secure with military-grade encryption.",
    url: "https://krypt.app",
    siteName: "Krypt",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Krypt Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krypt - Your Private, Encrypted Journal",
    description:
      "A secure, end-to-end encrypted personal diary application. Write freely, knowing your thoughts are protected.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
