'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="bg-app-background">
      <div className="mx-auto max-w-screen-xl px-4 py-8 md:py-16 lg:px-6 lg:py-32">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-app-foreground-color mb-4 text-7xl font-extrabold tracking-tight  lg:text-9xl">404</h1>
          <p className="text-app-foreground-color mb-4 text-3xl font-bold tracking-tight">{"Somethings' missing."}</p>
          <p className="text-app-foreground-color mb-4 text-lg font-light">Whoops! That page doesn’t exist.</p>

          <Button className="bg-app-primary-color hover:bg-app-primary-color hover:opacity-90">
            <Link href="/">Back to Public Timeline</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
