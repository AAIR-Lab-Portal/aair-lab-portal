// src/components/TableOfContents.tsx
"use client";

import { useState } from "react";
import { FileText, ChevronRight } from "lucide-react";

type TOCItem = { level: number; text: string; id: string };
type ParentItem = TOCItem & { num: string; children: (TOCItem & { num: string })[] };

export default function TableOfContents({ toc }: { toc: TOCItem[] }) {
    const groupedTOC: ParentItem[] = [];
    const initialState: Record<string, boolean> = {};
    let currentParent: ParentItem | null = null;
    let h2Counter = 0;
    let h3Counter = 0;

    for (const item of toc) {
        const match = item.text.match(/^([\d.]+)\s+(.*)/);
        let numStr = "";
        let cleanText = item.text;

        if (match) {
            numStr = match[1]; 
            cleanText = match[2];
        } else {
            if (item.level === 2) {
                h2Counter++;
                h3Counter = 0;
                numStr = `${h2Counter}.`;
            } else if (item.level === 3) {
                h3Counter++;
                numStr = `${h2Counter}.${h3Counter}.`;
            }
        }

        if (item.level === 2) {
            initialState[numStr] = true;
            currentParent = { ...item, text: cleanText, num: numStr, children: [] };
            groupedTOC.push(currentParent);
        } else if (item.level === 3 && currentParent) {
            currentParent.children.push({ ...item, text: cleanText, num: numStr });
        }
    }

    const [expanded, setExpanded] = useState<Record<string, boolean>>(initialState);
    const toggleSection = (num: string) => setExpanded(prev => ({ ...prev, [num]: !prev[num] }));

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: "smooth" });
            window.history.pushState(null, "", `#${id}`);
        }
    };

    return (
        // The container is locked to h-full. The header stays still. The inner div scrolls.
        <nav className="w-full flex flex-col h-full min-h-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2 shrink-0">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Contents
            </h3>
            
            <div className="overflow-y-auto flex-grow pr-4 -mr-2 overscroll-contain">
                <ul className="space-y-5 pb-4">
                    {groupedTOC.map((parent, i) => {
                        const hasChildren = parent.children.length > 0;
                        const isExpanded = expanded[parent.num];

                        return (
                            <li key={i} className="flex flex-col">
                                <div className="flex items-start gap-2 group">
                                    <div className="w-4 h-4 shrink-0 flex items-center justify-center mt-0.5">
                                        {hasChildren && (
                                            <button onClick={() => toggleSection(parent.num)} className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                                                <ChevronRight className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                                            </button>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 shrink-0 min-w-[1.25rem]">{parent.num}</span>
                                    <a 
                                        href={`#${parent.id}`} 
                                        onClick={(e) => handleScroll(e, parent.id)}
                                        className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                                    >
                                        {parent.text}
                                    </a>
                                </div>

                                {hasChildren && (
                                    <ul className={`overflow-hidden transition-all duration-300 flex flex-col gap-1.5 ml-10 ${isExpanded ? "mt-3 max-h-96 opacity-100" : "mt-0 max-h-0 opacity-0 pointer-events-none"}`}>
                                        {parent.children.map((child, j) => (
                                            <li key={j} className="flex gap-2">
                                                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0 min-w-[1.25rem]">{child.num}</span>
                                                <a 
                                                    href={`#${child.id}`} 
                                                    onClick={(e) => handleScroll(e, child.id)}
                                                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                                                >
                                                    {child.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}