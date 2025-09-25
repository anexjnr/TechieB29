import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TiltCard from "@/components/site/TiltCard";

export type Step = { t: string; d: string };

export default function HowWeServe({
  steps,
  className,
}: {
  steps: Step[];
  className?: string;
}) {
  const parent = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
  return (
    <div className={cn("lg:pl-24", className)}>
      <motion.ol
        variants={parent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch"
      >
        {steps.map((s, i) => (
          <motion.li
            key={`${s.t}-${i}`}
            variants={item}
            className="lg:col-start-2 lg:col-span-4 relative"
          >
            <div className="absolute -left-3 top-6 h-2 w-2 rounded-full bg-primary" />
            <TiltCard className="glass-card border border-primary/20 p-6">
              <div className="flex items-start gap-6">
                <div className="hidden sm:block shrink-0">
                  <span
                    className="font-semibold text-foreground/90 tracking-wider"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" as any }}
                  >
                    {s.t}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground/80">{String(i + 1).padStart(2, "0")}</div>
                  <div className="text-sm text-foreground/85 mt-1 max-w-prose">{s.d}</div>
                </div>
              </div>
            </TiltCard>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
