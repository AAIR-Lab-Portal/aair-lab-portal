// src/components/AnimatedHero.tsx
"use client"; // CRITICAL: This allows the animation library to run in the browser

import { motion } from "framer-motion";

export default function AnimatedHero() {
    return (
        <section className="py-20 text-center flex flex-col items-center">

            {/* motion.h1 acts just like an h1, but allows animation instructions */}
            <motion.h1
                className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter mb-6"
                initial={{ opacity: 0, y: 20 }} // Start invisible and 20px lower
                animate={{ opacity: 1, y: 0 }}  // Animate to full visibility and original position
                transition={{ duration: 0.6, ease: "easeOut" }} // Take 0.6 seconds
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-teal-500">Advanced AI Research</span>
            </motion.h1>

            <motion.p
                className="text-xl text-slate-600 max-w-2xl mb-10 dark:text-zinc-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }} // Delay it so it fades in AFTER the title
            >
                Pioneering solutions in Retrieval-Augmented Generation (RAG), imbalanced learning,
                data augmentation, and auto-labeling to build resilient, high-performance AI systems.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <a href="/projects" className="bg-slate-900 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-colors duration-300 shadow-lg dark:bg-slate-300 dark:text-slate-800">
                    Explore Our Projects
                </a>
            </motion.div>

        </section>
    );
}