// src/app/publications/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllPublications } from "@/lib/api";

export async function generateStaticParams() {
    const publications = await getAllPublications();

    return publications.map((paper) => ({
        slug: paper.slug,
    }));
}

// 1. We must explicitly type the params as a Promise
export default async function PublicationPost({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    // 2. We MUST await the promise to unwrap the actual URL slug
    const resolvedParams = await params;

    // 3. Now we safely pass the resolved string to the server
    const paper = await getMarkdownData("_publications", resolvedParams.slug);

    return (
        <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">

            <header className="mb-10 border-b pb-8 dark:border-zinc-800">
                <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4 dark:text-zinc-100">
                    {paper.title}
                </h1>
                <div className="flex flex-col text-slate-500 space-y-2 dark:text-zinc-400">
                    <p className="text-lg font-medium text-slate-700 dark:text-zinc-400">Author: {paper.author}</p>
                    <p>Published: {paper.date}</p>
                    {paper.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded w-max mt-2">
                            {paper.category}
                        </span>
                    )}
                </div>
            </header>

            <div
                className="prose prose-zinc dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none"
                dangerouslySetInnerHTML={{ __html: paper.contentHtml }}
            />

        </article>
    );
}