// src/components/NewsCard.tsx
import Link from "next/link";

interface Props {
    slug: string;
    title: string;
    date: string;
    author: string;
}

export default function NewsCard({ slug, title, date, author }: Props) {
    return (
        <Link href={`/news/${slug}`} className="group block">
            {/* Notice the dark mode styling here: dark:bg-zinc-900 */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
                <div className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{date}</span> • <span>{author}</span>
                </div>
            </div>
        </Link>
    );
}