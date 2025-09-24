import { useEffect, useState } from "react";

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await (await import('@/lib/fetchUtils')).parseResponse(res);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const createOrUpdate = async () => {
    try {
      if (editingId) {
        const payload: any = { role };
        if (password) payload.password = password;
        const res = await fetch(`/api/admin/users/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
        if (res.ok) { setEditingId(null); setEmail(''); setPassword(''); setRole('EDITOR'); fetchUsers(); }
      } else {
        const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ email, password, role }) });
        if (res.ok) { setEmail(''); setPassword(''); setRole('EDITOR'); fetchUsers(); }
      }
    } catch (e) { console.error(e); }
  };

  const startEdit = (u: any) => { setEditingId(u.id); setEmail(u.email); setRole(u.role || 'EDITOR'); };
  const remove = async (id: string) => { try { const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} }); if (res.ok) fetchUsers(); } catch (e) { console.error(e); } };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Users</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder={editingId ? 'New password (leave blank to keep)' : 'Password'} className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <div className="mt-2">
            <label className="text-sm text-primary/80 mr-2">Role</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="rounded-md bg-transparent border border-primary/30 px-2 py-1 text-primary">
              <option value="ADMIN">Admin</option>
              <option value="EDITOR">Editor</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={createOrUpdate} className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-4 py-2 text-sm font-semibold text-primary">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button onClick={() => { setEditingId(null); setEmail(''); setPassword(''); setRole('EDITOR'); }} className="text-sm text-primary/80">Cancel</button>}
          </div>
        </div>
        <div>
          <ul className="space-y-3">
            {users.map(u => (
              <li key={u.id} className="rounded-md border border-primary/20 p-3 flex items-center justify-between bg-black/5">
                <div>
                  <div className="font-semibold text-primary">{u.email}</div>
                  <div className="text-sm text-primary/80">{u.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>startEdit(u)} className="text-sm text-primary/80 hover:text-primary">Edit</button>
                  <button onClick={()=>remove(u.id)} className="text-sm text-red-300">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
