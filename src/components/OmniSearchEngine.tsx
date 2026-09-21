// src/components/OmniSearchEngine.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon, FileText, Newspaper, Box, ChevronLeft, ChevronRight } from "lucide-react";
import { UnifiedResult } from "@/app/search/page";
import { Member } from "@/lib/api";

export default function OmniSearchEngine({ initialData, members }: { initialData: UnifiedResult[]; members: Member[] }) {
    const [query, setQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Reset to page 1 anytime the user types or changes filters
    useEffect(() => {
        setCurrentPage(1);
    }, [query, selectedType, selectedYear]);

    const uniqueYears = Array.from(new Set(initialData.map((d) => (d.date || "").split("-")[0]))).filter(Boolean).sort().reverse();
    const contentTypes = ["Publication", "Project", "News"];

    const filteredData = initialData.filter((item) => {
        const searchMatch = query === "" ||
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(query.toLowerCase());
        const typeMatch = selectedType ? item.contentType === selectedType : true;
        const yearMatch = selectedYear ? (item.date || "").startsWith(selectedYear) : true;

        return searchMatch && typeMatch && yearMatch;
    });

    // Pagination Math
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const displayedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const getTypeCount = (type: string | null) => {
        return initialData.filter(item => {
            const qMatch = query === "" || item.title.toLowerCase().includes(query.toLowerCase()) || item.excerpt.toLowerCase().includes(query.toLowerCase());
            const yMatch = selectedYear ? (item.date || "").startsWith(selectedYear) : true;
            const tMatch = type ? item.contentType === type : true;
            return qMatch && yMatch && tMatch;
        }).length;
    };

    const getYearCount = (year: string | null) => {
        return initialData.filter(item => {
            const qMatch = query === "" || item.title.toLowerCase().includes(query.toLowerCase()) || item.excerpt.toLowerCase().includes(query.toLowerCase());
            const tMatch = selectedType ? item.contentType === selectedType : true;
            const yMatch = year ? (item.date || "").startsWith(year) : true;
            return qMatch && tMatch && yMatch;
        }).length;
    };

    const getTypeIcon = (type: string) => {
        if (type === "Publication") return <FileText className="w-4 h-4" />;
        if (type === "News") return <Newspaper className="w-4 h-4" />;
        return <Box className="w-4 h-4" />;
    };

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

    return (
        <div className="space-y-12">

            {/* 1. The Omni-Search Bar */}
            <div className="relative max-w-3xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="w-6 h-6 text-zinc-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by keyword, abstract, or title..."
                    className="w-full pl-14 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-shadow text-zinc-900 dark:text-zinc-100 text-lg font-bold placeholder:text-zinc-400 shadow-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-12">
                {/* 2. The Filter Sidebar */}
                <aside className="w-full md:w-64 shrink-0 space-y-10">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-400 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                            Type
                        </h3>
                        <ul className="space-y-1">
                            <li>
                                <button onClick={() => setSelectedType(null)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${!selectedType ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50'}`}>
                                    <span>All</span>
                                    <span className="bg-zinc-200 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-xs">{getTypeCount(null)}</span>
                                </button>
                            </li>
                            {contentTypes.map(type => (
                                <li key={type}>
                                    <button onClick={() => setSelectedType(type)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${selectedType === type ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50'}`}>
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(type)}
                                            <span>{type}</span>
                                        </div>
                                        <span className="bg-zinc-200 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-xs">{getTypeCount(type)}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {uniqueYears.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-400 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                                Date
                            </h3>
                            <ul className="space-y-1">
                                <li>
                                    <button onClick={() => setSelectedYear(null)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${!selectedYear ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50'}`}>
                                        <span>All</span>
                                        <span className="bg-zinc-200 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-xs">{getYearCount(null)}</span>
                                    </button>
                                </li>
                                {uniqueYears.map(year => (
                                    <li key={year}>
                                        <button onClick={() => setSelectedYear(year)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${selectedYear === year ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50'}`}>
                                            <span>{year}</span>
                                            <span className="bg-zinc-200 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-xs">{getYearCount(year)}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </aside>

                {/* 3. The Results Matrix */}
                <main className="flex-grow min-w-0 flex flex-col min-h-[50vh]">
                    <div className="mb-6 flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                            Results
                        </h2>
                        <span className="text-sm font-bold text-zinc-500">
                            {filteredData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} Matches
                        </span>
                    </div>

                    {filteredData.length === 0 ? (
                        <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-zinc-900 dark:text-zinc-100 font-bold mb-2">No results found.</p>
                            <p className="text-zinc-500 text-sm font-medium">Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {displayedData.map((item) => (
                                <Link href={item.url} key={item.id} className="block group">
                                    <article className="p-6 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors">

                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                                                {getTypeIcon(item.contentType)}
                                                {item.contentType}
                                            </span>
                                            {item.date && (
                                                <span className="text-sm font-bold text-zinc-400">{item.date.split("-")[0]}</span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight mb-2">
                                            {item.title}
                                        </h3>

                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed line-clamp-2 mb-3">
                                            {item.excerpt}
                                        </p>

                                        <div className="text-xs font-bold text-zinc-500 flex flex-wrap items-center gap-2">
                                            <span className="line-clamp-1 max-w-[200px] sm:max-w-[300px]">
                                                {item.contentType === "Project" ? `Status: ${item.authorOrStatus}` : parseAuthors(item.authorOrStatus)}
                                            </span>

                                            {item.tags.length > 0 && (
                                                <>
                                                    <span className="text-zinc-300 dark:text-zinc-700 shrink-0">•</span>
                                                    <span className="uppercase tracking-widest shrink-0 line-clamp-1">
                                                        {item.tags.slice(0, 2).join(", ")}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-auto pt-12 flex justify-center items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => {
                                    setCurrentPage(p => p - 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex gap-1">
                                {pageNumbers.map(num => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            setCurrentPage(num);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === num
                                                ? "bg-blue-600 text-white shadow-sm border border-blue-600"
                                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => {
                                    setCurrentPage(p => p + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}