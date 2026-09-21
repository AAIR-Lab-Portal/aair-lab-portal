// src/app/news/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllNews, NewsItem, getAllMembers } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Newspaper } from "lucide-react";
import AuthorPill from "@/components/AuthorPill";
import TableOfContents from "@/components/TableOfContents";
import TextToSpeech from "@/components/TextToSpeech";
import HeroImage from "@/components/HeroImage";

export async function generateStaticParams() {
    const newsItems = await getAllNews();
    return newsItems.map((item) => ({ slug: item.slug }));
}

export default async function NewsPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = (await getMarkdownData("_news", resolvedParams.slug)) as any;

    const allMembers = await getAllMembers();
    const allNews = await getAllNews();
    const recentNews = allNews.filter(n => n.slug !== article.slug).slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col lg:flex-row gap-16 items-start">

            <article className="flex-grow min-w-0 max-w-4xl">
                <Link href="/news" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" /> Back to News
                </Link>

                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 leading-tight mb-6 tracking-tight">
                        {article.title}
                    </h1>

                    {article.excerpt && (
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-8 border-l-4 border-blue-500 pl-6">
                            {article.excerpt}
                        </p>
                    )}

                    <TextToSpeech title={article.title} htmlContent={article.contentHtml} />

                    <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Written by:</span>
                            <AuthorPill nameOrId={article.author} members={allMembers} />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                            <Clock className="w-4 h-4" /> {article.date}
                        </div>
                    </div>
                </header>

                {article.image && (
                    <div className="mb-12">
                        <HeroImage
                            src={article.image}
                            alt={article.title}
                            caption={article.image_caption}
                            className="w-full aspect-video md:aspect-[21/9]"
                        />
                    </div>
                )}

                <div
                    className="prose prose-zinc dark:prose-invert prose-lg prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
            </article>

            <aside className="w-full lg:w-80 shrink-0 space-y-8 sticky top-24">

                {/* FIXED: Replaced muddy bg-zinc-50 with crisp, unified Card styling */}
                {article.toc && article.toc.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                        <TableOfContents toc={article.toc} />
                    </div>
                )}

                {recentNews.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Recent Articles</h3>
                        </div>
                        <div className="space-y-6">
                            {recentNews.map(news => (
                                <Link href={`/news/${news.slug}`} key={news.slug} className="group block">
                                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
                                        {news.title}
                                    </h4>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                        {news.date}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}