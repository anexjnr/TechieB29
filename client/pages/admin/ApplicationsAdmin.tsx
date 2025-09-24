import { useEffect, useState } from "react";

export default function ApplicationsAdmin(){
  const [apps, setApps] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchApps = async ()=>{
    try{
      const res = await fetch('/api/admin/applications', { headers: token?{ Authorization: `Bearer ${token}` } : {} });
      const data = await (await import('@/lib/fetchUtils')).parseResponse(res);
      setApps(Array.isArray(data)?data:[]);
    }catch(e){console.error(e)}
  };

  useEffect(()=>{fetchApps()},[]);

  const remove = async (id:string)=>{ try{ const res = await fetch(`/api/admin/applications/${id}`, { method: 'DELETE', headers: token?{ Authorization: `Bearer ${token}` }:{}}); if(res.ok) fetchApps(); }catch(e){console.error(e)} };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Job Applications</h1>
      <p className="text-sm text-primary/80 mt-2">List of candidate applications and resume uploads.</p>
      <div className="mt-4">
        <ul className="space-y-3">
          {apps.map(a=> (
            <li key={a.id} className="rounded-md border border-primary/20 p-3 bg-black/5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-primary">{a.name} — {a.position}</div>
                <div className="text-sm text-primary/80">{a.email} • {new Date(a.appliedAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                {a.resumeAssetId ? <a href={`/api/admin/assets/${a.resumeAssetId}`} className="text-sm text-primary/80" target="_blank" rel="noreferrer">Download</a> : (a.resumeUrl ? <a href={a.resumeUrl} className="text-sm text-primary/80" target="_blank" rel="noreferrer">Download</a> : null)}
                <button onClick={()=>remove(a.id)} className="text-sm text-red-300">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
