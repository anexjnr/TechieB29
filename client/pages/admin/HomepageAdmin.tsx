import { useEffect, useState } from "react";

export default function HomepageAdmin() {
  const [sections, setSections] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/sections', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await (await import('@/lib/fetchUtils')).parseResponse(res);
      setSections(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchSections(); }, []);

  const toggle = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/admin/sections/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ enabled: !enabled }) });
      if (res.ok) fetchSections();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Homepage / Sections</h1>
      <p className="text-sm text-primary/80 mt-2">Manage homepage hero, banners and section content.</p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(s => (
          <div key={s.id} className="rounded-md border border-primary/20 p-4 bg-black/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-primary">{s.key}</div>
                <div className="text-sm text-primary/80">{s.heading}</div>
              </div>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={!!s.enabled} onChange={()=>toggle(s.id, !!s.enabled)} />
                <span className="text-sm text-primary/80">Enabled</span>
              </label>
            </div>
            <div className="mt-3 text-sm text-primary/80">{s.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
