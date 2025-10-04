import { cn } from "@/lib/utils";
import TiltCard from "@/components/site/TiltCard";
import type { LucideIcon } from "lucide-react";

export type FlowItem = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
};

export default function FlowGrid({
  items,
  className,
}: {
  items: FlowItem[];
  className?: string;
}) {
  const list = items.slice(0, 4);
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {list.map((it, idx) => (
        <TiltCard key={`${it.title}-${idx}`} className="min-h-[140px]">
          <it.icon className="h-6 w-6 text-primary/100" />
          <div className="mt-4 font-semibold text-primary/100">{it.title}</div>
          {it.subtitle ? (
            <div className="text-sm text-primary/80">{it.subtitle}</div>
          ) : null}
        </TiltCard>
      ))}
    </div>
  );
}
