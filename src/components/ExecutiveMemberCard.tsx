// src/components/ExecutiveMemberCard.tsx
import Link from "next/link";
import ClientAvatar from "./ClientAvatar";

interface Props {
    slug: string;
    name: string;
    role: string;
    department: string;
    image?: string;
    id?: string;
}

export default function ExecutiveMemberCard({ slug, name, role, department, image, id }: Props) {
    return (
        <Link href={`/members/${slug}`} className="group block w-full">
            <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8 h-full">

                {/* Massive Left-Aligned Avatar */}
                <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0 rounded-full overflow-hidden border-4 border-zinc-50 dark:border-zinc-800 group-hover:border-blue-100 dark:group-hover:border-blue-900/30 transition-colors shadow-md">
                    {/* Size Doubled from 64 to 128 */}
                    <ClientAvatar src={image} alt={name} fallbackSize={128} />
                </div>

                <div className="flex flex-col justify-center flex-grow py-2 md:py-4">
                    {id && (
                        <div className="mb-4">
                            <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1.5 rounded-md">
                                ID: {id}
                            </span>
                        </div>
                    )}

                    <h3 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 tracking-tight">
                        {name}
                    </h3>
                    <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{role}</p>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{department}</p>
                </div>

            </div>
        </Link>
    );
}