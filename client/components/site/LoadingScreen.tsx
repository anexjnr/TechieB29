import React from "react";
import OrbitLoader from "@/components/ui/orbit-loader";

export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[300] grid place-items-center bg-[rgba(10,10,11,0.6)] backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <OrbitLoader size={44} />
          <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl animate-pulse" />
        </div>
        <span className="text-sm text-foreground/80">Loading…</span>
      </div>
    </div>
  );
}
