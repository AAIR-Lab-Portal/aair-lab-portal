// src/components/NotionDirectory.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Bell, Database, Search, User, Calendar, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { InternalDoc } from "@/lib/api";
import StarButton from "./StarButton";

export default function NotionDirectory({ docs }: { docs: InternalDoc[] }) {
    const searchParams = useSearchParams();
    const urlType = searchParams.get("type");

    const initialTab = urlType ? urlType.charAt(0).toUpperCase() + urlType.slice(1) : "All";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [starredSlugs, setStarredSlugs] = useState<string[]>([]);

    // Reset pagination when changing tabs or searching
    useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

    // Load and sync stars
    useEffect(() => {
        if (urlType) setActiveTab(urlType.charAt(0).toUpperCase() + urlType.slice(1));

        const fetchStars = () => setStarredSlugs(JSON.parse(localStorage.getItem("aair_stars") || "[]"));
        fetchStars();

        window.addEventListener("starsUpdated", fetchStars);
        return () => window.removeEventListener("starsUpdated", fetchStars);
    }, [urlType]);

    const tabs = [
        { id: "All", label: "All", icon: null },
        { id: "Starred", label: "Starred", icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> },
        { id: "Tutorial", label: "Tutorials", icon: <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> },
        { id: "Announcement", label: "Announcements", icon: <Bell className="w-4 h-4 text-blue-600 dark:text-blue-500" /> },
        { id: "Resource", label: "Resources", icon: <Database className="w-4 h-4 text-purple-600 dark:text-purple-500" /> }
    ];

    const filteredDocs = docs.filter((doc) => {
        let matchesTab = false;
        if (activeTab === "All") matchesTab = true;
        else if (activeTab === "Starred") matchesTab = starredSlugs.includes(doc.slug);
        else matchesTab = doc.type === activeTab;

        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (doc.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Pagination Math
    const ITEMS_PER_PAGE = activeTab === "All" ? 20 : 10;
    const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);
    const displayedDocs = filteredDocs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const getIcon = (type: string) => {
        if (type === "Tutorial") return <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />;
        if (type === "Announcement") return <Bell className="w-4 h-4 text-blue-600 dark:text-blue-500" />;
        if (type === "Resource") return <Database className="w-4 h-4 text-purple-600 dark:text-purple-500" />;
        return <Database className="w-4 h-4 text-zinc-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900/80 rounded-lg w-max border border-zinc-200 dark:border-zinc-800">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            title={tab.label}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center justify-center min-w-[3rem] ${activeTab === tab.id
                                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                }`}
                        >
                            {tab.icon ? tab.icon : "All"}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-2 shadow-sm flex flex-col min-h-[50vh]">

                <div className="flex justify-between items-center px-6 py-3 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Results</span>
                    <span className="text-xs font-bold text-zinc-400">
                        {filteredDocs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredDocs.length)} of {filteredDocs.length} items
                    </span>
                </div>

                {filteredDocs.length === 0 ? (
                    <div className="px-6 py-12 text-center text-zinc-500 font-medium text-sm">
                        No documents found matching your criteria.
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {displayedDocs.map((doc) => (
                            <div key={doc.slug} className="group flex flex-col md:flex-row md:items-center justify-between px-6 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 relative">

                                {/* Link overlays the entire row except the star button */}
                                <Link href={`/vault/docs/${doc.slug}`} className="absolute inset-0 z-0"></Link>

                                <div className="flex items-center gap-4 mb-2 md:mb-0 relative z-10 pointer-events-none">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-sm group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                                        {getIcon(doc.type)}
                                    </div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-1">
                                        {doc.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-6 relative z-10 md:w-1/2 md:justify-end shrink-0 pl-12 md:pl-0">
                                    <div className="flex items-center gap-1.5 w-32 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        <User className="w-3.5 h-3.5" /> <span className="truncate">{doc.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 w-24 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        <Calendar className="w-3.5 h-3.5" /> <span>{doc.date}</span>
                                    </div>
                                    {/* Star Button explicitly has pointer-events-auto so it intercepts clicks */}
                                    <div className="pointer-events-auto">
                                        <StarButton slug={doc.slug} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-auto pt-6 pb-4 flex justify-center items-center gap-2 border-t border-zinc-200 dark:border-zinc-800/80">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                <button key={num} onClick={() => setCurrentPage(num)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === num ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>{num}</button>
                            ))}
                        </div>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                )}
            </div>
        </div>
    );
}