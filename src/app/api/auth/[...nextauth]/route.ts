// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Initialize the NextAuth handler with our configuration
const handler = NextAuth(authOptions);

// Next.js App Router requires us to explicitly export GET and POST methods
export { handler as GET, handler as POST };