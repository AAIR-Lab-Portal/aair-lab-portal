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

        const { displayName, avatarUrl, bio } = await req.json();

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER!;
        const repo = process.env.GITHUB_REPO!;

        const userEmailSanitized = session.user.email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const filePath = `_profiles/${userEmailSanitized}.json`;
        const branchName = `profile-update-${userEmailSanitized}-${Date.now()}`;

        let existingSha: string | undefined = undefined;
        try {
            const { data } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: "heads/main",
            });
            if (!Array.isArray(data) && "sha" in data) {
                existingSha = data.sha;
            }
        } catch {
            // File does not exist yet
        }

        const profileData = {
            accountEmail: session.user.email,
            displayName: displayName.trim(),
            avatarUrl: avatarUrl.trim(),
            bio: bio.trim(),
            updatedAt: new Date().toISOString(),
        };

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
            path: filePath,
            message: `Profile Update: ${session.user.email}`,
            content: Buffer.from(JSON.stringify(profileData, null, 2)).toString("base64"),
            branch: branchName,
            ...(existingSha ? { sha: existingSha } : {}),
        });

        const { data: prData } = await octokit.rest.pulls.create({
            owner,
            repo,
            title: `Profile Customization: ${displayName}`,
            head: branchName,
            base: "main",
            body: `Automated update for user handle \`${session.user.email}\`.`,
        });

        return NextResponse.json({ success: true, prUrl: prData.html_url });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: error.message || "Failed to submit profile update" }, { status: 500 });
    }
}