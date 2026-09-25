// src/app/vault/profile/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { UploadCloud, AlertCircle, UserCircle } from "lucide-react";

export default function ProfileEditorPage() {
    const { data: session } = useSession();

    const [bio, setBio] = useState("");
    const [department, setDepartment] = useState("Computer Science");
    const [role, setRole] = useState("Research Assistant");
    const [email, setEmail] = useState("");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageError("");
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setImageError("File size exceeds 5MB limit.");
            setImageFile(null);
            setImagePreview(null);
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let imageBase64 = null;
        if (imageFile) {
            const buffer = await imageFile.arrayBuffer();
            imageBase64 = Buffer.from(buffer).toString("base64");
        }

        const payload = {
            displayName: session?.user?.name || "Internal User",
            bio, department, role, email,
            avatarUrl: imageBase64,
            avatarName: imageFile?.name
        };

        try {
            const res = await fetch("/api/github/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                alert(`Success! Profile update sent for review: ${data.prUrl}`);
            } else {
                alert(`GitHub API Error: ${data.error}`);
            }
        } catch (error) {
            alert("A network error occurred while communicating with the server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12">
            <header className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter mb-2">Profile Editor</h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">Update your public-facing lab profile and avatar.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3 mb-8">
                    <UserCircle className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    <span className="text-sm font-bold text-blue-800 dark:text-blue-300">
                        Editing profile for authenticated user: {session?.user?.name || "Pending..."}.
                    </span>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Profile Picture</label>
                    <div className="flex items-center gap-8">
                        <label className="relative flex flex-col items-center justify-center w-36 h-36 border-2 border-zinc-300 dark:border-zinc-700 border-dashed rounded-full cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors shrink-0 overflow-hidden bg-white dark:bg-zinc-950 shadow-sm group">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Change</p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <UploadCloud className="w-6 h-6 text-zinc-400 mb-1" />
                                    <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Upload</p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">Preview Avatar Crop</p>
                            <p className="text-xs font-medium text-zinc-500 mb-3">Your image will be cropped to this circle. SVG, PNG, JPG (Max 5MB).</p>
                            {imageError && <div className="text-sm font-bold text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {imageError}</div>}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Role / Title</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-zinc-900 dark:text-zinc-100">
                                <option value="Lab Director">Lab Director</option>
                                <option value="Principal Investigator">Principal Investigator</option>
                                <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                                <option value="Research Assistant">Research Assistant</option>
                                <option value="System Administrator">System Administrator</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Department</label>
                            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-zinc-900 dark:text-zinc-100">
                                <option value="Computer Science">Computer Science</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Data Science">Data Science</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Public Contact Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-zinc-900 dark:text-zinc-100" placeholder="e.g., researcher@aair.lab" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Biography (Markdown Supported)</label>
                        <textarea required rows={6} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-4 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-zinc-900 dark:text-zinc-100" placeholder="Describe your research interests..." />
                    </div>
                </div>

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-blue-600 text-white font-black tracking-widest uppercase rounded-xl hover:bg-blue-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 disabled:opacity-50 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isSubmitting ? "Transmitting to GitHub..." : "Submit Profile Update"}
                    </button>
                </div>
            </form>
        </div>
    );
}