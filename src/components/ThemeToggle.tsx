// src/components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
        >
            {/* We show the Sun in dark mode, and Moon in light mode */}
            <Sun className="h-5 w-5 hidden dark:block text-slate-200" />
            <Moon className="h-5 w-5 block dark:hidden text-slate-700" />
        </button>
    );
}