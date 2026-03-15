import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/header";
import { BottomTabBar } from "@/components/ui/tab-bar";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "なでしこつながり",
  description: "東住吉区 地域活動支援アプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#EC6D80" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <PwaRegister />
        <Header userName="田中 花子" />
        <main className="pb-20">{children}</main>
        <BottomTabBar userRole="resident" />
      </body>
    </html>
  );
}
