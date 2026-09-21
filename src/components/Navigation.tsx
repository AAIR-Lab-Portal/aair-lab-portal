// src/components/Navigation.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function Navigation() {
    const pathname = usePathname();

    // The Isolation Rule: If the URL starts with /vault, do not render the public navbar.
    if (pathname.startsWith("/vault")) {
        return null;
    }

    return (
        <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link href="/" className="flex items-center gap-3">
                    <Image src="/logo.svg" alt="AAIR Lab Logo" width={32} height={32} className="rounded-sm" />
                    <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                        AAIR<span className="text-blue-600 dark:text-blue-500">.LAB</span>
                    </span>
                </Link>

                <div className="flex items-center space-x-4 md:space-x-6 font-medium text-sm">
                    <Link href="/projects" className="hidden md:inline-block hover:text-blue-600 dark:hover:text-blue-400 transition">Projects</Link>
                    <Link href="/publications" className="hidden md:inline-block hover:text-blue-600 dark:hover:text-blue-400 transition">Publications</Link>
                    <Link href="/members" className="hidden md:inline-block hover:text-blue-600 dark:hover:text-blue-400 transition">Team</Link>
                    <Link href="/news" className="hidden md:inline-block hover:text-blue-600 dark:hover:text-blue-400 transition">News</Link>

                    <Link href="/search" className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors" title="Global Search">
                        <Search className="w-5 h-5" />
                    </Link>

                    <Link href="/join" className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                        Join Us
                    </Link>
                </div>
            </div>
        </nav>
    );
}