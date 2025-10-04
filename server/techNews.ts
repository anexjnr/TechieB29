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

async function fetchOpenGraphImage(targetUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FusionBot/1.0; +https://example.com/bot)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const html = await res.text();
    const rel = (name: string) => new RegExp(`<meta[^>]+property=[\"']${name}[\"'][^>]+content=[\"']([^\"']+)[\"']`, "i").exec(html)?.[1] ||
      new RegExp(`<meta[^>]+name=[\"']${name}[\"'][^>]+content=[\"']([^\"']+)[\"']`, "i").exec(html)?.[1];
    const candidates = [
      rel("og:image:secure_url"),
      rel("og:image"),
      rel("twitter:image"),
    ].filter(Boolean) as string[];
    let img = candidates[0] || null;
    const base = new URL(targetUrl);
    if (img && img.startsWith("//")) {
      img = `${base.protocol}${img}`;
    } else if (img && img.startsWith("/")) {
      img = `${base.origin}${img}`;
    }
    if (!img) {
      img = `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(base.origin)}`;
    }
    return img || null;
  } catch {
    try {
      const base = new URL(targetUrl);
      return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(base.origin)}`;
    } catch {
      return null;
    }
  }
}

export async function refreshTechNews() {
  const items = await fetchAllSources();
  if (!items.length) return;
  for (const n of items) {
    try {
      // find existing
      const existing = await prisma.techNews.findUnique({ where: { url: n.url } });
      let imageUrl = existing?.imageUrl || n.imageUrl || null;
      if (!imageUrl) {
        imageUrl = await fetchOpenGraphImage(n.url);
      }

      await prisma.techNews.upsert({
        where: { url: n.url },
        create: {
          title: n.title,
          excerpt: n.excerpt || null,
          url: n.url,
          imageUrl: imageUrl || null,
          publishedAt: n.publishedAt,
        },
        update: {
          title: n.title,
          excerpt: n.excerpt || null,
          imageUrl: imageUrl || null,
          publishedAt: n.publishedAt,
          updatedAt: new Date(),
        },
      });
    } catch (e) {
      // ignore individual upsert failures
    }
  }

  try {
    const all = await prisma.techNews.findMany({ orderBy: { publishedAt: "desc" } });
    if (all.length > 6) {
      const toDelete = all.slice(6).map((x) => x.id);
      if (toDelete.length) await prisma.techNews.deleteMany({ where: { id: { in: toDelete } } });
    }
  } catch {}
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
