import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useCallback } from "react";

export default function TiltCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  }, []);

  const reset = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.removeProperty("--x");
    el.style.removeProperty("--y");
  }, []);

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale: 1.05, y: -6, boxShadow: "0 24px 72px rgba(17, 12, 46, 0.5)" }}
      transition={{ type: "spring", stiffness: 240, damping: 20, mass: 0.6 }}
      className={cn(
        "relative rounded-2xl border border-primary/20 bg-black/10 p-6 overflow-hidden group",
        "before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:opacity-0 before:transition-opacity before:duration-200",
        "before:[background:radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.10),transparent_45%)]",
        "group-hover:before:opacity-100",
        "h-full",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
      }} />
      <div className="relative z-[1]">
        {children}
      </div>
    </motion.div>
  );
}
