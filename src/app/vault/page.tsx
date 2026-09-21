// src/app/vault/page.tsx
import Link from "next/link";
import { ShieldCheck, BookOpen, Bell, Database, GitPullRequest, User, Calendar, FileEdit, Terminal, GitMerge } from "lucide-react";
import { getAllInternalDocs } from "@/lib/api";
import ContactCard from "@/components/ContactCard";

export default async function VaultDashboard() {
    const internalDocs = await getAllInternalDocs();

    const tutorials = internalDocs.filter(d => d.type === "Tutorial").slice(0, 3);
    const announcements = internalDocs.filter(d => d.type === "Announcement").slice(0, 3);
    const resources = internalDocs.filter(d => d.type === "Resource").slice(0, 3);

    return (
        <div className="max-w-6xl mx-auto py-12 space-y-12">

            <header className="border-b border-zinc-200 dark:border-zinc-700 pb-6">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    System Overview
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 font-medium">
                    Internal documentation, cluster guides, and shared laboratory resources.
                </p>
            </header>

            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-zinc-900 dark:bg-zinc-800/80 border border-zinc-800 dark:border-indigo-500/40 rounded-2xl hover:border-indigo-500/80 hover:bg-zinc-800 dark:hover:bg-zinc-800 hover:scale-[1.01] transition-all shadow-md group">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                        <GitPullRequest className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-2 text-zinc-100">
                            Source Control <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </h2>
                        <p className="text-sm font-medium text-zinc-400">
                            Manage pull requests and review repository infrastructure.
                        </p>
                    </div>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Open Repository <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
            </a>

            <div className="grid lg:grid-cols-3 gap-6 items-start">

                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 gap-4">
                        <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2 truncate">
                            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
                            Tutorial
                        </h2>
                        <Link href="/vault/docs?type=tutorial" className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 hover:underline shrink-0">
                            View All
                        </Link>
                    </div>

                    {tutorials.length === 0 ? (
                        <p className="text-xs font-medium text-zinc-500">No tutorials uploaded yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {tutorials.map((doc) => (
                                /* FIX: Removed h-full here */
                                <Link href={`/vault/docs/${doc.slug}`} key={doc.slug} className="flex flex-col p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group">
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors mb-3 line-clamp-2">
                                        {doc.title}
                                    </h3>
                                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-auto">
                                        <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-zinc-400" /> {doc.author}</span>
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-zinc-400" /> {doc.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 gap-4">
                        <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2 truncate">
                            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-500 shrink-0" />
                            Announcement
                        </h2>
                        <Link href="/vault/docs?type=announcement" className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 hover:underline shrink-0">
                            View All
                        </Link>
                    </div>

                    {announcements.length === 0 ? (
                        <p className="text-xs font-medium text-zinc-500">No announcements posted.</p>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((doc) => (
                                <Link href={`/vault/docs/${doc.slug}`} key={doc.slug} className="flex flex-col p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors group">
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                                        {doc.title}
                                    </h3>
                                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-auto">
                                        <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-zinc-400" /> {doc.author}</span>
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-zinc-400" /> {doc.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 gap-4">
                        <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2 truncate">
                            <Database className="w-4 h-4 text-purple-600 dark:text-purple-500 shrink-0" />
                            Resource
                        </h2>
                        <Link href="/vault/docs?type=resource" className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-500 hover:underline shrink-0">
                            View All
                        </Link>
                    </div>

                    {resources.length === 0 ? (
                        <p className="text-xs font-medium text-zinc-500">No resources available.</p>
                    ) : (
                        <div className="space-y-4">
                            {resources.map((doc) => (
                                <Link href={`/vault/docs/${doc.slug}`} key={doc.slug} className="flex flex-col p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors group">
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-3 line-clamp-2">
                                        {doc.title}
                                    </h3>
                                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-auto">
                                        <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-zinc-400" /> {doc.author}</span>
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-zinc-400" /> {doc.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Structured Lab Protocols & Workflows Grid */}
            <section className="pt-8">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-6">
                    Lab Protocols & Workflows
                </h2>

                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                    {/* Protocol 1: Content Blueprint */}
                    <Link href="/vault/docs/markdown-blueprint" className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 border-t-4 border-t-blue-500 rounded-2xl p-6 shadow-sm hover:scale-[1.02] hover:shadow-md transition-all">
                        <div className="flex flex-col mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shrink-0">
                                <FileEdit className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">1. Markdown Blueprint</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Review the official frontmatter blueprint, KaTeX syntax rules, and image insertion guidelines before drafting.
                        </p>
                    </Link>

                    {/* Protocol 2: CI/CD Pipeline */}
                    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 border-t-4 border-t-emerald-500 rounded-2xl p-6 shadow-sm hover:scale-[1.02] hover:shadow-md transition-all">
                        <div className="flex flex-col mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 shrink-0">
                                <GitMerge className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">2. Submission</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Submit via the portal to trigger automated GitHub CI/CD checks. Code and markdown will be reviewed and merged by responsible leaders.
                        </p>
                    </div>

                    {/* Protocol 3: Dynamic Contact Modal */}
                    <ContactCard />
                </div>
            </section>
        </div>
    );
}