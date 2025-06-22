import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Roboto } from "next/font/google";

import { TRPCProvider } from "@/lib/trpc/provider";
import "./globals.css";
import { Header } from "@/components/layout/header";

const inter = Roboto({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LearnSphere - A modern E-Learning Platform",
  description: "Learn anything, anytime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <TRPCProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </TRPCProvider>
      </body>
    </html>
  );
}
