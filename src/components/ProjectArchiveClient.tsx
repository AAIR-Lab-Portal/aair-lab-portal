// src/components/ProjectArchiveClient.tsx
"use client";

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Member } from "@/lib/api";
import { Search, ChevronLeft, ChevronRight, CheckCircle2, Archive, PauseCircle, LayoutGrid } from "lucide-react";

export default function ProjectArchiveClient({ projects, members }: { projects: any[]; members: Member[] }) {
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

    // Icons and colors explicitly mirror the ProjectCard setup
    const tabs = [
        { id: "All", label: "All", icon: <LayoutGrid className="w-4 h-4" /> },
        { id: "Published", label: "Published", icon: <CheckCircle2 className="w-4 h-4 text-purple-500" /> },
        { id: "Completed", label: "Completed", icon: <Archive className="w-4 h-4 text-emerald-500" /> },
        { id: "Inactive", label: "Inactive", icon: <PauseCircle className="w-4 h-4 text-zinc-500" /> }
    ];

    const filteredProjects = projects.filter((doc) => {
        const matchesTab = activeTab === "All" || doc.status === activeTab;
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const ITEMS_PER_PAGE = 9;
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const displayedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900/80 rounded-lg w-max border border-zinc-200 dark:border-zinc-800">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                </div>
            </div>

            <div className="min-h-[50vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                        {activeTab} Archive
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                        {filteredProjects.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length} items
                    </span>
                </div>

                {filteredProjects.length === 0 ? (
                    <div className="py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 mt-6">
                        <p className="text-zinc-500 font-medium">No projects found for this criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProjects.map(p => (
                            <ProjectCard key={p.slug} slug={p.slug} title={p.title} lead={p.lead} status={p.status} tech={p.tech} canvas_tags={p.canvas_tags} members={members} />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-auto pt-12 flex justify-center items-center gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === num ? "bg-blue-600 text-white shadow-sm border border-blue-600" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>{num}</button>
                            ))}
                        </div>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                )}
            </div>
        </div>
    );
}