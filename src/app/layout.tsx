import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { RouterCacheProvider } from "@/components/RouterCacheProvider";
import { Suspense } from "react";
import "./globals.css";
import type { Metadata } from "next";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'NTMDB',
  description: 'A modern movie discovery application built with Next.js, featuring real-time movie data from The Movie Database (TMDB).'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <RouterCacheProvider>
              {children}
            </RouterCacheProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
