import { ArrowRight, Cpu, Palette, Target, BarChart3, Quote } from "lucide-react";
import Section from "@/components/site/Section";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Index() {
  const [news, setNews] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [sections, setSections] = useState<Record<string, any>>({});

  useEffect(() => {
    (async () => {
      try {
        const s = await fetch('/api/sections').then(r => r.json());
        const map: Record<string, any> = {};
        if (Array.isArray(s)) s.forEach((it: any) => { if (it && it.key) map[it.key] = it; });
        setSections(map);
      } catch (e) { console.error(e); }

      try {
        const n = await fetch('/api/news').then((r) => r.json());
        const fetchedNews = Array.isArray(n) ? n.filter((x:any)=> x.enabled !== false).slice(0,3) : [];
        if (fetchedNews.length) setNews(fetchedNews);
        else {
          // fallback sample news with external images
          setNews([
            { id: 's1', title: 'Q4 Highlights', excerpt: 'Milestones across platform and growth.', image: 'https://images.unsplash.com/photo-1503481766315-1f9d1d9c7f1a?auto=format&fit=crop&w=1200&q=80' },
            { id: 's2', title: 'New Office', excerpt: 'We expanded to Berlin.', image: 'https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=80' },
            { id: 's3', title: 'Open Roles', excerpt: "We're hiring across the stack.", image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' },
          ]);
        }
      } catch (e) { console.error(e); setNews([
        { id: 's1', title: 'Q4 Highlights', excerpt: 'Milestones across platform and growth.', image: 'https://images.unsplash.com/photo-1503481766315-1f9d1d9c7f1a?auto=format&fit=crop&w=1200&q=80' },
        { id: 's2', title: 'New Office', excerpt: 'We expanded to Berlin.', image: 'https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=80' },
        { id: 's3', title: 'Open Roles', excerpt: "We're hiring across the stack.", image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' },
      ]); }

      try {
        const t = await fetch('/api/testimonials').then((r) => r.json());
        const fetchedT = Array.isArray(t) ? t.filter((x:any)=> x.enabled !== false) : [];
        if (fetchedT.length) setTestimonials(fetchedT);
        else {
          setTestimonials([
            { id: 'tt1', author: 'Alex M.', role: 'CTO, Nimbus', quote: 'They move fast without breaking clarity.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
            { id: 'tt2', author: 'Priya S.', role: 'VP Eng, Northstar', quote: 'A true partner from strategy to delivery.', avatar: 'https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80' },
          ]);
        }
      } catch (e) { console.error(e); setTestimonials([
        { id: 'tt1', author: 'Alex M.', role: 'CTO, Nimbus', quote: 'They move fast without breaking clarity.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
        { id: 'tt2', author: 'Priya S.', role: 'VP Eng, Northstar', quote: 'A true partner from strategy to delivery.', avatar: 'https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80' },
      ]); }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-primary/100">
              {sections.hero?.heading || 'Building clear, resilient products for modern companies'}
            </h1>
            <p className="mt-6 text-lg text-primary/90 max-w-xl">
              {sections.hero?.content || 'We partner with teams to design, build, and evolve software that ships value fast—without the clutter.'}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full glass-card px-6 py-3 text-sm font-semibold text-primary/100 shadow-lg"
              >
                Start a project <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
              <Link to="/services" className="text-sm font-semibold text-primary/90 hover:text-primary/100">See services</Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl glass-card border border-primary/20 p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6 w-full">
                {[
                  { icon: Target, label: "Strategy" },
                  { icon: Palette, label: "Design" },
                  { icon: Cpu, label: "Engineering" },
                  { icon: BarChart3, label: "Analytics" },
                ].map((i, idx) => (
                  <div key={idx} className="rounded-xl border border-primary/10 p-6 bg-transparent">
                    <i.icon className="h-6 w-6 text-primary/100" />
                    <div className="mt-4 font-semibold text-primary/100">{i.label}</div>
                    <div className="text-sm text-primary/80">Crisp systems that scale.</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Who We Are */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">{sections.who?.heading || 'Who We Are'}</h2>
            <p className="mt-4 text-primary/85 max-w-prose">
              {sections.who?.content || 'A senior, cross‑functional team with a bias for clarity. We operate with lean process, bold typography, and a focus on measurable outcomes.'}
            </p>
          </div>
          <div>
            <img src="/placeholder.svg" alt="Team" className="w-full rounded-2xl border border-primary/20 bg-black/10" />
          </div>
        </div>
      </Section>

      {/* What We Do */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.15}>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">What We Do</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Target, title: "Strategy", desc: "From discovery to roadmap, aligning on outcomes." },
            { icon: Palette, title: "Design", desc: "Accessible, modern interfaces with purpose." },
            { icon: Cpu, title: "Engineering", desc: "Robust web apps, APIs, and infra." },
            { icon: BarChart3, title: "Analytics", desc: "Ship, learn, iterate with data." },
          ].map((c, idx) => (
            <div key={idx} className="rounded-2xl border border-primary/20 bg-black/10 p-6">
              <c.icon className="h-6 w-6" />
              <div className="mt-4 font-semibold text-primary">{c.title}</div>
              <p className="mt-2 text-sm text-primary/80">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How We Serve - timeline */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.2}>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">How We Serve</h2>
        <div className="mt-8 relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-primary/30" />
          <ol className="space-y-8">
            {[
              { t: "Discover", d: "Define goals, constraints, and success." },
              { t: "Design", d: "Prototype, test, refine with users." },
              { t: "Build", d: "Ship iteratively with quality gates." },
              { t: "Evolve", d: "Measure outcomes and iterate." },
            ].map((s, i) => (
              <li key={i} className="relative">
                <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary" />
                <div className="ml-4">
                  <div className="font-semibold">{s.t}</div>
                  <div className="text-sm text-primary/80">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Testimonials slider (simple auto scroll) */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.25}>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary/100">Testimonials</h2>
        <div className="mt-8 overflow-hidden">
          <div className="flex gap-6 animate-[slide_20s_linear_infinite] will-change-transform">
            {testimonials.length ? testimonials.map((t:any) => (
              <figure key={t.id} className="min-w-[320px] sm:min-w-[420px] rounded-2xl border border-primary/20 bg-transparent p-6 glass-card">
                <Quote className="h-5 w-5 text-primary/90" />
                <blockquote className="mt-3 text-primary/100">{t.quote}</blockquote>
                <figcaption className="mt-4 text-sm text-primary/90">{t.author} {t.role ? `, ${t.role}` : ''}</figcaption>
                {t.avatar ? (typeof t.avatar === 'string' ? <img src={t.avatar} alt="avatar" className="mt-3 h-12 w-12 rounded-full object-cover" /> : (t.avatar.id ? <img src={`/api/assets/${t.avatar.id}`} alt="avatar" className="mt-3 h-12 w-12 rounded-full object-cover" /> : null)) : null}
              </figure>
            )) : (
              <div className="text-primary/90">No testimonials yet</div>
            )}
          </div>
        </div>
      </Section>

      {/* News */}
      <Section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" delay={0.3}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary/100">Latest News</h2>
          <Link to="/insights" className="text-sm font-semibold text-primary/90 hover:text-primary/100">All insights</Link>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n:any) => (
            <article key={n.id} className="rounded-2xl border border-primary/20 bg-transparent overflow-hidden glass-card">
              {n.image ? (typeof n.image === 'string' ? <img src={n.image} alt="" className="h-40 w-full object-cover border-b border-primary/10" /> : (n.image.id ? <img src={`/api/assets/${n.image.id}`} alt="" className="h-40 w-full object-cover border-b border-primary/10" /> : <img src="/placeholder.svg" alt="" className="h-40 w-full object-cover border-b border-primary/10" />)) : <img src="/placeholder.svg" alt="" className="h-40 w-full object-cover border-b border-primary/10" />}
              <div className="p-6">
                <h3 className="font-semibold text-primary/100">{n.title}</h3>
                <p className="mt-2 text-sm text-primary/90">{n.excerpt}</p>
                <button className="mt-4 text-sm font-semibold text-primary/90 hover:text-primary/100">Read more →</button>
              </div>
            </article>
          ))}
        </div>
      </Section>

    </div>
  );
}
