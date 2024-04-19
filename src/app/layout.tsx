import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import Footer from '@/components/custom/footer';
import Sidebar from '@/components/custom/sidebar';
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
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <main>
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
