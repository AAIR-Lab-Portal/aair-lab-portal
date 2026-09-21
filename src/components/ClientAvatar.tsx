// src/components/ClientAvatar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
    src?: string;
    alt: string;
    fallbackSize?: number;
}

export default function ClientAvatar({ src, alt, fallbackSize = 40 }: Props) {
    const [error, setError] = useState(false);
    const hasValidImage = src && src.trim() !== "" && !error;

    if (hasValidImage) {
        return (
            <Image
                src={src as string}
                alt={alt}
                fill
                className="object-cover"
                onError={() => setError(true)}
            />
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
            <Image
                src="/aair-lab-logo.svg"
                alt="AAIR Lab"
                width={fallbackSize}
                height={fallbackSize}
                className="object-contain"
            />
        </div>
    );
}