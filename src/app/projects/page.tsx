// src/app/projects/page.tsx
import { getAllProjects } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";

export default async function ProjectsIndex() {
    const projects = await getAllProjects();

    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-white tracking-tight">
                Active Research Projects
            </h1>
            <div className="grid gap-6 md:grid-cols-2">
                {projects.map((project) => (
                    <ProjectCard key={project.slug} {...project} />
                ))}
            </div>
        </div>
    );
}