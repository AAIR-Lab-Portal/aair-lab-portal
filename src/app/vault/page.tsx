// src/app/vault/page.tsx
import { Terminal, Video } from "lucide-react";

export default function VaultDashboard() {
    return (
        <div className="space-y-12">

            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    System Overview
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 font-medium">
                    Internal documentation, cluster guides, and shared laboratory resources.
                </p>
            </header>

            {/* GPU Cluster SSH Guide */}
            <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-zinc-100 dark:bg-zinc-950 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    <h2 className="font-black text-zinc-900 dark:text-zinc-100 tracking-tight">GPU Cluster Access (NVIDIA A100)</h2>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        The lab cluster is currently operating behind the university VPN. Ensure you have the Cisco AnyConnect client running before attempting the SSH handshake.
                    </p>
                    <div className="bg-zinc-900 text-zinc-300 p-4 rounded-xl font-mono text-sm overflow-x-auto shadow-inner">
                        <p className="text-zinc-500 mb-2"># 1. Initiate secure shell connection</p>
                        <p className="mb-4 text-emerald-400">ssh [your_id]@cluster.aair.vgu.edu.vn -p 2202</p>

                        <p className="text-zinc-500 mb-2"># 2. Activate specific conda environments</p>
                        <p className="text-emerald-400">conda activate tf_imbalance_env</p>
                    </div>
                </div>
            </section>

            {/* Technical Lectures Index */}
            <section>
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-6 flex items-center gap-2">
                    <Video className="w-5 h-5 text-blue-600" />
                    Recorded Technical Lectures
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    {[
                        { title: "VLM Attention Mechanisms", date: "2026-06-10", desc: "Breakdown of cross-attention layers in vision-language models and hardware optimization." },
                        { title: "Synthetic Data Augmentation", date: "2026-05-22", desc: "Workshop on utilizing GANs for upsampling minority classes in highly imbalanced datasets." }
                    ].map((lecture, idx) => (
                        <div key={idx} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer group">
                            <div className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-2">
                                {lecture.date}
                            </div>
                            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {lecture.title}
                            </h3>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {lecture.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}