// src/app/news/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllNews, NewsItem } from "@/lib/api";
import Image from "next/image"; // <-- Import Image

export async function generateStaticParams() {
    const newsItems = await getAllNews();
    return newsItems.map((item) => ({ slug: item.slug }));
}

export default async function NewsPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = (await getMarkdownData("_news", resolvedParams.slug)) as NewsItem;

    return (
        <article className="bg-white dark:bg-zinc-900 p-6 md:p-10 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 max-w-4xl mx-auto">

            {/* --- THE NEW HERO IMAGE INJECTOR --- */}
            {article.image && (
                <div className="relative w-full h-[300px] md:h-[450px] mb-10 rounded-xl overflow-hidden shadow-inner">
                    <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* --- The Metadata Header --- */}
            <header className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-4">
                    {article.title}
                </h1>
                <div className="text-zinc-500 dark:text-zinc-400 font-medium">
                    <p>Published: {article.date} • By {article.author}</p>
                </div>
            </header>

            {/* --- The Markdown Content Body --- */}
            <div
                className="prose prose-zinc dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
        </article>
    );
}