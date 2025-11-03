import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnimatedTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = (text || "").split(/\s+/).filter(Boolean);

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as unknown as any },
    },
  };

  return (
    <motion.h1
      className={cn("tracking-tight break-words", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={child}
          className="inline-block mr-2"
        >
          {w}
        </motion.span>
      ))}
    </motion.h1>
  );
}
