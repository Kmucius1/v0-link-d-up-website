import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LINK'D UP — Networking for Creators, Artists & Entrepreneurs",
  description: "LINK'D UP is a modern networking community for artists, business owners, entrepreneurs, creators, influencers, musicians, educators, and anyone who creates, builds, teaches, or wants to connect.",
  openGraph: {
    title: "LINK'D UP",
    description: "Connection. Creativity. Community. Opportunity.",
    url: "https://linkdup.club",
    siteName: "LINK'D UP",
    locale: "en_US",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "LINK'D UP",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
