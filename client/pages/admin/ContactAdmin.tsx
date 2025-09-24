import { useEffect, useState } from "react";

export default function ContactAdmin(){
  const [items, setItems] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchItems = async ()=>{
    try{
      const res = await fetch('/api/admin/contact', { headers: token?{ Authorization: `Bearer ${token}` } : {} });
      const data = await (await import('@/lib/fetchUtils')).parseResponse(res);
      setItems(Array.isArray(data)?data:[]);
    }catch(e){console.error(e)}
  };

  useEffect(()=>{fetchItems()},[]);

  const remove = async (id:string)=>{ try{ const res = await fetch(`/api/admin/contact/${id}`, { method: 'DELETE', headers: token?{ Authorization: `Bearer ${token}` }:{}}); if(res.ok) fetchItems(); }catch(e){console.error(e)} };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Contact Inquiries</h1>
      <p className="text-sm text-primary/80 mt-2">View messages submitted via contact form.</p>
      <div className="mt-4">
        <ul className="space-y-3">
          {items.map(i=> (
            <li key={i.id} className="rounded-md border border-primary/20 p-3 bg-black/5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-primary">{i.name} — {i.email}</div>
                  <div className="text-sm text-primary/80 mt-2">{i.message}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>remove(i.id)} className="text-sm text-red-300">Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
