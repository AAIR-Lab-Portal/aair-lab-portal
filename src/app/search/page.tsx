// src/app/search/page.tsx
import { getAllProjects, getAllNews, getAllPublications } from "@/lib/api";
import OmniSearchEngine from "@/components/OmniSearchEngine";
import { Search } from "lucide-react";

export type UnifiedResult = {
  id: string;
  title: string;
  contentType: "Project" | "News" | "Publication";
  date: string;
  excerpt: string;
  url: string;
  authorOrStatus: string;
  tags: string[];
};

export default async function GlobalSearchPage() {
  const [projects, news, publications] = await Promise.all([
    getAllProjects(),
    getAllNews(),
    getAllPublications(),
  ]);

  // Schema Normalization with Defensive Fallbacks (|| "")
  const searchIndex: UnifiedResult[] = [
    ...projects.map((p) => ({
      id: `proj-${p.slug}`,
      title: p.title,
      contentType: "Project" as const,
      date: p.date || "", // DEFENSIVE FALLBACK
      excerpt: p.excerpt || "No description provided.",
      url: `/projects/${p.slug}`,
      authorOrStatus: p.status || "Unknown Status",
      tags: [], 
    })),
    ...news.map((n) => ({
      id: `news-${n.slug}`,
      title: n.title,
      contentType: "News" as const,
      date: n.date || "", // DEFENSIVE FALLBACK
      excerpt: n.excerpt || "No excerpt provided.",
      url: `/news/${n.slug}`,
      authorOrStatus: n.author || "AAIR Lab",
      tags: [],
    })),
    ...publications.map((p) => ({
      id: `pub-${p.slug}`,
      title: p.title,
      contentType: "Publication" as const,
      date: p.date || "", // DEFENSIVE FALLBACK
      excerpt: p.abstract || "No abstract provided.",
      url: `/publications/${p.slug}`,
      authorOrStatus: p.authors || "Unknown Authors",
      tags: p.tags || [],
    })),
  ];

  // Sort chronologically. If a date is missing, fallback to the Unix epoch start so it safely drops to the bottom.
  searchIndex.sort((a, b) => (new Date(b.date || "1970-01-01").getTime() - new Date(a.date || "1970-01-01").getTime()));

  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl shrink-0">
          <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter mb-2">
            Search
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">
            Query {searchIndex.length} indexed records across research, news, and publications.
          </p>
        </div>
      </header>

      <OmniSearchEngine initialData={searchIndex} />
    </div>
  );
}