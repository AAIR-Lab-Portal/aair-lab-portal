// src/lib/api.ts
import { getAllSlugsFromFolder, getMarkdownData } from "./markdown";

// 1. The Blueprint (TypeScript Interface)
// This tells our app exactly what a "Publication" is supposed to look like.
export interface Publication {
    slug: string;
    title: string;
    author: string;
    date: string;
    category?: string; // The question mark means this field is optional
    contentHtml: string;
}

// 2. The Librarian Function
export async function getAllPublications(): Promise<Publication[]> {
    // Grab all the file names from our database folder
    const slugs = getAllSlugsFromFolder("_publications");

    // Loop through every slug and tell the worker (markdown.ts) to read it.
    // Because reading files takes time, we create an array of "Promises".
    const promises = slugs.map((slug) => getMarkdownData("_publications", slug));

    // Promise.all tells the server: "Read all 50 files AT THE SAME TIME, 
    // and don't move to the next line of code until every single one is finished."
    const rawPublications = await Promise.all(promises);

    // Tell TypeScript to trust us that the data matches our Publication interface
    const publications = rawPublications as Publication[];

    // Sort them by date (Newest first)
    const sortedPublications = publications.sort((paperA, paperB) => {
        if (paperA.date < paperB.date) {
            return 1;
        } else {
            return -1;
        }
    });

    return sortedPublications;
}

// 1. Define the specific shape of a Member
export interface Member {
    slug: string;
    name: string;
    role: string;
    department: string;
    email: string;
    image?: string;
    contentHtml: string;
}

// 2. The Member Librarian
export async function getAllMembers(): Promise<Member[]> {
    const slugs = getAllSlugsFromFolder("_members");

    const promises = slugs.map((slug) => getMarkdownData("_members", slug));
    const rawMembers = await Promise.all(promises);

    const members = rawMembers as Member[];

    // Note: We sort members alphabetically by name, instead of by date
    const sortedMembers = members.sort((a, b) => {
        if (a.name > b.name) return 1;
        return -1;
    });

    return sortedMembers;
}

// 1. Define the specific shape of a Project
export interface Project {
    slug: string;
    title: string;
    lead: string;
    status: string;
    tech: string;
    contentHtml: string;
}

// 2. The Project Librarian
export async function getAllProjects(): Promise<Project[]> {
    // Grab all the file names from the _projects folder
    const slugs = getAllSlugsFromFolder("_projects");

    // Read all the files concurrently
    const promises = slugs.map((slug) => getMarkdownData("_projects", slug));
    const rawProjects = await Promise.all(promises);

    const projects = rawProjects as Project[];

    // Sort Logic: 
    // 1st Priority: "Active" projects always go to the top.
    // 2nd Priority: If both have the same status, sort them alphabetically by title.
    const sortedProjects = projects.sort((projectA, projectB) => {
        // If A is Active and B is not, A goes first (-1)
        if (projectA.status === "Active" && projectB.status !== "Active") return -1;
        // If B is Active and A is not, B goes first (1)
        if (projectA.status !== "Active" && projectB.status === "Active") return 1;

        // If they have the exact same status, sort alphabetically
        if (projectA.title > projectB.title) return 1;
        return -1;
    });

    return sortedProjects;
}

// 1. Define the News Interface
export interface NewsItem {
    slug: string;
    title: string;
    date: string;
    author: string;
    image: string;
    contentHtml: string;
}

// 2. The News Fetcher
export async function getAllNews(): Promise<NewsItem[]> {
    const slugs = getAllSlugsFromFolder("_news");

    const promises = slugs.map((slug) => getMarkdownData("_news", slug));
    const rawNews = await Promise.all(promises);

    const news = rawNews as NewsItem[];

    // Sort by date, newest first
    return news.sort((a, b) => (a.date < b.date ? 1 : -1));
}