import React from "react";

export default function BackgroundOrnaments() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
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
        }}
      />
    </div>
  );
}
