import React from "react";

export default function BackgroundOrnaments() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Bubble 1 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-30"
        style={{
          left: "10%",
          top: "12%",
          width: 220,
          height: 220,
          color: "hsl(var(--primary) / 0.25)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "drift 28s ease-in-out infinite",
        }}
      />
      {/* Bubble 2 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-25"
        style={{
          right: "8%",
          top: "18%",
          width: 280,
          height: 280,
          color: "hsl(var(--accent) / 0.22)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "floaty 34s ease-in-out infinite",
        }}
      />
      {/* Bubble 3 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-20"
        style={{
          left: "18%",
          bottom: "15%",
          width: 300,
          height: 300,
          color: "hsl(var(--primary) / 0.2)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "drift 36s ease-in-out infinite",
        }}
      />
      {/* Bubble 4 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-25"
        style={{
          right: "14%",
          bottom: "10%",
          width: 240,
          height: 240,
          color: "hsl(var(--primary) / 0.18)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "floaty 30s ease-in-out infinite",
        }}
      />
      {/* Bubble 5 (center subtle) */}
      <span
        className="absolute block rounded-full blur-3xl opacity-15"
        style={{
          left: "45%",
          top: "40%",
          width: 260,
          height: 260,
          color: "hsl(var(--ring) / 0.2)",
          background:
            "radial-gradient(closest-side, currentColor 0%, transparent 70%)",
          animation: "drift 40s ease-in-out infinite",
        }}
      />
    </div>
  );
}
