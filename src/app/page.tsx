// src/app/page.tsx
import { getAllPublications, getAllNews } from "@/lib/api";
import AnimatedHero from "@/components/AnimatedHero";
import NewsCarousel from "@/components/NewsCarousel";
import { FileText } from "lucide-react";
import Link from "next/link"; // <-- This was the missing piece causing the errors

export default async function HomePage() {
  // Fetch data in parallel for maximum speed
  const [allPublications, allNews] = await Promise.all([
    getAllPublications(),
    getAllNews()
  ]);

  // Grab only the 2 most recent publications for the home page
  const recentPublications = allPublications.slice(0, 2);

  // Grab up to 5 of the most recent news items for the carousel
  const recentNews = allNews.slice(0, 5);

  return (
    <div className="space-y-24">

      {/* 1. The Interactive Hero */}
      <AnimatedHero />

      {/* 2. The News Carousel Section */}
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-3xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Lab News</h2>
          <a href="/news" className="text-blue-600 dark:text-blue-400 hover:underline font-normal text-sm transition hover:font-bold uppercase tracking-widest mb-1">
            View All News →
          </a>
        </div>
        <NewsCarousel news={recentNews} />
      </section>

      {/* 3. The Latest Research Section */}
      <section className="pb-12">
        <div className="flex justify-between items-end mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-3xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Latest Research</h2>
          <a href="/publications" className="text-blue-600 dark:text-blue-400 hover:underline font-normal text-sm transition hover:font-bold uppercase tracking-widest mb-1">
            View All Publications →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recentPublications.map((pub) => {
            const year = (pub.date || "").split("-")[0];

            return (
              <Link href={`/publications/${pub.slug}`} key={pub.slug} className="block group">
                <article className="h-full p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm flex flex-col">

                  {/* Badge & Year */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                      <FileText className="w-3.5 h-3.5" />
                      Publication
                    </span>
                    {year && <span className="text-xs font-bold text-zinc-400 tracking-wider">{year}</span>}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-blue-600 dark:text-blue-400 group-hover:underline tracking-tight mb-2">
                    {pub.title}
                  </h3>

                  {/* Abstract Snippet (Pushes footer to the bottom) */}
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed line-clamp-2 mb-4 flex-grow">
                    {pub.abstract || "No abstract available."}
                  </p>

                  {/* Footer: Authors & Tags */}
                  <div className="text-xs font-bold text-zinc-500 mt-auto flex flex-wrap items-center gap-2">
                    <span>{pub.authors || "AAIR Lab"}</span>
                    {pub.tags && pub.tags.length > 0 && (
                      <>
                        <span className="text-zinc-300 dark:text-zinc-700">•</span>
                        <span className="uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                          {pub.tags.slice(0, 2).join(", ")}
                        </span>
                      </>
                    )}
                  </div>

                </article>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}