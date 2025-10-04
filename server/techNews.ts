import { prisma } from "./prisma";

export type TechNewsItem = {
  title: string;
  excerpt?: string | null;
  url: string;
  imageUrl?: string | null;
  publishedAt: Date;
};

async function fetchFromHackerNews(): Promise<TechNewsItem[]> {
  try {
    const endpoint =
      "https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=20&query=technology";
    const res = await fetch(endpoint, { headers: { "User-Agent": "fusion-starter/technews" } });
    if (!res.ok) return [];
    const data = await res.json();
    const hits: any[] = Array.isArray(data?.hits) ? data.hits : [];
    return hits
      .map((h) => {
        const title: string = h.title || h.story_title || "";
        const url: string = h.url || h.story_url || "";
        const publishedAt: Date = h.created_at ? new Date(h.created_at) : new Date();
        const excerpt: string | null = h._highlightResult?.title?.value
          ? String(h._highlightResult.title.value).replace(/<[^>]+>/g, "")
          : null;
        return title && url
          ? ({ title, url, publishedAt, excerpt, imageUrl: null } as TechNewsItem)
          : null;
      })
      .filter(Boolean) as TechNewsItem[];
  } catch {
    return [];
  }
}

async function fetchAllSources(): Promise<TechNewsItem[]> {
  const lists = await Promise.all([fetchFromHackerNews()]);
  const all = lists.flat();
  // de-duplicate by url
  const seen = new Set<string>();
  const unique: TechNewsItem[] = [];
  for (const item of all) {
    if (!item.url || seen.has(item.url)) continue;
    seen.add(item.url);
    unique.push(item);
  }
  // Sort by publishedAt desc and keep top 12 for processing
  unique.sort((a, b) => +b.publishedAt - +a.publishedAt);
  return unique.slice(0, 12);
}

export async function refreshTechNews() {
  const items = await fetchAllSources();
  if (!items.length) return;
  // Upsert by url
  for (const n of items) {
    try {
      await prisma.techNews.upsert({
        where: { url: n.url },
        create: {
          title: n.title,
          excerpt: n.excerpt || null,
          url: n.url,
          imageUrl: n.imageUrl || null,
          publishedAt: n.publishedAt,
        },
        update: {
          title: n.title,
          excerpt: n.excerpt || null,
          imageUrl: n.imageUrl || null,
          publishedAt: n.publishedAt,
          updatedAt: new Date(),
        },
      });
    } catch (e) {
      // ignore individual upsert failures
    }
  }

  // Keep max 6 rows, delete older ones
  try {
    const all = await prisma.techNews.findMany({
      orderBy: { publishedAt: "desc" },
    });
    if (all.length > 6) {
      const toDelete = all.slice(6).map((x) => x.id);
      if (toDelete.length) {
        await prisma.techNews.deleteMany({ where: { id: { in: toDelete } } });
      }
    }
  } catch {
    // ignore cleanup errors
  }
}

let started = false;
export function startTechNewsScheduler() {
  if (started) return;
  started = true;
  // run on server start
  refreshTechNews().catch(() => void 0);
  // every 24h
  const DAY_MS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    refreshTechNews().catch(() => void 0);
  }, DAY_MS).unref?.();
}
