// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

// --- NEW IMPORTS FOR AUTH ---
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthNav from "@/components/AuthNav";

// ... keep metadata exactly the same ...

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SECURELY FETCH THE SESSION ON THE SERVER
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col transition-colors duration-300">
        <ThemeProvider>

          <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

              <Link href="/" className="flex items-center gap-3">
                <Image src="/favicon.ico" alt="AAIR Lab Logo" width={32} height={32} className="rounded-sm" />
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  AAIR<span className="text-blue-600 dark:text-blue-500">.Lab</span>
                </span>
              </Link>

              <div className="flex items-center space-x-6 font-medium text-sm">
                <Link href="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Projects</Link>
                <Link href="/publications" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Publications</Link>
                <Link href="/members" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Team</Link>
                <Link href="/news" className="hover:text-blue-600 dark:hover:text-blue-400 transition">News</Link>

                {/* INJECT THE SMART NAVBAR COMPONENT HERE */}
                <AuthNav session={session} />

                <ThemeToggle />
              </div>
            </div>
          </nav>

          <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
            {children}
          </main>

          <footer className="bg-zinc-100 dark:bg-zinc-900 py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm mt-auto border-t border-zinc-200 dark:border-zinc-800">
            <p>© {new Date().getFullYear()} AAIR Laboratory. Advanced AI Research.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}