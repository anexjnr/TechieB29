import React from "react";
import { cn } from "@/lib/utils";

interface OrbitLoaderProps {
  size?: number; // pixels
  className?: string;
}

export default function OrbitLoader({
  size = 44,
  className,
}: OrbitLoaderProps) {
  const px = `${size}px`;
  return (
    <div
      className={cn("relative", className)}
      style={{ width: px, height: px }}
      role="img"
      aria-label="Loading"
    >
      {/* Ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        aria-hidden
      />
      {/* Center dot */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ width: size * 0.18, height: size * 0.18 }}
        aria-hidden
      />
      {/* Orbiting dot */}
      <div
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "1.1s" }}
        aria-hidden
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-foreground"
          style={{ width: size * 0.16, height: size * 0.16, top: 0 }}
        />
      </div>
    </div>
  );
}
