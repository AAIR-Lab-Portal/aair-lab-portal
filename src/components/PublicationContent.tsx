// src/components/PublicationContent.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";

export default function PublicationContent({ html }: { html: string }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [lightboxImg, setLightboxImg] = useState<{ src: string, alt: string } | null>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        // 1. Process Collapsible Headings
        const headings = contentRef.current.querySelectorAll("h2, h3");
        headings.forEach((heading, index) => {
            if (heading.hasAttribute("data-ribbon")) return;
            heading.setAttribute("data-ribbon", "true");

            const isH2 = heading.tagName === "H2";

            const topMargin = index === 0;

            heading.className = `group flex justify-between items-center cursor-pointer transition-colors scroll-mt-[120px] mb-6 pb-3 ${isH2
                ? "border-b-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "border-b border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 ml-0 md:ml-4"
                } ${topMargin ? "mt-0" : "mt-12"}`;

            const titleSpan = document.createElement("span");
            titleSpan.innerHTML = heading.innerHTML;
            titleSpan.className = "flex-grow group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors";
            heading.innerHTML = "";
            heading.appendChild(titleSpan);

            const btn = document.createElement("div");
            btn.className = "shrink-0 ml-4 w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors shadow-sm group-hover:border-blue-500 group-hover:text-blue-600 dark:group-hover:border-blue-400 dark:group-hover:text-blue-400";
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`;
            heading.appendChild(btn);

            let isCollapsed = false;
            heading.addEventListener("click", () => {
                isCollapsed = !isCollapsed;
                btn.innerHTML = isCollapsed
                    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`
                    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`;

                let current = heading.nextElementSibling;
                while (current) {
                    if (isH2 && current.tagName === "H2") break;
                    if (!isH2 && (current.tagName === "H2" || current.tagName === "H3")) break;
                    if (isCollapsed) current.classList.add("hidden");
                    else current.classList.remove("hidden");
                    current = current.nextElementSibling;
                }
            });
        });

        // 2. Process Interactive Images & Captions
        const images = contentRef.current.querySelectorAll("img");
        images.forEach((img) => {
            if (img.parentElement?.tagName.toLowerCase() === "figure") return; // Prevent loop duplication

            const altText = img.getAttribute("alt") || "Figure documentation";
            const src = img.getAttribute("src") || "";

            const figure = document.createElement("figure");
            figure.className = "my-12 flex flex-col items-center justify-center group cursor-zoom-in w-full";

            const newImg = img.cloneNode(true) as HTMLImageElement;
            newImg.className = "rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:ring-4 ring-blue-500/20 transition-all max-h-[600px] object-contain bg-zinc-50 dark:bg-zinc-900 w-full";

            newImg.addEventListener("click", () => setLightboxImg({ src, alt: altText }));

            const caption = document.createElement("figcaption");
            caption.className = "mt-1.5 px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700/50 flex items-center gap-3 max-w-2xl text-left leading-snug";
            caption.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-zinc-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg> <span>${altText}</span>`;

            img.parentNode?.insertBefore(figure, img);
            figure.appendChild(newImg);
            figure.appendChild(caption);
            img.remove();
        });

    }, [html]);

    return (
        <>
            <div
                ref={contentRef}
                className="prose prose-zinc dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none leading-relaxed prose-headings:font-black"
                dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Absolute Full-Screen Lightbox Modal */}
            {lightboxImg && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-200 cursor-zoom-out"
                    onClick={() => setLightboxImg(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                        onClick={() => setLightboxImg(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <img
                        src={lightboxImg.src}
                        alt={lightboxImg.alt}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/70 backdrop-blur-xl text-white font-bold rounded-full border border-white/20 pointer-events-none shadow-2xl flex items-center gap-2 max-w-[90vw] truncate">
                        <ZoomIn className="w-4 h-4 shrink-0 text-zinc-400" />
                        <span className="truncate">{lightboxImg.alt}</span>
                    </div>
                </div>
            )}
        </>
    );
}