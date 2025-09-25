import React from "react";

export default function BackgroundOrnaments() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Bubble 1 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-40"
        style={{
          left: "10%",
          top: "12%",
          width: 360,
          height: 360,
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.32) 0%, transparent 70%)",
          animation: "drift 28s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      />
      {/* Bubble 2 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-35"
        style={{
          right: "8%",
          top: "18%",
          width: 420,
          height: 420,
          background:
            "radial-gradient(closest-side, hsl(var(--accent) / 0.3) 0%, transparent 70%)",
          animation: "floaty 34s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      />
      {/* Bubble 3 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-32"
        style={{
          left: "18%",
          bottom: "15%",
          width: 440,
          height: 440,
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.28) 0%, transparent 70%)",
          animation: "drift 36s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      />
      {/* Bubble 4 */}
      <span
        className="absolute block rounded-full blur-3xl opacity-35"
        style={{
          right: "14%",
          bottom: "10%",
          width: 380,
          height: 380,
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.26) 0%, transparent 70%)",
          animation: "floaty 30s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      />
      {/* Bubble 5 (center subtle) */}
      <span
        className="absolute block rounded-full blur-3xl opacity-28"
        style={{
          left: "45%",
          top: "40%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(closest-side, hsl(var(--ring) / 0.28) 0%, transparent 70%)",
          animation: "drift 40s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
