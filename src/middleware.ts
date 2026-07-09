// src/middleware.ts
import { withAuth } from "next-auth/middleware";

// 1. Explicitly export the function to satisfy Turbopack
export default withAuth;

// 2. Keep the routing configuration exactly the same
export const config = {
    matcher: ["/vault/:path*"],
};