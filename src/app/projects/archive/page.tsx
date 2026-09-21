// src/app/projects/archive/page.tsx
import { getAllMembers, getAllProjects } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ArchiveX } from "lucide-react";
import ProjectArchiveClient from "@/components/ProjectArchiveClient";

export default async function ProjectArchivePage() {
  const allProjects = await getAllProjects();
  const allMembers = await getAllMembers();

  // Pass everything except active initiatives into the archive client
  const archivedProjects = allProjects.filter(p => p.status !== "Active");

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-16">

      <header className="pb-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Active Projects
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter mb-4">
          Project Archive
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
          A historical ledger of completed research initiatives, deprecated systems, and inactive repositories.
        </p>
      </header>

      {archivedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <ArchiveX className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">No Archived Projects</h3>
        </div>
      ) : (
        <ProjectArchiveClient projects={archivedProjects} members={allMembers} />
      )}

    </div>
  );
}