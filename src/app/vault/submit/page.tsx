// src/app/vault/submit/page.tsx
"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, ExternalLink, Lock, Globe } from "lucide-react";

export default function SubmitPage() {
    const [docType, setDocType] = useState("Publication");
    const [isInternal, setIsInternal] = useState(false);
    const [title, setTitle] = useState("");
    const [authorIdsInput, setAuthorIdsInput] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prUrl, setPrUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setPrUrl(null);

        const authorIds = authorIdsInput
            .split(",")
            .map((id) => parseInt(id.trim(), 10))
            .filter((n) => !isNaN(n));

        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        try {
            const res = await fetch("/api/github/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    type: docType,
                    isInternal,
                    authorIds,
                    tags,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setPrUrl(data.prUrl);
            setTitle("");
            setContent("");
            setAuthorIdsInput("");
            setTagsInput("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-10 max-w-3xl">
            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    Submission Portal
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 font-medium">
                    Draft items for automatic staging and administrative PR creation.
                </p>
            </header>

            {prUrl && (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-emerald-800 dark:text-emerald-400 font-black tracking-tight flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Staged Successfully
                        </h3>
                        <p className="text-emerald-600 dark:text-emerald-500 font-medium text-sm mt-1">
                            Pull Request opened on repository.
                        </p>
                    </div>
                    <a href={prUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm">
                        Review Pull Request <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-xl text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">

                {/* Scope Selector */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Destination Scope</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setIsInternal(false)}
                            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition-all ${!isInternal
                                    ? "border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500"
                                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                                }`}
                        >
                            <Globe className="w-4 h-4" /> Public Portal
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsInternal(true)}
                            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition-all ${isInternal
                                    ? "border-emerald-600 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500"
                                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                                }`}
                        >
                            <Lock className="w-4 h-4" /> Internal Vault Only
                        </button>
                    </div>
                </div>

                {/* Document Type Selector */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Classification</label>
                    <div className="grid grid-cols-3 gap-4">
                        {["Publication", "Project", "News"].map((type) => (
                            <button
                                type="button"
                                key={type}
                                onClick={() => setDocType(type)}
                                className={`p-3 rounded-xl border text-sm font-bold transition-all ${docType === type
                                        ? "border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500"
                                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Robust Feature Extraction in Edge Networks"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-zinc-900 dark:text-zinc-100"
                    />
                </div>

                {/* Relational Author IDs and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Author IDs (Comma-separated)</label>
                        <input
                            type="text"
                            value={authorIdsInput}
                            onChange={(e) => setAuthorIdsInput(e.target.value)}
                            placeholder="e.g. 101, 104"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-sm text-zinc-900 dark:text-zinc-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Tags (Comma-separated)</label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="e.g. Vision-Language, Edge Computing"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-sm text-zinc-900 dark:text-zinc-100"
                        />
                    </div>
                </div>

                {/* Content Body */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Document Body (Markdown & LaTeX)</label>
                    <textarea
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write abstract, methodology, results, or guide instructions here..."
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-sm text-zinc-900 dark:text-zinc-100 resize-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-sm"
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Submitting to GitHub...</>
                    ) : (
                        <><UploadCloud className="w-5 h-5" /> Dispatch Pull Request</>
                    )}
                </button>
            </form>
        </div>
    );
}