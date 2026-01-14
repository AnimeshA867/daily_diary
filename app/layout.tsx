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
  title: "Daily Diary - Your Private, Encrypted Journal",
  description: "A secure, end-to-end encrypted personal diary application. Write freely, knowing your thoughts are protected by military-grade encryption.",
  keywords: ["diary", "journal", "encrypted", "private", "secure", "personal"],
  authors: [{ name: "Daily Diary" }],
  openGraph: {
    title: "Daily Diary - Your Private, Encrypted Journal",
    description: "Write freely in your private, encrypted diary. Your thoughts are secure with military-grade encryption.",
    type: "website",
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
