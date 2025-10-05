import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";
import TiltCard from "@/components/site/TiltCard";
import { Cpu, Palette, Target, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Services() {
  const [items, setItems] = useState<any[]>([]);
  const [projectCards, setProjectCards] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetch("/api/services").then((r) => r.json());
        const arr = Array.isArray(s) ? s.filter((x: any) => x.enabled !== false) : [];
        setItems(
          arr.length
            ? arr
            : [
                { id: "sv1", title: "Strategy", description: "From discovery to roadmap, aligning on outcomes." },
                { id: "sv2", title: "Design", description: "Accessible, modern interfaces with purpose." },
              ],
        );
      } catch (e) {
        console.error(e);
        setItems([
          { id: "sv1", title: "Strategy", description: "From discovery to roadmap, aligning on outcomes." },
          { id: "sv2", title: "Design", description: "Accessible, modern interfaces with purpose." },
        ]);
      }
    })();
  }, []);

  useEffect(() => {
    // load section with key 'flowchart' and use its data items for project cards
    (async () => {
      try {
        const sections = await fetch("/api/sections").then((r) => r.json());
        const found = Array.isArray(sections)
          ? sections.find((x: any) => x.key === "flowchart")
          : null;
        const raw = found?.data != null ? found.data : found?.content;
        let arr: any[] = [];
        if (raw) {
          if (Array.isArray(raw)) arr = raw;
          else if (Array.isArray((raw as any).items)) arr = (raw as any).items;
          else if (typeof raw === "string") {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) arr = parsed;
              else if (Array.isArray(parsed.items)) arr = parsed.items;
            } catch (e) {
              // ignore
            }
          }
        }
        if (arr.length === 0) {
          setProjectCards(null);
        } else {
          const normalized = arr.map((it: any, idx: number) => {
            const title = it.title || it.heading || it.label || `Case Study ${idx + 1}`;
            const description = it.description || it.subtitle || it.desc || "";
            const image =
              it.image && typeof it.image === "string"
                ? it.image
                : it.image && typeof it.image === "object" && it.image.id
                ? `/api/assets/${it.image.id}`
                : it.imageUrl || null;
            return { title, description, image };
          });
          setProjectCards(normalized);
        }
      } catch (e) {
        console.error("Failed loading flowchart section", e);
        setProjectCards(null);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Section>
        <AnimatedTitle
          text="Services"
          className="text-4xl sm:text-5xl font-extrabold text-foreground"
        />
        <p className="mt-4 max-w-prose text-foreground/85">Pragmatic services that ship outcomes—not vanity.</p>
      </Section>

      <Section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" delay={0.1}>
        {items.map((c, i) => (
          <div key={i} className="rounded-2xl border border-primary/20 bg-transparent p-6 glass-card">
            <div className="h-6 w-6 text-primary/100">
              <Target />
            </div>
            <div className="mt-4 font-semibold text-foreground">{c.title}</div>
            <p className="mt-2 text-sm text-foreground/90">{c.description}</p>
          </div>
        ))}
      </Section>

      <Section className="mt-16" delay={0.15}>
        <h2 className="text-2xl font-bold text-foreground">Project Details</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(projectCards || [
            { title: "Case Study 1", description: "Outcome‑focused delivery with crisp constraints.", image: "/placeholder.svg" },
            { title: "Case Study 2", description: "Outcome‑focused delivery with crisp constraints.", image: "/placeholder.svg" },
            { title: "Case Study 3", description: "Outcome‑focused delivery with crisp constraints.", image: "/placeholder.svg" },
          ]).map((card, idx) => (
            <TiltCard key={idx} className="h-full">
              <div className="overflow-hidden rounded-2xl">
                <img src={card.image || "/placeholder.svg"} alt="" className="h-40 w-full object-cover border-b border-primary/20" />
              </div>
              <div className="p-6">
                <div className="font-semibold text-foreground">{card.title}</div>
                <p className="mt-2 text-sm text-foreground/80">{card.description}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>
    </div>
  );
}
