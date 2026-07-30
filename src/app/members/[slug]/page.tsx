// src/app/members/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllMembers, Member } from "@/lib/api";
import Image from "next/image"; // Import the Next.js Image component

export async function generateStaticParams() {
    const members = await getAllMembers();
    return members.map((m) => ({ slug: m.slug }));
}

export default async function MemberProfile({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const member = (await getMarkdownData("_members", resolvedParams.slug)) as Member;

    return (
        <article className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 max-w-4xl mx-auto">

            {/* --- The Side-by-Side Header --- */}
            <header className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-10 flex flex-col md:flex-row items-center md:items-start gap-8">

                {/* Profile Picture */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-md">
                    {member.image ? (
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-5xl font-bold text-white">
                            {member.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Text Metadata */}
                <div className="text-center md:text-left flex-grow">
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-2">
                        {member.name}
                    </h1>
                    <p className="text-xl font-medium text-blue-600 dark:text-blue-400 mb-4">
                        {member.role}
                    </p>
                    <div className="text-zinc-500 dark:text-zinc-400 text-sm flex flex-col sm:flex-row justify-center md:justify-start gap-2 sm:gap-4">
                        <span>{member.department}</span>
                        <span className="hidden sm:inline">•</span>
                        <a href={`mailto:${member.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {member.email}
                        </a>
                    </div>
                </div>

            </header>

            {/* --- The Markdown Biography --- */}
            <div
                className="prose prose-zinc dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none"
                dangerouslySetInnerHTML={{ __html: member.contentHtml }}
            />

        </article>
    );
}