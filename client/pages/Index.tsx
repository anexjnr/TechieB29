import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Cpu, Globe, Quote, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";
import TiltCard from "@/components/site/TiltCard";
import LoadingScreen from "@/components/site/LoadingScreen";
import FlowGrid from "@/components/site/FlowGrid";
import { getIconByName } from "@/lib/iconMap";

type SectionPayload = {
  id?: string;
  key: string;
  heading?: string | null;
  subheading?: string | null;
  content?: string | null;
  data?: any;
  image?: string | null;
  imageId?: string | null;
  enabled?: boolean;
};

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  image: string | null;
  link?: string | null;
  date?: string | null;
};

type TestimonialItem = {
  id: string;
  author: string;
  title?: string | null;
  company?: string | null;
  quote: string;
  avatar?: string | null;
};

const HERO_CTAS_FALLBACK = [
  { label: "Explore Products", href: "/products" },
  { label: "Speak to an Expert", href: "/contact" },
] as const;

function parseJsonIfPossible(value: unknown) {
  if (value == null) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const starts = trimmed[0];
  const ends = trimmed[trimmed.length - 1];
  if ((starts === "{" && ends === "}") || (starts === "[" && ends === "]")) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
      console.warn("parseJsonIfPossible error", error);
      return null;
    }
  }
  return null;
}

function normalizeImage(raw: any): string | null {
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  if (typeof raw === "object") {
    if (raw.url && typeof raw.url === "string") return raw.url;
    if (raw.id && typeof raw.id === "string") return `/api/assets/${raw.id}`;
  }
  return null;
}

function normalizeSections(input: any[] | null | undefined) {
  const map: Record<string, SectionPayload> = {};
  (Array.isArray(input) ? input : []).forEach((item) => {
    if (!item || typeof item !== "object") return;
    const key = typeof item.key === "string" ? item.key : null;
    if (!key) return;
    if (item.enabled === false) return;
    const parsedData =
      item.data != null
        ? parseJsonIfPossible(item.data)
        : parseJsonIfPossible(item.content);
    map[key] = {
      id: typeof item.id === "string" ? item.id : undefined,
      key,
      heading: item.heading ?? null,
      subheading: item.subheading ?? null,
      content: item.content ?? null,
      data: parsedData ?? undefined,
      image: normalizeImage(item.image ?? item.imageUrl),
      imageId: item.imageId ?? null,
      enabled: item.enabled ?? true,
    };
  });
  return map;
}

function normalizeNews(items: any[] | null | undefined): NewsItem[] {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const id =
        typeof item?.id === "string"
          ? item.id
          : typeof item?.title === "string"
            ? item.title
            : null;
      if (!id) return null;
      const title = typeof item.title === "string" ? item.title : id;
      const excerpt = typeof item.excerpt === "string" ? item.excerpt : "";
      const link =
        typeof item.link === "string"
          ? item.link
          : typeof item.url === "string"
            ? item.url
            : null;
      const image = normalizeImage(item.image ?? item.imageUrl);
      const date =
        typeof item.date === "string" ? item.date : (item.publishedAt ?? null);
      return {
        id,
        title,
        excerpt,
        image,
        link,
        date,
      } satisfies NewsItem;
    })
    .filter(Boolean) as NewsItem[];
}

function normalizeTestimonials(
  items: any[] | null | undefined,
): TestimonialItem[] {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const id = typeof item?.id === "string" ? item.id : null;
      if (!id) return null;
      const author = typeof item.author === "string" ? item.author : "";
      if (!author) return null;
      const title = item.title ?? item.role ?? null;
      const company = item.company ?? null;
      const quote = typeof item.quote === "string" ? item.quote : "";
      if (!quote) return null;
      const avatar = normalizeImage(item.avatar);
      return {
        id,
        author,
        title,
        company,
        quote,
        avatar,
      } satisfies TestimonialItem;
    })
    .filter(Boolean) as TestimonialItem[];
}

async function fetchJsonSoft<T = any>(
  url: string,
  timeoutMs = 0,
): Promise<T | null> {
  const safeFetch = async (): Promise<Response | null> => {
    try {
      return await fetch(url, {
        credentials: "same-origin",
        cache: "no-store",
      });
    } catch {
      return null;
    }
  };

  try {
    let resp: Response | null;
    if (timeoutMs > 0) {
      resp = (await Promise.race([
        safeFetch(),
        new Promise<Response | null>((resolve) =>
          setTimeout(() => resolve(null), timeoutMs),
        ),
      ])) as Response | null;
    } else {
      resp = await safeFetch();
    }

    if (!resp || !resp.ok) return null;
    try {
      return (await resp.json()) as T;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 1500,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const easeOutQuad = (t: number) => t * (2 - t);

    let rafId = 0;
    let start: number | null = null;

    const run = (timestamp: number) => {
      if (start == null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      const current = Math.floor(eased * target);
      setValue(current);
      if (progress < 1) rafId = requestAnimationFrame(run);
    };

    const onIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          rafId = requestAnimationFrame(run);
        }
      });
    };

    const obs = new IntersectionObserver(onIntersection, { threshold: 0.3 });
    obs.observe(el);

    return () => {
      obs.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, duration]);

  return (
    <span ref={spanRef}>
      {value}
      {suffix}
    </span>
  );
}

function TestimonialAvatar({
  avatar,
  author,
}: {
  avatar?: string | null;
  author: string;
}) {
  const [failed, setFailed] = useState(false);

  const initials = useMemo(() => {
    return author
      .split(/\s+/)
      .map((part) => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [author]);

  if (!avatar || failed) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/10 bg-primary/10 text-xs font-semibold uppercase text-foreground">
        {initials || "?"}
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={`${author} avatar`}
      className="h-12 w-12 rounded-full object-cover border-2 border-white/10"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function Index() {
  const [sections, setSections] = useState<Record<string, SectionPayload>>({});
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    const load = async () => {
      try {
        const [sectionsResp, newsResp, testimonialsResp] = await Promise.all([
          fetchJsonSoft<any[]>("/api/sections", 1500),
          fetchJsonSoft<any[]>("/api/news", 1500),
          fetchJsonSoft<any[]>("/api/testimonials", 1500),
        ]);
        if (canceled) return;

        setSections(normalizeSections(sectionsResp));
        setNewsItems(normalizeNews(newsResp));
        setTestimonials(normalizeTestimonials(testimonialsResp));
      } finally {
        if (!canceled) setIsLoading(false);
      }
    };

    load();
    return () => {
      canceled = true;
    };
  }, []);

  const hero = sections["hero"];
  const cardsSection = sections["info-cards"];
  const whatWeDo = sections["what-we-do"];
  const whoWeAre = sections["who-we-are"];
  const impact = sections["impact"];
  const flowchartSection = sections["flowchart"] ?? sections["capabilities"];
  const whatWeDoCompact = sections["what-we-do-compact"];
  const whoSection = sections["who"];

  const flowSteps = useMemo(() => {
    const raw = (flowchartSection as any)?.data;
    const arr = Array.isArray(raw)
      ? raw
      : raw && Array.isArray((raw as any).items)
        ? (raw as any).items
        : [];
    return (arr as any[])
      .map((item: any, idx: number) => {
        const titleCandidate =
          typeof item?.label === "string" && item.label.trim().length
            ? item.label
            : typeof item?.title === "string" && item.title.trim().length
              ? item.title
              : typeof item?.heading === "string" && item.heading.trim().length
                ? item.heading
                : null;
        if (!titleCandidate) return null;
        const descCandidate =
          typeof item?.desc === "string" && item.desc.trim().length
            ? item.desc
            : typeof item?.description === "string" &&
                item.description.trim().length
              ? item.description
              : typeof item?.subtitle === "string" &&
                  item.subtitle.trim().length
                ? item.subtitle
                : "";
        const Icon =
          getIconByName(item?.icon) ||
          [Target, BarChart3, Cpu, Globe][idx % 4] ||
          Target;
        return { title: titleCandidate, desc: descCandidate, icon: Icon };
      })
      .filter(Boolean) as { title: string; desc: string; icon: any }[];
  }, [flowchartSection?.data]);

  const whatWeDoCompactItems = useMemo(() => {
    const raw = (whatWeDoCompact as any)?.data;
    const arr = Array.isArray(raw)
      ? raw
      : raw && Array.isArray((raw as any).items)
        ? (raw as any).items
        : [];
    return (arr as any[])
      .map((item: any, idx: number) => {
        const titleCandidate =
          typeof item?.heading === "string" && item.heading.trim().length
            ? item.heading
            : typeof item?.label === "string" && item.label.trim().length
              ? item.label
              : typeof item?.title === "string" && item.title.trim().length
                ? item.title
                : null;
        if (!titleCandidate) return null;
        const subtitle =
          typeof item?.subheading === "string" && item.subheading.trim().length
            ? item.subheading
            : typeof item?.desc === "string" && item.desc.trim().length
              ? item.desc
              : typeof item?.description === "string" &&
                  item.description.trim().length
                ? item.description
                : "";
        const Icon =
          getIconByName(item?.icon) ||
          [Target, BarChart3, Cpu][idx % 3] ||
          Target;
        return { title: titleCandidate, subtitle, icon: Icon };
      })
      .filter(Boolean) as { title: string; subtitle: string; icon: any }[];
  }, [whatWeDoCompact?.data]);

  const whoParagraphs2 = useMemo(() => {
    const arr = Array.isArray((whoSection as any)?.data?.paragraphs)
      ? (whoSection as any).data.paragraphs
      : [];
    if (arr.length)
      return arr.filter((p: any) => typeof p === "string" && p.trim().length);
    const s = typeof whoSection?.content === "string" ? whoSection.content : "";
    return s
      .split(/\n+/)
      .map((x) => x.trim())
      .filter((x) => x.length);
  }, [whoSection?.data, whoSection?.content]);

  const whoImage2 = useMemo(() => {
    if (
      typeof (whoSection as any)?.image === "string" &&
      (whoSection as any).image
    )
      return (whoSection as any).image as string;
    if (
      typeof (whoSection as any)?.imageId === "string" &&
      (whoSection as any).imageId
    )
      return `/api/assets/${(whoSection as any).imageId}`;
    return null;
  }, [whoSection]);

  const heroCtas = useMemo(() => {
    const raw = hero?.data?.ctas;
    if (Array.isArray(raw)) {
      const sanitized = raw
        .map((cta: any) => {
          const label =
            typeof cta?.label === "string" ? cta.label.trim() : null;
          const href = typeof cta?.href === "string" ? cta.href.trim() : null;
          if (!label || !href) return null;
          return { label, href };
        })
        .filter(Boolean) as { label: string; href: string }[];
      if (sanitized.length) return sanitized;
    }
    return HERO_CTAS_FALLBACK.map((cta) => ({ ...cta }));
  }, [hero?.data?.ctas]);

  const heroPrimaryCta = heroCtas[0];
  const heroSecondaryCta = heroCtas[1];

  const infoCards = useMemo(() => {
    const cards = cardsSection?.data?.cards;
    if (!Array.isArray(cards)) return [];
    return cards.filter(
      (card: any) =>
        card &&
        typeof card === "object" &&
        (typeof card.title === "string" || typeof card.label === "string"),
    );
  }, [cardsSection?.data]);

  const whatWeDoTiles = useMemo(() => {
    const tiles = whatWeDo?.data?.tiles;
    if (!Array.isArray(tiles)) return [];
    return tiles.filter(
      (tile: any) =>
        tile &&
        typeof tile === "object" &&
        (typeof tile.title === "string" || typeof tile.heading === "string"),
    );
  }, [whatWeDo?.data]);

  const whoParagraphs = useMemo(() => {
    const raw = whoWeAre?.data?.paragraphs;
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (paragraph: any) =>
        typeof paragraph === "string" && paragraph.trim().length > 0,
    );
  }, [whoWeAre?.data]);

  const whoWeAreImage = useMemo(() => {
    const img = normalizeImage(whoWeAre?.image ?? (whoWeAre as any)?.imageUrl);
    if (img) return img;
    if (typeof whoWeAre?.imageId === "string" && whoWeAre.imageId) {
      return `/api/assets/${whoWeAre.imageId}`;
    }
    return null;
  }, [whoWeAre?.image, (whoWeAre as any)?.imageUrl, whoWeAre?.imageId]);

  const impactItems = useMemo(() => {
    const raw = impact?.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter((item: any) => item && typeof item === "object");
    if (typeof raw === "object" && Array.isArray((raw as any).items)) {
      return (raw as any).items.filter((item: any) => item && typeof item === "object");
    }
    return [];
  }, [impact?.data]);

  const stats = useMemo(
    () =>
      impactItems.filter((item: any) => {
        if (item?.type !== "stat") return false;
        if (typeof item?.label !== "string" || item.label.trim().length === 0) {
          return false;
        }
        return item.value != null;
      }),
    [impactItems],
  );

  const presence = useMemo(
    () =>
      impactItems.find(
        (item: any) =>
          item?.type === "description" &&
          (typeof item?.heading === "string" ||
            typeof item?.title === "string"),
      ),
    [impactItems],
  );

  const renderCta = (
    cta: { label: string; href: string } | undefined,
    className: string,
    isPrimary = false,
  ) => {
    if (!cta) return null;
    const href = cta.href;
    const label = cta.label;
    if (!href || !label) return null;
    const isExternal =
      href.startsWith("http://") || href.startsWith("https://");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {label}
          {isPrimary ? <ArrowRight className="ml-3 h-4 w-4" /> : null}
        </a>
      );
    }
    return (
      <Link to={href} className={className}>
        {label}
        {isPrimary ? <ArrowRight className="ml-3 h-4 w-4" /> : null}
      </Link>
    );
  };

  const heroSubheading =
    typeof hero?.subheading === "string" && hero.subheading.trim().length > 0
      ? hero.subheading
      : typeof hero?.content === "string" && hero.content.trim().length > 0
        ? hero.content
        : null;

  const showDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';

  return (
    <div>
      {showDebug ? (
        <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 bg-black/30 mb-6">
          <div className="text-sm text-primary/80">
            <div className="font-semibold text-primary/90">DEBUG: Sections / Impact</div>
            <pre className="mt-2 max-h-72 overflow-auto text-xs text-primary/80">{JSON.stringify({ sections, impact, impactItems, presence, stats }, null, 2)}</pre>
          </div>
        </Section>
      ) : null}
      {isLoading ? <LoadingScreen /> : null}

      {hero ? (
        <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {typeof hero.heading === "string" &&
              hero.heading.trim().length ? (
                <AnimatedTitle
                  text={hero.heading}
                  className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-foreground"
                />
              ) : null}
              {heroSubheading ? (
                <p className="mt-6 text-lg text-foreground/90 max-w-xl">
                  {heroSubheading}
                </p>
              ) : null}
              <div className="mt-8 flex items-center gap-4">
                {renderCta(
                  heroPrimaryCta,
                  "inline-flex items-center rounded-full glass-card px-6 py-3 text-sm font-semibold text-foreground shadow-lg",
                  true,
                )}
                {renderCta(
                  heroSecondaryCta,
                  "text-sm font-semibold text-foreground/90 hover:text-foreground",
                )}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl glass-card border border-primary/20 p-4 sm:p-6 md:p-8">
                {flowSteps.length ? (
                  <FlowGrid
                    items={flowSteps.map((s) => ({
                      icon: s.icon,
                      title: s.title,
                      subtitle: s.desc,
                    }))}
                  />
                ) : infoCards.length ? (
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-120px" }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.08 } },
                    }}
                    className="grid grid-cols-2 gap-4 sm:gap-6 w-full items-stretch"
                  >
                    {infoCards.map((card: any, idx: number) => {
                      const title =
                        typeof card.title === "string" &&
                        card.title.trim().length
                          ? card.title
                          : typeof card.label === "string" &&
                              card.label.trim().length
                            ? card.label
                            : null;
                      if (!title) return null;

                      const subtitle =
                        typeof card.subtitle === "string" &&
                        card.subtitle.trim().length
                          ? card.subtitle
                          : typeof card.description === "string" &&
                              card.description.trim().length
                            ? card.description
                            : typeof card.desc === "string" &&
                                card.desc.trim().length
                              ? card.desc
                              : null;
                      const Icon =
                        getIconByName(card?.icon) ||
                        [Target, BarChart3, Cpu, Globe][idx % 4] ||
                        Target;
                      return (
                        <motion.div
                          key={card?.id ?? `${title}-${idx}`}
                          variants={{
                            hidden: { opacity: 0, y: 18 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              transition: { duration: 0.45 },
                            },
                          }}
                        >
                          <TiltCard className="h-full min-h-[160px]">
                            <Icon className="h-6 w-6 text-primary/100" />
                            <div className="mt-4 font-semibold text-primary/100">
                              {title}
                            </div>
                            {subtitle ? (
                              <div className="text-sm text-primary/80">
                                {subtitle}
                              </div>
                            ) : null}
                          </TiltCard>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : null}
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {whatWeDo?.heading || whatWeDo?.subheading || whatWeDoTiles.length ? (
        <Section
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
          delay={0.05}
        >
          <div className="text-center">
            {typeof whatWeDo?.heading === "string" &&
            whatWeDo.heading.trim().length ? (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {whatWeDo.heading}
              </h2>
            ) : null}
            {typeof whatWeDo?.subheading === "string" &&
            whatWeDo.subheading.trim().length ? (
              <p className="mt-4 text-foreground/90 max-w-2xl mx-auto">
                {whatWeDo.subheading}
              </p>
            ) : null}
          </div>
          {whatWeDoTiles.length ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {whatWeDoTiles.map((tile: any, idx: number) => {
                const title =
                  typeof tile.title === "string" && tile.title.trim().length
                    ? tile.title
                    : typeof tile.heading === "string" &&
                        tile.heading.trim().length
                      ? tile.heading
                      : null;
                if (!title) return null;
                const subtitle =
                  typeof tile.subtitle === "string" &&
                  tile.subtitle.trim().length
                    ? tile.subtitle
                    : typeof tile.description === "string" &&
                        tile.description.trim().length
                      ? tile.description
                      : null;
                const Icon =
                  getIconByName(tile?.icon) ||
                  [Target, BarChart3, Cpu][idx % 3] ||
                  Target;
                return (
                  <TiltCard
                    key={tile?.id ?? `${title}-${idx}`}
                    className="min-h-[160px]"
                  >
                    <Icon className="h-6 w-6 text-primary/100" />
                    <div className="mt-4 font-semibold text-primary/100">
                      {title}
                    </div>
                    {subtitle ? (
                      <div className="text-sm text-primary/80 mt-2">
                        {subtitle}
                      </div>
                    ) : null}
                  </TiltCard>
                );
              })}
            </div>
          ) : null}
        </Section>
      ) : null}

      {whoWeAre?.heading || whoParagraphs.length || whoWeAreImage ? (
        <Section
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
          delay={0.1}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {typeof whoWeAre?.heading === "string" &&
              whoWeAre.heading.trim().length ? (
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  {whoWeAre.heading}
                </h2>
              ) : null}
              <div className="mt-4 text-foreground/85 max-w-prose space-y-4">
                {whoParagraphs.map((paragraph, idx) => (
                  <p key={`${paragraph}-${idx}`}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  className="inline-flex items-center rounded-full glass-card px-5 py-2 text-sm font-semibold"
                  to="/about"
                >
                  Learn more about us
                </Link>
              </div>
            </div>
            {whoWeAreImage ? (
              <div className="relative flex items-center justify-center">
                <div
                  aria-hidden
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: "64%",
                    height: "80%",
                    transform: "translateY(6%)",
                    background:
                      "radial-gradient(circle at 40% 30%, rgba(124,58,237,0.36) 0%, rgba(167,139,250,0.12) 35%, transparent 70%)",
                    filter: "blur(38px) brightness(0.95)",
                    zIndex: 10,
                  }}
                />

                <img
                  src={whoWeAreImage}
                  alt={
                    typeof whoWeAre?.heading === "string"
                      ? whoWeAre.heading
                      : ""
                  }
                  className="relative w-auto max-h-64 md:max-h-80 lg:max-h-[420px] object-contain bg-transparent"
                  style={{
                    filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.45))",
                    zIndex: 20,
                  }}
                />

                <div
                  aria-hidden
                  className="absolute pointer-events-none"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: 0,
                    width: "70%",
                    height: "160px",
                    zIndex: 25,
                    background:
                      "linear-gradient(180deg, rgba(124,58,237,0) 0%, rgba(124,58,237,0.18) 40%, rgba(124,58,237,0.6) 85%, rgba(167,139,250,0.8) 100%)",
                    filter: "blur(14px)",
                    borderRadius: "40px",
                  }}
                />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* impact moved below */}

      {whatWeDoCompactItems.length ? (
        <Section
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
          delay={0.22}
        >
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {typeof whatWeDoCompact?.heading === "string" &&
              whatWeDoCompact.heading.trim().length
                ? whatWeDoCompact.heading
                : "What We Do"}
            </h2>
            {typeof whatWeDoCompact?.subheading === "string" &&
            whatWeDoCompact.subheading.trim().length ? (
              <p className="mt-4 text-foreground/90 max-w-2xl mx-auto">
                {whatWeDoCompact.subheading}
              </p>
            ) : null}
          </div>
          <div className="mt-8">
            <FlowGrid items={whatWeDoCompactItems} columns={3} limit={3} />
          </div>
        </Section>
      ) : null}

      {whoSection?.heading || whoParagraphs2.length || whoImage2 ? (
        <Section
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
          delay={0.24}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {typeof whoSection?.heading === "string" &&
              whoSection.heading.trim().length ? (
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  {whoSection.heading}
                </h2>
              ) : null}
              <div className="mt-4 text-foreground/85 max-w-prose space-y-4">
                {whoParagraphs2.map((paragraph, idx) => (
                  <p key={`${paragraph}-${idx}`}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  className="inline-flex items-center rounded-full glass-card px-5 py-2 text-sm font-semibold"
                  to="/about"
                >
                  Learn more about us
                </Link>
              </div>
            </div>
            {whoImage2 ? (
              <div className="relative flex items-center justify-center">
                <div
                  aria-hidden
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: "64%",
                    height: "80%",
                    transform: "translateY(6%)",
                    background:
                      "radial-gradient(circle at 40% 30%, rgba(124,58,237,0.36) 0%, rgba(167,139,250,0.12) 35%, transparent 70%)",
                    filter: "blur(38px) brightness(0.95)",
                    zIndex: 10,
                  }}
                />
                <img
                  src={whoImage2}
                  alt={
                    typeof whoSection?.heading === "string"
                      ? whoSection.heading
                      : ""
                  }
                  className="relative w-auto max-h-64 md:max-h-80 lg:max-h-[420px] object-contain bg-transparent"
                  style={{
                    filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.45))",
                    zIndex: 20,
                  }}
                />
                <div
                  aria-hidden
                  className="absolute pointer-events-none"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: 0,
                    width: "70%",
                    height: "160px",
                    zIndex: 25,
                    background:
                      "linear-gradient(180deg, rgba(124,58,237,0) 0%, rgba(124,58,237,0.18) 40%, rgba(124,58,237,0.6) 85%, rgba(167,139,250,0.8) 100%)",
                    filter: "blur(14px)",
                    borderRadius: "40px",
                  }}
                />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {impactItems.length ? (
        <Section
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
          delay={0.14}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center items-center">
            {presence ? (
              <div className="group block rounded-lg">
                <div className="flex items-center justify-center">
                  {(() => {
                    const PresenceIcon = getIconByName(presence?.icon) || Globe;
                    return (
                      <PresenceIcon className="h-12 w-12 text-primary/90" />
                    );
                  })()}
                </div>
                <div className="mt-2 text-sm text-foreground/85 whitespace-nowrap">
                  {typeof presence?.heading === "string" &&
                  presence.heading.trim().length
                    ? presence.heading
                    : typeof presence?.title === "string"
                      ? presence.title
                      : ""}
                </div>
              </div>
            ) : null}

            {stats.map((item: any, idx: number) => {
              const valueNumber = Number(item?.value);
              if (!Number.isFinite(valueNumber)) return null;
              const suffix =
                typeof item?.suffix === "string" ? item.suffix : "";
              const label = typeof item?.label === "string" ? item.label : "";
              if (!label.trim().length) return null;
              const href =
                typeof item?.href === "string" && item.href.trim().length
                  ? item.href.trim()
                  : undefined;
              const isExternal =
                href &&
                (href.startsWith("http://") || href.startsWith("https://"));
              const content = (
                <>
                  <div className="text-4xl font-extrabold text-foreground">
                    <AnimatedCounter
                      target={valueNumber}
                      suffix={suffix}
                      duration={1200}
                    />
                  </div>
                  <div className="mt-2 text-sm text-foreground/85">{label}</div>
                </>
              );
              if (!href) {
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="group block rounded-lg"
                  >
                    {content}
                  </div>
                );
              }
              return isExternal ? (
                <a
                  key={`${label}-${idx}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={`${label}-${idx}`}
                  to={href}
                  className="group block rounded-lg"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </Section>
      ) : null}

      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.25}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Testimonials
          </h2>
        </div>

        <div className="mt-8">
          {testimonials.length ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {testimonials.slice(0, 4).map((testimonial) => {
                const roleLabel = [testimonial.title, testimonial.company]
                  .filter(
                    (value) => typeof value === "string" && value.trim().length,
                  )
                  .join(", ");
                return (
                  <motion.article
                    key={testimonial.id}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.45 },
                      },
                    }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 p-6 overflow-hidden glass-card"
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <Quote className="h-6 w-6 text-primary/80" />
                        <p className="mt-3 text-foreground/90 text-sm leading-relaxed">
                          {testimonial.quote}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {testimonial.author}
                          </div>
                          {roleLabel ? (
                            <div className="text-xs text-foreground/80">
                              {roleLabel}
                            </div>
                          ) : null}
                        </div>
                        <TestimonialAvatar
                          avatar={testimonial.avatar}
                          author={testimonial.author}
                        />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            <p className="text-sm text-foreground/80">
              Testimonials will appear here once added.
            </p>
          )}
        </div>
      </Section>

      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.3}
      >
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Latest News
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.length ? (
            newsItems.slice(0, 3).map((news, idx) => {
              const hasImage =
                typeof news.image === "string" && news.image.trim().length > 0;
              const link =
                typeof news.link === "string" && news.link.trim().length
                  ? news.link.trim()
                  : "";
              const isExternal =
                link.startsWith("http://") || link.startsWith("https://");
              const title = news.title;
              const excerpt = news.excerpt;

              const imageElement = hasImage ? (
                <img
                  src={news.image as string}
                  alt=""
                  className="h-40 w-full object-cover border-b border-primary/10"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding={idx === 0 ? "sync" : "async"}
                  onError={(event) => {
                    const element = event.currentTarget;
                    element.onerror = null;
                    element.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-40 w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-primary/10" />
              );

              const media = (() => {
                if (!link) return imageElement;
                if (isExternal) {
                  return (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {imageElement}
                    </a>
                  );
                }
                return <Link to={link}>{imageElement}</Link>;
              })();

              const readMore = (() => {
                if (!link) return null;
                if (isExternal) {
                  return (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-semibold text-foreground/90 hover:text-foreground"
                    >
                      Read more →
                    </a>
                  );
                }
                return (
                  <Link
                    to={link}
                    className="mt-4 inline-block text-sm font-semibold text-foreground/90 hover:text-foreground"
                  >
                    Read more →
                  </Link>
                );
              })();

              return (
                <article
                  key={news.id}
                  className="rounded-2xl border border-primary/20 bg-transparent overflow-hidden glass-card"
                >
                  {media}
                  <div className="p-6">
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    {excerpt ? (
                      <p className="mt-2 text-sm text-foreground/90">
                        {excerpt}
                      </p>
                    ) : null}
                    {readMore}
                  </div>
                </article>
              );
            })
          ) : (
            <p className="text-sm text-foreground/80">
              News updates will appear here once published.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
