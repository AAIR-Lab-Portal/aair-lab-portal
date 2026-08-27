// src/app/news/page.tsx
import { getAllNews } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function NewsIndex() {
    const news = await getAllNews();

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Page Header */}
            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    Lab News
                </h1>
            </header>

            {/* The Single-Column List */}
            <div className="flex flex-col space-y-8">
                {news.map((item) => (
                    <Link href={`/news/${item.slug}`} key={item.slug} className="group block">
                        <article className="flex flex-col md:flex-row gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200">

                            {/* Left Side: Thumbnail Image */}
                            <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                {item.image && (
                                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                )}
                            </div>

                            {/* Right Side: Text Content */}
                            <div className="flex flex-col justify-center py-2 pr-4">
                                <div className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-2">
                                    {item.date} • {item.author}
                                </div>
                                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed line-clamp-3">
                                    {item.excerpt || "Read the full announcement..."}
                                </p>
                            </div>

                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}