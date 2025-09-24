import { useEffect, useState } from "react";
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function PoliciesAdmin(){
  const [policies, setPolicies] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchPolicies = async ()=>{
    try{
      const res = await fetch('/api/admin/policies', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await (await import('@/lib/fetchUtils')).parseResponse(res);
      setPolicies(Array.isArray(data)?data:[]);
    }catch(e){console.error(e)}
  };

  useEffect(()=>{fetchPolicies()},[]);

  const create = async ()=>{
    try{
      const res = await fetch('/api/admin/policies',{ method: 'POST', headers: { 'Content-Type': 'application/json', ...(token?{ Authorization: `Bearer ${token}` }:{}) }, body: JSON.stringify({ title, content }) });
      if(res.ok){ setTitle(''); setContent(''); fetchPolicies(); }
    }catch(e){console.error(e)}
  };

  const remove = async (id:string)=>{ try{ const res = await fetch(`/api/admin/policies/${id}`, { method: 'DELETE', headers: token?{ Authorization: `Bearer ${token}` }:{}}); if(res.ok) fetchPolicies(); }catch(e){console.error(e)} };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Policies & Legal</h1>
      <p className="text-sm text-primary/80 mt-2">Manage compliance, privacy, and legal documents.</p>
      <div className="mt-4 rounded-md border border-primary/20 p-4 bg-black/5">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
        <RichTextEditor value={content} onChange={setContent} />
        <div className="mt-3">
          <button onClick={create} className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-4 py-2 text-sm font-semibold text-primary">Create</button>
        </div>
      </div>

      <div className="mt-4">
        <ul className="space-y-3">
          {policies.map(p=> (
            <li key={p.id} className="rounded-md border border-primary/20 p-3 bg-black/5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-primary">{p.title}</div>
                <div className="text-sm text-primary/80">{p.content?.slice(0,120)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>remove(p.id)} className="text-sm text-red-300">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
