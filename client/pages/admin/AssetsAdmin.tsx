import { useEffect, useState } from 'react';

export default function AssetsAdmin(){
  const [assets, setAssets] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchAssets = async ()=>{
    try{
      const res = await fetch('/api/admin/assets', { headers: token?{ Authorization: `Bearer ${token}` } : {} });
      const data = await (await import('@/lib/fetchUtils')).parseResponse(res);
      setAssets(Array.isArray(data)?data:[]);
    }catch(e){console.error(e)}
  };

  useEffect(()=>{fetchAssets()},[]);

  const remove = async (id:string)=>{ try{ const res = await fetch(`/api/admin/assets/${id}`, { method: 'DELETE', headers: token?{ Authorization: `Bearer ${token}` }:{}}); if(res.ok) fetchAssets(); }catch(e){console.error(e)} };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Assets / Media</h1>
      <p className="text-sm text-primary/80 mt-2">List uploaded images and files. You can delete unused assets here.</p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {assets.map(a=> (
          <div key={a.id} className="rounded-md border border-primary/20 p-3 bg-black/5 text-center">
            <div className="font-semibold text-primary text-sm">{a.filename}</div>
            <div className="text-xs text-primary/80 mt-2">{a.createdAt}</div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <a href={`/api/admin/assets/${a.id}`} target="_blank" rel="noreferrer" className="text-sm text-primary/80">View</a>
              <button onClick={()=>remove(a.id)} className="text-sm text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
