import type { Metadata } from 'next';
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import { Inter as FontSans } from 'next/font/google';
import { notFound } from 'next/navigation';

import { Toaster } from '@/components/ui/sonner';

import { cn } from '@/lib/utils';

import './globals.css';

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
  console.log('locale', locale);

  // if (params?.locale !== locale) {
  //   notFound();
  // }

  return (
    <html lang={params?.locale}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextIntlClientProvider messages={messages}>
          <main>
            {children}
            <Toaster />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
