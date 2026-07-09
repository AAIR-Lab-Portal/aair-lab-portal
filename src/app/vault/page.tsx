// src/app/vault/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Database, Server, BookOpen, HardDrive } from "lucide-react";

export default async function VaultDashboard() {
    // Securely verify the session on the server
    const session = await getServerSession(authOptions);

    // Fallback protection: if someone bypasses middleware, redirect them
    if (!session) {
        redirect("/api/auth/signin");
    }

    // Dummy data for the SSO links
    const tools = [
        { name: "JupyterHub", desc: "GPU Cluster Access", icon: Server, color: "text-orange-500" },
        { name: "Nextcloud", desc: "Shared Lab Datasets", icon: HardDrive, color: "text-blue-500" },
        { name: "BookStack", desc: "Internal Documentation", icon: BookOpen, color: "text-green-500" },
        { name: "Portainer", desc: "Docker Container Management", icon: Database, color: "text-cyan-500" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    Lab Internal Vault
                </h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400 font-medium">
                    Welcome back, {session.user?.name}. You are authenticated.
                </p>
            </header>

            <section>
                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-6">SSO Applications</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <a
                                key={tool.name}
                                href="#"
                                className="group block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className={`p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform ${tool.color}`}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                    {tool.desc}
                                </p>
                            </a>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}