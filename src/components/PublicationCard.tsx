// src/components/PublicationCard.tsx
import Link from "next/link";

// 1. Define what data this component needs to render
interface Props {
    slug: string;
    title: string;
    author: string;
    date: string;
}

export default function PublicationCard({ slug, title, author, date }: Props) {
    return (
        <Link href={`/publications/${slug}`} className="group block">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
                <div className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="font-medium text-slate-700 dark:text-zinc-400">{author}</span>
                    <span> • </span>
                    <span>{date}</span>
                </div>
            </div>
        </Link>
    );
}