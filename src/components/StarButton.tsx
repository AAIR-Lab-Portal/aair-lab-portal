// src/components/StarButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export default function StarButton({ slug }: { slug: string }) {
    const [isStarred, setIsStarred] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Read initial state from the browser
    useEffect(() => {
        setMounted(true);
        const stars = JSON.parse(localStorage.getItem("aair_stars") || "[]");
        if (stars.includes(slug)) setIsStarred(true);

        // Listen for changes from other tabs/components
        const handleStorageChange = () => {
            const updatedStars = JSON.parse(localStorage.getItem("aair_stars") || "[]");
            setIsStarred(updatedStars.includes(slug));
        };
        window.addEventListener("starsUpdated", handleStorageChange);
        return () => window.removeEventListener("starsUpdated", handleStorageChange);
    }, [slug]);

    const toggleStar = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the document when clicking the star
        e.stopPropagation();

        const stars = JSON.parse(localStorage.getItem("aair_stars") || "[]");

        if (isStarred) {
            const newStars = stars.filter((s: string) => s !== slug);
            localStorage.setItem("aair_stars", JSON.stringify(newStars));
            setIsStarred(false);
        } else {
            stars.push(slug);
            localStorage.setItem("aair_stars", JSON.stringify(stars));
            setIsStarred(true);
        }

        // Broadcast the update so the Directory catches it instantly
        window.dispatchEvent(new Event("starsUpdated"));
    };

    // Prevent hydration mismatch by rendering a skeleton until mounted
    if (!mounted) return <div className="w-8 h-8 rounded-md" />;

    return (
        <button
            onClick={toggleStar}
            className={`p-2 rounded-md transition-colors group/star ${isStarred ? "bg-yellow-500/10 hover:bg-yellow-500/20" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
        >
            <Star className={`w-4 h-4 transition-all ${isStarred ? "fill-yellow-500 text-yellow-500" : "text-zinc-400 group-hover/star:text-yellow-500"
                }`} />
        </button>
    );
}