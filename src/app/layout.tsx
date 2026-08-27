// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import ThemeEnforcer from "@/components/ThemeEnforcer";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sourcecodepro",
});

export const metadata: Metadata = {
  title: "AAIR Lab",
  description: "Advanced AI Research Laboratory",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Deterministic Theme Execution
  const themeClass = session ? "dark" : "";

  return (
    <html lang="en" className={`${themeClass} ${sourceCodePro.variable}`}>
      <body className="font-mono min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col transition-colors duration-300">
        <ThemeEnforcer />
        <Navigation />

        <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
          {children}
        </main>

        <footer className="bg-zinc-100 dark:bg-zinc-900 py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm mt-auto border-t border-zinc-200 dark:border-zinc-800">
          <p>© {new Date().getFullYear()} AAIR Laboratory. Advanced AI Research.</p>
        </footer>
      </body>
    </html>
  );
}