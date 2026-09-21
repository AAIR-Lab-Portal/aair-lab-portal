// src/components/ProjectCard.tsx
import Link from "next/link";
import { Network, Eye, Layers, BarChart, Settings, ExternalLink, CheckCircle2, Archive, PauseCircle, Activity } from "lucide-react";
import { Member } from "@/lib/api";

interface Props {
    slug: string;
    title: string;
    lead: string;
    status: string;
    tech: string;
    canvas_tags?: string[];
    members: Member[];
}

export default function ProjectCard({ slug, title, lead, status, tech, canvas_tags = [], members }: Props) {
    const canvasIcons: Record<string, React.ElementType> = {
        "ML Foundation": Network,
        "Vision-Language Models": Eye,
        "Imbalanced Learning": BarChart,
        "Complementary Label Learning": Layers,
    };

    const tags = Array.isArray(canvas_tags) ? canvas_tags : canvas_tags ? [canvas_tags] : [];

    const getStatusStyle = (s: string) => {
        switch (s) {
            case "Published": return { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", Icon: CheckCircle2 };
            case "Completed": return { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", Icon: Archive };
            case "Inactive": return { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-400", Icon: PauseCircle };
            case "Active": return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", Icon: Activity };
            default: return { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500", Icon: Activity };
        }
    };

    const style = getStatusStyle(status);
    const StatusIcon = style.Icon;

    // THE SMART PARSER: Converts links and IDs into clean, plain-text names
    const parseAuthors = (rawAuthors: string) => {
        if (!rawAuthors) return "Unassigned";
        return rawAuthors.split(",").map(a => {
            const clean = a.trim();
            const match = clean.match(/^\[(.*?)\]\((.*?)\)$/); // Detects [Name](Link)
            const name = match ? match[1].trim() : clean;
            
            const memberMatch = members.find(m => String(m.id) === name || m.name.toLowerCase() === name.toLowerCase());
            return memberMatch ? memberMatch.name : name;
        }).join(", ");
    };

    const cleanLeadString = parseAuthors(lead);

    return (
        <article className="p-6 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 h-full flex flex-col group">
            <Link href={`/projects/${slug}`} className="flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex -space-x-2">
                        {tags.length > 0 ? tags.map((tag, i) => {
                            const Icon = canvasIcons[tag] || Settings;
                            return (
                                <div key={i} className="group/tag relative z-10 hover:z-50 cursor-help">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-white dark:border-zinc-900 transition-transform hover:scale-110">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover/tag:opacity-100 group-hover/tag:scale-100 transition-all flex flex-col items-center">
                                        <span className="text-xs font-bold">{tag}</span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-2 border-white dark:border-zinc-900">
                                <Settings className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1.5 ${style.bg} ${style.text}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status}
                    </span>
                </div>

                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight leading-tight mb-2">
                    {title}
                </h3>

                {/* REVERTED TO PLAIN TEXT: Fixed Grid Alignment with line-clamp-1 */}
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-1" title={cleanLeadString}>
                    Lead: <span className="text-zinc-700 dark:text-zinc-300">{cleanLeadString}</span>
                </p>
            </Link>

            <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-between items-end">
                <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Architecture</span>
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 line-clamp-1">{tech}</span>
                </div>
                <Link href={`/projects/${slug}`}>
                    <ExternalLink className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors shrink-0" />
                </Link>
            </div>
        </article>
    );
}