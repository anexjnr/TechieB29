import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [recent, setRecent] = useState<any>({ news: [], projects: [] });
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', { headers: token ? { Authorization: `Bearer ${token}` } : {}, });
        const data = await (await import('@/lib/fetchUtils')).parseResponse(res);
        setStats(data || {});
      } catch (e) {
        console.error(e);
      }
    };
    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/news');
        const n = await (await import('@/lib/fetchUtils')).parseResponse(res);
        const res2 = await fetch('/api/projects');
        const p = await (await import('@/lib/fetchUtils')).parseResponse(res2);
        setRecent({ news: Array.isArray(n)?n.slice(0,3):[], projects: Array.isArray(p)?p.slice(0,3):[] });
      } catch (e) { console.error(e); }
    };
    fetchStats(); fetchRecent();
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-primary/20 bg-black/10 p-4 text-center">
            <div className="text-sm text-primary/80 capitalize">{k}</div>
            <div className="mt-2 font-extrabold text-primary text-2xl">{String(v)}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-primary/20 bg-black/5 p-4">
          <div className="font-semibold text-primary">Recent Activity</div>
          <div className="mt-2 text-sm text-primary/80 space-y-2">
            {recent.news.length === 0 && recent.projects.length === 0 ? (
              <div>No recent actions</div>
            ) : (
              <div>
                {recent.news.map((n:any)=> <div key={n.id} className="text-sm text-primary/80">News: {n.title}</div>)}
                {recent.projects.map((p:any)=> <div key={p.id} className="text-sm text-primary/80">Project: {p.title}</div>)}
              </div>
            )}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.05 } }} className="rounded-xl border border-primary/20 bg-black/5 p-4">
          <div className="font-semibold text-primary">Quick Actions</div>
          <div className="mt-2 flex flex-col gap-2">
            <a href="/admin/projects" className="px-3 py-2 rounded bg-transparent border border-primary/30 text-primary text-sm text-left">Manage Projects</a>
            <a href="/admin/news" className="px-3 py-2 rounded bg-transparent border border-primary/30 text-primary text-sm text-left">Manage News</a>
            <a href="/admin/services" className="px-3 py-2 rounded bg-transparent border border-primary/30 text-primary text-sm text-left">Manage Services</a>
            <a href="/admin/careers" className="px-3 py-2 rounded bg-transparent border border-primary/30 text-primary text-sm text-left">Manage Jobs</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} className="rounded-xl border border-primary/20 bg-black/5 p-4">
          <div className="font-semibold text-primary">Site Health</div>
          <div className="mt-2 text-sm text-primary/80">All systems nominal</div>
        </motion.div>
      </div>
    </div>
  );
}
