// src/app/page.tsx
import { getAllPublications, getAllNews, getAllMembers } from "@/lib/api";
import AnimatedHero from "@/components/AnimatedHero";
import NewsCarousel from "@/components/NewsCarousel";
import PublicationCard from "@/components/PublicationCard"; // <-- Import the newly recycled card
import Link from "next/link";

export default async function HomePage() {
  const [allPublications, allNews, allMembers] = await Promise.all([
    getAllPublications(),
    getAllNews(),
    getAllMembers()
  ]);

  const recentPublications = allPublications.slice(0, 2);
  const recentNews = allNews.slice(0, 5);

  return (
    <div className="space-y-24">
      <AnimatedHero />

      <section>
        <div className="flex justify-between items-end mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-3xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Lab News</h2>
          <a href="/news" className="text-blue-600 dark:text-blue-400 hover:underline font-normal text-sm transition hover:font-bold uppercase tracking-widest mb-1">
            View All News →
          </a>
        </div>
        <NewsCarousel news={recentNews} />
      </section>

      <section className="pb-12">
        <div className="flex justify-between items-end mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-3xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Latest Research</h2>
          <a href="/publications" className="text-blue-600 dark:text-blue-400 hover:underline font-normal text-sm transition hover:font-bold uppercase tracking-widest mb-1">
            View All Publications →
          </a>
        </div>

        {/* REFACTORED: The grid now cleanly maps the components */}
        <div className="grid gap-6 md:grid-cols-2">
          {recentPublications.map((pub) => (
            <PublicationCard key={pub.slug} pub={pub} members={allMembers}/>
          ))}
        </div>
      </section>
    </div>
  );
}