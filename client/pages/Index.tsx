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
              "https://images.unsplash.com/photo-1503481766315-1f9d1d9c7f1a?auto=format&fit=crop&w=1200&q=80",
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
            "https://images.unsplash.com/photo-1503481766315-1f9d1d9c7f1a?auto=format&fit=crop&w=1200&q=80",
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
                We partner with leadership to translate uncertain opportunities into clear roadmaps — combining user research, pragmatic engineering, and measurable outcomes. Our teams have shipped platforms for startups and enterprises across regulated and consumer markets.
              </p>
              <p>
                Operating as a remote-first company with strategic offices globally, we emphasize clarity, fast feedback loops, and long-term partnerships that prioritize user value and technical excellence.
              </p>
            </div>

            <div className="mt-6">
              <Link className="inline-flex items-center rounded-full glass-card px-5 py-2 text-sm font-semibold" to="/about">
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
                width: '64%',
                height: '80%',
                transform: 'translateY(6%)',
                background: 'radial-gradient(circle at 40% 30%, rgba(124,58,237,0.36) 0%, rgba(167,139,250,0.12) 35%, transparent 70%)',
                filter: 'blur(38px) brightness(0.95)',
                zIndex: 10,
              }}
            />

            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F4ed1abb4e7b8432696da3fc4bf216ad1?format=webp&width=800"
              alt="Woman"
              className="relative w-auto max-h-64 md:max-h-80 lg:max-h-[420px] object-contain bg-transparent"
              style={{
                filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.45))',
                zIndex: 20,
              }}
            />

            {/* bottom blur/fade to blend subject into background */}
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 0,
                width: '70%',
                height: '160px',
                zIndex: 25,
                background: 'linear-gradient(180deg, rgba(124,58,237,0) 0%, rgba(124,58,237,0.18) 40%, rgba(124,58,237,0.6) 85%, rgba(167,139,250,0.8) 100%)',
                filter: 'blur(14px)',
                borderRadius: '40px',
              }}
            />
          </div>
        </div>
      </Section>

      {/* Numbers / Impact */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" delay={0.14}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-extrabold text-foreground">120+</div>
            <div className="mt-2 text-sm text-foreground/85">Clients served</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-foreground">300+</div>
            <div className="mt-2 text-sm text-foreground/85">Projects shipped</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-foreground">8</div>
            <div className="mt-2 text-sm text-foreground/85">Countries</div>
          </div>
        </div>
      </Section>

      {/* Industries & Case Studies */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Industries we serve</h3>
            <p className="mt-3 text-foreground/85 max-w-prose">We partner with companies across sectors to deliver domain-aware, high-impact solutions.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 glass-card border border-primary/20">
                <div className="font-semibold text-foreground">Fintech</div>
                <div className="text-sm text-foreground/80 mt-2">Payments, billing, and financial platforms with strong compliance needs.</div>
              </div>
              <div className="rounded-xl p-4 glass-card border border-primary/20">
                <div className="font-semibold text-foreground">Health</div>
                <div className="text-sm text-foreground/80 mt-2">Data-sensitive products and interoperable systems for care teams.</div>
              </div>
              <div className="rounded-xl p-4 glass-card border border-primary/20">
                <div className="font-semibold text-foreground">SaaS</div>
                <div className="text-sm text-foreground/80 mt-2">Scalable product platforms, analytics, and go-to-market tooling.</div>
              </div>
              <div className="rounded-xl p-4 glass-card border border-primary/20">
                <div className="font-semibold text-foreground">Enterprise</div>
                <div className="text-sm text-foreground/80 mt-2">Legacy modernisation, integrations, and developer experience improvements.</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground">Case studies</h3>
            <p className="mt-3 text-foreground/85">Selected projects showing outcomes and impact — concise summaries with links to read more.</p>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <article className="rounded-2xl border border-primary/20 p-4 glass-card flex gap-4 items-center">
                <img src="/placeholder.svg" alt="case" className="h-24 w-24 rounded-md object-cover" />
                <div>
                  <div className="font-semibold text-foreground">Platform scaling for Nimbus</div>
                  <div className="text-sm text-foreground/80 mt-1">Cut latency by 40% and reduced costs via targeted infra improvements.</div>
                  <div className="mt-3">
                    <Link to="/services" className="text-sm font-semibold text-foreground/90 hover:text-foreground">Read case study →</Link>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-primary/20 p-4 glass-card flex gap-4 items-center">
                <img src="/placeholder.svg" alt="case" className="h-24 w-24 rounded-md object-cover" />
                <div>
                  <div className="font-semibold text-foreground">Design system for Northstar</div>
                  <div className="text-sm text-foreground/80 mt-1">A shared component library enabling faster launches across teams.</div>
                  <div className="mt-3">
                    <Link to="/services" className="text-sm font-semibold text-foreground/90 hover:text-foreground">Read case study →</Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials slider (simple auto scroll) */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.25}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Testimonials
        </h2>
        <div className="mt-8 overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="flex gap-6 animate-[slide_20s_linear_infinite] will-change-transform"
          >
            {testimonials.length ? (
              testimonials.map((t: any) => (
                <motion.figure
                  key={t.id}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    },
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="min-w-[320px] sm:min-w-[420px] rounded-2xl border border-primary/20 bg-transparent p-6 glass-card"
                >
                  <Quote className="h-5 w-5 text-foreground/90" />
                  <blockquote className="mt-3 text-foreground">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-foreground/90">
                    {t.author} {t.role ? `, ${t.role}` : ""}
                  </figcaption>
                  {t.avatar ? (
                    typeof t.avatar === "string" ? (
                      <motion.img
                        src={t.avatar}
                        alt="avatar"
                        className="mt-3 h-12 w-12 rounded-full object-cover"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    ) : t.avatar.id ? (
                      <motion.img
                        src={`/api/assets/${t.avatar.id}`}
                        alt="avatar"
                        className="mt-3 h-12 w-12 rounded-full object-cover"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    ) : null
                  ) : null}
                </motion.figure>
              ))
            ) : (
              <div className="text-foreground/90">No testimonials yet</div>
            )}
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
          {news.map((n: any) => (
            <article
              key={n.id}
              className="rounded-2xl border border-primary/20 bg-transparent overflow-hidden glass-card"
            >
              {n.image ? (
                typeof n.image === "string" ? (
                  <img
                    src={n.image}
                    alt=""
                    className="h-40 w-full object-cover border-b border-primary/10"
                  />
                ) : n.image.id ? (
                  <img
                    src={`/api/assets/${n.image.id}`}
                    alt=""
                    className="h-40 w-full object-cover border-b border-primary/10"
                  />
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt=""
                    className="h-40 w-full object-cover border-b border-primary/10"
                  />
                )
              ) : (
                <img
                  src="/placeholder.svg"
                  alt=""
                  className="h-40 w-full object-cover border-b border-primary/10"
                />
              )}
              <div className="p-6">
                <h3 className="font-semibold text-foreground">{n.title}</h3>
                <p className="mt-2 text-sm text-foreground/90">{n.excerpt}</p>
                <button className="mt-4 text-sm font-semibold text-foreground/90 hover:text-foreground">
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
