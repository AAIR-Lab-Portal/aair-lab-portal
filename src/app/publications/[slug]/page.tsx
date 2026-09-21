// src/app/publications/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllPublications, Publication, getAllMembers } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import PublicationContent from "@/components/PublicationContent";
import AuthorPill from "@/components/AuthorPill";

export async function generateStaticParams() {
    const pubs = await getAllPublications();
    return pubs.map((p) => ({ slug: p.slug }));
}

export default async function PublicationPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    const pub = (await getMarkdownData("_publications", resolvedParams.slug)) as Publication;
    const allMembers = await getAllMembers();
    const authorArray = (pub.authors || "").split(",").map(a => a.trim()).filter(Boolean);

    // 1. INJECT ABSTRACT INTO HTML
    const finalHtml = pub.abstract
        ? `<h2 id="abstract">0. Abstract</h2>\n<p class="text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-8 border-l-4 border-blue-500 pl-6">${pub.abstract}</p>\n${pub.contentHtml}`
        : pub.contentHtml;

    // 2. INJECT ABSTRACT INTO TOC
    // Because TableOfContents.tsx now handles smart numbering autonomously, 
    // we completely remove the old manual map loop!
    const finalToc = pub.abstract
        ? [{ level: 2, text: "0. Abstract", id: "abstract" }, ...(pub.toc || [])]
        : (pub.toc || []);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-0 flex flex-col lg:flex-row relative items-start gap-12">

            {finalToc.length > 0 && (
                <div className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
                    <TableOfContents toc={finalToc} />
                </div>
            )}

            <article className="flex-grow min-w-0 max-w-4xl lg:border-l border-zinc-200 dark:border-zinc-800 lg:pl-12">

                <Link href="/publications" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Archive
                </Link>

                <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-bold uppercase tracking-widest">
                            {pub.type}
                        </span>
                        {pub.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md text-xs font-bold uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter leading-tight mb-6">
                        {pub.title}
                    </h1>

                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="mr-1 text-xs font-bold tracking-widest uppercase text-zinc-400">Authors:</span>

                            {authorArray.map((authorName, index) => (
                                <AuthorPill key={`${authorName}-${index}`} nameOrId={authorName} members={allMembers} compact={true} />
                            ))}
                        </div>

                        <p className="flex items-center">
                            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400 mr-3">Published:</span>
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{pub.date}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-10">
                        {pub.pdf_url && (
                            <a
                                href={pub.pdf_url}
                                download
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                            >
                                <Download className="w-4 h-4" /> Download PDF
                            </a>
                        )}
                        {pub.externalLink && (
                            <a
                                href={pub.externalLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                            >
                                <ExternalLink className="w-4 h-4" /> View External Source
                            </a>
                        )}
                    </div>
                </header>

                <PublicationContent html={finalHtml} />

            </article>
        </div>
    );
}