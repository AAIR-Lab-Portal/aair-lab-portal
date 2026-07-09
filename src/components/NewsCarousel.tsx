// src/components/NewsCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Next.js Image Optimizer

interface NewsItem {
    slug: string;
    title: string;
    date: string;
    image: string; // Add image to the props contract
}

export default function NewsCarousel({ news }: { news: NewsItem[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (news.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 6000); // Increased to 6 seconds for better reading time
        return () => clearInterval(timer);
    }, [news.length]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % news.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1));

    if (news.length === 0) return null;

    return (
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg group">

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition z-20 opacity-0 group-hover:opacity-100"
                aria-label="Previous news"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition z-20 opacity-0 group-hover:opacity-100"
                aria-label="Next news"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* The Animated Image & Content Window */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* 1. The Background Image */}
                    <Image
                        src={news[currentIndex].image}
                        alt={news[currentIndex].title}
                        fill
                        className="object-cover"
                        priority // Tells Next.js to load this image instantly
                    />

                    {/* 2. The Dark Overlay (Ensures text is always readable) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/60 to-transparent" />

                    {/* 3. The Text Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10 text-center md:text-left">
                        <span className="text-sm font-bold tracking-wider text-blue-400 uppercase mb-3">
                            Lab Update • {news[currentIndex].date}
                        </span>
                        <Link href={`/news/${news[currentIndex].slug}`} className="block">
                            <h3 className="text-2xl md:text-4xl font-extrabold text-white hover:text-blue-300 transition-colors max-w-3xl">
                                {news[currentIndex].title}
                            </h3>
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {news.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentIndex ? "bg-blue-500" : "bg-white/40 hover:bg-white/70"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}