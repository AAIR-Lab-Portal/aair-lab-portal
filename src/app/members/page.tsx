// src/app/members/page.tsx
import { getAllMembers } from "@/lib/api";
import MemberCard from "@/components/MemberCard";
import ExecutiveMemberCard from "@/components/ExecutiveMemberCard";

export default async function MembersIndex() {
    const allMembers = await getAllMembers();

    const principalInvestigator = allMembers.filter(m =>
        m.role.toLowerCase().includes("principal investigator") ||
        m.role.toLowerCase().includes("director")
    );

    const labManager = allMembers.filter(m =>
        m.role.toLowerCase().includes("manager") ||
        m.role.toLowerCase().includes("co-pi")
    );

    // Filter out leadership, then mathematically sort remaining members by ID
    const researchers = allMembers
        .filter(m => !principalInvestigator.includes(m) && !labManager.includes(m))
        .sort((a, b) => (Number(a.id) || 999) - (Number(b.id) || 999));

    return (
        <div className="max-w-6xl mx-auto space-y-12">

            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h1 className="text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    Our Team
                </h1>
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-[700px] leading-relaxed">
                    The community of researchers, students, and engineers collaborating on our lab’s artificial intelligence initiatives.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {principalInvestigator.length > 0 && (
                    <section className="flex flex-col h-full">
                        <h2 className="w-fit text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 inline-block">
                            Principal Investigator
                        </h2>
                        <div className="flex flex-col gap-6">
                            {/* OVERRIDE: Convert ID to string */}
                            {principalInvestigator.map(m => (
                                <ExecutiveMemberCard key={m.slug} {...m} id={m.id ? String(m.id) : undefined} />
                            ))}
                        </div>
                    </section>
                )}

                {labManager.length > 0 && (
                    <section className="flex flex-col h-full">
                        <h2 className="w-fit text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 inline-block">
                            Lab Manager
                        </h2>
                        <div className="flex flex-col gap-6">
                            {/* OVERRIDE: Convert ID to string */}
                            {labManager.map(m => (
                                <ExecutiveMemberCard key={m.slug} {...m} id={m.id ? String(m.id) : undefined} />
                            ))}
                        </div>
                    </section>
                )}

            </div>

            {researchers.length > 0 && (
                <section>
                    <h2 className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 inline-block">
                        Researchers & Members
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {/* OVERRIDE: Convert ID to string (using fallback for MemberCard) */}
                        {researchers.map(m => (
                            <MemberCard key={m.slug} {...m} id={m.id ? String(m.id) : ""} />
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}