// src/app/vault/submit/page.tsx
"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { UploadCloud, AlertCircle, ShieldCheck, Image as ImageIcon } from "lucide-react";

export default function SubmitPage() {
    const { data: session } = useSession();
    const [scope, setScope] = useState<"Public" | "Internal">("Public");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [authors, setAuthors] = useState("");
    const [publicType, setPublicType] = useState("Publication");
    const [internalType, setInternalType] = useState("Tutorial");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState("");
    const [imageCaption, setImageCaption] = useState(""); // NEW: Header Image Caption

    const [inlineImages, setInlineImages] = useState<{ name: string, base64: string }[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageError("");
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setImageError("File size exceeds 2MB limit.");
            setImageFile(null);
            return;
        }
        setImageFile(file);
    };

    const handleInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("Inline image exceeds 2MB limit.");
            return;
        }

        const cleanFilename = `inline-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const markdownTag = `\n![Type your caption here](/images/${cleanFilename})\n`;

        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        setInlineImages(prev => [...prev, { name: cleanFilename, base64 }]);

        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.substring(0, start) + markdownTag + content.substring(end);
            setContent(newContent);

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + markdownTag.length;
                textarea.focus();
            }, 0);
        } else {
            setContent((prev) => prev + markdownTag);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let imageBase64 = null;
        if (imageFile) {
            const buffer = await imageFile.arrayBuffer();
            imageBase64 = Buffer.from(buffer).toString("base64");
        }

        const payload = {
            scope,
            title,
            content,
            type: scope === "Internal" ? internalType : publicType,
            author: scope === "Internal" ? session?.user?.name || "Internal User" : authors,
            headerImage: { name: imageFile?.name, base64: imageBase64, caption: imageCaption }, // Updated payload
            inlineImages
        };

        console.log("Transmitting payload to API:", payload);
    };

    return (
        <div className="max-w-3xl mx-auto py-12">
            <header className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter mb-2">
                    Content Submission
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Draft and route new documents to the GitHub repository.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">

                <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <button type="button" onClick={() => setScope("Public")} className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-lg transition-colors ${scope === "Public" ? "bg-white dark:bg-zinc-800 text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}>
                        Public Facing
                    </button>
                    <button type="button" onClick={() => setScope("Internal")} className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-lg transition-colors ${scope === "Internal" ? "bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}>
                        Internal Vault
                    </button>
                </div>

                <div className="space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Document Title</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-zinc-900 dark:text-zinc-100" placeholder="Enter the title..." />
                    </div>

                    {scope === "Public" ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Content Type</label>
                                <select value={publicType} onChange={(e) => setPublicType(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-zinc-900 dark:text-zinc-100">
                                    <option value="Publication">Publication</option>
                                    <option value="Project">Project</option>
                                    <option value="News">News Article</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Author / Lead Names (Comma Separated)</label>
                                <input type="text" required value={authors} onChange={(e) => setAuthors(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-zinc-900 dark:text-zinc-100" placeholder="e.g., Le Lam Son, Ngo Minh Chau" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Internal Document Type</label>
                                <select value={internalType} onChange={(e) => setInternalType(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-zinc-900 dark:text-zinc-100">
                                    <option value="Tutorial">Tutorial / Guide</option>
                                    <option value="Announcement">Lab Announcement</option>
                                    <option value="Resource">Shared Resources</option>
                                </select>
                            </div>
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                                    Author automatically mapped to your session: {session?.user?.name || "Pending..."}.
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Header Image (Optional)</label>
                        <div className="flex items-center gap-6">
                            <label className="flex flex-col items-center justify-center w-full max-w-xs h-32 border-2 border-zinc-300 dark:border-zinc-700 border-dashed rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                                    <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Click to upload</p>
                                    <p className="text-xs text-zinc-500">SVG, PNG, JPG (Max 2MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            {imageFile && !imageError && <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Ready: {imageFile.name}</div>}
                            {imageError && <div className="text-sm font-bold text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {imageError}</div>}
                        </div>
                    </div>
                    {/* NEW: Caption field unlocks when a file is selected */}
                    {imageFile && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Header Image Caption</label>
                            <input type="text" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-zinc-900 dark:text-zinc-100" placeholder="Add a descriptive caption for the hero banner..." />
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Markdown Body</label>
                        <label className="cursor-pointer text-xs font-bold bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm">
                            <ImageIcon className="w-3.5 h-3.5" /> Insert Inline Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleInlineImage} />
                        </label>
                    </div>

                    <textarea
                        ref={textareaRef}
                        required
                        rows={12}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-4 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-zinc-900 dark:text-zinc-100 shadow-sm"
                        placeholder="Write your markdown content here..."
                    />
                </div>

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <button type="submit" className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black tracking-widest uppercase rounded-xl hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm">
                        Propose Submission
                    </button>
                </div>
            </form>
        </div>
    );
}