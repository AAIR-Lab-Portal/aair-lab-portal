// src/app/members/page.tsx
import { getAllMembers } from "@/lib/api";
import MemberCard from "@/components/MemberCard";

export default async function MembersIndex() {
    const members = await getAllMembers();

    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-white tracking-tight">
                Our Team
            </h1>
            {/* We use grid-cols-3 here because member cards are smaller */}
            <div className="grid gap-6 md:grid-cols-3">
                {members.map((member) => (
                    <MemberCard key={member.slug} {...member} />
                ))}
            </div>
        </div>
    );
}