// src/components/AuthorPill.tsx
"use client";

import Link from "next/link";
import { User, ExternalLink } from "lucide-react";
import { Member } from "@/lib/api";
import ClientAvatar from "./ClientAvatar";

interface Props {
    nameOrId: string;
    members: Member[];
    compact?: boolean;
}

export default function AuthorPill({ nameOrId, members, compact = false }: Props) {
    const rawInput = nameOrId.trim();
    
    // 1. Markdown URL Extractor for External Authors
    // Detects "[John Doe](https://arxiv.org/123)"
    const linkRegex = /^\[(.*?)\]\((.*?)\)$/;
    const match = rawInput.match(linkRegex);
    
    const cleanName = match ? match[1].trim() : rawInput;
    const externalUrl = match ? match[2].trim() : null;

    // 2. Member Matching
    const memberMatch = members.find(m => {
        const memberIdText = m.id !== undefined && m.id !== null ? String(m.id) : "";
        return m.name.toLowerCase() === cleanName.toLowerCase() || memberIdText === cleanName;
    });

    // 3. Mathematical Initialing Engine (IEEE Standard)
    const getShortName = (fullName: string) => {
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return fullName;
        const last = parts.pop();
        const initials = parts.map(p => p[0].toUpperCase() + ".").join(" ");
        return `${initials} ${last}`;
    };

    // 4. Dynamic Styles
    // Added group/pill and relative for the tooltip positioning
    const pillClass = `group/pill relative inline-flex items-center ${compact ? "gap-2 px-1.5 py-1.5 pr-3" : "gap-3 px-2 py-2 pr-5"} bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-full transition-colors w-max`;
    const avatarWrapper = `relative rounded-full overflow-hidden shrink-0 border border-zinc-300 dark:border-zinc-700 ${compact ? "w-6 h-6" : "w-10 h-10"}`;
    const textSize = `${compact ? "text-xs" : "text-[15px]"} font-bold text-zinc-700 dark:text-zinc-300 group-hover/pill:text-blue-600 dark:group-hover/pill:text-blue-400 transition-colors whitespace-nowrap`;
    const fallbackSize = compact ? 24 : 40;

    const displayName = compact ? getShortName(memberMatch ? memberMatch.name : cleanName) : (memberMatch ? memberMatch.name : cleanName);

    // --- RENDER 1: LAB MEMBER ---
    if (memberMatch) {
        return (
            <Link href={`/members/${memberMatch.slug}`} className={`${pillClass} hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer`}>
                <div className={avatarWrapper}>
                    <ClientAvatar src={memberMatch.image} alt={memberMatch.name} fallbackSize={fallbackSize} />
                </div>
                <span className={textSize}>{displayName}</span>

                {/* CSS Tooltip */}
                {compact && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover/pill:opacity-100 group-hover/pill:scale-100 transition-all z-50 flex flex-col items-center">
                        <span className="text-xs font-bold">{memberMatch.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-0.5">Lab Member</span>
                    </div>
                )}
            </Link>
        );
    }

    // --- RENDER 2: EXTERNAL AUTHOR (WITH LINK) ---
    if (externalUrl) {
        return (
            <a href={externalUrl} target="_blank" rel="noreferrer" className={`${pillClass} hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer`}>
                <div className={`${avatarWrapper} flex items-center justify-center bg-zinc-200 dark:bg-zinc-800`}>
                    <ExternalLink className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-zinc-500 dark:text-zinc-400`} />
                </div>
                <span className={textSize}>{displayName}</span>

                {/* CSS Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover/pill:opacity-100 group-hover/pill:scale-100 transition-all z-50 flex flex-col items-center">
                    <span className="text-xs font-bold">{cleanName}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 dark:text-blue-500 mt-0.5">View Profile ↗</span>
                </div>
            </a>
        );
    }

    // --- RENDER 3: EXTERNAL AUTHOR (NO LINK) ---
    return (
        <div className={pillClass}>
            <div className={`${avatarWrapper} flex items-center justify-center bg-zinc-200 dark:bg-zinc-800`}>
                <User className={`${compact ? "w-3.5 h-3.5" : "w-5 h-5"} text-zinc-500 dark:text-zinc-400`} />
            </div>
            <span className={textSize}>{displayName}</span>

            {/* CSS Tooltip */}
            {compact && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover/pill:opacity-100 group-hover/pill:scale-100 transition-all z-50 flex flex-col items-center">
                    <span className="text-xs font-bold">{cleanName}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-0.5">External Author</span>
                </div>
            )}
        </div>
    );
}