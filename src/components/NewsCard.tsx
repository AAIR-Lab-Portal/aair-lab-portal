// src/components/NewsCard.tsx
import Link from "next/link";
import Image from "next/image";

interface Props {
    slug: string;
    title: string;
    date: string;
    author: string;
    image?: string;
    excerpt?: string;
}

export default function NewsCard({ slug, title, date, author, image, excerpt }: Props) {
    return (
        <Link href={`/news/${slug}`} className="group block h-full">
            <article className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200">
                
                {/* Top: Thumbnail Image */}
                <div className="relative w-full h-48 shrink-0 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                    {image ? (
                        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold uppercase tracking-widest">
                            No Image
                        </div>
                    )}
                </div>

                {/* Bottom: Text Content */}
                <div className="flex flex-col flex-grow p-6">
                    <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {title}
                    </h2>
                    
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium text-sm leading-relaxed line-clamp-3 mb-6">
                        {excerpt || "Read the full announcement..."}
                    </p>
                    
                    {/* Footer pushed to absolute bottom */}
                    <div className="mt-auto text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500">
                        {date} • {author}
                    </div>
                </div>
            </article>
        </Link>
    );
}