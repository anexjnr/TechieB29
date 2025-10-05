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
        {(() => {
          const wanted = [
            'Enterprise Architecture Services',
            'Cloud Enablement',
            'AI Augmentation',
            'Cybersecurity & Vulnerability Assessments',
          ];
          const filtered = Array.isArray(services)
            ? services.filter((s) => wanted.includes(s.title))
            : [];
          const fallback = [
            { id: 'svc1', title: 'Enterprise Architecture Services', description: 'Align technology with business objectives for scale, security, and agility.', icon: 'cpu' },
            { id: 'svc2', title: 'Cloud Enablement', description: 'Drive cloud adoption, optimization, and resilience.', icon: 'cloud' },
            { id: 'svc3', title: 'AI Augmentation', description: 'Integrate intelligence into decision-making and operations.', icon: 'zap' },
            { id: 'svc4', title: 'Cybersecurity & Vulnerability Assessments', description: 'Protect your enterprise with proactive risk management.', icon: 'shield' },
          ];
          const toRender = filtered.length ? filtered : fallback;
          return toRender.map((c, i) => {
            // Try to map icon name to lucide icon
            const getIcon = (name: string | undefined) => {
              if (!name) return [Target, Palette, Cpu, BarChart3][i % 4];
              const map: Record<string, any> = {
                target: Target,
                palette: Palette,
                cpu: Cpu,
                'bar-chart-3': BarChart3,
                cloud: CloudIcon,
                zap: BarChart3, // fallback mapping
                shield: BarChart3,
              };
              return map[name] || map[name?.toLowerCase?.()] || [Target, Palette, Cpu, BarChart3][i % 4];
            };

            const Icon = getIcon(c.icon);

            return (
              <TiltCard key={c.id || i} className="h-full">
                <div className="h-6 w-6 text-primary/100">
                  {Icon && <Icon />}
                </div>
                <div className="mt-4 font-semibold text-foreground">{c.title}</div>
                <p className="mt-2 text-sm text-foreground/90">{c.description}</p>
              </TiltCard>
            );
          });
        })()}
      </Section>
    </div>
  );
}
