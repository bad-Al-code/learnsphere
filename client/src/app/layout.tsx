import { Header } from "@/components/layout/header";
import { SessionProvider } from "@/components/layout/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { getCurrentUser } from "./(auth)/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnSphere",
  description: "A modern E-learning Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans  antialiased min-h-screen bg-background`}
      >
        <SessionProvider>
          <div className="relative mx-6 flex flex-col min-h-screen">
            <Header user={user} />
            <main className="flex-1">{children}</main>
            <Toaster />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
