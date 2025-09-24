import Section from "@/components/site/Section";
import { useEffect, useState } from "react";

export default function About() {
  const [about, setAbout] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/about');
        const data = await res.json();
        if (Array.isArray(data) && data.length) setAbout(data[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderImage = () => {
    const img = about?.image;
    if (!img) return <img src="/placeholder.svg" alt="Team" className="rounded-2xl border border-primary/20 bg-black/10" />;
    if (typeof img === 'string') return <img src={img} alt="Team" className="rounded-2xl border border-primary/20 bg-black/10" />;
    if (img.id) return <img src={`/api/assets/${img.id}`} alt="Team" className="rounded-2xl border border-primary/20 bg-black/10" />;
    return <img src="/placeholder.svg" alt="Team" className="rounded-2xl border border-primary/20 bg-black/10" />;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Section>
        <h1 className="text-4xl sm:text-5xl font-extrabold">About</h1>
        <p className="mt-4 max-w-prose text-primary/85">
          {loading ? 'Loading...' : (about?.heading || 'We are a compact team focused on clarity, velocity, and outcomes.')}
        </p>
      </Section>

      <Section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center" delay={0.1}>
        <div>
          <h2 className="text-2xl font-bold">Who We Are</h2>
          <p className="mt-4 text-primary/85 max-w-prose">
            {loading ? '' : (about?.content || 'Senior engineers and designers working as one unit. Fewer handoffs, more accountability. We operate with lean process and a bias for action.')}
          </p>
        </div>
        {renderImage()}
      </Section>

      <Section className="mt-16" delay={0.15}>
        <h2 className="text-2xl font-bold">How We Serve</h2>
        <ol className="mt-6 space-y-6 relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-primary/30" />
          {[
            { t: "Discover", d: "Align on goals, constraints, and success metrics." },
            { t: "Design", d: "Prototype, test, refine with users and stakeholders." },
            { t: "Build", d: "Implement iteratively with quality gates and CI." },
            { t: "Evolve", d: "Measure outcomes, learn, and iterate." },
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
      </Section>
    </div>
  );
}
