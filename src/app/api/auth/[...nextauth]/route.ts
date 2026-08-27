// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // THE VAULT BOUNCER: Only these exact GitHub emails are allowed in.
            // Replace these with your actual lab members' GitHub emails.
            const allowedEmails = [
                "mchau43ioe@gmail.com",
            ];

            if (user.email && allowedEmails.includes(user.email)) {
                return true; // Access Granted
            }

            return false; // Access Denied (Redirects to an error page)
        },
    },
});

export { handler as GET, handler as POST };