import React, { useEffect, useState } from "react";

export default function AboutAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/about", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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

  const uploadFile = async (f: File) => {
    const fd = new FormData(); fd.append('file', f);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, headers: token ? { Authorization: `Bearer ${token}` } : {} });
    return (await (await import("@/lib/fetchUtils")).parseResponse(res));
  };

  const createOrUpdate = async () => {
    try {
      let uploaded: any = null;
      if (file) uploaded = await uploadFile(file);
      const payload: any = { heading: title || 'Untitled', content, enabled };
      if (uploaded?.id) payload.imageId = uploaded.id;

      if (editingId) {
        const res = await fetch(`/api/admin/about/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
        if (res.ok) { setEditingId(null); setTitle(''); setContent(''); setFile(null); setEnabled(true); fetchItems(); }
      } else {
        const res = await fetch('/api/admin/about', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
        if (res.ok) { setTitle(''); setContent(''); setFile(null); setEnabled(true); fetchItems(); }
      }
    } catch (e) { console.error(e); }
  };

  const startEdit = (it: any) => { setEditingId(it.id); setTitle(it.heading || it.title || ''); setContent(it.content || it.description || ''); };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/about/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage About</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Heading" className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2 text-sm text-primary/80" />
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            <span className="text-sm text-primary/80">Enabled</span>
          </label>
          <div className="mt-3">
            <button onClick={createOrUpdate} className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-4 py-2 text-sm font-semibold text-primary">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button onClick={() => { setEditingId(null); setTitle(''); setContent(''); setFile(null); }} className="ml-3 text-sm text-primary/80">Cancel</button>}
          </div>
        </div>

        <div>
          {loading ? (
            <div className="text-primary/80">Loading...</div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="rounded-md border border-primary/20 p-3 flex items-start justify-between bg-black/5">
                  <div>
                    <div className="font-semibold text-primary">{it.heading || it.title}</div>
                    <div className="text-sm text-primary/80">{it.content || it.description}</div>
                    {it.image && <img src={`/api/assets/${it.image.id}`} className="mt-2 h-20 w-32 object-cover rounded-md" alt="about" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={!!it.enabled} onChange={async () => { try { const res = await fetch(`/api/admin/about/${it.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ enabled: !it.enabled }) }); if (res.ok) fetchItems(); } catch (e) { console.error(e); } }} />
                      <span className="text-sm text-primary/80">Enabled</span>
                    </label>
                    <button onClick={() => startEdit(it)} className="text-sm text-primary/80 hover:text-primary">Edit</button>
                    <button onClick={() => remove(it.id)} className="text-sm text-red-300">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
