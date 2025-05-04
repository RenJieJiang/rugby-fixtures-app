import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import MobileNavigation from "@/app/ui/navigation/mobile-navigation";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Rugby Fixtures App",
  description: "Track and manage rugby fixtures with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Explicit favicon links to override caching */}
        <link rel="icon" href="/rugby-icon.png" />
        <link rel="shortcut icon" href="/rugby-icon.png" />
        <link rel="apple-touch-icon" href="/rugby-icon.png" />
      </head>
      <body
        className={`${inter.className} bg-amber-50 min-h-screen flex flex-col`}
      >
        <header>
          <nav
            aria-label="Header Navigation"
            className="p-4 bg-blue-900 text-white relative"
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto sm:justify-start sm:gap-12">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" className="text-2xl font-bold">
                  RUGBY Fixtures App
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden sm:flex sm:space-x-8">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <Link href="/fixtures" className="hover:underline">
                  Fixtures
                </Link>
                <Link href="/upload" className="hover:underline">
                  Upload Data
                </Link>
              </div>
              
              {/* Mobile Navigation Component */}
              <MobileNavigation />
            </div>
          </nav>
        </header>
        <main className="flex-grow flex flex-col">{children}</main>
        <footer className="bg-blue-900 shadow-inner py-2 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-100 text-xs">
              &copy; {new Date().getFullYear()} Rugby Fixtures App. <span className="hidden sm:inline">All rights
              reserved.</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
