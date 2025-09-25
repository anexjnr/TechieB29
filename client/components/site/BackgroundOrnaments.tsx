import React from "react";

export default function BackgroundOrnaments() {
  const tiny = [
    { x: "12%", y: "35%", s: 8, o: 0.25, k: "sway", d: 0 },
    { x: "22%", y: "24%", s: 6, o: 0.22, k: "sway2", d: 1 },
    { x: "30%", y: "70%", s: 7, o: 0.2, k: "sway", d: 2 },
    { x: "58%", y: "28%", s: 6, o: 0.22, k: "sway2", d: 1.2 },
    { x: "66%", y: "62%", s: 7, o: 0.24, k: "sway", d: 0.8 },
    { x: "78%", y: "44%", s: 6, o: 0.22, k: "sway2", d: 1.5 },
    { x: "35%", y: "50%", s: 5, o: 0.2, k: "sway", d: 0.6 },
    { x: "48%", y: "22%", s: 6, o: 0.22, k: "sway2", d: 1.1 },
    { x: "88%", y: "30%", s: 7, o: 0.24, k: "sway", d: 0.3 },
    { x: "8%", y: "60%", s: 6, o: 0.22, k: "sway2", d: 1.8 },
    { x: "54%", y: "78%", s: 5, o: 0.2, k: "sway", d: 0.2 },
    { x: "72%", y: "16%", s: 6, o: 0.22, k: "sway2", d: 1.3 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* Bubble 1 */}
      <span
        className="absolute block rounded-full blur-2xl opacity-55"
        style={{
          left: "10%",
          top: "12%",
          width: 420,
          height: 420,
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.48) 0%, transparent 65%)",
          animation: "drift 28s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Bubble 2 */}
      <span
        className="absolute block rounded-full blur-2xl opacity-50"
        style={{
          right: "8%",
          top: "18%",
          width: 480,
          height: 480,
          background:
            "radial-gradient(closest-side, hsl(var(--accent) / 0.42) 0%, transparent 60%)",
          animation: "floaty 34s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Bubble 3 */}
      <span
        className="absolute block rounded-full blur-2xl opacity-45"
        style={{
          left: "18%",
          bottom: "15%",
          width: 520,
          height: 520,
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.4) 0%, transparent 60%)",
          animation: "drift 36s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Bubble 4 */}
      <span
        className="absolute block rounded-full blur-2xl opacity-48"
        style={{
          right: "14%",
          bottom: "10%",
          width: 460,
          height: 460,
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.38) 0%, transparent 60%)",
          animation: "floaty 30s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Bubble 5 (center subtle) */}
      <span
        className="absolute block rounded-full blur-2xl opacity-44"
        style={{
          left: "45%",
          top: "40%",
          width: 460,
          height: 460,
          background:
            "radial-gradient(closest-side, hsl(var(--ring) / 0.4) 0%, transparent 60%)",
          animation: "drift 40s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Center white glow for visibility */}
      <span
        className="absolute block rounded-full blur-3xl opacity-25"
        style={{
          left: "50%",
          top: "50%",
          width: 520,
          height: 520,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.22) 0%, transparent 70%)",
          animation: "floaty 44s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Tiny particles */}
      {tiny.map((p, i) => (
        <span
          key={i}
          className="absolute block rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.s,
            height: p.s,
            opacity: p.o,
            background:
              "radial-gradient(closest-side, hsl(var(--primary) / 0.6) 0%, transparent 70%)",
            animation: `${p.k} ${8 + (i % 5)}s ease-in-out ${p.d}s infinite`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
