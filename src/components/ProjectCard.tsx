// src/components/ProjectCard.tsx
import Link from "next/link";

interface Props {
    slug: string;
    title: string;
    lead: string;
    status: string;
    tech: string;
}

export default function ProjectCard({ slug, title, lead, status, tech }: Props) {
    return (
        <Link href={`/projects/${slug}`} className="group block">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-3 ${status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                            {status}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Led by: {lead}</p>
                </div>
                <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    Tech: {tech}
                </div>
            </div>
        </Link>
    );
}