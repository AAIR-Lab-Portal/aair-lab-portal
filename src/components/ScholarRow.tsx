// src/components/ScholarRow.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Quote } from "lucide-react";
import { Publication, Member } from "@/lib/api";

interface Props {
    pub: Publication;
    members: Member[];
}

export default function ScholarRow({ pub, members }: Props) {
    const [showAbstract, setShowAbstract] = useState(false);
    const [showCite, setShowCite] = useState(false);

    const year = (pub.date || "").split("-")[0];

    // THE SMART PARSER: Converts links and IDs into clean, plain-text names
    const parseAuthors = (rawAuthors: string) => {
        if (!rawAuthors) return "AAIR Lab";
        return rawAuthors.split(",").map(a => {
            const clean = a.trim();
            const match = clean.match(/^\[(.*?)\]\((.*?)\)$/);
            const name = match ? match[1].trim() : clean;
            
            const memberMatch = members.find(m => String(m.id) === name || m.name.toLowerCase() === name.toLowerCase());
            return memberMatch ? memberMatch.name : name;
        }).join(", ");
    };

    const cleanAuthors = parseAuthors(pub.authors);

    return (
        <article className="border-b border-zinc-200 dark:border-zinc-800 pb-8 last:border-0">
            <div className="flex justify-between items-start gap-6">

                <div className="flex-grow">
                    <Link
                        href={`/publications/${pub.slug}`}
                        className="text-xl font-extrabold text-blue-600 dark:text-blue-400 hover:underline tracking-tight block mb-2"
                    >
                        {pub.title}
                    </Link>

                    {/* REVERTED TO CLEAN TEXT */}
                    <div className="text-zinc-800 dark:text-zinc-200 font-bold mb-3 text-base">
                        {cleanAuthors}
                    </div>

                    <div className="text-sm text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-3">
                        <span className="font-extrabold text-zinc-900 dark:text-zinc-100">{pub.type}</span>
                        {year && (
                            <>
                                <span>•</span>
                                <span className="font-bold">{year}</span>
                            </>
                        )}

                        {pub.tags && pub.tags.length > 0 && (
                            <>
                                <span>•</span>
                                <div className="flex flex-wrap gap-2">
                                    {pub.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {pub.externalLink && (
                    <a href={pub.externalLink} target="_blank" rel="noreferrer" title="View external source" className="shrink-0 p-2 text-zinc-400 hover:text-blue-600 transition-colors bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <ExternalLink className="w-5 h-5" />
                    </a>
                )}
            </div>

            <div className="mt-5 flex items-center gap-6">
                <button onClick={() => { setShowAbstract(!showAbstract); setShowCite(false); }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAbstract ? "rotate-180 text-blue-600 dark:text-blue-400" : ""}`} />
                    Abstract
                </button>
                <button onClick={() => { setShowCite(!showCite); setShowAbstract(false); }} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${showCite ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400"}`}>
                    <Quote className="w-4 h-4" />
                    Cite
                </button>
            </div>

            {showAbstract && (
                <div className="mt-4 p-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed font-medium shadow-sm">
                    {pub.abstract || "No abstract provided."}
                </div>
            )}

            {showCite && (
                <div className="mt-4 p-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm space-y-6">
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">APA</div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {cleanAuthors}. ({year}). {pub.title}. <em className="text-zinc-600 dark:text-zinc-400">AAIR Lab Proceedings</em>.
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">MLA</div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {cleanAuthors}. "{pub.title}." <em className="text-zinc-600 dark:text-zinc-400">AAIR Lab Proceedings</em>, {year}.
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Chicago</div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {cleanAuthors}. "{pub.title}." <em className="text-zinc-600 dark:text-zinc-400">AAIR Lab Proceedings</em> ({year}).
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}