import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Palette,
  Cpu,
  Target,
  BarChart3,
  Quote,
} from "lucide-react";
import { motion } from "framer-motion";
import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";
import TiltCard from "@/components/site/TiltCard";
import { Link, useLoaderData } from "react-router-dom";
import { getIconByName } from "@/lib/iconMap";

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
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const startedRef = React.useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const easeOutQuad = (t: number) => t * (2 - t);

    let rafId = 0;
    let start: number | null = null;

    const run = (timestamp: number) => {
      if (!start) start = timestamp;
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
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export async function loader() {
  try {
    const [s, n, t] = await Promise.all([
      fetch("/api/sections")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/news")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/testimonials")
        .then((r) => r.json())
        .catch(() => []),
    ]);
    const sectionsMap: Record<string, any> = {};
    if (Array.isArray(s))
      s.filter((it: any) => it?.enabled !== false).forEach((it: any) => {
        if (it && it.key) sectionsMap[it.key] = it;
      });

    const newsRaw = Array.isArray(n)
      ? n.filter((x: any) => x?.enabled !== false).slice(0, 3)
      : [];
    const news = newsRaw.length
      ? newsRaw
      : [
          {
            id: "s1",
            title: "Q4 Highlights",
            excerpt: "Milestones across platform and growth.",
            image:
              "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F9aebb7e90f334acbb611405deeab415d?format=webp&width=1200&q=80",
          },
          {
            id: "s2",
            title: "New Office",
            excerpt: "We expanded to Berlin.",
            image:
              "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=80",
          },
          {
            id: "s3",
            title: "Open Roles",
            excerpt: "We're hiring across the stack.",
            image:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          },
        ];

    const testiRaw = Array.isArray(t)
      ? t.filter((x: any) => x?.enabled !== false)
      : [];
    const testimonials = testiRaw.length
      ? testiRaw
      : [
          {
            id: "tt1",
            author: "Alex M.",
            role: "CTO, Nimbus",
            quote: "They move fast without breaking clarity.",
            avatar:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
          },
          {
            id: "tt2",
            author: "Priya S.",
            role: "VP Eng, Northstar",
            quote: "A true partner from strategy to delivery.",
            avatar:
              "https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80",
          },
        ];

    return { sections: sectionsMap, news, testimonials };
  } catch (e) {
    return {
      sections: {},
      news: [
        {
          id: "s1",
          title: "Q4 Highlights",
          excerpt: "Milestones across platform and growth.",
          image:
            "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F9aebb7e90f334acbb611405deeab415d?format=webp&width=1200&q=80",
        },
        {
          id: "s2",
          title: "New Office",
          excerpt: "We expanded to Berlin.",
          image:
            "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "s3",
          title: "Open Roles",
          excerpt: "We're hiring across the stack.",
          image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        },
      ],
      testimonials: [
        {
          id: "tt1",
          author: "Alex M.",
          role: "CTO, Nimbus",
          quote: "They move fast without breaking clarity.",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: "tt2",
          author: "Priya S.",
          role: "VP Eng, Northstar",
          quote: "A true partner from strategy to delivery.",
          avatar:
            "https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80",
        },
      ],
    };
  }
}

export default function Index() {
  const { sections, news, testimonials } = useLoaderData() as {
    sections: Record<string, any>;
    news: any[];
    testimonials: any[];
  };

  return (
    <div>
      {/* Hero */}
      {sections.hero ? (
        <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedTitle
                text={
                  sections.hero?.heading ||
                  "Building clear, resilient products for modern companies"
                }
                className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-foreground"
              />
              <p className="mt-6 text-lg text-foreground/90 max-w-xl">
                {sections.hero?.content}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-full glass-card px-6 py-3 text-sm font-semibold text-foreground shadow-lg"
                >
                  Start a project <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="text-sm font-semibold text-foreground/90 hover:text-foreground"
                >
                  See services
                </Link>
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
                  {(() => {
                    const iconMap: Record<string, any> = {
                      target: Target,
                      palette: Palette,
                      cpu: Cpu,
                      "bar-chart-3": BarChart3,
                    };
                    let items: any[] = [];
                    try {
                      items = sections.flowchart?.content
                        ? JSON.parse(sections.flowchart.content)
                        : [];
                    } catch {
                      items = [];
                    }
                    if (!Array.isArray(items) || items.length === 0) {
                      items = [
                        {
                          icon: "target",
                          label: "Strategy",
                          desc: "Crisp systems that scale.",
                        },
                        {
                          icon: "palette",
                          label: "Design",
                          desc: "Crisp systems that scale.",
                        },
                        {
                          icon: "cpu",
                          label: "Engineering",
                          desc: "Crisp systems that scale.",
                        },
                        {
                          icon: "bar-chart-3",
                          label: "Analytics",
                          desc: "Crisp systems that scale.",
                        },
                      ];
                    }
                    return items.map((i, idx) => {
                      const Icon = iconMap[i.icon] || Target;
                      return (
                        <motion.div
                          key={idx}
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
                              {i.label}
                            </div>
                            <div className="text-sm text-primary/80">
                              {i.desc}
                            </div>
                          </TiltCard>
                        </motion.div>
                      );
                    });
                  })()}
                </motion.div>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {/* About teaser: merged Who We Are + What We Do */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.1}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {sections.who?.heading || "Who We Are"}
            </h2>
            <div className="mt-4 text-foreground/85 max-w-prose space-y-4">
              <p>
                {sections.who?.content ||
                  "A senior, cross‑functional team that designs, builds, and scales products people love. We blend strategy, design, engineering, and analytics to deliver measurable impact."}
              </p>
              <p>
                We partner with leadership to translate uncertain opportunities
                into clear roadmaps — combining user research, pragmatic
                engineering, and measurable outcomes. Our teams have shipped
                platforms for startups and enterprises across regulated and
                consumer markets.
              </p>
              <p>
                Operating as a remote-first company with strategic offices
                globally, we emphasize clarity, fast feedback loops, and
                long-term partnerships that prioritize user value and technical
                excellence.
              </p>
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
            {/* soft halo behind subject to hide edge artifacts */}
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
              src="https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F4ed1abb4e7b8432696da3fc4bf216ad1?format=webp&width=800"
              alt="Woman"
              className="relative w-auto max-h-64 md:max-h-80 lg:max-h-[420px] object-contain bg-transparent"
              style={{
                filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.45))",
                zIndex: 20,
              }}
            />

            {/* bottom blur/fade to blend subject into background */}
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

      {/* Numbers / Impact */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
        delay={0.14}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <Link to="/services" className="group block rounded-lg">
            <div className="text-4xl font-extrabold text-foreground">
              <AnimatedCounter target={50} suffix="+" duration={1200} />
            </div>
            <div className="mt-2 text-sm text-foreground/85">
              Clients served
            </div>
          </Link>

          <Link to="/services" className="group block rounded-lg">
            <div className="text-4xl font-extrabold text-foreground">
              <AnimatedCounter target={80} suffix="+" duration={1400} />
            </div>
            <div className="mt-2 text-sm text-foreground/85">
              Projects shipped
            </div>
          </Link>

          <Link to="/services" className="group block rounded-lg">
            <div className="text-4xl font-extrabold text-foreground">
              <AnimatedCounter target={5} duration={1000} />
            </div>
            <div className="mt-2 text-sm text-foreground/85">Countries</div>
          </Link>
        </div>
      </Section>

      {/* Industries & Case Studies */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.15}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Industries we serve
            </h3>
            <p className="mt-3 text-foreground/85 max-w-prose">
              We partner with companies across sectors to deliver domain-aware,
              high-impact solutions.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                {
                  label: "Fintech",
                  desc: "Payments, billing, and financial platforms with strong compliance needs.",
                  icon: "target",
                },
                {
                  label: "Health",
                  desc: "Data-sensitive products and interoperable systems for care teams.",
                  icon: "palette",
                },
                {
                  label: "SaaS",
                  desc: "Scalable product platforms, analytics, and go-to-market tooling.",
                  icon: "cpu",
                },
                {
                  label: "Enterprise",
                  desc: "Legacy modernisation, integrations, and developer experience improvements.",
                  icon: "bar-chart-3",
                },
              ].map((it, idx) => {
                const Icon = getIconByName(it.icon);
                return (
                  <TiltCard
                    key={idx}
                    className="rounded-xl p-4 h-36 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-white/5">
                        <Icon className="h-5 w-5 text-primary/100" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {it.label}
                        </div>
                        <div className="text-sm text-foreground/80 mt-1">
                          {it.desc}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
            <div className="mt-8">
              <Link
                to="/services"
                className="inline-flex items-center rounded-full glass-card px-5 py-2 text-sm font-semibold"
              >
                Read more →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground">Case studies</h3>
            <p className="mt-3 text-foreground/85">
              Selected projects showing outcomes and impact — concise summaries
              with links to read more.
            </p>
            <div className="mt-6 flex flex-col gap-4 h-full">
              <article className="rounded-2xl border border-primary/20 p-4 glass-card flex gap-4 items-center h-36">
                <img
                  src="https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=400&q=80"
                  alt="Nimbus case study"
                  className="h-24 w-24 rounded-md object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex-1">
                  <div className="font-semibold text-foreground">
                    Platform scaling for Nimbus
                  </div>
                  <div className="text-sm text-foreground/80 mt-1">
                    Cut latency by 40% and reduced costs via targeted infra
                    improvements.
                  </div>
                  <div className="mt-3">
                    <Link
                      to="/services"
                      className="text-sm font-semibold text-foreground/90 hover:text-foreground"
                    >
                      Read case study →
                    </Link>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-primary/20 p-4 glass-card grid grid-cols-4 gap-4 items-center h-36">
                <div className="col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                    alt="Northstar case study"
                    className="h-28 w-28 rounded-md object-cover shadow-lg"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).onerror = null;
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="col-span-3">
                  <div className="font-semibold text-foreground">
                    Design system for Northstar
                  </div>
                  <div className="text-sm text-foreground/80 mt-1">
                    A shared component library enabling faster launches across
                    teams.
                  </div>
                  <div className="mt-3">
                    <Link
                      to="/services"
                      className="text-sm font-semibold text-foreground/90 hover:text-foreground"
                    >
                      Read case study →
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials - infographic style */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.25}
      >
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
            {[
              ...(testimonials || []),
              {
                id: "tt_extra",
                author: "Alex J.",
                role: "CEO, Inn Solutions",
                quote: "Working with AUIO was a Game-Changer.",
                avatar:
                  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&q=80",
              },
              {
                id: "tt4",
                author: "Sam R.",
                role: "Product Lead, Gamma",
                quote: "A focused team that delivers measurable outcomes.",
                avatar:
                  "https://images.unsplash.com/photo-1545996124-1b3aab1d3c5b?auto=format&fit=crop&w=400&q=80",
              },
            ]
              .slice(0, 4)
              .map((t: any, idx: number) => {
                const fallbacks = [
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&q=80",
                ];

                // map known authors to fixed web avatars to ensure consistent loading
                const rawAvatars: Record<string, string> = {
                  "alex m":
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
                  "priya s":
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
                  "alex j":
                    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&q=80",
                  "sam r":
                    "https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80",
                };

                const normalize = (s: string) =>
                  s
                    .toLowerCase()
                    .replace(/[^a-z0-9 ]/g, "")
                    .trim();

                // resolve avatar url for any testimonial
                let avatarUrl: string | null = null;

                const authorKey =
                  typeof t.author === "string" ? normalize(t.author) : "";
                // prefer explicit mapping for known authors
                if (authorKey && rawAvatars[authorKey]) {
                  avatarUrl = rawAvatars[authorKey];
                }

                // if not resolved, try t.avatar as string or object with url or id
                if (!avatarUrl && t && t.avatar) {
                  if (typeof t.avatar === "string") avatarUrl = t.avatar;
                  else if ((t.avatar as any).url)
                    avatarUrl = (t.avatar as any).url;
                  else if ((t.avatar as any).id)
                    avatarUrl = `/api/assets/${(t.avatar as any).id}`;
                }

                if (!avatarUrl) avatarUrl = fallbacks[idx % fallbacks.length];

                // ensure the avatar URL uses https and add small query parameters to help CDN
                if (
                  avatarUrl &&
                  avatarUrl.startsWith("https://images.unsplash.com") &&
                  avatarUrl.indexOf("auto=format") === -1
                ) {
                  avatarUrl = avatarUrl + "?auto=format&fit=crop&w=400&q=80";
                }

                // ensure full url (avoid relative API asset issues) - leave as-is otherwise

                return (
                  <motion.article
                    key={t.id}
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
                          {t.quote}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {t.author}
                          </div>
                          <div className="text-xs text-foreground/80">
                            {t.role}
                          </div>
                        </div>
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={`${t.author} avatar`}
                            className="h-12 w-12 rounded-full object-cover border-2 border-white/10"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).onerror =
                                null;
                              (e.currentTarget as HTMLImageElement).src =
                                fallbacks[idx % fallbacks.length];
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

      {/* News */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.3}
      >
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Latest News
          </h2>
          <Link
            to="/insights"
            className="text-sm font-semibold text-foreground/90 hover:text-foreground"
          >
            All insights
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n: any, idx: number) => (
            <article
              key={n.id}
              className="rounded-2xl border border-primary/20 bg-transparent overflow-hidden glass-card"
            >
              {(() => {
                const builderFallback =
                  "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F9aebb7e90f334acbb611405deeab415d?format=webp&width=1200&q=80";
                const q4Href =
                  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.livemint.com%2Fcompanies%2Fcompany-results%2Fq4-results-today-dmart-kotak-mahindra-idbi-bank-to-zen-tech-18-companies-to-declare-q4-results-2024-on-may-4-11714789780675.html&psig=AOvVaw0LKKs-2BIXMeJGos_tsuWA&ust=1759060848156000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCa3Mby-I8DFQAAAAAdAAAAABAL";
                const isQ4 = n?.title?.toLowerCase().includes("q4 highlights");
                const src =
                  typeof n?.image === "string"
                    ? n.image
                    : n?.image?.id
                    ? `/api/assets/${n.image.id}`
                    : isQ4
                    ? builderFallback
                    : "/placeholder.svg";
                const imgEl = (
                  <img
                    src={src}
                    alt=""
                    className="h-40 w-full object-cover border-b border-primary/10"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding={idx === 0 ? "sync" : "async"}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).onerror = null;
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                );
                return isQ4 ? (
                  <a href={q4Href} target="_blank" rel="noopener noreferrer">{imgEl}</a>
                ) : (
                  imgEl
                );
              })()}
              <div className="p-6">
                <h3 className="font-semibold text-foreground">{n.title}</h3>
                <p className="mt-2 text-sm text-foreground/90">{n.excerpt}</p>
                {n?.title?.toLowerCase().includes("q4 highlights") ? (
                  <a
                    href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.livemint.com%2Fcompanies%2Fcompany-results%2Fq4-results-today-dmart-kotak-mahindra-idbi-bank-to-zen-tech-18-companies-to-declare-q4-results-2024-on-may-4-11714789780675.html&psig=AOvVaw0LKKs-2BIXMeJGos_tsuWA&ust=1759060848156000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCa3Mby-I8DFQAAAAAdAAAAABAL"
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
          ))}
        </div>
      </Section>
    </div>
  );
}
