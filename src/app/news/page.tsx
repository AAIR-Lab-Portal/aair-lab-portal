// src/app/news/page.tsx
import { getAllNews } from "@/lib/api";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default async function NewsIndex({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const allNews = await getAllNews();

    // --- Pagination Engine ---
    const ITEMS_PER_PAGE = 12;
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedNews = allNews.slice(startIndex, endIndex);

    // Generate an array of page numbers [1, 2, 3] for the UI
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-4">
            {/* Page Header */}
            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h1 className="text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    Lab News
                </h1>
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                    The latest stories, project updates, and achievements from our research community.
                </p>
            </header>

            {/* Strict Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedNews.map((item) => (
                    <NewsCard
                        key={item.slug}
                        slug={item.slug}
                        title={item.title}
                        date={item.date}
                        author={item.author}
                        image={item.image}
                        excerpt={item.excerpt}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-zinc-200 dark:border-zinc-800 mt-12">

                    {/* Previous Button */}
                    {currentPage > 1 ? (
                        <Link
                            href={`/news?page=${currentPage - 1}`}
                            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                    ) : (
                        <span className="p-2 rounded-lg text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                            <ChevronLeft className="w-5 h-5" />
                        </span>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {pageNumbers.map((num) => (
                            <Link
                                key={num}
                                href={`/news?page=${num}`}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === num
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                {num}
                            </Link>
                        ))}
                    </div>

                    {/* Next Button */}
                    {currentPage < totalPages ? (
                        <Link
                            href={`/news?page=${currentPage + 1}`}
                            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    ) : (
                        <span className="p-2 rounded-lg text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                            <ChevronRight className="w-5 h-5" />
                        </span>
                    )}

                </div>
            )}
        </div>
    );
}