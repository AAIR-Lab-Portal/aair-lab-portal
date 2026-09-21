// src/lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import GithubSlugger from "github-slugger";

const rootDirectory = process.cwd();

export function getAllSlugsFromFolder(folderName: string) {
    const folderPath = path.join(rootDirectory, folderName);
    const fileNames = fs.readdirSync(folderPath);
    return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
}

export async function getMarkdownData(folderName: string, slug: string) {
    const fullPath = path.join(rootDirectory, folderName, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    const slugger = new GithubSlugger();
    const toc: { level: number; text: string; id: string }[] = [];
    
    const headingRegex = /^(#{2,3})\s+(.+)$/gm; 
    let match;
    while ((match = headingRegex.exec(matterResult.content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const id = slugger.slug(text); 
        toc.push({ level, text, id });
    }

    const processedContent = await remark()
        .use(remarkMath) 
        // 1. Tell the bridge to allow raw HTML
        .use(remarkRehype, { allowDangerousHtml: true }) 
        // 2. Parse the raw HTML (<details>, <summary>)
        .use(rehypeRaw) 
        .use(rehypeSlug) 
        .use(rehypeKatex) 
        .use(rehypeStringify) 
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        toc,
        ...(matterResult.data as { [key: string]: any }), 
    };
}