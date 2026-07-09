// src/app/publications/page.tsx
import { getAllPublications } from "@/lib/api";
// Import your new component
import PublicationCard from "@/components/PublicationCard";

export default async function PublicationsIndex() {
    const publications = await getAllPublications();

    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-slate-300 tracking-tight">
                Lab Publications
            </h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* The code is now incredibly clean and easy to read */}
                {publications.map((paper) => (
                    <PublicationCard
                        key={paper.slug}
                        slug={paper.slug}
                        title={paper.title}
                        author={paper.author}
                        date={paper.date}
                    />
                ))}
            </div>
        </div>
    );
}