// src/lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// process.cwd() gets the absolute path of your Next.js project folder 
// (e.g., D:\CHAU\...\aair-lab-portal)
const rootDirectory = process.cwd();

/**
 * UTILITY 1: Get all the file names (slugs) from a specific folder.
 * We need this so Next.js knows exactly how many web pages it needs to generate.
 */
export function getAllSlugsFromFolder(folderName: string) {
    // Point the engine to the target folder (e.g., "_publications")
    const folderPath = path.join(rootDirectory, folderName);

    // Read all the files inside that folder
    const fileNames = fs.readdirSync(folderPath);

    // Loop through the file names and chop off the ".md" extension
    // "edge-cnn-optimization.md" becomes "edge-cnn-optimization"
    return fileNames.map((fileName) => {
        return fileName.replace(/\.md$/, "");
    });
}

/**
 * UTILITY 2: Read a specific file, parse its Frontmatter, and convert its body to HTML.
 * Notice the 'async' keyword. Converting Markdown to HTML takes a fraction of a millisecond,
 * so we use async/await to ensure the server waits for the conversion to finish.
 */
export async function getMarkdownData(folderName: string, slug: string) {
    // Reconstruct the exact path to the file
    const fullPath = path.join(rootDirectory, folderName, `${slug}.md`);

    // Read the raw text from the file
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 1. Use gray-matter to parse the metadata block (Frontmatter) at the top
    const matterResult = matter(fileContents);

    // 2. Use remark to convert the remaining Markdown body into raw HTML
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    // 3. Package it all together in a neat TypeScript object and return it
    return {
        slug,
        contentHtml,
        ...(matterResult.data as { [key: string]: any }), // This grabs title, author, date, etc.
    };
}