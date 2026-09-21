// src/components/ActiveProjectsClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Network, Eye, Layers, BarChart, ChevronLeft, ChevronRight, Activity } from "lucide-react";

export default function ActiveProjectsClient({ projects }: { projects: any[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6; // Standard 2-row x 3-column layout

    const canvasIcons: Record<string, React.ElementType> = {
        "ML Foundation": Network,
        "Vision-Language Models": Eye,
        "Imbalanced Learning": BarChart,
        "Complementary Label Learning": Layers,
    };

    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
    const displayedProjects = projects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <section>
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    Active Initiatives
                </h2>
                <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">
                    {projects.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, projects.length)} of {projects.length}
                </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedProjects.map((project) => {
                    const rawTags = project.canvas_tags || project.canvas_tag;
                    const tags: string[] = Array.isArray(rawTags) ? rawTags : rawTags ? [rawTags] : [];
                    const CanvasIcons = tags
                        .map(tag => ({ tag, Icon: canvasIcons[tag] }))
                        .filter(({ Icon }) => Boolean(Icon));

                    const sinceFormatted = (() => {
                        if (!project.date) return null;
                        const d = new Date(project.date);
                        if (!isNaN(d.getTime())) return d.toLocaleString("en-US", { month: "short", year: "numeric" });
                        const parts = project.date.split("-");
                        if (parts.length >= 2) {
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            return `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
                        }
                        return null;
                    })();

                    return (
                        <Link href={`/projects/${project.slug}`} key={project.slug} className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 h-full">
                            <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden rounded-t-2xl border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                                {project.image ? (
                                    <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm tracking-widest font-bold uppercase">No Image Data</div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        <span className="text-[10px] font-black tracking-widest uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5 w-max">
                                            <Activity className="w-3 h-3" />
                                            {project.status}
                                        </span>
                                        {sinceFormatted && (
                                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                                                {sinceFormatted}
                                            </span>
                                        )}
                                    </div>
                                    {CanvasIcons.length > 0 && (
                                        <div className="flex -space-x-2">
                                            {CanvasIcons.map(({ tag, Icon }, i) => (
                                                <div key={i} className="group/tag relative z-10 hover:z-50 cursor-help">
                                                    <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border-2 border-white dark:border-zinc-900 transition-transform hover:scale-110">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover/tag:opacity-100 group-hover/tag:scale-100 transition-all flex flex-col items-center">
                                                        <span className="text-xs font-bold">{tag}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 tracking-tight leading-tight">
                                    {project.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed line-clamp-3 mt-auto">
                                    {project.excerpt || "View technical specifications and project details..."}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === num ? "bg-blue-600 text-white shadow-sm border border-blue-600" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                                {num}
                            </button>
                        ))}
                    </div>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </section>
    );
}