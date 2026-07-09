// src/app/news/page.tsx
import { getAllNews } from "@/lib/api";
import NewsCard from "@/components/NewsCard";
import Image from "next/image";

export default async function NewsIndex() {
    const newsItems = await getAllNews();

    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-slate-300 tracking-tight">
                Lab News & Announcements
            </h1>

            <div className="grid gap-6 md:grid-cols-2">
                {newsItems.map((item) => (
                    <NewsCard
                        key={item.slug}
                        slug={item.slug}
                        title={item.title}
                        date={item.date}
                        author={item.author}
                    />
                ))}
            </div>
        </div>
    );
}