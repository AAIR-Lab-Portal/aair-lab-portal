// src/components/MemberCard.tsx
import Link from "next/link";
import ClientAvatar from "./ClientAvatar";

interface Props {
    slug: string;
    name: string;
    role: string;
    department: string;
    image?: string;
    id: string;
}

export default function MemberCard({ slug, name, role, department, image, id }: Props) {
    return (
        <Link href={`/members/${slug}`} className="group block h-full w-full">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 text-center flex flex-col items-center h-full">

                <div className="relative w-24 h-24 mb-5 rounded-full overflow-hidden border-4 border-zinc-50 dark:border-zinc-800 group-hover:border-blue-100 dark:group-hover:border-blue-900/30 transition-colors shadow-sm">
                    {/* Size Doubled from 48 to 96 */}
                    <ClientAvatar src={image} alt={name} fallbackSize={96} />
                </div>

                {id && (
                    <div className="text-[10px] font-black tracking-widest uppercase bg-indigo-100 text-indigo-600 dark:bg-zinc-800 dark:text-zinc-400 px-2.5 py-1 rounded-md mb-3">
                        ID: {id}
                    </div>
                )}

                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {name}
                </h3>
                <p className="mt-2 font-medium text-blue-600 dark:text-blue-400 text-sm">{role}</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{department}</p>

            </div>
        </Link>
    );
}