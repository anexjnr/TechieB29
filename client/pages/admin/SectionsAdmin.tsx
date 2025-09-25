import { useEffect, useState } from "react";

import IconPicker from '@/components/admin/IconPicker';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function SectionsAdmin(){
  const [items, setItems] = useState<any[]>([]);
  const [key, setKey] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [order, setOrder] = useState<number | undefined>(undefined);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [capabilities, setCapabilities] = useState<{ icon?: string; label?: string; desc?: string }[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    // revoke object URL when component unmounts or when preview changes
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        try { URL.revokeObjectURL(imagePreview); } catch (e) { /* ignore */ }
      }
    };
  }, [imagePreview]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/sections', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await (await import('@/lib/fetchUtils')).parseResponse(res);
      setItems(Array.isArray(data)?data:[]);
    } catch(e){ console.error(e); }
  };

  useEffect(()=>{ fetchItems(); }, []);

  const uploadFile = async (f: File) => {
    const fd = new FormData(); fd.append('file', f);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, headers: token ? { Authorization: `Bearer ${token}` } : {} });
    return (await (await import('@/lib/fetchUtils')).parseResponse(res));
  };

  const createOrUpdate = async () => {
    try {
      let uploaded: any = null;
      if (file) uploaded = await uploadFile(file);
      const payload: any = { key, heading, content, enabled };
      if (order !== undefined) payload.order = order;
      if (uploaded?.id) payload.imageId = uploaded.id;

      // if capabilities present and key indicates flowchart, stringify
      if (key === 'flowchart' || key === 'capabilities') {
        payload.content = JSON.stringify(capabilities);
      }

      if (editingId){
        const res = await fetch(`/api/admin/sections/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token?{ Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify(payload) });
        if (res.ok){ setEditingId(null); setKey(''); setHeading(''); setContent(''); setFile(null); setOrder(undefined); setEnabled(true); setCapabilities([]); fetchItems(); }
      } else {
        const res = await fetch('/api/admin/sections', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token?{ Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify(payload) });
        if (res.ok){ setKey(''); setHeading(''); setContent(''); setFile(null); setOrder(undefined); setEnabled(true); setCapabilities([]); fetchItems(); }
      }
    } catch(e){ console.error(e); }
  };

  const startEdit = (it:any) => {
    setEditingId(it.id);
    setKey(it.key||'');
    setHeading(it.heading||'');
    setContent(it.content||'');
    setOrder(it.order);
    setEnabled(!!it.enabled);
    // if content is JSON array, load capabilities
    try {
      const parsed = typeof it.content === 'string' ? JSON.parse(it.content) : it.content;
      if (Array.isArray(parsed)) setCapabilities(parsed);
      else setCapabilities([]);
    } catch(e) { setCapabilities([]); }
    if (it.imageId) { setImagePreview(`/api/admin/assets/${it.imageId}`); } else { setImagePreview(null); }
  };

  const remove = async (id:string) => { try { const res = await fetch(`/api/admin/sections/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} }); if (res.ok) fetchItems(); } catch(e){ console.error(e); } };

  const addCapability = () => setCapabilities(prev => [...prev, { icon: 'target', label: 'New', desc: '' }]);
  const updateCapability = (i:number, field:string, val:string) => setCapabilities(prev => prev.map((c,idx) => idx===i?{...c,[field]:val}:c));
  const removeCapability = (i:number) => setCapabilities(prev => prev.filter((_,idx)=>idx!==i));

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Sections</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <input value={key} onChange={(e)=>setKey(e.target.value)} placeholder="Key (unique)" className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <input value={heading} onChange={(e)=>setHeading(e.target.value)} placeholder="Heading" className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          {/* If editing capabilities, show structured editor */}
          {(key === 'flowchart' || key === 'capabilities') ? (
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-primary/90">Capabilities</div>
                <button onClick={addCapability} className="text-sm text-primary/80">Add</button>
              </div>
              <div className="mt-2 space-y-2">
                {capabilities.map((c, i) => (
                  <div key={i} className="rounded-md border border-primary/20 p-2 bg-black/5 flex items-start gap-2">
                    <IconPicker value={c.icon || null} onChange={(v)=>updateCapability(i,'icon',v||'')} />
                    <input value={c.label || ''} onChange={(e)=>updateCapability(i,'label',e.target.value)} placeholder="label" className="w-36 rounded-md bg-transparent border border-primary/30 px-2 py-1 text-primary" />
                    <input value={c.desc || ''} onChange={(e)=>updateCapability(i,'desc',e.target.value)} placeholder="desc" className="flex-1 rounded-md bg-transparent border border-primary/30 px-2 py-1 text-primary" />
                    <button onClick={()=>removeCapability(i)} className="text-sm text-red-300">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <RichTextEditor value={content} onChange={setContent} placeholder="Content" />
          )}

          <input type="file" accept="image/*" onChange={(e)=>{ const f = e.target.files?.[0] ?? null; setFile(f); if (f) setImagePreview(URL.createObjectURL(f)); else setImagePreview(null); }} className="mt-2 text-sm text-primary/80" />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="max-h-48 object-contain rounded-md border border-primary/20" />
            </div>
          )}
          <input value={order ?? ''} onChange={(e)=>setOrder(e.target.value?parseInt(e.target.value,10):undefined)} placeholder="Order (number)" className="w-full mt-2 mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" checked={enabled} onChange={(e)=>setEnabled(e.target.checked)} />
            <span className="text-sm text-primary/80">Enabled</span>
          </label>
          <div className="mt-3">
            <button onClick={createOrUpdate} className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-4 py-2 text-sm font-semibold text-primary">{editingId? 'Update' : 'Create'}</button>
            {editingId && <button onClick={()=>{ setEditingId(null); setKey(''); setHeading(''); setContent(''); setFile(null); setOrder(undefined); setEnabled(true); setCapabilities([]); }} className="ml-3 text-sm text-primary/80">Cancel</button>}
          </div>
        </div>

        <div>
          <ul className="space-y-3">
            {items.map((it, idx) => (
              <li
                key={it.id}
                draggable
                onDragStart={(e) => { e.dataTransfer?.setData('text/plain', String(idx)); setDraggingIndex(idx); }}
                onDragOver={(e) => { e.preventDefault(); setDragOverIndex(idx); }}
                onDrop={async (e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer?.getData('text/plain'));
                  const to = idx;
                  setDraggingIndex(null);
                  setDragOverIndex(null);
                  if (isNaN(from)) return;
                  if (from === to) return;
                  const newItems = [...items];
                  const [moved] = newItems.splice(from, 1);
                  newItems.splice(to, 0, moved);
                  // update local order
                  setItems(newItems);
                  // persist orders
                  try {
                    await Promise.all(newItems.map((item, i) => fetch(`/api/admin/sections/${item.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ order: i }),
                    })));
                    fetchItems();
                  } catch (e) { console.error(e); }
                }}
                className={`rounded-md border ${dragOverIndex === idx ? 'border-primary/40' : 'border-primary/20'} p-3 flex items-start justify-between bg-black/5`}
              >
                <div className="flex items-center gap-3">
                  <div className="cursor-grab px-2 py-1 rounded bg-primary/5 text-primary/70">≡</div>
                  <div>
                    <div className="font-semibold text-primary">{it.key} {it.heading ? `- ${it.heading}` : ''}</div>
                    <div className="text-sm text-primary/80">{typeof it.content === 'string' && it.content.length > 100 ? it.content.slice(0,100)+'...' : it.content}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!it.enabled} onChange={async ()=>{ try{ const res = await fetch(`/api/admin/sections/${it.id}`, { method: 'PUT', headers: { 'Content-Type':'application/json', ...(token?{ Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify({ enabled: !it.enabled }) }); if (res.ok) fetchItems(); } catch(e){ console.error(e); } }} />
                    <span className="text-sm text-primary/80">Enabled</span>
                  </label>
                  <button onClick={()=>startEdit(it)} className="text-sm text-primary/80 hover:text-primary">Edit</button>
                  <button onClick={()=>remove(it.id)} className="text-sm text-red-300">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
