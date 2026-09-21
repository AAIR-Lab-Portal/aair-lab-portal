// src/app/vault/docs/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllInternalDocs, InternalDoc } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, User, Calendar, ShieldCheck } from "lucide-react";
import PublicationContent from "@/components/PublicationContent";
import StarButton from "@/components/StarButton";

export async function generateStaticParams() {
    const docs = await getAllInternalDocs();
    return docs.map((d) => ({ slug: d.slug }));
}

export default async function InternalDocReader({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const doc = (await getMarkdownData("_internal", resolvedParams.slug)) as unknown as InternalDoc;

    return (
        <div className="max-w-4xl mx-auto py-12">
            <Link href="/vault" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Vault Dashboard
            </Link>

            <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                {/* Header Top Row: Pill and Star */}
                <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Internal {doc.type}
                    </span>
                    <StarButton slug={doc.slug} />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter leading-tight mb-6">
                    {doc.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                        <User className="w-4 h-4 text-zinc-400" /> Uploaded by: {doc.author}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-400" /> {doc.date}
                    </div>
                </div>
            </header>

            <PublicationContent html={doc.contentHtml} />
        </div>
    );
}