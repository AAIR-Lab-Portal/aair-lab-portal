// src/app/vault/layout.tsx
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { LayoutDashboard, FileEdit, UserCircle, ShieldAlert, LogOut } from "lucide-react";

export default async function VaultLayout({ children }: { children: React.ReactNode }) {
    // 1. Verify the session on the server before rendering ANYTHING
    const session = await getServerSession();

    // 2. If no valid session exists, instantly redirect to the GitHub login portal
    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="flex flex-col md:flex-row gap-10 min-h-[75vh]">

            {/* The Administrative Control Ribbon */}
            <aside className="w-full md:w-64 shrink-0 h-fit">
                <div className="bg-zinc-900 dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-800 text-zinc-300">

                    <div className="mb-8">
                        <h2 className="text-white text-xl font-black tracking-tighter">Vault Access</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {session.user?.name || "Active Session"}
                        </p>
                    </div>

                    <nav className="flex flex-col space-y-2">
                        <Link href="/vault" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors font-bold text-sm">
                            <LayoutDashboard className="w-4 h-4" /> Lab Dashboard
                        </Link>
                        <Link href="/vault/submit" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors font-bold text-sm">
                            <FileEdit className="w-4 h-4" /> Submission Portal
                        </Link>
                        <Link href="/vault/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors font-bold text-sm">
                            <UserCircle className="w-4 h-4" /> Profile Editor
                        </Link>
                    </nav>
                </div>

                {/* NextAuth Sign Out Route */}
                <Link
                    href="/api/auth/signout"
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Sign Out & Return
                </Link>
            </aside>

            {/* Vault Content Area */}
            <main className="flex-grow min-w-0">
                {children}
            </main>

        </div>
    );
}