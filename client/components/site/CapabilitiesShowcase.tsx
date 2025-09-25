import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={parent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", className)}
    >
      {items.map((c, idx) => (
        <motion.div
          key={`${c.title}-${idx}`}
          variants={card}
          whileHover={{ y: -6, rotate: [-0.2, 0.2, 0], transition: { duration: 0.4 } }}
          whileTap={{ scale: 0.98 }}
          className="relative rounded-2xl border border-primary/20 bg-black/10 p-6 overflow-hidden group"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.06), transparent 40%)",
            }}
          />
          <div className="relative z-[1]">
            <c.icon className="h-7 w-7" />
            <div className="mt-4 font-semibold text-foreground">{c.title}</div>
            <p className="mt-2 text-sm text-foreground/85">{c.desc}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
