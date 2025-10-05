import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  Award,
  Globe,
  TrendingUp,
  Zap,
  Heart,
  Shield,
  Calendar,
  Trophy,
  User,
  Newspaper,
  Building,
  Package,
  Cloud,
  ShieldCheck,
  Brain,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Section from "../components/site/Section";
import AnimatedTitle from "../components/site/AnimatedTitle";
import TiltCard from "../components/site/TiltCard";
import LoadingScreen from "../components/site/LoadingScreen";
import { Link } from "react-router-dom";

const BACKEND_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_BACKEND_URL) ||
  (typeof process !== "undefined" &&
    (process as any).env?.REACT_APP_BACKEND_URL) ||
  "";

const DEFAULT_ABOUT_DESCRIPTION =
  "We are a technology solutions company focused on helping businesses unlock new possibilities with AI, digital transformation, and enterprise innovation.";

const DEFAULT_ABOUT_PARAGRAPHS = [
  "Senior engineers and designers working as one unit. Fewer handoffs, more accountability. We operate with lean process and a bias for action.",
  "We are a team of passionate professionals who believe in the power of technology to transform businesses. Our diverse backgrounds in engineering, design, and strategy enable us to deliver comprehensive solutions that drive real results.",
];

import { getIconByName } from "../lib/iconMap";

interface AwardItem {
  icon?: string;
  title: string;
  subtitle?: string;
}

interface LeaderItem {
  name: string;
  role?: string;
  bio?: string;
  avatar?: string | { id: string } | null;
}

interface AboutData {
  heading: string;
  description?: string;
  content: string;
  image?: string | { id: string } | null;
  awards?: AwardItem[] | null;
  leadership?: LeaderItem[] | null;
  valuesHeading?: string | null;
  valuesSubheading?: string | null;
  valuesCards?: AwardItem[] | null;
  serveHeading?: string | null;
  serveSubheading?: string | null;
  serveSteps?: any[] | null;
}

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 1500,
}: AnimatedCounterProps) {
  const [value, setValue] = useState<number>(0);
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const startedRef = React.useRef<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const easeOutQuad = (t: number): number => t * (2 - t);

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

export default function About() {
  const [about, setAbout] = useState<AboutData>({
    heading: "About Us",
    description: DEFAULT_ABOUT_DESCRIPTION,
    content: DEFAULT_ABOUT_PARAGRAPHS.join("\n\n"),
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchAbout = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/about`, {
          cache: "no-store",
        });
        if (!res.ok) return null;
        const data: AboutData[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) return null;
        return data[0];
      } catch (e) {
        console.error("API call failed for /api/about:", e);
        return null;
      }
    };

    const update = async () => {
      setLoading(true);
      const latest = await fetchAbout();
      if (mounted && latest)
        setAbout((prev) => {
          try {
            const prevJson = JSON.stringify(prev || {});
            const latestJson = JSON.stringify(latest || {});
            if (prevJson !== latestJson) return latest;
          } catch (e) {
            return latest;
          }
          return prev;
        });
      setLoading(false);
    };

    // Fetch once immediately for fastest render
    update();

    // Re-fetch on window focus to pick up changes
    const onFocus = () => update();
    window.addEventListener("focus", onFocus);

    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const contentParagraphs = useMemo(() => {
    const raw = typeof about?.content === "string" ? about.content : "";
    const paragraphs = raw
      .split(/\r?\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    return paragraphs.length ? paragraphs : DEFAULT_ABOUT_PARAGRAPHS;
  }, [about?.content]);

  const description = useMemo(() => {
    const raw = typeof about?.description === "string" ? about.description : "";
    const trimmed = raw.trim();
    if (trimmed.length) return trimmed;
    if (contentParagraphs.length) return contentParagraphs[0];
    return DEFAULT_ABOUT_DESCRIPTION;
  }, [about?.description, contentParagraphs]);

  const detailParagraphs = useMemo(() => {
    const desc = description.trim();
    return contentParagraphs.filter((paragraph, index) => {
      if (index === 0 && paragraph.trim() === desc) {
        return false;
      }
      return true;
    });
  }, [contentParagraphs, description]);

  const renderImage = (): JSX.Element | null => {
    const img = (about as any)?.image ?? (about as any)?.imageUrl ?? null;

    // Only render if database provided an image. Do NOT use external fallback images.
    if (!img) return null;

    let imageSrc: string | null = null;
    if (typeof img === "string") imageSrc = img;
    else if (img && typeof img === "object" && "id" in img)
      imageSrc = `/api/assets/${img.id}`;

    if (!imageSrc) return null;

    let versionKey: string | null = null;
    if (
      typeof img === "object" &&
      img &&
      "id" in img &&
      typeof img.id === "string"
    ) {
      versionKey = img.id;
    } else if (typeof imageSrc === "string") {
      const match = imageSrc.match(/\/api\/assets\/(.+?)(?:[/?].*)?$/);
      if (match && match[1]) {
        versionKey = match[1];
      }
    }

    const finalSrc = versionKey
      ? `${imageSrc}${imageSrc.includes("?") ? "&" : "?"}v=${encodeURIComponent(versionKey)}`
      : imageSrc;

    return (
      <img
        src={finalSrc}
        alt="Team"
        className="w-full h-64 object-cover rounded-2xl border border-primary/20"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          // hide image if it fails to load
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        <div className="text-center">
          <AnimatedTitle
            text={about?.heading || "About Us"}
            className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-foreground"
          />
        </div>
      </Section>

      {/* Who We Are Section */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 pb-16"
        delay={0.15}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start mb-16">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="sr-only">{about?.heading || "Who We Are"}</h2>
              <p className="mt-4 text-lg text-foreground/85 max-w-2xl">
                {description}
              </p>
            </div>
            <div className="space-y-4 text-foreground/85 max-w-prose">
              {detailParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl glass-card border border-primary/20 p-6 overflow-hidden flex items-center justify-center">
              {renderImage()}
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">
              Awards & Recognition
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(about?.awards && about.awards.length
              ? about.awards
              : [
                  {
                    title: "Tech Innovation Award",
                    subtitle: "TechCrunch • 2023",
                    icon: "award",
                  },
                  {
                    title: "Best UX Design",
                    subtitle: "Awwwards • 2022",
                    icon: "star",
                  },
                  {
                    title: "Startup of the Year",
                    subtitle: "Forbes • 2021",
                    icon: "award",
                  },
                  {
                    title: "Excellence in AI",
                    subtitle: "AI Summit • 2023",
                    icon: "sparkles",
                  },
                ]
            ).map((award: any, idx: number) => {
              const Icon =
                getIconByName((award && award.icon) || "award") || Award;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.45 },
                    },
                  }}
                >
                  <TiltCard className="h-full flex flex-col items-center justify-center text-center py-6">
                    <div className="mb-3 flex items-center justify-center">
                      <Icon className="h-10 w-10 text-primary/100" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {award.title}
                    </h4>
                    <p className="text-sm text-foreground/80">
                      {award.subtitle}
                    </p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Leadership */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">
              Leadership Team
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(about?.leadership && about.leadership.length
              ? about.leadership
              : [
                  {
                    name: "Sarah Johnson",
                    role: "CEO & Co-Founder",
                    bio: "Former VP at Google, leading our vision and strategy",
                    avatar:
                      "https://images.unsplash.com/photo-1494790108755-2616b66139e6?auto=format&fit=crop&w=300&q=80",
                  },
                  {
                    name: "Michael Chen",
                    role: "CTO & Co-Founder",
                    bio: "Ex-Tesla engineer, driving our technical innovation",
                    avatar:
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
                  },
                  {
                    name: "Emily Rodriguez",
                    role: "VP of Design",
                    bio: "Award-winning designer with 15+ years experience",
                    avatar:
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
                  },
                ]
            ).map((leader: any, idx: number) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                }}
              >
                <TiltCard className="text-center">
                  {(() => {
                    const avatarUrl =
                      typeof leader.avatar === "string"
                        ? leader.avatar
                        : leader.avatar && (leader.avatar as any).id
                          ? `/api/assets/${(leader.avatar as any).id}`
                          : null;
                    const initials =
                      (leader as any).avatarInitials ||
                      (leader.name || "")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                    if (avatarUrl) {
                      return (
                        <img
                          src={avatarUrl}
                          alt={leader.name}
                          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-primary/20"
                        />
                      );
                    }
                    return (
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary/50 text-white font-bold text-lg border-2 border-primary/20">
                        {initials}
                      </div>
                    );
                  })()}

                  <h4 className="text-xl font-semibold text-foreground mb-1">
                    {leader.name}
                  </h4>
                  <p className="text-primary/100 font-medium mb-3">
                    {leader.role}
                  </p>
                  <p className="text-sm text-foreground/80">{leader.bio}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Purpose & Values */}
      {((about?.valuesHeading &&
        String(about.valuesHeading).trim().length > 0) ||
        (about?.valuesSubheading &&
          String(about.valuesSubheading).trim().length > 0) ||
        (Array.isArray(about?.valuesCards) &&
          (about!.valuesCards as any[]).length > 0)) && (
        <Section
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
          delay={0.25}
        >
          <div className="text-center mb-12">
            {about?.valuesHeading && (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {about.valuesHeading}
              </h2>
            )}
            {about?.valuesSubheading && (
              <p className="mt-4 text-foreground/85 max-w-2xl mx-auto">
                {about.valuesSubheading}
              </p>
            )}
          </div>

          {Array.isArray(about?.valuesCards) &&
            about.valuesCards.length > 0 && (
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
                {about.valuesCards.map((card: any, idx: number) => {
                  const Icon = getIconByName(card?.icon) as any;
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
                      <TiltCard className="h-full p-6 text-center">
                        {Icon ? (
                          <div className="mx-auto w-12 h-12 rounded-full glass-card border border-primary/20 flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-primary/100" />
                          </div>
                        ) : null}
                        <h3 className="font-semibold text-foreground mb-2">
                          {card.title}
                        </h3>
                        {card.subtitle && (
                          <p className="text-sm text-foreground/80">
                            {card.subtitle}
                          </p>
                        )}
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
        </Section>
      )}

      {/* How We Serve - Enhanced Timeline */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.3}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {about?.serveHeading || "How We Serve"}
          </h2>
          <p className="mt-4 text-foreground/85 max-w-2xl mx-auto">
            {about?.serveSubheading ||
              "Our proven methodology that ensures successful project delivery from concept to completion."}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/80 to-primary/50" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="space-y-12"
          >
            {(
              (Array.isArray((about as any)?.serveSteps) && (about as any).serveSteps.length
                ? (about as any).serveSteps
                : [
                    {
                      phase: "01",
                      title: "Discover",
                      description:
                        "Align on goals, constraints, and success metrics. We dive deep into understanding your vision and requirements.",
                      icon: "target",
                    },
                    {
                      phase: "02",
                      title: "Design",
                      description:
                        "Prototype, test, refine with users and stakeholders. Creating user-centered designs that solve real problems.",
                      icon: "globe",
                    },
                    {
                      phase: "03",
                      title: "Build",
                      description:
                        "Implement iteratively with quality gates and CI. Building robust, scalable solutions with modern technologies.",
                      icon: "trending-up",
                    },
                    {
                      phase: "04",
                      title: "Evolve",
                      description:
                        "Measure outcomes, learn, and iterate. Continuous improvement based on data and user feedback.",
                      icon: "zap",
                    },
                  ]) as any[]
            ).map((step: any, idx: number) => {
              const Icon = (getIconByName(step?.icon) as any) || Target;
              const isLeft = idx % 2 === 0;
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
                  className={`relative flex items-center ${isLeft ? "justify-start" : "justify-end"}`}
                >
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
                  <div className={`w-5/12 ${isLeft ? "pr-8" : "pl-8"}`}>
                    <TiltCard className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{
                              background:
                                "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
                            }}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-primary/100 mb-1">
                            PHASE {step?.phase || String(idx + 1).padStart(2, "0")}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-sm text-foreground/80">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        delay={0.35}
      >
        <div className="text-center rounded-3xl glass-card border border-primary/20 p-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-foreground/85 max-w-2xl mx-auto mb-8">
            Let's discuss your project and discover how we can help you achieve
            your goals with innovative technology solutions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full glass-card px-6 py-3 text-sm font-semibold text-foreground shadow-lg"
            >
              Get in touch
            </Link>
            <Link
              to="/services"
              className="text-sm font-semibold text-foreground/90 hover:text-foreground"
            >
              Explore services
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
