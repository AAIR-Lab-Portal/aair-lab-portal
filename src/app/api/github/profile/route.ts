// src/app/api/github/profile/route.ts
import { NextResponse } from "next/server";
import { Octokit } from "octokit";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { displayName, bio, department, role, email, avatarUrl, avatarName } = await req.json();

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER!;
        const repo = process.env.GITHUB_REPO!;

        // Generate a clean slug for the member file
        const filename = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const mdPath = `_members/${filename}.md`;
        const branchName = `profile-update-${filename}-${Date.now()}`;

        const { data: refData } = await octokit.rest.git.getRef({
            owner, repo, ref: "heads/main",
        });

        await octokit.rest.git.createRef({
            owner, repo, ref: `refs/heads/${branchName}`, sha: refData.object.sha,
        });

        let imageFrontmatter = "";

        // FIXED: Properly save the avatar image into the public/images/members folder
        if (avatarUrl && avatarName) {
            const ext = avatarName.split('.').pop() || "jpg";
            const imagePath = `public/images/members/${filename}-avatar.${ext}`;

            await octokit.rest.repos.createOrUpdateFileContents({
                owner, repo,
                path: imagePath,
                message: `Profile Update: Add avatar for ${displayName}`,
                content: avatarUrl,
                branch: branchName,
            });

            imageFrontmatter = `\nimage: "/images/members/${filename}-avatar.${ext}"`;
        }

        // Construct standard Member Markdown Frontmatter
        const frontmatter = [
            "---",
            `name: "${displayName.replace(/"/g, '\\"')}"`,
            `role: "${role}"`,
            `department: "${department}"`,
            `email: "${email}"`,
            imageFrontmatter.trim(),
            "---",
            "",
            bio,
        ].filter(Boolean).join("\n");

        await octokit.rest.repos.createOrUpdateFileContents({
            owner, repo,
            path: mdPath,
            message: `Profile Update: ${displayName}`,
            content: Buffer.from(frontmatter).toString("base64"),
            branch: branchName,
        });

        const { data: prData } = await octokit.rest.pulls.create({
            owner, repo,
            title: `Profile Customization: ${displayName}`,
            head: branchName,
            base: "main",
            body: `### Profile Update Request\n- **Target File:** \`${mdPath}\`\n- **Authenticated User:** \`${session.user.email}\`\n- **Avatar Attached:** ${avatarUrl ? "Yes" : "No"}`,
        });

        return NextResponse.json({ success: true, prUrl: prData.html_url });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: error.message || "Failed to submit profile update" }, { status: 500 });
    }
}