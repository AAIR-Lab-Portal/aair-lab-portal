// src/app/vault/docs/page.tsx
import { getAllInternalDocs } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import NotionDirectory from "@/components/NotionDirectory";

export default async function InternalDocsIndex() {
    const docs = await getAllInternalDocs();

    return (
        <div className="max-w-5xl mx-auto py-12 space-y-8">
            <Link href="/vault" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Vault
            </Link>

            <header className="mb-8">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter mb-2">
                    Internal Directory
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">
                    The lab's central wiki for tutorials, announcements, and shared resources.
                </p>
            </header>

            <Suspense fallback={<div className="animate-pulse h-64 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl"></div>}>
                <NotionDirectory docs={docs} />
            </Suspense>
        </div>
    );
}