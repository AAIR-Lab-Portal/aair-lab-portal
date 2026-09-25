// src/app/api/github/submit/route.ts
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function POST(req: Request) {
    try {
        const { title, content, type, scope, author, headerImage, inlineImages } = await req.json();

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER!;
        const repo = process.env.GITHUB_REPO!;

        const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const uniqueId = Date.now(); // NEW: Unbreakable unique identifier for this submission
        const branchName = `submission-${filename}-${uniqueId}`;

        // 1. Establish Markdown Folder and Image Subfolder routing
        let folder = "_news";
        let imageFolder = "news";

        if (scope === "Internal") {
            folder = "_internal";
            imageFolder = "internal";
        } else if (type === "Publication") {
            folder = "_publications";
            imageFolder = "publications";
        } else if (type === "Project") {
            folder = "_projects";
            imageFolder = "projects";
        }

        const mdPath = `${folder}/${filename}.md`;

        const { data: refData } = await octokit.rest.git.getRef({
            owner, repo, ref: "heads/main",
        });

        await octokit.rest.git.createRef({
            owner, repo, ref: `refs/heads/${branchName}`, sha: refData.object.sha,
        });

        let imageFrontmatter = "";

        // 2. Process Header Image into correct subfolder WITH Collision Protection
        if (headerImage && headerImage.base64) {
            const ext = headerImage.name.split('.').pop() || "png";
            // FIXED: Appended uniqueId to prevent overwriting
            const finalHeaderName = `${filename}-header-${uniqueId}.${ext}`;
            const imagePath = `public/images/${imageFolder}/${finalHeaderName}`;

            await octokit.rest.repos.createOrUpdateFileContents({
                owner, repo,
                path: imagePath,
                message: `Automated Submission: Add header image for ${title}`,
                content: headerImage.base64,
                branch: branchName,
            });

            imageFrontmatter = `\nimage: "/images/${imageFolder}/${finalHeaderName}"`;
        }

        // 3. Process Inline Images WITH Collision Protection
        let finalContent = content;
        if (inlineImages && Array.isArray(inlineImages)) {
            for (let i = 0; i < inlineImages.length; i++) {
                const img = inlineImages[i];
                if (img.base64 && img.name) {
                    const ext = img.name.split('.').pop() || "png";
                    // FIXED: Appended uniqueId to prevent overwriting
                    const finalImgName = `${filename}-inline-${i + 1}-${uniqueId}.${ext}`;
                    const finalImgPath = `public/images/${imageFolder}/${finalImgName}`;

                    await octokit.rest.repos.createOrUpdateFileContents({
                        owner, repo,
                        path: finalImgPath,
                        message: `Automated Submission: Add inline image ${i + 1} for ${title}`,
                        content: img.base64,
                        branch: branchName,
                    });

                    // Search and replace the frontend placeholder with the permanent collision-free path
                    finalContent = finalContent.replace(`/images/${img.name}`, `/images/${imageFolder}/${finalImgName}`);
                }
            }
        }

        let authorRouting = `author: "${author}"`;
        if (scope === "Public" && type === "Project") {
            authorRouting = `lead: "${author}"`;
        } else if (scope === "Public" && type === "Publication") {
            authorRouting = `authors: "${author}"`;
        }

        const frontmatter = [
            "---",
            `title: "${title.replace(/"/g, '\\"')}"`,
            `date: "${new Date().toISOString().split("T")[0]}"`,
            `type: "${type}"`,
            headerImage?.caption ? `image_caption: "${headerImage.caption.replace(/"/g, '\\"')}"` : "",
            authorRouting,
            imageFrontmatter.trim(),
            "---",
            "",
            finalContent,
        ].filter(Boolean).join("\n");

        await octokit.rest.repos.createOrUpdateFileContents({
            owner, repo,
            path: mdPath,
            message: `Automated Submission: Add ${scope} ${type} - ${title}`,
            content: Buffer.from(frontmatter).toString("base64"),
            branch: branchName,
        });

        const { data: prData } = await octokit.rest.pulls.create({
            owner, repo,
            title: `[${scope.toUpperCase()}] ${type}: ${title}`,
            head: branchName,
            base: "main",
            body: `### New Content Staged for Review\n- **Target Folder:** \`${folder}/\`\n- **Image Folder:** \`public/images/${imageFolder}/\`\n- **Images Attached:** ${inlineImages?.length || 0} inline, ${headerImage?.base64 ? 1 : 0} header.`,
        });

        return NextResponse.json({ success: true, prUrl: prData.html_url });
    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: error.message || "Failed to submit PR" }, { status: 500 });
    }
}