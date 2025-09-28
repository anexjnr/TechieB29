import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, Users, Award, Globe, TrendingUp, Zap, Heart, Shield, 
  Calendar, Trophy, User, Newspaper, Building, Package, Cloud, 
  ShieldCheck, Brain, CheckCircle, Star, MapPin, Phone, Mail,
  Briefcase, GraduationCap
} from "lucide-react";
import Section from "../components/site/Section";
import AnimatedTitle from "../components/site/AnimatedTitle";
import TiltCard from "../components/site/TiltCard";
import { Link } from "react-router-dom";

const BACKEND_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_BACKEND_URL) ||
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_BACKEND_URL) ||
  "";


// Define proper TypeScript interfaces
interface AboutData {
  heading: string;
  description: string;
  content: string;
  image?: string | { id: string } | null; // Make image optional
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
    description: "We are a compact team focused on clarity, velocity, and outcomes. Building the future through innovation and excellence.",
    content: "Senior engineers and designers working as one unit. Fewer handoffs, more accountability. We operate with lean process and a bias for action.",
    image: null // Add image property to initial state
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/about`);
        if (res.ok) {
          const data: AboutData[] = await res.json();
          if (Array.isArray(data) && data.length) setAbout(data[0]);
        }
      } catch (e) {
        console.error("API call failed, using fallback content:", e);
        // Keep the fallback data we set above
      }
    })();
  }, []);

  const renderImage = (): JSX.Element => {
    const img = about?.image;
    const fallbackImg = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80";
    
    let imageSrc = fallbackImg;
    
    if (typeof img === "string") {
      imageSrc = img;
    } else if (img && typeof img === "object" && "id" in img) {
      imageSrc = `/api/assets/${img.id}`;
    }
    
    return (
      <img
        src={imageSrc}
        alt="Team"
        className="w-full h-64 object-cover rounded-2xl border border-primary/20"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = fallbackImg;
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <AnimatedTitle
            text={loading ? "About Us" : about?.heading || "About Us"}
            className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-foreground"
          />
          <p className="mt-6 text-lg text-foreground/90 max-w-2xl mx-auto">
            {loading
              ? "Loading..."
              : about?.description ||
                "We are a compact team focused on clarity, velocity, and outcomes. Building the future through innovation and excellence."}
          </p>
        </div>
      </Section>

      {/* Company Stats */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div className="rounded-lg glass-card p-6">
            <div className="text-4xl font-extrabold text-foreground">
              <AnimatedCounter target={7} suffix="+" duration={1200} />
            </div>
            <div className="mt-2 text-sm text-foreground/85">Years Experience</div>
          </div>
          <div className="rounded-lg glass-card p-6">
            <div className="text-4xl font-extrabold text-foreground">
              <AnimatedCounter target={150} suffix="+" duration={1400} />
            </div>
            <div className="mt-2 text-sm text-foreground/85">Projects Completed</div>
          </div>
          <div className="rounded-lg glass-card p-6">
            <div className="text-4xl font-extrabold text-foreground">
              <AnimatedCounter target={50} suffix="+" duration={1000} />
            </div>
            <div className="mt-2 text-sm text-foreground/85">Team Members</div>
          </div>
          <div className="rounded-lg glass-card p-6">
            <div className="text-4xl font-extrabold text-foreground">
              <AnimatedCounter target={15} suffix="+" duration={1600} />
            </div>
            <div className="mt-2 text-sm text-foreground/85">Countries Served</div>
          </div>
        </div>
      </Section>

      {/* Who We Are Section */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.15}>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
            Who We Are
          </h2>
          <p className="text-lg text-foreground/85 max-w-3xl mx-auto">
            Discover our journey, achievements, leadership team, and the people who drive our success forward every day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="space-y-4 text-foreground/85 max-w-prose">
              <p>
                {loading
                  ? ""
                  : about?.content ||
                    "Senior engineers and designers working as one unit. Fewer handoffs, more accountability. We operate with lean process and a bias for action."}
              </p>
              <p>
                We are a team of passionate professionals who believe in the power of technology to transform businesses. Our diverse backgrounds in engineering, design, and strategy enable us to deliver comprehensive solutions that drive real results.
              </p>
              <p>
                With a remote-first culture and offices spanning multiple continents, we combine global perspectives with local insights to create products that resonate with users worldwide.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full glass-card px-6 py-3 text-sm font-semibold text-foreground shadow-lg hover:scale-105 transition-all duration-200"
              >
                Work with us
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-3xl glass-card border border-primary/20 p-6 overflow-hidden">
              {renderImage()}
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 rounded-full glass-card p-3">
                <Users className="h-6 w-6 text-primary/100" />
              </div>
              <div className="absolute bottom-4 left-4 rounded-full glass-card p-3">
                <Award className="h-6 w-6 text-primary/100" />
              </div>
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Our Journey</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { year: "2018", title: "Founded", description: "Started with a vision to revolutionize digital experiences" },
              { year: "2020", title: "Global Expansion", description: "Expanded operations to serve clients across 15 countries" },
              { year: "2023", title: "Innovation Hub", description: "Established our AI and emerging technologies center" }
            ].map((milestone, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <TiltCard className="text-center h-full">
                  <div className="text-2xl font-bold text-primary/100 mb-2">{milestone.year}</div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{milestone.title}</h4>
                  <p className="text-sm text-foreground/80">{milestone.description}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Awards Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Awards & Recognition</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { award: "Tech Innovation Award", year: "2023", org: "TechCrunch" },
              { award: "Best UX Design", year: "2022", org: "Awwwards" },
              { award: "Startup of the Year", year: "2021", org: "Forbes" },
              { award: "Excellence in AI", year: "2023", org: "AI Summit" }
            ].map((award, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                }}
              >
                <TiltCard className="text-center h-full">
                  <Award className="h-10 w-10 text-primary/100 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">{award.award}</h4>
                  <p className="text-sm text-foreground/70">{award.org} • {award.year}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leaders Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Leadership Team</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Sarah Johnson", 
                role: "CEO & Co-Founder", 
                bio: "Former VP at Google, leading our vision and strategy",
                image: "https://images.unsplash.com/photo-1494790108755-2616b66139e6?auto=format&fit=crop&w=300&q=80"
              },
              { 
                name: "Michael Chen", 
                role: "CTO & Co-Founder", 
                bio: "Ex-Tesla engineer, driving our technical innovation",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
              },
              { 
                name: "Emily Rodriguez", 
                role: "VP of Design", 
                bio: "Award-winning designer with 15+ years experience",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
              }
            ].map((leader, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <TiltCard className="text-center">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-primary/20"
                  />
                  <h4 className="text-xl font-semibold text-foreground mb-1">{leader.name}</h4>
                  <p className="text-primary/100 font-medium mb-3">{leader.role}</p>
                  <p className="text-sm text-foreground/80">{leader.bio}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Media Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Media & Press</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                title: "How We're Revolutionizing Digital Transformation", 
                outlet: "TechCrunch",
                date: "Dec 2023",
                excerpt: "A deep dive into our innovative approach to enterprise solutions..."
              },
              { 
                title: "The Future of AI-Driven Design", 
                outlet: "Forbes",
                date: "Nov 2023",
                excerpt: "Our CEO discusses the intersection of artificial intelligence and user experience..."
              },
              { 
                title: "Startup Spotlight: Building Global Impact", 
                outlet: "Wired",
                date: "Oct 2023",
                excerpt: "From a small team to serving Fortune 500 companies worldwide..."
              },
              { 
                title: "Innovation in Remote Work Culture", 
                outlet: "Harvard Business Review",
                date: "Sep 2023",
                excerpt: "How we built a successful distributed team across multiple continents..."
              }
            ].map((article, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: idx % 2 === 0 ? -30 : 30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                }}
              >
                <TiltCard className="h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <Newspaper className="h-5 w-5 text-primary/100 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary/100">{article.outlet}</p>
                      <p className="text-xs text-foreground/60">{article.date}</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{article.title}</h4>
                  <p className="text-sm text-foreground/80">{article.excerpt}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Board of Directors Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Building className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Board of Directors</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: "Robert Kim", 
                role: "Chairman",
                company: "Former CEO, Microsoft",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
              },
              { 
                name: "Dr. Lisa Wang", 
                role: "Independent Director",
                company: "Stanford University",
                image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=300&q=80"
              },
              { 
                name: "James Thompson", 
                role: "Investor Director",
                company: "Sequoia Capital",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
              },
              { 
                name: "Maria Santos", 
                role: "Independent Director",
                company: "Former CMO, Adobe",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
              }
            ].map((director, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                }}
              >
                <TiltCard className="text-center">
                  <img 
                    src={director.image} 
                    alt={director.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border border-primary/20"
                  />
                  <h4 className="font-semibold text-foreground mb-1">{director.name}</h4>
                  <p className="text-sm text-primary/100 mb-1">{director.role}</p>
                  <p className="text-xs text-foreground/70">{director.company}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* What We Do Section */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-muted/30" delay={0.2}>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
            What We Do
          </h2>
          <p className="text-lg text-foreground/85 max-w-3xl mx-auto">
            Our comprehensive suite of services spans cutting-edge technology domains, delivering innovative solutions that drive business growth.
          </p>
        </div>

        {/* Products Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Products</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "DataFlow Pro", 
                category: "Analytics Platform",
                description: "Advanced data analytics and visualization platform for enterprise insights",
                features: ["Real-time Analytics", "Custom Dashboards", "API Integration"]
              },
              { 
                name: "CloudSync Enterprise", 
                category: "Collaboration Suite",
                description: "Seamless file sharing and team collaboration across global teams",
                features: ["End-to-end Encryption", "Version Control", "Team Workspaces"]
              },
              { 
                name: "AutoScale Manager", 
                category: "Infrastructure Tool",
                description: "Intelligent infrastructure scaling and resource optimization",
                features: ["Auto-scaling", "Cost Optimization", "Performance Monitoring"]
              }
            ].map((product, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <TiltCard className="h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg glass-card flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary/100" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{product.name}</h4>
                      <p className="text-sm text-primary/100">{product.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 mb-4">{product.description}</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-xs text-foreground/70">
                        <CheckCircle className="h-3 w-3 text-primary/100" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cloud Services Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Cloud className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Cloud Solutions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                service: "Multi-Cloud Architecture", 
                description: "Design and implement robust multi-cloud strategies for maximum reliability and performance",
                benefits: ["99.99% Uptime", "Global Distribution", "Vendor Agnostic"]
              },
              { 
                service: "Cloud Migration", 
                description: "Seamless migration of legacy systems to modern cloud infrastructure with minimal downtime",
                benefits: ["Zero Downtime", "Data Integrity", "Cost Reduction"]
              },
              { 
                service: "DevOps & CI/CD", 
                description: "Streamlined development pipelines and automated deployment processes for faster delivery",
                benefits: ["Faster Deployment", "Quality Assurance", "Automated Testing"]
              },
              { 
                service: "Cloud Security", 
                description: "Comprehensive security frameworks and compliance management for cloud environments",
                benefits: ["Advanced Encryption", "Compliance Ready", "Threat Detection"]
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: idx % 2 === 0 ? -30 : 30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                }}
              >
                <TiltCard className="h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <Cloud className="h-6 w-6 text-primary/100 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">{service.service}</h4>
                      <p className="text-sm text-foreground/80 mb-3">{service.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.benefits.map((benefit, bidx) => (
                          <span key={bidx} className="px-2 py-1 text-xs bg-primary/10 text-primary/100 rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cybersecurity Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Cybersecurity</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Threat Assessment", 
                description: "Comprehensive security audits and vulnerability assessments",
                icon: Shield
              },
              { 
                title: "Identity Management", 
                description: "Advanced IAM solutions and zero-trust architecture implementation",
                icon: Users
              },
              { 
                title: "Incident Response", 
                description: "24/7 monitoring and rapid response to security incidents",
                icon: Zap
              },
              { 
                title: "Compliance Management", 
                description: "GDPR, HIPAA, SOC2 compliance frameworks and auditing",
                icon: CheckCircle
              },
              { 
                title: "Security Training", 
                description: "Employee security awareness and phishing simulation programs",
                icon: GraduationCap
              },
              { 
                title: "Penetration Testing", 
                description: "Ethical hacking and security testing to identify vulnerabilities",
                icon: Target
              }
            ].map((security, idx) => {
              const Icon = security.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                  }}
                >
                  <TiltCard className="text-center h-full">
                    <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary/100" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">{security.title}</h4>
                    <p className="text-sm text-foreground/80">{security.description}</p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Solutions Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Brain className="h-8 w-8 text-primary/100" />
            <h3 className="text-3xl font-bold text-foreground">Artificial Intelligence</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
              }}
            >
              <TiltCard className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-8 w-8 text-primary/100" />
                  <h4 className="text-2xl font-bold text-foreground">Machine Learning Solutions</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary/100 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-foreground">Predictive Analytics</h5>
                      <p className="text-sm text-foreground/80">Advanced forecasting models for business intelligence</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary/100 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-foreground">Natural Language Processing</h5>
                      <p className="text-sm text-foreground/80">Intelligent text analysis and automated content generation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary/100 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-foreground">Computer Vision</h5>
                      <p className="text-sm text-foreground/80">Image recognition and automated visual analysis systems</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
              }}
            >
              <TiltCard className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-8 w-8 text-primary/100" />
                  <h4 className="text-2xl font-bold text-foreground">AI Integration Services</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary/100 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-foreground">Custom AI Models</h5>
                      <p className="text-sm text-foreground/80">Tailored machine learning models for specific business needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary/100 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-foreground">AI Automation</h5>
                      <p className="text-sm text-foreground/80">Intelligent process automation and workflow optimization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary/100 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-foreground">AI Consulting</h5>
                      <p className="text-sm text-foreground/80">Strategic guidance for AI adoption and implementation</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* Purpose & Values */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.25}>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Our Purpose & Values
          </h2>
          <p className="mt-4 text-foreground/85 max-w-2xl mx-auto">
            The principles that guide everything we do and shape the way we work with our clients.
          </p>
        </div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Target,
              title: "Purpose-Driven",
              description: "Every solution we build serves a meaningful purpose and creates lasting impact."
            },
            {
              icon: Zap,
              title: "Innovation First",
              description: "We embrace cutting-edge technologies and creative approaches to solve complex challenges."
            },
            {
              icon: Heart,
              title: "Client-Centric",
              description: "Our clients' success is our success. We build long-term partnerships based on trust."
            },
            {
              icon: Shield,
              title: "Quality Excellence",
              description: "We maintain the highest standards in everything we deliver, ensuring reliability and scalability."
            }
          ].map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <TiltCard className="h-full p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full glass-card flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary/100" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-foreground/80">{value.description}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </Section>

      {/* How We Serve - Enhanced Timeline */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-muted/30" delay={0.3}>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            How We Serve
          </h2>
          <p className="mt-4 text-foreground/85 max-w-2xl mx-auto">
            Our proven methodology that ensures successful project delivery from concept to completion.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/80 to-primary/50" />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="space-y-12"
          >
            {[
              {
                phase: "01",
                title: "Discover",
                description: "Align on goals, constraints, and success metrics. We dive deep into understanding your vision and requirements.",
                icon: Target,
                position: "left"
              },
              {
                phase: "02", 
                title: "Design",
                description: "Prototype, test, refine with users and stakeholders. Creating user-centered designs that solve real problems.",
                icon: Globe,
                position: "right"
              },
              {
                phase: "03",
                title: "Build", 
                description: "Implement iteratively with quality gates and CI. Building robust, scalable solutions with modern technologies.",
                icon: TrendingUp,
                position: "left"
              },
              {
                phase: "04",
                title: "Evolve",
                description: "Measure outcomes, learn, and iterate. Continuous improvement based on data and user feedback.",
                icon: Zap,
                position: "right"
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              const isLeft = step.position === "left";
              
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: isLeft ? -50 : 50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                  }}
                  className={`relative flex items-center ${
                    isLeft ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
                  
                  {/* Content Card */}
                  <div className={`w-5/12 ${isLeft ? "pr-8" : "pl-8"}`}>
                    <TiltCard className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary/100" />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-primary/80 mb-1">
                            PHASE {step.phase}
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
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.35}>
        <div className="text-center rounded-3xl glass-card border border-primary/20 p-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-foreground/85 max-w-2xl mx-auto mb-8">
            Let's discuss your project and discover how we can help you achieve your goals with innovative technology solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full glass-card px-8 py-3 text-sm font-semibold text-foreground shadow-lg hover:scale-105 transition-all duration-200"
              data-testid="start-project-btn"
            >
              Start a Project
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center rounded-full border border-primary/20 px-8 py-3 text-sm font-semibold text-foreground/90 hover:text-foreground hover:scale-105 transition-all duration-200"
              data-testid="view-services-btn"
            >
              View Services
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}