// src/app/vault/layout.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AuthProvider from "@/components/AuthProvider";
import VaultNav from "@/components/VaultNav";
import SignOutButton from "@/components/SignOutButton";

export default async function VaultLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <AuthProvider>
            <div className="flex flex-col md:flex-row gap-10 min-h-[75vh]">

                {/* STICKY: Added 'sticky top-12' and upgraded border contrast */}
                <aside className="w-full md:w-64 shrink-0 h-fit sticky top-12 z-10">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100">
                        <div className="mb-8">
                            <h2 className="text-xl font-black tracking-tighter">Vault Access</h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {session.user?.name || "Active Session"}
                            </p>
                        </div>

                        <VaultNav />
                    </div>

                    <SignOutButton />
                </aside>

                <main className="flex-grow min-w-0">
                    {children}
                </main>

            </div>
        </AuthProvider>
    );
}