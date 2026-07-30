// src/app/projects/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllProjects, Project } from "@/lib/api";

export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const project = (await getMarkdownData("_projects", resolvedParams.slug)) as Project;

    return (
        <article className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <header className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-4">
                    {project.title}
                </h1>
                <div className="text-zinc-500 dark:text-zinc-400 space-y-2">
                    <p>Project Lead: <span className="font-medium text-zinc-700 dark:text-zinc-300">{project.lead}</span></p>
                    <p>Status: {project.status}</p>
                    <p>Tech Stack: {project.tech}</p>
                </div>
            </header>
            <div
                className="prose prose-zinc dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none"
                dangerouslySetInnerHTML={{ __html: project.contentHtml }}
            />
        </article>
    );
}