// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    // 1. Configure the login methods
    providers: [
        CredentialsProvider({
            name: "Lab Credentials",
            credentials: {
                email: { label: "VGU Email", type: "email", placeholder: "chau@vgu.edu.vn" },
                password: { label: "Password", type: "password" }
            },
            // 2. The Verification Engine
            async authorize(credentials) {
                // In production, this is where you check a Python backend or PostgreSQL database.
                // For the prototype, we use a hardcoded dummy pass:
                if (credentials?.email === "chau@vgu.edu.vn" && credentials?.password === "admin123") {
                    return {
                        id: "1",
                        name: "Chau",
                        email: "chau@vgu.edu.vn",
                        role: "Lead Researcher"
                    };
                }
                // If it fails, return null to reject the login
                return null;
            }
        })
    ],
    // 3. Security Settings
    session: {
        strategy: "jwt", // JSON Web Tokens
    },
    // We use the default NextAuth login page for now to save time
};