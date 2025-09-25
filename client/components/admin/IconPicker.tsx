import { useEffect, useMemo, useState } from "react";
import { ICONS, ICON_NAMES, getIconByName } from "@/lib/iconMap";

export default function IconPicker({ value, onChange }: { value?: string | null; onChange: (v: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const names = useMemo(() => ICON_NAMES.filter((n) => n.includes(query.trim().toLowerCase())), [query]);
  const Selected = value ? getIconByName(value) : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen((s) => !s)} className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-transparent px-3 py-2 text-sm text-primary">
        {Selected ? <Selected className="h-4 w-4" /> : <span className="text-sm text-primary/80">Icon</span>}
        <span className="text-xs text-primary/80">Choose</span>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 right-0 w-64 max-h-72 overflow-auto rounded-md border border-primary/20 bg-black/5 p-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search icons" className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-2 py-1 text-primary" />
          <div className="grid grid-cols-6 gap-2">
            {names.map((n) => {
              const C = ICONS[n];
              return (
                <button key={n} onClick={() => { onChange(n); setOpen(false); }} className="p-1 rounded-md hover:bg-primary/10 flex items-center justify-center">
                  <C className="h-5 w-5 text-primary/100" />
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-primary/80">Selected: {value || 'none'}</div>
        </div>
      )}
    </div>
  );
}
