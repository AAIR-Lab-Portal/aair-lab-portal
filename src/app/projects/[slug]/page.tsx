// src/app/projects/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllProjects, getAllMembers } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Activity, Code2, Network, BookOpen, ArrowRight, CheckCircle2, Archive, PauseCircle } from "lucide-react";
import PublicationContent from "@/components/PublicationContent";
import TableOfContents from "@/components/TableOfContents";
import AuthorPill from "@/components/AuthorPill";
import HeroImage from "@/components/HeroImage";

export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectReader({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const project = await getMarkdownData("_projects", resolvedParams.slug) as any;
    const allMembers = await getAllMembers();

    const tags = Array.isArray(project.canvas_tags) ? project.canvas_tags : project.canvas_tags ? [project.canvas_tags] : [];
    const techStack = Array.isArray(project.tech) ? project.tech : project.tech ? project.tech.split(",").map((t: string) => t.trim()) : [];
    const leads = project.lead ? project.lead.split(",").map((l: string) => l.trim()) : [];

    const isActive = project.status === "Active";
    const backLink = isActive ? "/projects" : "/projects/archive";
    const backText = isActive ? "Back to Initiatives" : "Back to Project Archive";

    // Reusable logic to match Archive colors and icons
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Published": return { bg: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", Icon: CheckCircle2 };
            case "Completed": return { bg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400", Icon: Archive };
            case "Inactive": return { bg: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400", Icon: PauseCircle };
            case "Active": return { bg: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", Icon: Activity };
            default: return { bg: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500", Icon: Activity };
        }
    };
    const statusStyle = getStatusBadge(project.status || "Unknown");
    const StatusIcon = statusStyle.Icon;

    return (
        <article className="min-h-screen pb-20">

            <header className="pt-12 pb-12 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                <div className="max-w-7xl mx-auto flex flex-col items-start">
                    <Link href={backLink} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-10">
                        <ArrowLeft className="w-4 h-4" /> {backText}
                    </Link>

                    <div className="max-w-4xl mb-12">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tags.map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <Network className="w-3.5 h-3.5" /> {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-6 text-zinc-900 dark:text-zinc-100">
                            {project.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                            {project.excerpt || "Technical documentation and system architecture."}
                        </p>
                    </div>

                    {project.image && (
                        <HeroImage
                            src={project.image}
                            alt={project.title}
                            caption={project.image_caption}
                            className="w-full aspect-video md:aspect-[21/9]"
                        />
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 items-start">

                <main className="flex-grow min-w-0">
                    <PublicationContent html={project.contentHtml} />
                </main>

                <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 sticky top-24 self-start max-h-[calc(100vh-8rem)]">
                    
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shrink-0">
                        
                        {/* THE CLEANED HEADER WITH TUCKED BADGE */}
                        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">System Information</h3>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1 ${statusStyle.bg}`}>
                                <StatusIcon className="w-3 h-3" /> {project.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">Project Lead</span>
                                <div className="flex flex-wrap gap-2">
                                    {leads.map((lead: string, i: number) => (
                                        <AuthorPill key={i} nameOrId={lead} members={allMembers} compact={true} />
                                    ))}
                                </div>
                            </div>

                            {techStack.length > 0 && (
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">Core Technologies</span>
                                    <div className="flex flex-wrap gap-2">
                                        {techStack.map((tech: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded text-xs font-bold flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                <Code2 className="w-3 h-3" /> {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.publication_slug && (
                                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                    <Link href={`/publications/${project.publication_slug}`} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">Read Paper</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {project.toc && project.toc.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col flex-grow min-h-0">
                            <TableOfContents toc={project.toc} />
                        </div>
                    )}
                </aside>
            </div>
        </article>
    );
}