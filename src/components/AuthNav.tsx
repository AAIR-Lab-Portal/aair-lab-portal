// src/components/AuthNav.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, User, Folder } from "lucide-react";

// We pass the session data down from the secure server
export default function AuthNav({ session }: { session: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown if user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // If NOT logged in, show the standard Vault Login button
    if (!session) {
        return (
            <Link href="/vault" className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm text-sm">
                Login
            </Link>
        );
    }

    // If LOGGED IN, show the user profile dropdown
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    {session.user?.name?.charAt(0)}
                </div>
                <span>{session.user?.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* The Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Signed in as</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{session.user?.email}</p>
                    </div>

                    <Link href="/vault" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Lab Dashboard
                    </Link>
                    <Link href="/members/chau" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link href="/projects" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <Folder className="w-4 h-4" /> My Projects
                    </Link>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 mt-2 pt-2">
                        <button
                            // THIS IS THE MAGIC REDIRECT: callbackUrl forces them to the home page!
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}