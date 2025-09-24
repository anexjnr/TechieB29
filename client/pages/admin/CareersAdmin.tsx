import React, { useEffect, useState } from "react";
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function CareersAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/jobs", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const createOrUpdate = async () => {
    try {
      const payload: any = { title, location, description, enabled };
      if (editingId) {
        const res = await fetch(`/api/admin/jobs/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
        if (res.ok) { setEditingId(null); setTitle(''); setLocation(''); setDescription(''); setEnabled(true); fetchItems(); }
      } else {
        const res = await fetch('/api/admin/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
        if (res.ok) { setTitle(''); setLocation(''); setDescription(''); setEnabled(true); fetchItems(); }
      }
    } catch (e) { console.error(e); }
  };

  const remove = async (id: string) => { try { const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} }); if (res.ok) fetchItems(); } catch (e) { console.error(e); } };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Jobs</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <div className="mt-2">
            <label className="text-sm text-primary/80">Description</label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            <span className="text-sm text-primary/80">Enabled</span>
          </label>
          <div className="mt-3">
            <button onClick={createOrUpdate} className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-4 py-2 text-sm font-semibold text-primary">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button onClick={() => { setEditingId(null); setTitle(''); setLocation(''); }} className="ml-3 text-sm text-primary/80">Cancel</button>}
          </div>
        </div>
        <div>
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.id} className="rounded-md border border-primary/20 p-3 flex items-start justify-between bg-black/5">
                <div>
                  <div className="font-semibold text-primary">{it.title}</div>
                  <div className="text-sm text-primary/80">{it.location}</div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!it.enabled} onChange={async () => { try { const res = await fetch(`/api/admin/jobs/${it.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ enabled: !it.enabled }) }); if (res.ok) fetchItems(); } catch (e) { console.error(e); } }} />
                    <span className="text-sm text-primary/80">Enabled</span>
                  </label>
                  <button onClick={() => { setEditingId(it.id); setTitle(it.title); setLocation(it.location || ''); setEnabled(!!it.enabled); }} className="text-sm text-primary/80 hover:text-primary">Edit</button>
                  <button onClick={() => remove(it.id)} className="text-sm text-red-300">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
