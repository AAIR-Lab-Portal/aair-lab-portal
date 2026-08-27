// src/components/ThemeEnforcer.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ThemeEnforcer() {
    const pathname = usePathname();

    useEffect(() => {
        // If we are anywhere inside the restricted vault, force Dark Mode
        if (pathname.startsWith("/vault")) {
            document.documentElement.classList.add("dark");
        }
        // Otherwise, force Light Mode for the public portal
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [pathname]);

    return null; // This component remains invisible
}