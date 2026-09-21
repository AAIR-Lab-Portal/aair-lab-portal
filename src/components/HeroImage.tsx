// src/components/HeroImage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, Camera } from "lucide-react";

interface Props {
    src: string;
    alt: string;
    caption?: string;
    className?: string;
}

export default function HeroImage({ src, alt, caption, className = "" }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <figure className={`group cursor-zoom-in relative flex flex-col ${className}`} onClick={() => setIsOpen(true)}>
                <div className="w-full h-full relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl group-hover:ring-4 ring-blue-500/20 transition-all bg-zinc-50 dark:bg-zinc-900">
                    <Image src={src} alt={alt} fill className="object-cover" priority />
                </div>

                {caption && (
                    <figcaption className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/20 shadow-lg flex items-center gap-2 max-w-[80%] transition-opacity opacity-90 group-hover:opacity-100">
                        <Camera className="w-3.5 h-3.5 shrink-0 text-zinc-300" />
                        <span className="truncate">{caption}</span>
                    </figcaption>
                )}
            </figure>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-200 cursor-zoom-out"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <img
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/70 backdrop-blur-xl text-white font-bold rounded-full border border-white/20 pointer-events-none shadow-2xl flex items-center gap-2 max-w-[90vw] truncate">
                        <ZoomIn className="w-4 h-4 shrink-0 text-zinc-400" />
                        <span className="truncate">{caption || alt}</span>
                    </div>
                </div>
            )}
        </>
    );
}