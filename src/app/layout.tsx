import type { Metadata } from "next";
import { Inter } from "next/font/google";


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
    </header>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">

      <body className={inter.className}>
      <Header />

      {children}
      </body>
    </html>

  );
}
