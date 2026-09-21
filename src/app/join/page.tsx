// src/app/join/page.tsx
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function JoinPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-12 py-8">

            {/* 1. Page Header */}
            <header className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    Join the AAIR Lab
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
                    We are looking for driven researchers, developers, and students passionate about the edge of artificial intelligence.
                </p>
            </header>

            {/* 2. Application Instructions */}
            <section className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-3 tracking-tight">
                    <Mail className="w-6 h-6 text-blue-600" />
                    How to Apply
                </h2>

                <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
                    <p className="font-medium leading-relaxed mb-2">
                        To apply for a research position or student thesis supervision, please send an email to our lab management team: <br></br>
                    </p>
                    <ul className="space-y-1 pl-1 font-medium">
                        <li className="flex items-center gap-2">
                            <span className="text-zinc-400 dark:text-zinc-600">•</span>
                            <span>
                                <strong className="font-bold text-zinc-900 dark:text-zinc-100">Prof. Son</strong> -{" "}
                                <a href="mailto:son.ll@vgu.edu.vn" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    son.ll@vgu.edu.vn
                                </a>
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-zinc-400 dark:text-zinc-600">•</span>
                            <span>
                                <strong className="font-bold text-zinc-900 dark:text-zinc-100">Mr. Ha</strong> -{" "}
                                <a href="mailto:maitanhaksdtvt6@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    maitanhaksdtvt6@gmail.com
                                </a>
                            </span>
                        </li>
                    </ul>

                    <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <h3 className="font-bold mb-3 tracking-tight">Please include the following in your email:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm md:text-base marker:text-blue-500 font-medium leading-relaxed">
                            <li>A brief introduction about yourself and your academic background.</li>
                            <li>Your CV or Resume (PDF format).</li>
                            <li>A short paragraph detailing which of our active research fields interests you the most.</li>
                            <li>Links to any previous projects, GitHub repositories, or publications.</li>
                        </ul>
                    </div>

                    <a
                        href="mailto:admin@vgu.edu.vn?subject=Application to Join AAIR Lab"
                        className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-lg font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        Compose an Email <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>

            {/* 3. Existing Members Gateway */}
            <section className="text-center pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-2 block">
                    Internal Access
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">
                    Already a member?
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm font-medium leading-relaxed max-w-md mx-auto">
                    Access the internal lab dashboard, GPU cluster credentials, and shared datasets.
                </p>
                <Link
                    href="/vault"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                    <ShieldCheck className="w-5 h-5" />
                    Access Internal Vault
                </Link>
            </section>

        </div>
    );
}