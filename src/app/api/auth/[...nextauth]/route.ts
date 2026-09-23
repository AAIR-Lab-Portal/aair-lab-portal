// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            // NEW: We request permission to read the user's organization memberships
            authorization: { params: { scope: "read:user user:email read:org" } },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Ensure we only process GitHub logins
            if (account?.provider !== "github" || !account.access_token) {
                return false;
            }

            try {
                // Ask the GitHub API for a list of organizations this user belongs to
                const res = await fetch("https://api.github.com/user/orgs", {
                    headers: {
                        Authorization: `Bearer ${account.access_token}`,
                    },
                });

                if (!res.ok) return false;

                const orgs = await res.json();

                // THE VAULT BOUNCER: Check if they belong to the lab's exact GitHub Organization.
                const isLabMember = orgs.some((org: any) => org.login === "aair-lab-portal");

                if (isLabMember) {
                    return true; // Access Granted!
                }

                console.log(`Access Denied: ${user.name} is not in the required GitHub Organization.`);
                return false; // Access Denied

            } catch (error) {
                console.error("Error verifying GitHub organization:", error);
                return false;
            }
        },
    },
});

export { handler as GET, handler as POST };