// src/app/members/page.tsx
import { getAllMembers } from "@/lib/api";
import MemberCard from "@/components/MemberCard";

export default async function MembersIndex() {
    const allMembers = await getAllMembers();

    // The Filtering Engine: Now based dynamically on the 'role' field
    const principalInvestigator = allMembers.filter(m =>
        m.role.toLowerCase().includes("principal investigator") ||
        m.role.toLowerCase().includes("director")
    );

    const labManager = allMembers.filter(m =>
        m.role.toLowerCase().includes("manager") ||
        m.role.toLowerCase().includes("co-pi")
    );

    // Everyone else who wasn't caught by the first two filters
    const researchers = allMembers.filter(m =>
        !principalInvestigator.includes(m) && !labManager.includes(m)
    );

    return (
        <div className="max-w-6xl mx-auto space-y-16">

            <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    Our Team
                </h1>
            </header>

            {/* Tier 1: Principal Investigator */}
            {principalInvestigator.length > 0 && (
                <section>
                    <h2 className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 inline-block">
                        Principal Investigator
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {principalInvestigator.map(m => <MemberCard key={m.slug} {...m} />)}
                    </div>
                </section>
            )}

            {/* Tier 2: Lab Management */}
            {labManager.length > 0 && (
                <section>
                    <h2 className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 inline-block">
                        Lab Management
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {labManager.map(m => <MemberCard key={m.slug} {...m} />)}
                    </div>
                </section>
            )}

            {/* Tier 3: Researchers */}
            {researchers.length > 0 && (
                <section>
                    <h2 className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 inline-block">
                        Researchers & Members
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {researchers.map(m => <MemberCard key={m.slug} {...m} />)}
                    </div>
                </section>
            )}

        </div>
    );
}