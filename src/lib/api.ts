// src/lib/api.ts
import { getAllSlugsFromFolder, getMarkdownData } from "./markdown";

export interface Member {
    slug: string;
    name: string;
    id?: number;
    role: string;
    department: string;
    email: string;
    image?: string;
    contentHtml: string;
}

export interface Publication {
    slug: string;
    title: string;
    date: string;
    authors: string;
    type: string;
    tags: string[];
    abstract: string;
    externalLink?: string;
    pdf_url?: string;
    toc?: { level: number; text: string; id: string }[];
    contentHtml: string;
}

export interface Project {
    slug: string;
    title: string;
    date: string;
    lead: string;
    status: string;
    tech: string;
    canvas_tags?: string[];
    image?: string;
    excerpt?: string;
    contentHtml: string;
}

export interface NewsItem {
    slug: string;
    title: string;
    date: string;
    author: string;
    image: string;
    excerpt?: string;
    contentHtml: string;
}

export async function getAllMembers(): Promise<Member[]> {
    const slugs = getAllSlugsFromFolder("_members");
    const promises = slugs.map((slug) => getMarkdownData("_members", slug));
    const rawMembers = await Promise.all(promises);

    const members: Member[] = rawMembers.map((raw: any) => ({
        slug: raw.slug,
        name: raw.name || "Unknown",
        id: raw.id,
        role: raw.role || "",
        department: raw.department || "",
        email: raw.email || "",
        image: raw.image,
        contentHtml: raw.contentHtml || "",
    }));

    return members.sort((a, b) => (a.name > b.name ? 1 : -1));
}

export async function getAllPublications(): Promise<Publication[]> {
    const slugs = getAllSlugsFromFolder("_publications");
    const promises = slugs.map((slug) => getMarkdownData("_publications", slug));
    const rawPublications = await Promise.all(promises);

    const publications: Publication[] = rawPublications.map((raw: any) => ({
        slug: raw.slug,
        title: raw.title || "Untitled",
        date: raw.date || "2026-01-01",
        authors: raw.authors || "AAIR Lab",
        type: raw.type || "Journal",
        tags: raw.tags || [],
        abstract: raw.abstract || "",
        externalLink: raw.externalLink,
        pdf_url: raw.pdf_url,
        toc: raw.toc || [],
        contentHtml: raw.contentHtml || "",
    }));

    return publications.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAllProjects(): Promise<Project[]> {
    const slugs = getAllSlugsFromFolder("_projects");
    const promises = slugs.map((slug) => getMarkdownData("_projects", slug));
    const rawProjects = await Promise.all(promises);

    const projects: Project[] = rawProjects.map((raw: any) => ({
        slug: raw.slug,
        title: raw.title || "Untitled",
        date: raw.date || "",
        lead: raw.lead || "AAIR Lab",
        status: raw.status || "Inactive",
        tech: raw.tech || "",
        canvas_tags: raw.canvas_tags || [],
        image: raw.image,
        excerpt: raw.excerpt,
        contentHtml: raw.contentHtml || "",
    }));

    return projects.sort((a, b) => (a.title > b.title ? 1 : -1));
}

export async function getAllNews(): Promise<NewsItem[]> {
    const slugs = getAllSlugsFromFolder("_news");
    const promises = slugs.map((slug) => getMarkdownData("_news", slug));
    const rawNews = await Promise.all(promises);

    const news: NewsItem[] = rawNews.map((raw: any) => ({
        slug: raw.slug,
        title: raw.title || "Untitled",
        date: raw.date || "",
        author: raw.author || "AAIR Lab",
        image: raw.image || "",
        excerpt: raw.excerpt,
        contentHtml: raw.contentHtml || "",
    }));

    return news.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export interface InternalDoc {
    slug: string;
    title: string;
    date: string;
    author: string;
    type: string; // "Tutorial", "Announcement", "Resource"
    excerpt?: string;
    contentHtml: string;
}

export async function getAllInternalDocs(): Promise<InternalDoc[]> {
    try {
        const slugs = getAllSlugsFromFolder("_internal");
        const promises = slugs.map((slug) => getMarkdownData("_internal", slug));
        const rawDocs = await Promise.all(promises);

        const docs: InternalDoc[] = rawDocs.map((raw: any) => ({
            slug: raw.slug,
            title: raw.title || "Untitled Document",
            date: raw.date || "",
            author: raw.author || "AAIR Lab",
            type: raw.type || "Resource",
            excerpt: raw.excerpt || "",
            contentHtml: raw.contentHtml || "",
        }));

        return docs.sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (error) {
        // Fallback if the _internal folder doesn't exist yet
        return [];
    }
}