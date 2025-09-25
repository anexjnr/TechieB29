import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useCallback } from "react";

export default function TiltCard({
  children,
  className,
  maxTilt = 10,
}: PropsWithChildren<{ className?: string; maxTilt?: number }>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(x, [0, 1], [-maxTilt, maxTilt]);

  const rX = useSpring(rotateX, { stiffness: 200, damping: 20, mass: 0.5 });
  const rY = useSpring(rotateY, { stiffness: 200, damping: 20, mass: 0.5 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    x.set(px);
    y.set(py);
  }, [x, y]);

  const reset = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  return (
    <div
      className="[perspective:1000px]"
      onMouseLeave={reset}
    >
      <motion.div
        onMouseMove={handleMove}
        style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" as any }}
        whileHover={{ scale: 1.03, boxShadow: "0 18px 60px rgba(17, 12, 46, 0.35)" }}
        transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.6 }}
        className={cn(
          "relative rounded-2xl border border-primary/20 bg-black/10 p-6 overflow-hidden group",
          "before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:opacity-0 before:transition-opacity before:duration-200",
          "before:[background:radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.08),transparent_40%)]",
          "group-hover:before:opacity-100",
          className,
        )}
      >
        {/* subtle inner shine layer */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            transform: "translateZ(20px)",
          }}
        />
        <div className="relative z-[1]" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
