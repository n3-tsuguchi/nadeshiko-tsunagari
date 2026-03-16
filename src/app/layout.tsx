import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { ReadStatusProvider } from "@/lib/read-status-context";
import { FontSizeProvider } from "@/lib/font-size-context";
import { AppShell } from "@/components/layout/app-shell";
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
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <FontSizeProvider>
            <ReadStatusProvider>
              <PwaRegister />
              <AppShell>{children}</AppShell>
            </ReadStatusProvider>
          </FontSizeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
