import React from "react";
import { Loader2 } from "lucide-react";

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
          <Loader2 className="h-10 w-10 animate-spin text-foreground" />
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        </div>
        <span className="text-sm text-foreground/80">Preparing content…</span>
      </div>
    </div>
  );
}
