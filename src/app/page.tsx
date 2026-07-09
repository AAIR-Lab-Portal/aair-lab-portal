// src/app/page.tsx
import { getAllPublications, getAllNews } from "@/lib/api";
import PublicationCard from "@/components/PublicationCard";
import AnimatedHero from "@/components/AnimatedHero";
import NewsCarousel from "@/components/NewsCarousel";

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
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">Lab News</h2>
          <a href="/news" className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
            View All News →
          </a>
        </div>
        <NewsCarousel news={recentNews} />
      </section>

      {/* 3. The Latest Research Section */}
      <section className="pb-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">Latest Research</h2>
          <a href="/publications" className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
            View All Publications →
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {recentPublications.map((paper) => (
            <PublicationCard
              key={paper.slug}
              {...paper}
            />
          ))}
        </div>
      </section>

    </div>
  );
}