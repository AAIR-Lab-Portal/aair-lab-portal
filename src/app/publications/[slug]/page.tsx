// src/app/publications/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllPublications, Publication, getAllMembers } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export async function generateStaticParams() {
    const pubs = await getAllPublications();
    return pubs.map((p) => ({ slug: p.slug }));
}

export default async function PublicationPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    // Fetch both the specific publication and the entire member database
    const pub = (await getMarkdownData("_publications", resolvedParams.slug)) as Publication;
    const allMembers = await getAllMembers();

    // Parse the authors string into an array (e.g., "Le Lam Son, Ngo Minh Chau" -> ["Le Lam Son", "Ngo Minh Chau"])
    const authorArray = (pub.authors || "").split(",").map(a => a.trim());

    return (
        <article className="max-w-4xl mx-auto py-12">

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

                <div className="space-y-3 text-lg">

                    {/* Smart Author Routing Engine */}
                    <div className="text-zinc-800 dark:text-zinc-200 font-bold flex flex-wrap items-center">
                        <span className="mr-2">Authors:</span>
                        {authorArray.map((authorName, index) => {
                            // Cross-reference the author's name against our member database (case-insensitive)
                            const memberMatch = allMembers.find(m => m.name.toLowerCase() === authorName.toLowerCase());

                            return (
                                <span key={index} className="font-medium text-zinc-600 dark:text-zinc-400 flex items-center">
                                    {memberMatch ? (
                                        <Link
                                            href={`/members/${memberMatch.slug}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 transition-colors font-bold"
                                        >
                                            {authorName}
                                        </Link>
                                    ) : (
                                        <span>{authorName}</span>
                                    )}
                                    {/* Add comma if it is not the last author in the array */}
                                    {index < authorArray.length - 1 && <span className="mr-1">,</span>}
                                </span>
                            );
                        })}
                    </div>

                    <p className="text-zinc-800 dark:text-zinc-200 font-bold">
                        Published: <span className="font-medium text-zinc-600 dark:text-zinc-400 ml-2">{pub.date}</span>
                    </p>
                </div>

                {pub.externalLink && (
                    <a
                        href={pub.externalLink}
                        target="_blank"
                        className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                    >
                        View External Source <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </header>

            <div
                className="prose prose-zinc dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none leading-relaxed prose-headings:tracking-tight prose-headings:font-black"
                dangerouslySetInnerHTML={{ __html: pub.contentHtml }}
            />
        </article>
    );
}