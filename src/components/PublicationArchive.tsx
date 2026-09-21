// src/components/PublicationArchive.tsx
"use client";

import { useState, useEffect } from "react";
import ScholarRow from "./ScholarRow";
import { Member, Publication } from "@/lib/api";
import { CheckSquare, Square, ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function PublicationArchive({ allPublications, allMembers }: { allPublications: Publication[]; allMembers: Member[] }) {
    const [activeTab, setActiveTab] = useState<"research" | "theses">("research");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, selectedYears, selectedTags, selectedTypes]);

    const regularPubs = allPublications.filter(p => p.type !== "Thesis");
    const thesisPubs = allPublications.filter(p => p.type === "Thesis");

    const activeDataset = activeTab === "research" ? regularPubs : thesisPubs;

    const uniqueYears = Array.from(new Set(activeDataset.map(p => (p.date || "").split("-")[0]))).filter(Boolean).sort().reverse();
    const uniqueTags = Array.from(new Set(activeDataset.flatMap(p => p.tags || []))).filter(Boolean).sort();
    const uniqueTypes = Array.from(new Set(activeDataset.map(p => p.type))).filter(Boolean).sort();

    const toggleFilter = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
    };

    const filteredPubs = activeDataset.filter(pub => {
        const pubYear = (pub.date || "").split("-")[0];
        const yearMatch = selectedYears.length === 0 || selectedYears.includes(pubYear);
        const tagMatch = selectedTags.length === 0 || (pub.tags || []).some(t => selectedTags.includes(t));
        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(pub.type);

        const searchMatch = searchQuery === "" ||
            pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (pub.abstract && pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()));

        return yearMatch && tagMatch && typeMatch && searchMatch;
    });

    const totalPages = Math.ceil(filteredPubs.length / ITEMS_PER_PAGE);
    const displayedPubs = filteredPubs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const startResult = filteredPubs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endResult = Math.min(currentPage * ITEMS_PER_PAGE, filteredPubs.length);

    return (
        <div className="flex flex-col md:flex-row gap-12 relative items-start">
            <aside className="w-full md:w-64 shrink-0 space-y-8 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-8">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Filter by</h2>
                    {(selectedYears.length > 0 || selectedTags.length > 0 || selectedTypes.length > 0) && (
                        <button
                            onClick={() => { setSelectedYears([]); setSelectedTags([]); setSelectedTypes([]); }}
                            className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {uniqueYears.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-400 mb-4">Date</h3>
                        <ul className="space-y-1.5">
                            {uniqueYears.map(year => {
                                const isChecked = selectedYears.includes(year);
                                return (
                                    <li key={year}>
                                        <button
                                            onClick={() => toggleFilter(year, setSelectedYears)}
                                            className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 group"
                                        >
                                            <span className={isChecked ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300"}>
                                                {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                            </span>
                                            {year}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {uniqueTypes.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-400 mb-4">Type</h3>
                        <ul className="space-y-1.5">
                            {uniqueTypes.map(type => {
                                const isChecked = selectedTypes.includes(type);
                                return (
                                    <li key={type}>
                                        <button
                                            onClick={() => toggleFilter(type, setSelectedTypes)}
                                            className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 group"
                                        >
                                            <span className={isChecked ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300"}>
                                                {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                            </span>
                                            {type}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {uniqueTags.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-400 mb-4">Topic</h3>
                        <ul className="space-y-1.5">
                            {uniqueTags.map(tag => {
                                const isChecked = selectedTags.includes(tag);
                                return (
                                    <li key={tag}>
                                        <button
                                            onClick={() => toggleFilter(tag, setSelectedTags)}
                                            className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 group"
                                        >
                                            <span className={`shrink-0 ${isChecked ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300"}`}>
                                                {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                            </span>
                                            <span className="text-left leading-tight">{tag}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </aside>

            <main className="flex-grow min-w-0 flex flex-col min-h-[50vh]">

                {/* Search Bar */}
                <div className="relative w-full max-w-3xl mb-8">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search publications by title or abstract..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow text-zinc-900 dark:text-zinc-100 font-medium placeholder:text-zinc-400 shadow-sm"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                    <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 w-max">
                        <button
                            onClick={() => setActiveTab("research")}
                            className={`px-6 py-2.5 rounded-lg text-sm font-black tracking-wide transition-all ${activeTab === "research"
                                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                }`}
                        >
                            Research Papers
                        </button>
                        {thesisPubs.length > 0 && (
                            <button
                                onClick={() => setActiveTab("theses")}
                                className={`px-6 py-2.5 rounded-lg text-sm font-black tracking-wide transition-all ${activeTab === "theses"
                                    ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    }`}
                            >
                                Student Theses
                            </button>
                        )}
                    </div>

                    <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        {startResult} - {endResult} <span className="text-zinc-400">of</span> {filteredPubs.length} Results
                    </div>
                </div>

                {filteredPubs.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 font-bold bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        No publications match the selected filters.
                    </div>
                ) : (
                    <div className="flex flex-col space-y-6">
                        {displayedPubs.map(pub => <ScholarRow key={pub.slug} pub={pub} members={allMembers} />)}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-auto pt-12 flex justify-center items-center gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-1">
                            {pageNumbers.map(num => (
                                <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === num ? "bg-blue-600 text-white shadow-sm border border-blue-600" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent"}`}>
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}