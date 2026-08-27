// src/app/api/github/submit/route.ts
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function POST(req: Request) {
    try {
        const { title, content, type, isInternal, authorIds, tags } = await req.json();

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER!;
        const repo = process.env.GITHUB_REPO!;

        const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const branchName = `submission-${filename}-${Date.now()}`;

        // Target folder routing
        let folder = "_news";
        if (isInternal) {
            folder = "_internal";
        } else if (type === "Publication") {
            folder = "_publications";
        } else if (type === "Project") {
            folder = "_projects";
        }

        const path = `${folder}/${filename}.md`;

        // Construct standardized YAML Frontmatter
        const frontmatter = [
            "---",
            `id: "${type.toLowerCase().slice(0, 3)}_${Date.now()}"`,
            `title: "${title.replace(/"/g, '\\"')}"`,
            `date: "${new Date().toISOString().split("T")[0]}"`,
            `type: "${type}"`,
            `is_internal: ${Boolean(isInternal)}`,
            `author_ids: [${(authorIds || []).join(", ")}]`,
            `tags: [${(tags || []).map((t: string) => `"${t.trim()}"`).join(", ")}]`,
            "---",
            "",
            content,
        ].join("\n");

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

        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: `Automated Submission: Add ${isInternal ? "Internal" : "Public"} ${type} - ${title}`,
            content: Buffer.from(frontmatter).toString("base64"),
            branch: branchName,
        });

        const { data: prData } = await octokit.rest.pulls.create({
            owner,
            repo,
            title: `[${isInternal ? "INTERNAL" : "PUBLIC"}] ${type}: ${title}`,
            head: branchName,
            base: "main",
            body: `### New Content Staged for Review\n- **Target Folder:** \`${folder}/\`\n- **Author IDs:** \`${(authorIds || []).join(", ") || "None specified"}\``,
        });

        return NextResponse.json({ success: true, prUrl: prData.html_url });
    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: error.message || "Failed to submit PR" }, { status: 500 });
    }
}