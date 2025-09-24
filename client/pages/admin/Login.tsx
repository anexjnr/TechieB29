import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    setErr("");
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) return setErr(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      navigate('/admin');
    } catch (e) {
      setErr('Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-black/10 p-8">
        <h1 className="text-2xl font-extrabold">Admin Login</h1>
        <p className="text-sm text-primary/80 mt-2">Sign in to manage site content</p>
        <div className="mt-6 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary" />
          {err && <div className="text-sm text-red-300">{err}</div>}
          <button onClick={submit} className="w-full inline-flex items-center justify-center rounded-md border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary">Sign in</button>
        </div>
      </div>
    </div>
  );
}
