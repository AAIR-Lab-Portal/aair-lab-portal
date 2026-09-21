// src/components/ContactCard.tsx
"use client";

import { useState } from "react";
import { Users, Mail, MessageSquare, Phone, X } from "lucide-react";

export default function ContactCard() {
    const [activeContact, setActiveContact] = useState<{ role: string, name: string, email: string, slack: string, phone: string } | null>(null);

    const contacts = [
        { role: "Lab Director", name: "Le Lam Son", email: "director@aair.lab", slack: "@lamson", phone: "+84 28 3822 9382" },
        { role: "Lab Manager", name: "Mai Tan Ha", email: "manager@aair.lab", slack: "@tanha", phone: "+84 28 3822 9383" },
        { role: "Web Developer", name: "Ngo Minh Chau", email: "web@aair.lab", slack: "@minhchau", phone: "+84 28 3822 9384" },
    ];

    return (
        <>
            <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 border-t-4 border-t-indigo-500 rounded-2xl p-6 shadow-sm hover:scale-[1.02] hover:shadow-md transition-all">
                <div className="flex flex-col mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">3. Contacts</h3>
                </div>

                <div className="flex flex-col space-y-2">
                    {contacts.map(c => (
                        <button
                            key={c.role}
                            onClick={() => setActiveContact(c)}
                            className="w-full text-left flex flex-col p-2 -ml-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500 transition-colors mb-0.5">
                                {c.role}
                            </span>
                            <span className="text-sm font-black text-zinc-900 dark:text-zinc-200 group-hover:text-indigo-400 transition-colors">
                                {c.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Absolute Overlay Modal */}
            {activeContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setActiveContact(null)} className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 text-lg font-black shadow-inner">
                            {activeContact.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{activeContact.name}</h3>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-6">{activeContact.role}</p>

                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <a href={`mailto:${activeContact.email}`} className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Mail className="w-4 h-4" /> {activeContact.email}
                            </a>
                            <a href={`tel:${activeContact.phone}`} className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Phone className="w-4 h-4" /> {activeContact.phone}
                            </a>
                            <div className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                <MessageSquare className="w-4 h-4" /> AAIR Slack: {activeContact.slack}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}