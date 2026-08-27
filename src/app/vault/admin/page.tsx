// src/app/vault/admin/page.tsx
import { ShieldAlert, KeyRound, UserPlus } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="space-y-10 max-w-3xl">

            <header className="border-b border-red-200 dark:border-red-900/30 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-500" />
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                        Access Control
                    </h1>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Provision credentials and manage vault access for lab personnel.
                </p>
            </header>

            <section className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-8 rounded-2xl">
                <h2 className="text-xl font-black text-red-900 dark:text-red-400 tracking-tight mb-6 flex items-center gap-2">
                    <UserPlus className="w-5 h-5" /> Generate Access Token
                </h2>

                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-widest text-red-800 dark:text-red-500">Member Email</label>
                            <input type="email" placeholder="new.member@vgu.edu.vn" className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-xl focus:ring-2 focus:ring-red-500/50 font-bold text-zinc-900 dark:text-zinc-100" />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-widest text-red-800 dark:text-red-500">Access Tier</label>
                            <select className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-xl focus:ring-2 focus:ring-red-500/50 font-bold text-zinc-900 dark:text-zinc-100 appearance-none">
                                <option>Standard Researcher</option>
                                <option>Lab Manager</option>
                                <option>Principal Investigator</option>
                            </select>
                        </div>
                    </div>

                    <button className="flex items-center justify-center w-full md:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-sm">
                        <KeyRound className="w-5 h-5" /> Issue Credentials
                    </button>
                </div>
            </section>

        </div>
    );
}