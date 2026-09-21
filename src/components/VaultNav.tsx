// src/components/VaultNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileEdit, UserCircle } from "lucide-react";

export default function VaultNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Lab Dashboard", path: "/vault", icon: LayoutDashboard },
        { name: "Submission Portal", path: "/vault/submit", icon: FileEdit },
        { name: "Profile Editor", path: "/vault/profile", icon: UserCircle },
    ];

    return (
        <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${isActive
                                ? "bg-blue-600/10 text-blue-500"
                                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}