import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import { ThemeProvider } from "@/components/providers";
import Sidebar from "@/components/sidebar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Lighthouse Resource Planning",
  description: "Lighthouse Resource Planning website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex justify-between">
            <Sidebar className={""}/>

          <div className="grow w-full">
          {children}

          </div>
            
          </div>


          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
