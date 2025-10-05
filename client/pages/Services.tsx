import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";
import TiltCard from "@/components/site/TiltCard";
import { Cpu, Palette, Target, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Services() {
  const [flowItems, setFlowItems] = useState<any[] | null>(null);

  useEffect(() => {
    // load section with key 'flowchart' and use its data items for service tiles
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
          setFlowItems(null);
        } else {
          const normalized = arr.map((it: any, idx: number) => {
            const title = it.title || it.heading || it.label || `Item ${idx + 1}`;
            const description = it.description || it.subtitle || it.desc || "";
            const image =
              it.image && typeof it.image === "string"
                ? it.image
                : it.image && typeof it.image === "object" && it.image.id
                ? `/api/assets/${it.image.id}`
                : it.imageUrl || null;
            return { id: it.id ?? idx, title, description, image, icon: it.icon };
          });
          setFlowItems(normalized);
        }
      } catch (e) {
        console.error("Failed loading flowchart section", e);
        setFlowItems(null);
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
        {(flowItems || []).map((c, i) => {
          const Icon = [Target, Palette, Cpu, BarChart3][i % 4] || Target;
          return (
            <TiltCard key={c.id || i} className="h-full">
              <div className="h-6 w-6 text-primary/100">
                <Icon />
              </div>
              <div className="mt-4 font-semibold text-foreground">{c.title}</div>
              <p className="mt-2 text-sm text-foreground/90">{c.description}</p>
            </TiltCard>
          );
        })}
      </Section>
    </div>
  );
}
