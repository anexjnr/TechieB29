import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/testimonials", {
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

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    // Return the full response (not just url)
    return await (await import("@/lib/fetchUtils")).parseResponse(res);
  };

  const createOrUpdate = async () => {
    try {
      console.log("Uploading file:", imageFile);
      let uploaded = null;
      if (imageFile) {
        uploaded = await uploadFile(imageFile);
      }
      console.log("Uploaded result:", uploaded);

      const payload: any = { author, quote, enabled };
      if (uploaded?.id) payload.avatarId = uploaded.id;
      else if (uploaded?.url) payload.avatar = uploaded.url;

      console.log("Payload to send:", payload);

      let res;
      if (editingId) {
        res = await fetch(`/api/admin/testimonials/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      }
      console.log("Create/Update response:", res);

      if (res.ok) {
        setEditingId(null);
        setAuthor("");
        setQuote("");
        setImageFile(null);
        setEnabled(true);
        fetchItems();
      } else {
        // Optionally parse error message from response
        const errorText = await res.text();
        console.error("Failed to create/update testimonial:", errorText);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (it: any) => {
    setEditingId(it.id);
    setAuthor(it.author || "");
    setQuote(it.quote || "");
    setImageFile(null);
    setEnabled(!!it.enabled);
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
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
      <h1 className="text-2xl font-extrabold">Manage Testimonials</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
          />
          <input
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Quote"
            className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
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
                  setAuthor("");
                  setQuote("");
                  setImageFile(null);
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="rounded-md border border-primary/20 p-3 flex items-start justify-between bg-black/5"
              >
                <div className="flex items-center gap-3">
                  {it.avatar && (
                    <img
                      src={it.avatar}
                      alt="avatar"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-primary">
                      {it.author}
                    </div>
                    <div className="text-sm text-primary/80">{it.quote}</div>
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
                            `/api/admin/testimonials/${it.id}`,
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
