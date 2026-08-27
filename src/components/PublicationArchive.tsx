// src/components/PublicationArchive.tsx
"use client";

import { useState } from "react";
import ScholarRow from "./ScholarRow";
import { Publication } from "@/lib/api";

export default function PublicationArchive({ allPublications }: { allPublications: Publication[] }) {
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const regularPubs = allPublications.filter(p => p.type !== "Thesis");
    const thesisPubs = allPublications.filter(p => p.type === "Thesis");

    const uniqueYears = Array.from(new Set(regularPubs.map(p => (p.date || "").split("-")[0]))).filter(Boolean).sort().reverse();
    const uniqueTags = Array.from(new Set(regularPubs.flatMap(p => p.tags || []))).filter(Boolean).sort();

    // The Active Filter Engine
    const filteredPubs = regularPubs.filter(pub => {
        const yearMatch = selectedYear ? (pub.date || "").startsWith(selectedYear) : true;
        const tagMatch = selectedTag ? (pub.tags || []).includes(selectedTag) : true;
        return yearMatch && tagMatch;
    });

    // Dynamic Count Calculators for the Badges
    const getYearCount = (year: string | null) => {
        return regularPubs.filter(pub => {
            const yMatch = year ? (pub.date || "").startsWith(year) : true;
            const tMatch = selectedTag ? (pub.tags || []).includes(selectedTag) : true;
            return yMatch && tMatch;
        }).length;
    };

    const getTagCount = (tag: string | null) => {
        return regularPubs.filter(pub => {
            const yMatch = selectedYear ? (pub.date || "").startsWith(selectedYear) : true;
            const tMatch = tag ? (pub.tags || []).includes(tag) : true;
            return yMatch && tMatch;
        }).length;
    };

    return (
        <div className="flex flex-col md:flex-row gap-12">

            {/* LEFT COLUMN: The Kaggle-Style Filter Sidebar */}
            <aside className="w-full md:w-64 shrink-0 space-y-8">

                {/* Master Heading */}
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    Filter by
                </h2>

                {/* Sub-section: DATE */}
                {uniqueYears.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-400 mb-4">
                            Date
                        </h3>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setSelectedYear(null)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${!selectedYear ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                                >
                                    <span>All Years</span>
                                    <span className="bg-zinc-200 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-xs">{getYearCount(null)}</span>
                                </button>
                            </li>
                            {uniqueYears.map(year => (
                                <li key={year}>
                                    <button
                                        onClick={() => setSelectedYear(year)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${selectedYear === year ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                                    >
                                        <span>{year}</span>
                                        <span className="bg-zinc-200 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-xs">{getYearCount(year)}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Sub-section: TOPIC TYPE */}
                {uniqueTags.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-400 mb-4">
                            Topic
                        </h3>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${!selectedTag ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                                >
                                    <span className="text-left">All Topics</span>
                                    <span className="bg-zinc-200 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-xs">{getTagCount(null)}</span>
                                </button>
                            </li>
                            {uniqueTags.map(tag => (
                                <li key={tag}>
                                    <button
                                        onClick={() => setSelectedTag(tag)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${selectedTag === tag ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                                    >
                                        <span className="text-left line-clamp-1 pr-2">{tag}</span>
                                        <span className="bg-zinc-200 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-xs shrink-0">{getTagCount(tag)}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </aside>

            {/* RIGHT COLUMN: The Data Archive */}
            <main className="flex-grow min-w-0">
                <section>
                    <div className="flex justify-between items-end mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                            Peer-Reviewed Research
                        </h2>
                        <span className="text-sm font-bold text-zinc-500">
                            {filteredPubs.length} Result{filteredPubs.length !== 1 && 's'}
                        </span>
                    </div>

                    {filteredPubs.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 font-bold bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            No publications match the selected filters.
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredPubs.map(pub => <ScholarRow key={pub.slug} pub={pub} />)}
                        </div>
                    )}
                </section>

                {thesisPubs.length > 0 && (
                    <section className="mt-16 pt-12 border-t-[6px] border-zinc-100 dark:border-zinc-900">
                        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
                            Student Theses
                        </h2>
                        <div className="flex flex-col">
                            {thesisPubs.map(pub => <ScholarRow key={pub.slug} pub={pub} />)}
                        </div>
                    </section>
                )}
            </main>

        </div>
    );
}