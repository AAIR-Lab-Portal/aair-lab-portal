// src/components/TextToSpeech.tsx
"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";

export default function TextToSpeech({ title, htmlContent }: { title: string, htmlContent: string }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined" && !window.speechSynthesis) {
            setSupported(false);
        }

        // Cleanup when component unmounts
        return () => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handlePlay = () => {
        if (!supported) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
            return;
        }

        // Strip HTML tags to get raw readable text
        const plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
        const fullText = `${title}. ${plainText}`;

        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsSpeaking(false);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    if (!supported) return null;

    return (
        <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl w-max shadow-sm mb-8">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 pl-2 pr-4 border-r border-zinc-200 dark:border-zinc-800">
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Audio Article</span>
            </div>

            <div className="flex items-center gap-2">
                {!isSpeaking ? (
                    <button onClick={handlePlay} className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Play className="w-4 h-4 ml-0.5" />
                    </button>
                ) : (
                    <button onClick={handlePause} className="w-8 h-8 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
                        <Pause className="w-4 h-4" />
                    </button>
                )}

                {(isSpeaking || isPaused) && (
                    <button onClick={handleStop} className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                        <Square className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}