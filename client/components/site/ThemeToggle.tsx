import { useEffect, useState } from "react";

const STORAGE_KEY = "theme-variant" as const;

type Variant = "black" | "purplemix";

function applyVariant(v: Variant) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", v);
}

export default function ThemeToggle() {
  const [variant, setVariant] = useState<Variant>("purplemix");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Variant | null) ?? null;
    const initial: Variant =
      saved === "black" || saved === "purplemix" ? saved : "purplemix";
    setVariant(initial);
    applyVariant(initial);
  }, []);

  const set = (v: Variant) => {
    setVariant(v);
    localStorage.setItem(STORAGE_KEY, v);
    applyVariant(v);
  };

  return (
    <div className="hidden md:flex items-center gap-2">
      <div className="glass-card rounded-full p-1 border border-primary/20">
        <button
          type="button"
          aria-pressed={variant === "black"}
          onClick={() => set("black")}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
            variant === "black"
              ? "bg-primary/20 text-foreground"
              : "text-foreground/80 hover:text-foreground"
          }`}
        >
          Black
        </button>
        <button
          type="button"
          aria-pressed={variant === "purplemix"}
          onClick={() => set("purplemix")}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
            variant === "purplemix"
              ? "bg-primary/20 text-foreground"
              : "text-foreground/80 hover:text-foreground"
          }`}
        >
          Purple mix
        </button>
      </div>
    </div>
  );
}
