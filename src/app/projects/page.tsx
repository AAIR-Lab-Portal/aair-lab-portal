// src/app/projects/page.tsx
import { getAllProjects } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Network, Eye, Layers, BarChart } from "lucide-react";
import ActiveProjectsClient from "@/components/ActiveProjectsClient";

export default async function ProjectsIndex() {
    const allProjects = await getAllProjects();
    const activeProjects = allProjects.filter(p => p.status === "Active");

    const canvasIcons: Record<string, React.ElementType> = {
        "ML Foundation": Network,
        "Vision-Language Models": Eye,
        "Imbalanced Learning": BarChart,
        "Complementary Label Learning": Layers,
    };

    const researchFields = [
        { title: "Machine Learning Foundation", icon: Network, desc: "Developing core algorithmic architectures and mathematical proofs for next-generation learning models." },
        { title: "Vision-Language Models", icon: Eye, desc: "Bridging computer vision and natural language processing for multimodal reasoning systems." },
        { title: "Imbalanced Learning", icon: BarChart, desc: "Engineering robust pipelines to handle extreme data scarcity and class imbalance in real-world datasets." },
        { title: "Complementary Label Learning", icon: Layers, desc: "Advancing weak supervision techniques by learning from negative constraints rather than absolute ground truths." },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-20 py-4">

            {/* 1. Fields of Research */}
            <section>
                <header className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                        Research Canvas
                    </h1>
                </header>
                <div className="grid md:grid-cols-2 gap-6">
                    {researchFields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.title} className="p-8 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
                                    {field.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                                    {field.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 2. Recent Publications Highlight */}
            <section id="recent-publications" className="bg-blue-600 dark:bg-blue-700 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-black tracking-tighter mb-4">Peer-Reviewed Output</h2>
                    <p className="text-blue-100 font-medium leading-relaxed mb-6">
                        Our theoretical frameworks and applied systems are rigorously tested and regularly published in leading international conferences and journals.
                    </p>
                    <Link href="/publications" className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm">
                        Access Publications Archive →
                    </Link>
                </div>
            </section>

            {/* 3. Active Research Initiatives */}
            <ActiveProjectsClient projects={activeProjects} />

            {/* 4. Project Archive CTA */}
            <section className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-12 flex flex-col items-center text-center">
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
                    Looking for past research?
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 max-w-md leading-relaxed">
                    Access our comprehensive ledger of completed systems, inactive repositories, and historical lab data.
                </p>
                <Link
                    href="/projects/archive"
                    className="group flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-md hover:shadow-lg hover:font-extrabold"
                >
                    View Project Archive
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
            </section>

        </div>
    );
}