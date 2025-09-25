import { useEffect, useState } from "react";
import Section from "@/components/site/Section";
import { Target, Palette, Cpu, BarChart3, Zap, Code, Award } from "lucide-react";

const ICONS: Record<string, any> = {
  "target": Target,
  "palette": Palette,
  "cpu": Cpu,
  "bar-chart-3": BarChart3,
  "zap": Zap,
  "code": Code,
  "award": Award,
};

function IconPicker({ value, onChange }: { value?: string | null; onChange: (v: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const keys = Object.keys(ICONS);
  const Selected = value ? ICONS[value] : null;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-transparent px-3 py-2 text-sm text-primary">
        {Selected ? <Selected className="h-4 w-4" /> : <span className="text-sm text-primary/80">Icon</span>}
        <span className="text-xs text-primary/80">Choose</span>
      </button>
      {open && (
        <div className="absolute mt-2 right-0 w-48 rounded-md border border-primary/20 bg-black/5 p-2 grid grid-cols-4 gap-2 z-30">
          {keys.map((k) => {
            const C = ICONS[k];
            return (
              <button key={k} onClick={() => { onChange(k); setOpen(false); }} className="p-1 rounded-md hover:bg-primary/10">
                <C className="h-4 w-4 text-primary/100" />
              </button>
            );
          })}
          <div className="col-span-4 text-xs text-primary/80 mt-1">Selected: {value || 'none'}</div>
        </div>
      )}
    </div>
  );
}

export default function ServicesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [icon, setIcon] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const createOrUpdate = async () => {
    try {
      const payload: any = { title, description: desc, enabled };
      if (icon) payload.icon = icon;
      if (editingId) {
        const res = await fetch(`/api/admin/services/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
        if (res.ok) {
          setEditingId(null);
          setTitle("");
          setDesc("");
          setEnabled(true);
          setIcon(null);
          fetchItems();
        }
      } else {
        const res = await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
        if (res.ok) {
          setTitle("");
          setDesc("");
          setEnabled(true);
          setIcon(null);
          fetchItems();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleEnabled = async (it: any) => {
    try {
      const res = await fetch(`/api/admin/services/${it.id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ enabled: !it.enabled }) });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (it: any) => {
    setEditingId(it.id);
    setTitle(it.title || "");
    setDesc(it.description || "");
    setEnabled(!!it.enabled);
    setIcon(it.icon || null);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Services</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <div className="mt-2 flex items-center gap-3">
            <IconPicker value={icon} onChange={setIcon} />
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
              <span className="text-sm text-primary/80">Enabled</span>
            </label>
          </div>
          <div className="mt-3">
            <button onClick={createOrUpdate} className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-4 py-2 text-sm font-semibold text-primary">{editingId ? "Update" : "Create"}</button>
            {editingId && <button onClick={() => { setEditingId(null); setTitle(""); setDesc(""); setIcon(null); setEnabled(true); }} className="ml-3 text-sm text-primary/80">Cancel</button>}
          </div>
        </div>
        <div>
          {loading ? (
            <div className="text-primary/80">Loading...</div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => {
                const Icon = it.icon ? (ICONS[it.icon] || null) : null;
                return (
                  <li key={it.id} className="rounded-md border border-primary/20 p-3 flex items-start justify-between bg-black/5">
                    <div className="flex items-start gap-3">
                      {Icon ? <Icon className="h-6 w-6 text-primary/100" /> : <div className="h-6 w-6" />}
                      <div>
                        <div className="font-semibold text-primary">{it.title}</div>
                        <div className="text-sm text-primary/80">{it.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={!!it.enabled} onChange={() => toggleEnabled(it)} />
                        <span className="text-sm text-primary/80">Enabled</span>
                      </label>
                      <button onClick={() => startEdit(it)} className="text-sm text-primary/80 hover:text-primary">Edit</button>
                      <button onClick={() => remove(it.id)} className="text-sm text-red-300">Delete</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
