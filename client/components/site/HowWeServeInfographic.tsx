import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TiltCard from "@/components/site/TiltCard";
import type { LucideIcon } from "lucide-react";

export type StepInfo = { title: string; desc: string; icon: LucideIcon };

export default function HowWeServeInfographic({
  items,
  className,
  centerTitle,
  centerSubtitle,
}: {
  items: StepInfo[];
  className?: string;
  centerTitle?: string;
  centerSubtitle?: string;
}) {
  const count = items.length;
  const radius = 38; // percent of box
  const nodes = items.map((s, idx) => {
    const angle = (idx / count) * Math.PI * 2 - Math.PI / 2; // start at top
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { ...s, x, y };
  });

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop / large layout */}
      <div className="relative mx-auto max-w-5xl min-h-[420px] hidden sm:block">
        {/* lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {nodes.map((n, i) => (
            <motion.line
              key={`line-${i}`}
              x1={50}
              y1={50}
              x2={n.x}
              y2={n.y}
              stroke="currentColor"
              className="text-primary/30"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              strokeWidth={0.4}
              strokeLinecap="round"
            />
          ))}
          <circle
            cx={50}
            cy={50}
            r={radius}
            className="text-primary/15"
            stroke="currentColor"
            strokeWidth={0.3}
            fill="none"
          />
        </svg>

        {/* center hub */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <TiltCard className="px-8 py-6">
            <div className="text-lg font-semibold">
              {centerTitle || "Process"}
            </div>
            <div className="text-sm text-foreground/85">
              {centerSubtitle || "Discover • Design • Build • Evolve"}
            </div>
          </TiltCard>
        </motion.div>

        {/* nodes */}
        {nodes.map((n, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <TiltCard className="min-w-[200px] max-w-[240px]">
              <n.icon className="h-6 w-6" />
              <div className="mt-3 font-semibold">{n.title}</div>
              <div className="text-sm text-foreground/85">{n.desc}</div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* Mobile fallback */}
      <div className="block sm:hidden">
        <div className="mb-4">
          <div className="text-base font-semibold">
            {centerTitle || "Process"}
          </div>
          <div className="text-sm text-foreground/85">
            {centerSubtitle || "Discover • Design • Build • Evolve"}
          </div>
        </div>
        <ol className="space-y-4">
          {items.map((s, i) => (
            <li key={i}>
              <TiltCard>
                <div className="flex items-start gap-3">
                  <s.icon className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-foreground/85">{s.desc}</div>
                  </div>
                </div>
              </TiltCard>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
