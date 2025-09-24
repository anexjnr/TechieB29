import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function NewsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [publishAt, setPublishAt] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/news", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch news items:", e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const uploadFile = async (f: File) => {
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
        return null;
      }
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const createOrUpdate = async () => {
    try {
      let imageUrl: string | undefined;
      let imageId: string | undefined;

      if (file) {
        const uploaded = await uploadFile(file);
        if (uploaded) {
          imageUrl = uploaded.url;
          imageId = uploaded.id;
        }
      }

      const payload: any = { title, excerpt, content, enabled };
      if (publishAt) payload.publishAt = publishAt;
      if (imageId) {
        payload.imageId = imageId;
      } else if (imageUrl) {
        payload.image = imageUrl;
      }

      let res;
      if (editingId) {
        res = await fetch(`/api/admin/news/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/news", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to create/update news:", errorText);
        return;
      }

      if (editingId) {
        setEditingId(null);
      }

      setTitle("");
      setExcerpt("");
      setFile(null);
      setEnabled(true);
      setContent("");
      setPublishAt(null);

      fetchItems();
    } catch (e) {
      console.error("Error in createOrUpdate:", e);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setExcerpt(item.excerpt || "");
    setContent(item.content || "");
    setEnabled(item.enabled ?? true);
    setPublishAt(item.publishAt ?? null);
    // File input can't be pre-filled for security reasons,
    // so leave file null and upload new if needed.
    setFile(null);
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        fetchItems();
      } else {
        const errorText = await res.text();
        console.error("Failed to delete news:", errorText);
      }
    } catch (e) {
      console.error("Error deleting news:", e);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage News</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
          />
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Excerpt"
            className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
          />
          <div className="mt-2">
            <label className="text-sm text-primary/80">Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 text-sm text-primary/80"
          />
          <div className="mt-2">
            <label className="text-sm text-primary/80 mr-2">Publish at</label>
            <input
              type="datetime-local"
              value={publishAt || ""}
              onChange={(e) => setPublishAt(e.target.value || null)}
              className="rounded-md bg-transparent border border-primary/30 px-2 py-1 text-primary"
            />
          </div>
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
                  setExcerpt("");
                  setFile(null);
                  setContent("");
                  setPublishAt(null);
                  setEnabled(true);
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
                      alt="news"
                      className="h-20 w-28 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-primary">{it.title}</div>
                    <div className="text-sm text-primary/80">{it.excerpt}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!it.enabled}
                      onChange={async () => {
                        try {
                          const res = await fetch(`/api/admin/news/${it.id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                            },
                            body: JSON.stringify({ enabled: !it.enabled }),
                          });
                          if (res.ok) fetchItems();
                          else {
                            const errorText = await res.text();
                            console.error("Failed to toggle enabled:", errorText);
                          }
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