import React from "react";

export default function BackgroundOrnaments() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Bubble 1 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-35"
        style={{
          left: "10%",
          top: "12%",
          width: 280,
          height: 280,
          color: "hsl(var(--primary) / 0.28)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "drift 28s ease-in-out infinite",
        }}
      />
      {/* Bubble 2 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-30"
        style={{
          right: "8%",
          top: "18%",
          width: 340,
          height: 340,
          color: "hsl(var(--accent) / 0.26)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "floaty 34s ease-in-out infinite",
        }}
      />
      {/* Bubble 3 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-28"
        style={{
          left: "18%",
          bottom: "15%",
          width: 360,
          height: 360,
          color: "hsl(var(--primary) / 0.24)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "drift 36s ease-in-out infinite",
        }}
      />
      {/* Bubble 4 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-30"
        style={{
          right: "14%",
          bottom: "10%",
          width: 300,
          height: 300,
          color: "hsl(var(--primary) / 0.22)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "floaty 30s ease-in-out infinite",
        }}
      />
      {/* Bubble 5 (center subtle) */}
      <span
        className="absolute block rounded-full blur-3xl opacity-20"
        style={{
          left: "45%",
          top: "40%",
          width: 320,
          height: 320,
          color: "hsl(var(--ring) / 0.24)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "drift 40s ease-in-out infinite",
        }}
      />
    </div>
  );
}
