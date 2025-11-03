import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TiltCard from "@/components/site/TiltCard";
import type { LucideIcon } from "lucide-react";

export type Capability = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export default function CapabilitiesShowcase({
  items,
  className,
}: {
  items: Capability[];
  className?: string;
}) {
  const parent = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const card = {
    hidden: { opacity: 0, y: 22, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: ([0.22, 1, 0.36, 1] as unknown) as any },
    },
  };

  return (
    <motion.div
      variants={parent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch",
        className,
      )}
    >
      {items.map((c, idx) => (
        <TiltCard key={`${c.title}-${idx}`}>
          <div className="relative z-[1] h-full min-h-[160px]">
            <c.icon className="h-7 w-7" />
            <div className="mt-4 font-semibold text-foreground">{c.title}</div>
            <p className="mt-2 text-sm text-foreground/85">{c.desc}</p>
          </div>
        </TiltCard>
      ))}
    </motion.div>
  );
}
