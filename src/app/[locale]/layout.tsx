import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import { Inter as FontSans } from 'next/font/google';

import { ThemeProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

import { cn } from '@/lib/utils';

import '../globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Lighthouse Resource Planning',
  description: 'Lighthouse Resource Planning website'
};

export default function RootLayout({
  children,

  params
}: Readonly<{
  children: React.ReactNode;

  params: { locale: string };
}>) {
  const messages = useMessages();

  const locale = useLocale();

  // if (params?.locale !== locale) {
  //   notFound();
  // }

  return (
    <html lang={params?.locale}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <main>
              {children}
              <Toaster
                toastOptions={{
                  classNames: {
                    error: 'text-red-500',
                    success: 'text-green-500',
                    warning: 'text-yellow-400',
                    info: 'text-blue-400'
                  }
                }}
              />
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
