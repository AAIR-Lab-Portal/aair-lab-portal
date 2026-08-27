// src/app/vault/profile/page.tsx
"use client";

import { useState } from "react";
import { Save, CheckCircle2, Loader2, ExternalLink } from "lucide-react";

export default function ProfileEditorPage() {
    const [displayName, setDisplayName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [bio, setBio] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prUrl, setPrUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setPrUrl(null);

        try {
            const res = await fetch("/api/github/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ displayName, avatarUrl, bio }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setPrUrl(data.prUrl);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-10 max-w-2xl">
            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    Profile Settings
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 font-medium">
                    Customize your display avatar, handle, and lab bio.
                </p>
            </header>

            {prUrl && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center justify-between">
                    <p className="text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Staged update for admin approval
                    </p>
                    <a href={prUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 underline flex items-center gap-1">
                        View PR <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-xl text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl">
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Public Display Handle</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Minh Chau"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-zinc-900 dark:text-zinc-100"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Avatar Image URL</label>
                    <input
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/pfp.jpg"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Public Bio</label>
                    <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Short overview of current projects and research topics."
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 resize-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Configuration
                </button>
            </form>
        </div>
    );
}