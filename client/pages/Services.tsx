import { useEffect, useState } from "react";
import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";
import { Cpu, Palette, Target, BarChart3 } from "lucide-react";

export default function Services() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const s = await fetch('/api/services').then(r => r.json());
        const arr = Array.isArray(s)?s.filter((x:any)=> x.enabled !== false):[];
        setItems(arr.length?arr:[{id:'sv1',title:'Strategy',description:'From discovery to roadmap, aligning on outcomes.'},{id:'sv2',title:'Design',description:'Accessible, modern interfaces with purpose.'}]);
      } catch(e){
        console.error(e);
        setItems([{id:'sv1',title:'Strategy',description:'From discovery to roadmap, aligning on outcomes.'},{id:'sv2',title:'Design',description:'Accessible, modern interfaces with purpose.'}]);
      }
    })();
  }, []);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Section>
        <AnimatedTitle text="Services" className="text-4xl sm:text-5xl font-extrabold text-foreground" />
        <p className="mt-4 max-w-prose text-foreground/85">Pragmatic services that ship outcomes—not vanity.</p>
      </Section>
      <Section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" delay={0.1}>
        {items.map((c, i) => (
          <div key={i} className="rounded-2xl border border-primary/20 bg-transparent p-6 glass-card">
            <div className="h-6 w-6 text-primary/100"><Target /></div>
            <div className="mt-4 font-semibold text-foreground">{c.title}</div>
            <p className="mt-2 text-sm text-foreground/90">{c.description}</p>
          </div>
        ))}
      </Section>
      <Section className="mt-16" delay={0.15}>
        <h2 className="text-2xl font-bold text-foreground">Project Details</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map((n) => (
            <div key={n} className="rounded-2xl border border-primary/20 bg-black/10 overflow-hidden">
              <img src="/placeholder.svg" alt="" className="h-40 w-full object-cover border-b border-primary/20" />
              <div className="p-6">
                <div className="font-semibold text-foreground">Case Study {n}</div>
                <p className="mt-2 text-sm text-foreground/80">Outcome‑focused delivery with crisp constraints.</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
