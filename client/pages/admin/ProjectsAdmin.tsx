import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ProjectsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/projects", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const uploadFile = async (f: File) => {
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return (await (await import("@/lib/fetchUtils")).parseResponse(res))?.url;
  };

  const createOrUpdate = async () => {
    try {
      let imageUrl: string | undefined;
      let imageId: string | undefined;
      if (file) {
        const uploaded = await uploadFile(file);
        imageUrl = uploaded?.url;
        imageId = uploaded?.id;
      }
      const payload: any = { title, description: desc, enabled };
      if (imageId) payload.imageId = imageId;
      else if (imageUrl) payload.image = imageUrl;
      if (editingId) {
        const res = await fetch(`/api/admin/projects/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setEditingId(null);
          setTitle("");
          setDesc("");
          setFile(null);
          setEnabled(true);
          fetchItems();
        }
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setTitle("");
          setDesc("");
          setFile(null);
          setEnabled(true);
          fetchItems();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (it: any) => {
    setEditingId(it.id);
    setTitle(it.title || "");
    setDesc(it.description || "");
  };
  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Projects</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 text-sm text-primary/80"
          />
          <label className="inline-flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <span className="text-sm text-primary/80">Enabled</span>
          </label>
          <div className="mt-3 flex gap-2">
            <button
              onClick={createOrUpdate}
              className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-4 py-2 text-sm font-semibold text-primary"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setDesc("");
                  setFile(null);
                }}
                className="text-sm text-primary/80"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div>
          <ul className="space-y-3">
            {items.map((it) => (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="rounded-md border border-primary/20 p-3 flex items-start justify-between bg-black/5"
              >
                <div className="flex items-center gap-3">
                  {it.image && (
                    <img
                      src={it.image}
                      alt="project"
                      className="h-20 w-28 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-primary">{it.title}</div>
                    <div className="text-sm text-primary/80">
                      {it.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!it.enabled}
                      onChange={async () => {
                        try {
                          const res = await fetch(
                            `/api/admin/projects/${it.id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                ...(token
                                  ? { Authorization: `Bearer ${token}` }
                                  : {}),
                              },
                              body: JSON.stringify({ enabled: !it.enabled }),
                            },
                          );
                          if (res.ok) fetchItems();
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    />
                    <span className="text-sm text-primary/80">Enabled</span>
                  </label>
                  <button
                    onClick={() => startEdit(it)}
                    className="text-sm text-primary/80 hover:text-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(it.id)}
                    className="text-sm text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
