import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yoruba 4 Pics 1 Word - Learn Yoruba with Visual Puzzles",
  description: "Learn Yoruba vocabulary through engaging visual puzzles. Guess the Yoruba word from 4 pictures!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-orange-800 via-orange-950 to-black`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 bg-slate-900/30 border-b border-white/10">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white truncate mr-2">Yoruba 4 Pics 1 Word</h1>
              <Link href="/" className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-white hover:bg-white/15 ring-1 ring-inset ring-white/15 flex-shrink-0">Home</Link>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="mt-4 sm:mt-8 border-t border-white/10">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 text-center text-white/50 text-xs">
              Ẹ kú àìkàkú! (Good job on learning!) Keep exploring Yoruba vocabulary.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
