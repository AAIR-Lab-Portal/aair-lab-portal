// src/app/members/[slug]/page.tsx
import { getMarkdownData } from "@/lib/markdown";
import { getAllMembers } from "@/lib/api";
import ClientAvatar from "@/components/ClientAvatar";

export async function generateStaticParams() {
    const members = await getAllMembers();
    return members.map((m) => ({ slug: m.slug }));
}

export default async function MemberProfile({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const member = (await getMarkdownData("_members", resolvedParams.slug)) as any;

    if (!member) return null;

    // Filter out standard system keys to isolate custom user metadata
    const standardKeys = ["slug", "contentHtml", "name", "role", "image", "id", "department", "email", "toc"];
    const customMetadata = Object.entries(member).filter(([key, value]) =>
        !standardKeys.includes(key) && typeof value === "string"
    );

    return (
        <article className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 max-w-4xl mx-auto">
            <header className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-10 flex flex-col md:flex-row items-center md:items-start gap-8">

                <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-md">
                    <ClientAvatar src={member.image} alt={member.name} fallbackSize={160} />
                </div>

                <div className="text-center md:text-left flex-grow">
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-2">
                        {member.name}
                    </h1>
                    <p className="text-xl font-medium text-blue-600 dark:text-blue-400 mb-6">
                        {member.role}
                    </p>

                    {/* Standard Required Metadata */}
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-6">
                        {member.id && (
                            <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 px-3 py-1.5 rounded-md">
                                ID: {member.id}
                            </span>
                        )}
                        {member.department && (
                            <span className="text-xs font-bold tracking-widest uppercase text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700">
                                {member.department}
                            </span>
                        )}
                        {member.email && (
                            <a href={`mailto:${member.email}`} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline px-2">
                                {member.email}
                            </a>
                        )}
                    </div>

                    {/* Flexible/Custom Metadata rendering */}
                    {customMetadata.length > 0 && (
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                            {customMetadata.map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                        {key.replace(/_/g, " ")}:
                                    </span>
                                    {/* If the value looks like a URL, make it clickable */}
                                    {(value as string).startsWith("http") ? (
                                        <a href={value as string} target="_blank" rel="noreferrer" className="text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-blue-500 transition-colors">
                                            Link ↗
                                        </a>
                                    ) : (
                                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                            {value as string}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <div
                className="prose prose-zinc dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none"
                dangerouslySetInnerHTML={{ __html: member.contentHtml }}
            />
        </article>
    );
}