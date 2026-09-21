// src/app/publications/page.tsx
import { getAllMembers, getAllPublications } from "@/lib/api";
import PublicationArchive from "@/components/PublicationArchive";

export default async function PublicationsIndex() {
    const publications = await getAllPublications();
    const allMembers = await getAllMembers();

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    Publications Archive
                </h1>
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
                    Explore our archive of peer-reviewed journal articles, conference proceedings, pre-prints, and student thesis work.
                </p>
            </header>

            <PublicationArchive allPublications={publications} allMembers={allMembers} />

        </div>
    );
}