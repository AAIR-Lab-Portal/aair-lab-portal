// src/components/SignOutButton.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Check, X } from "lucide-react";

export default function SignOutButton() {
    const [isConfirming, setIsConfirming] = useState(false);

    if (isConfirming) {
        return (
            <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl flex flex-col gap-3 shadow-sm">
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 text-center uppercase tracking-widest">End Session?</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-lg transition-colors text-xs font-bold"
                    >
                        <Check className="w-3 h-3" /> Yes
                    </button>
                    <button
                        onClick={() => setIsConfirming(false)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors text-xs font-bold"
                    >
                        <X className="w-3 h-3" /> No
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsConfirming(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
        >
            <LogOut className="w-4 h-4" /> Sign Out
        </button>
    );
}