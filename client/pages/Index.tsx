import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Cpu,
  Globe,
  Quote,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";
import TiltCard from "@/components/site/TiltCard";
import LoadingScreen from "@/components/site/LoadingScreen";
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

const DEFAULT_SECTIONS_LIST: SectionPayload[] = [
  {
    key: "hero",
    heading: "Transforming Businesses with AI and Digital Innovation",
    subheading:
      "We partner with organizations to drive efficiency, accelerate growth, and deliver measurable outcomes through AI-powered platforms, digital transformation, and next-generation software solutions.",
    content:
      "We partner with organizations to drive efficiency, accelerate growth, and deliver measurable outcomes through AI-powered platforms, digital transformation, and next-generation software solutions.",
    data: {
      ctas: [
        { label: "Explore Products", href: "/products" },
        { label: "Speak to an Expert", href: "/contact" },
      ],
    },
  },
  {
    key: "info-cards",
    heading: "Capabilities",
    subheading: "Where we focus impact",
    data: {
      cards: [
        {
          icon: "target",
          title: "Strategy",
          subtitle: "From discovery to roadmap, we align teams on outcomes.",
        },
        {
          icon: "palette",
          title: "Design",
          subtitle: "Accessible, modern interfaces with purpose.",
        },
        {
          icon: "cpu",
          title: "Engineering",
          subtitle: "Robust web apps, APIs, and infra.",
        },
        {
          icon: "bar-chart-3",
          title: "Analytics",
          subtitle: "Ship, learn, iterate with data.",
        },
      ],
    },
  },
  {
    key: "what-we-do",
    heading: "What We Do",
    subheading: "Integrated consulting, product, and engineering partnerships.",
    data: {
      tiles: [
        {
          icon: "target",
          title: "AI & Digital Transformation",
          subtitle: "Reimagine processes with intelligence and automation.",
        },
        {
          icon: "bar-chart-3",
          title: "Enterprise Products",
          subtitle:
            "Future-ready platforms across Retail, NBFC, MEP, and Data Transfer.",
        },
        {
          icon: "cpu",
          title: "Technology Services",
          subtitle:
            "Architecture review, cloud enablement, AI augmentation, and enterprise security.",
        },
      ],
    },
  },
  {
    key: "who-we-are",
    heading: "Who We Are",
    subheading:
      "A senior, cross-functional team with a bias for clarity and measurable outcomes.",
    content:
      "Operating as a remote-first company with strategic offices globally, we emphasize clarity, fast feedback loops, and long-term partnerships that prioritize user value and technical excellence.",
    data: {
      paragraphs: [
        "A senior, cross-functional team that designs, builds, and scales products people love. We blend strategy, design, engineering, and analytics to deliver measurable impact.",
        "We partner with leadership to translate uncertain opportunities into clear roadmaps — combining user research, pragmatic engineering, and measurable outcomes.",
        "Operating as a remote-first company with strategic offices globally, we emphasize clarity, fast feedback loops, and long-term partnerships that prioritize user value and technical excellence.",
      ],
    },
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F4ed1abb4e7b8432696da3fc4bf216ad1?format=webp&width=800",
  },
  {
    key: "impact",
    heading: "Impact Snapshot",
    data: {
      items: [
        {
          type: "description",
          icon: "globe",
          heading: "Presence across India & the Middle East",
        },
        {
          type: "stat",
          value: 45,
          suffix: "+",
          label: "Clients served",
          href: "/clients",
        },
        {
          type: "stat",
          value: 4,
          label: "Flagship enterprise products",
          href: "/products",
        },
      ],
    },
  },
];

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Q4 Highlights",
    excerpt: "Milestones across platform and growth.",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F9aebb7e90f334acbb611405deeab415d?format=webp&width=1200&q=80",
    link: null,
  },
  {
    id: "news-2",
    title: "New Office",
    excerpt: "We expanded to Berlin.",
    image:
      "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=80",
    link: null,
  },
  {
    id: "news-3",
    title: "Open Roles",
    excerpt: "We're hiring across the stack.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    link: null,
  },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testimonial-1",
    author: "Alex M.",
    title: "Chief Technology Officer",
    company: "Nimbus",
    quote: "They move fast without breaking clarity.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "testimonial-2",
    author: "Priya S.",
    title: "VP Engineering",
    company: "Northstar",
    quote: "A true partner from strategy to delivery.",
    avatar:
      "https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "testimonial-3",
    author: "Alex J.",
    title: "Chief Executive Officer",
    company: "Inn Solutions",
    quote: "Working with AUIO was a game-changer.",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "testimonial-4",
    author: "Sam R.",
    title: "Product Lead",
    company: "Gamma",
    quote: "A focused team that delivers measurable outcomes.",
    avatar:
      "https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80",
  },
];

const DEFAULT_SECTIONS_MAP = DEFAULT_SECTIONS_LIST.reduce<Record<string, SectionPayload>>(
  (acc, section) => {
    acc[section.key] = section;
    return acc;
  },
  {},
);

function parseJsonIfPossible(value: unknown) {
  if (value == null) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const starts = trimmed[0];
  const ends = trimmed[trimmed.length - 1];
  if (
    (starts === "{" && ends === "}") ||
    (starts === "[" && ends === "]")
  ) {
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
      item.data != null ? parseJsonIfPossible(item.data) : parseJsonIfPossible(item.content);
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
      const date = typeof item.date === "string" ? item.date : item.publishedAt ?? null;
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

function normalizeTestimonials(items: any[] | null | undefined): TestimonialItem[] {
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

async function fetchJsonSoft<T = any>(url: string, timeoutMs = 0): Promise<T | null> {
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

export default function Index() {
  const [sections, setSections] = useState<Record<string, SectionPayload>>(DEFAULT_SECTIONS_MAP);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(DEFAULT_NEWS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
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

        const normalizedSections = normalizeSections(sectionsResp);
        if (Object.keys(normalizedSections).length) {
          setSections((prev) => ({ ...prev, ...normalizedSections }));
        }

        const normalizedNews = normalizeNews(newsResp);
        if (normalizedNews.length) {
          setNewsItems(normalizedNews.slice(0, 3));
        }

        const normalizedTestimonials = normalizeTestimonials(testimonialsResp);
        if (normalizedTestimonials.length) {
          setTestimonials(normalizedTestimonials.slice(0, 4));
        }
      } finally {
        if (!canceled) setIsLoading(false);
      }
    };

    load();
    return () => {
      canceled = true;
    };
  }, []);

  const hero = sections["hero"] ?? DEFAULT_SECTIONS_MAP["hero"];
  const cardsSection = sections["info-cards"] ?? DEFAULT_SECTIONS_MAP["info-cards"];
  const whatWeDo = sections["what-we-do"] ?? DEFAULT_SECTIONS_MAP["what-we-do"];
  const whoWeAre = sections["who-we-are"] ?? DEFAULT_SECTIONS_MAP["who-we-are"];
  const impact = sections["impact"] ?? DEFAULT_SECTIONS_MAP["impact"];

  const infoCards = useMemo(() => {
    const cards = cardsSection?.data?.cards;
    if (Array.isArray(cards) && cards.length) return cards;
    return DEFAULT_SECTIONS_MAP["info-cards"].data?.cards ?? [];
  }, [cardsSection?.data]);

  const whatWeDoTiles = useMemo(() => {
    const tiles = whatWeDo?.data?.tiles;
    if (Array.isArray(tiles) && tiles.length) return tiles;
    return DEFAULT_SECTIONS_MAP["what-we-do"].data?.tiles ?? [];
  }, [whatWeDo?.data]);

  const whoParagraphs = useMemo(() => {
    const raw = whoWeAre?.data?.paragraphs;
    if (Array.isArray(raw) && raw.length) return raw;
    return DEFAULT_SECTIONS_MAP["who-we-are"].data?.paragraphs ?? [];
  }, [whoWeAre?.data]);

  const impactItems = useMemo(() => {
    const items = impact?.data?.items;
    if (Array.isArray(items) && items.length) return items;
    return DEFAULT_SECTIONS_MAP["impact"].data?.items ?? [];
  }, [impact?.data]);

  const stats = impactItems.filter((item: any) => item?.type === "stat").slice(0, 2);
  const presence = impactItems.find((item: any) => item?.type === "description");

  const heroPrimaryCta = hero?.data?.ctas?.[0] ?? DEFAULT_SECTIONS_MAP["hero"].data?.ctas?.[0];
  const heroSecondaryCta = hero?.data?.ctas?.[1] ?? DEFAULT_SECTIONS_MAP["hero"].data?.ctas?.[1];

  const renderCta = (cta: any, className: string, isPrimary = false) => {
    if (!cta || typeof cta.href !== "string" || typeof cta.label !== "string") return null;
    const href = cta.href;
    const isExternal = href.startsWith("http://") || href.startsWith("https://");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {cta.label}
          {isPrimary ? <ArrowRight className="ml-3 h-4 w-4" /> : null}
        </a>
      );
    }
    return (
      <Link to={href} className={className}>
        {cta.label}
        {isPrimary ? <ArrowRight className="ml-3 h-4 w-4" /> : null}
      </Link>
    );
  };

  return (
    <div>
      {isLoading ? <LoadingScreen /> : null}

      {hero ? (
        <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedTitle
                text={hero.heading || DEFAULT_SECTIONS_MAP["hero"].heading || "Transforming Businesses with AI and Digital Innovation"}
                className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-foreground"
              />
              <p className="mt-6 text-lg text-foreground/90 max-w-xl">
                {hero.subheading || hero.content || DEFAULT_SECTIONS_MAP["hero"].subheading}
              </p>
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
                    const Icon = getIconByName(card?.icon) || [Target, BarChart3, Cpu, Globe][idx % 4] || Target;
                    return (
                      <motion.div
                        key={`${card?.title ?? idx}`}
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
                            {card?.title || card?.label || "Capability"}
                          </div>
                          <div className="text-sm text-primary/80">
                            {card?.subtitle || card?.desc || "Focused execution for measurable results."}
                          </div>
                        </TiltCard>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.05}>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {whatWeDo.heading || DEFAULT_SECTIONS_MAP["what-we-do"].heading}
          </h2>
          {whatWeDo.subheading ? (
            <p className="mt-4 text-foreground/90 max-w-2xl mx-auto">
              {whatWeDo.subheading}
            </p>
          ) : null}
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {whatWeDoTiles.map((tile: any, idx: number) => {
            const Icon = getIconByName(tile?.icon) || [Target, BarChart3, Cpu][idx % 3] || Target;
            return (
              <TiltCard key={`${tile?.title ?? idx}`} className="min-h-[160px]">
                <Icon className="h-6 w-6 text-primary/100" />
                <div className="mt-4 font-semibold text-primary/100">
                  {tile?.title || tile?.heading || "Capability"}
                </div>
                <div className="text-sm text-primary/80 mt-2">
                  {tile?.subtitle || tile?.description || "Impactful outcomes with measurable value."}
                </div>
              </TiltCard>
            );
          })}
        </div>
      </Section>

      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {whoWeAre.heading || DEFAULT_SECTIONS_MAP["who-we-are"].heading}
            </h2>
            <div className="mt-4 text-foreground/85 max-w-prose space-y-4">
              {whoParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
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
              src={normalizeImage(whoWeAre.image) || normalizeImage(DEFAULT_SECTIONS_MAP["who-we-are"].image) || "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F4ed1abb4e7b8432696da3fc4bf216ad1?format=webp&width=800"}
              alt="Team member"
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
        </div>
      </Section>

      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" delay={0.14}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center items-center">
          <div className="group block rounded-lg">
            <div className="flex items-center justify-center">
              {(getIconByName(presence?.icon) || Globe)({
                className: "h-12 w-12 text-primary/90",
              })}
            </div>
            <div className="mt-2 text-sm text-foreground/85 whitespace-nowrap">
              {presence?.heading || "Presence across India & the Middle East"}
            </div>
          </div>

          {stats.map((item: any, idx: number) => {
            const value = Number(item?.value) || 0;
            const suffix = typeof item?.suffix === "string" ? item.suffix : "";
            const label = item?.label || "Metric";
            const href = typeof item?.href === "string" ? item.href : idx === 0 ? "/clients" : "/products";
            const isExternal = href.startsWith("http://") || href.startsWith("https://");
            const content = (
              <>
                <div className="text-4xl font-extrabold text-foreground">
                  <AnimatedCounter target={value} suffix={suffix} duration={1200} />
                </div>
                <div className="mt-2 text-sm text-foreground/85">{label}</div>
              </>
            );
            return isExternal ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg"
              >
                {content}
              </a>
            ) : (
              <Link key={label} to={href} className="group block rounded-lg">
                {content}
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.25}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Testimonials
          </h2>
          <Link
            to="/testimonials"
            className="text-sm font-semibold text-foreground/90 hover:text-foreground"
          >
            All Testimonials
          </Link>
        </div>

        <div className="mt-8">
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
            {testimonials.slice(0, 4).map((testimonial, idx) => {
              const fallbacks = DEFAULT_TESTIMONIALS.map((t) => t.avatar).filter(Boolean) as string[];
              let avatarUrl = normalizeImage(testimonial.avatar);
              if (!avatarUrl) avatarUrl = fallbacks[idx % fallbacks.length];

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
                        <div className="text-xs text-foreground/80">
                          {[testimonial.title, testimonial.company]
                            .filter(Boolean)
                            .join(", ") || "Client"}
                        </div>
                      </div>
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={`${testimonial.author} avatar`}
                          className="h-12 w-12 rounded-full object-cover border-2 border-white/10"
                          loading="lazy"
                          onError={(event) => {
                            const element = event.currentTarget;
                            element.onerror = null;
                            element.src = fallbacks[idx % fallbacks.length] ?? "/placeholder.svg";
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </Section>

      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.3}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Latest News
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.slice(0, 3).map((news, idx) => {
            const imageSrc = normalizeImage(news.image) || "/placeholder.svg";
            const isExternal = typeof news.link === "string" && news.link.startsWith("http");
            const imageElement = (
              <img
                src={imageSrc}
                alt=""
                className="h-40 w-full object-cover border-b border-primary/10"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding={idx === 0 ? "sync" : "async"}
                onError={(event) => {
                  const element = event.currentTarget;
                  element.onerror = null;
                  element.src = "/placeholder.svg";
                }}
              />
            );
            return (
              <article
                key={news.id}
                className="rounded-2xl border border-primary/20 bg-transparent overflow-hidden glass-card"
              >
                {isExternal ? (
                  <a href={news.link ?? "#"} target="_blank" rel="noopener noreferrer">
                    {imageElement}
                  </a>
                ) : (
                  imageElement
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-foreground">{news.title}</h3>
                  <p className="mt-2 text-sm text-foreground/90">{news.excerpt}</p>
                  {isExternal ? (
                    <a
                      href={news.link ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-semibold text-foreground/90 hover:text-foreground"
                    >
                      Read more →
                    </a>
                  ) : (
                    <button className="mt-4 text-sm font-semibold text-foreground/90 hover:text-foreground">
                      Read more →
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
