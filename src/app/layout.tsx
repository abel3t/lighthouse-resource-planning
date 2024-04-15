import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider,  SignedIn,
  SignedOut,
  SignInButton,
  UserButton, } from '@clerk/nextjs'

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lighthouse Resource Planning",
  description: "Lighthouse Resource Planning website",
};

function Header() {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
      <h1>My App</h1>
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton/>
      </SignedOut>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <ClerkProvider>

      <body className={inter.className}>
      <Header />

      {children}
      </body>
      </ClerkProvider>  
    </html>

  );
}
