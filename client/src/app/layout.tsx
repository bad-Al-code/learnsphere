import { Header } from '@/components/layout/header';
import { SessionRefresher } from '@/components/layout/session-refresher';
import { Toaster } from '@/components/ui/sonner';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { getCurrentUser } from './(auth)/actions';
import { ThemeFavicon } from './(components)/theme-favicon';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'LearnSphere',
  description: 'A modern E-learning Platform',
  icons: '../../assets/logo/Theme=Dark.svg',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link id="favicon" rel="icon" href="/icons/theme-light.svg" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} bg-background min-h-screen font-sans antialiased`}
      >
        <ThemeFavicon />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative mx-6 flex min-h-screen flex-col">
            <Header user={user} />
            <main className="flex-1">{children}</main>
            <Toaster />
          </div>
        </ThemeProvider>
        <SessionRefresher />
      </body>
    </html>
  );
}
