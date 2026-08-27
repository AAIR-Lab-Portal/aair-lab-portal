// src/app/projects/archive/page.tsx
import { getAllProjects } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ArchiveX } from "lucide-react";

export default async function ProjectArchivePage() {
  const allProjects = await getAllProjects();
  
  // Isolate only the historical/inactive projects
  const archivedProjects = allProjects.filter(
    (p) => p.status === "Completed" || p.status === "Inactive"
  );

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      
      {/* Navigation & Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
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

      {/* The Unadorned Ledger List */}
      {archivedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <ArchiveX className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">No Archived Projects</h3>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">There are currently no completed or inactive projects in the database.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {archivedProjects.map((project) => (
            <article key={project.slug} className="group border-b border-zinc-200 dark:border-zinc-800 py-8 last:border-0 flex flex-col md:flex-row md:items-start gap-4 md:gap-8 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors -mx-6 px-6 rounded-xl">
              
              {/* Left side: Status & Date Metadata */}
              <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-4 md:gap-2">
                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-md w-fit ${
                  project.status === "Completed" 
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}>
                  {project.status}
                </span>
                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1 md:mt-0">
                  {project.date}
                </span>
              </div>

              {/* Right side: Title & Excerpt */}
              <div className="flex-grow">
                <Link 
                  href={`/projects/${project.slug}`} 
                  className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight block mb-3"
                >
                  {project.title}
                </Link>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  {project.excerpt || "No description provided in the historical archive."}
                </p>
              </div>
              
            </article>
          ))}
        </div>
      )}

    </div>
  );
}