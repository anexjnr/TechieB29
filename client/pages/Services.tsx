import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";
import TiltCard from "@/components/site/TiltCard";
import { Cpu, Palette, Target, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Services() {
  const [services, setServices] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetch('/api/services').then((r) => r.json());
        const arr = Array.isArray(s) ? s.filter((x: any) => x.enabled !== false) : [];
        setServices(arr);
      } catch (e) {
        console.error('Failed to load services', e);
        setServices(null);
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

      <Section>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">Services</h1>
        <p className="mt-4 max-w-prose text-foreground/85">
          We provide specialized IT services that enhance performance, ensure scalability, and accelerate digital maturity:
        </p>
        <ul className="mt-4 max-w-prose text-foreground/85 list-disc pl-6 space-y-2">
          <li>Enterprise Architecture Services – Align technology with business objectives for scale, security, and agility.</li>
          <li>Cloud Enablement – Drive cloud adoption, optimization, and resilience.</li>
          <li>AI Augmentation – Integrate intelligence into decision-making and operations.</li>
          <li>Cybersecurity &amp; Vulnerability Assessments – Protect your enterprise with proactive risk management.</li>
        </ul>
      </Section>

      <Section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" delay={0.1}>
        {(services && services.length ? services : []).map((c, i) => {
          const Icon = [Target, Palette, Cpu, BarChart3][i % 4] || Target;
          return (
            <TiltCard key={c.id || i} className="h-full">
              <div className="h-6 w-6 text-primary/100">
                {Icon && <Icon />}
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
