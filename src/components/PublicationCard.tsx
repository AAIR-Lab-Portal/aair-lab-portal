// src/components/PublicationCard.tsx
import Link from "next/link";
import { FileText } from "lucide-react";
import { Publication, Member } from "@/lib/api";

interface Props {
    pub: Publication;
    members: Member[]; // Added members array for parsing
}

export default function PublicationCard({ pub, members }: Props) {
    const year = (pub.date || "").split("-")[0];

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
        <Link href={`/publications/${pub.slug}`} className="block group h-full">
            <article className="h-full p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm flex flex-col">

                <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                        <FileText className="w-3.5 h-3.5" /> Publication
                    </span>
                    {year && <span className="text-xs font-bold text-zinc-400 tracking-wider">{year}</span>}
                </div>

                <h3 className="text-lg font-extrabold text-blue-600 dark:text-blue-400 group-hover:underline tracking-tight mb-2">
                    {pub.title}
                </h3>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed line-clamp-2 mb-4 flex-grow">
                    {pub.abstract || "No abstract available."}
                </p>

                <div className="text-xs font-bold text-zinc-500 mt-auto flex items-center gap-2">
                    {/* Fixed truncation for structural alignment */}
                    <span className="line-clamp-1">{parseAuthors(pub.authors)}</span>
                    
                    {pub.tags && pub.tags.length > 0 && (
                        <>
                            <span className="text-zinc-300 dark:text-zinc-700 shrink-0">•</span>
                            <span className="uppercase tracking-widest text-zinc-600 dark:text-zinc-400 shrink-0">
                                {pub.tags[0]}
                            </span>
                        </>
                    )}
                </div>
            </article>
        </Link>
    );
}