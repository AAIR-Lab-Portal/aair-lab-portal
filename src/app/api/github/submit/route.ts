// src/app/api/github/submit/route.ts
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function POST(req: Request) {
    try {
        // Updated payload extraction based on your new frontend form
        const { title, content, type, scope, author, headerImage, inlineImages } = await req.json();

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER!;
        const repo = process.env.GITHUB_REPO!;

        const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const branchName = `submission-${filename}-${Date.now()}`;

        // 1. Target folder routing
        let folder = "_news";
        if (scope === "Internal") {
            folder = "_internal";
        } else if (type === "Publication") {
            folder = "_publications";
        } else if (type === "Project") {
            folder = "_projects";
        }

        const mdPath = `${folder}/${filename}.md`;

        // 2. Branch Creation
        const { data: refData } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: "heads/main",
        });

        await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha: refData.object.sha,
        });

        let imageFrontmatter = "";

        // 3. Process Header Image (if exists)
        if (headerImage && headerImage.base64) {
            const cleanImgName = headerImage.name.replace(/[^a-zA-Z0-9.-]/g, "");
            const imagePath = `public/images/header-${filename}-${cleanImgName}`;

            await octokit.rest.repos.createOrUpdateFileContents({
                owner, repo,
                path: imagePath,
                message: `Automated Submission: Add header image for ${title}`,
                content: headerImage.base64,
                branch: branchName,
            });

            imageFrontmatter = `\nimage: "/images/header-${filename}-${cleanImgName}"`;
        }

        // 4. Process Inline Images sequentially to avoid branch lock
        if (inlineImages && Array.isArray(inlineImages)) {
            for (const img of inlineImages) {
                if (img.base64 && img.name) {
                    await octokit.rest.repos.createOrUpdateFileContents({
                        owner, repo,
                        path: `public/images/${img.name}`,
                        message: `Automated Submission: Add inline image ${img.name}`,
                        content: img.base64,
                        branch: branchName,
                    });
                }
            }
        }

        // 5. Construct standardized YAML Frontmatter
        const frontmatter = [
            "---",
            `title: "${title.replace(/"/g, '\\"')}"`,
            `date: "${new Date().toISOString().split("T")[0]}"`,
            `type: "${type}"`,
            'image_caption: "${headerImage.caption}"',
            // If it's a publication, it uses 'authors'. Internal docs use 'author'.
            scope === "Public" && type === "Publication" ? `authors: "${author}"` : `author: "${author}"`,
            imageFrontmatter.trim(),
            "---",
            "",
            content,
        ].filter(Boolean).join("\n");

        // 6. Commit the Markdown File
        await octokit.rest.repos.createOrUpdateFileContents({
            owner, repo,
            path: mdPath,
            message: `Automated Submission: Add ${scope} ${type} - ${title}`,
            content: Buffer.from(frontmatter).toString("base64"),
            branch: branchName,
        });

        // 7. Open the Pull Request
        const { data: prData } = await octokit.rest.pulls.create({
            owner, repo,
            title: `[${scope.toUpperCase()}] ${type}: ${title}`,
            head: branchName,
            base: "main",
            body: `### New Content Staged for Review\n- **Target Folder:** \`${folder}/\`\n- **Author:** \`${author}\`\n- **Images Attached:** ${inlineImages?.length || 0} inline, ${headerImage?.base64 ? 1 : 0} header.`,
        });

        return NextResponse.json({ success: true, prUrl: prData.html_url });
    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: error.message || "Failed to submit PR" }, { status: 500 });
    }
}