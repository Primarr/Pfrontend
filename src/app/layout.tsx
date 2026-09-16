"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { WalletProvider } from "@/components/wallet/wallet-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <title>Primar — Agent Payment Dashboard</title>
        <meta
          name="description"
          content="Stellar-settled payment rails for the agent economy"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-black">
        <ErrorBoundary>
          <WalletProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
