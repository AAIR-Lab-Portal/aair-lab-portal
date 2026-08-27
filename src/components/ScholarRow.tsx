// src/components/ScholarRow.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Quote } from "lucide-react";
import { Publication } from "@/lib/api";

export default function ScholarRow({ pub }: { pub: Publication }) {
    const [showAbstract, setShowAbstract] = useState(false);
    const [showCite, setShowCite] = useState(false);

    const year = (pub.date || "").split("-")[0];

    // Handlers to ensure only one dropdown is open at a time
    const toggleAbstract = () => {
        setShowAbstract(!showAbstract);
        setShowCite(false);
    };

    const toggleCite = () => {
        setShowCite(!showCite);
        setShowAbstract(false);
    };

    return (
        <article className="border-b border-zinc-200 dark:border-zinc-800 py-6 last:border-0">
            <div className="flex justify-between items-start gap-6">

                <div className="flex-grow">
                    {/* FIXED: The title now ALWAYS routes to your internal page */}
                    <Link
                        href={`/publications/${pub.slug}`}
                        className="text-xl font-extrabold text-blue-600 dark:text-blue-400 hover:underline tracking-tight"
                    >
                        {pub.title}
                    </Link>

                    <div className="text-zinc-800 dark:text-zinc-200 font-bold mt-2">
                        {pub.authors}
                    </div>

                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 flex flex-wrap items-center gap-3">
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
                                        <span key={tag} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-bold uppercase tracking-widest">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Secondary External Link stays on the right */}
                {pub.externalLink && (
                    <a href={pub.externalLink} target="_blank" title="View external source" className="shrink-0 p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                    </a>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-6">
                <button
                    onClick={toggleAbstract}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAbstract ? "rotate-180" : ""}`} />
                    Abstract
                </button>
                <button
                    onClick={toggleCite}
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${showCite ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400"}`}
                >
                    <Quote className="w-4 h-4" />
                    Cite
                </button>
            </div>

            {/* Abstract Panel */}
            {showAbstract && (
                <div className="mt-4 p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium shadow-inner">
                    {pub.abstract || "No abstract provided."}
                </div>
            )}

            {/* Citation Generator Panel */}
            {showCite && (
                <div className="mt-4 p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-inner space-y-5">
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">APA</div>
                        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {pub.authors}. ({year}). {pub.title}. <em className="text-zinc-600 dark:text-zinc-400">AAIR Lab Proceedings</em>.
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">MLA</div>
                        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {pub.authors}. "{pub.title}." <em className="text-zinc-600 dark:text-zinc-400">AAIR Lab Proceedings</em>, {year}.
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Chicago</div>
                        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {pub.authors}. "{pub.title}." <em className="text-zinc-600 dark:text-zinc-400">AAIR Lab Proceedings</em> ({year}).
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}