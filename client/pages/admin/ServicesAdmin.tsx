import { useEffect, useState } from "react";
import IconPicker from "@/components/admin/IconPicker";
import { getIconByName } from "@/lib/iconMap";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function ServicesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [icon, setIcon] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // image + preview
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // drag/drop and reset
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [originalItems, setOriginalItems] = useState<any[] | null>(null);

  // modal + delete confirm
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [newEnabled, setNewEnabled] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      const arr = Array.isArray(data) ? data : [];
      setItems(arr);
      setOriginalItems(arr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
    return await (await import("@/lib/fetchUtils")).parseResponse(res);
  };

  const persistCreate = async (payload: any) => {
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) fetchItems();
  };

  const persistUpdate = async (id: string, payload: any) => {
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) fetchItems();
  };

  const createOrUpdate = async () => {
    try {
      let uploaded: any = null;
      if (file) uploaded = await uploadFile(file);
      const payload: any = { title, description: desc, enabled };
      if (icon) payload.icon = icon;
      if (uploaded?.id) payload.imageId = uploaded.id;
      if (editingId) {
        await persistUpdate(editingId, payload);
        setEditingId(null);
        setTitle("");
        setDesc("");
        setEnabled(true);
        setIcon(null);
        setFile(null);
        setImagePreview(null);
      } else {
        await persistCreate(payload);
        setTitle("");
        setDesc("");
        setEnabled(true);
        setIcon(null);
        setFile(null);
        setImagePreview(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleEnabled = async (it: any) => {
    try {
      await persistUpdate(it.id, { enabled: !it.enabled });
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (it: any) => {
    setEditingId(it.id);
    setTitle(it.title || "");
    setDesc(it.description || "");
    setEnabled(!!it.enabled);
    setIcon(it.icon || null);
    if (it.imageId) setImagePreview(`/api/admin/assets/${it.imageId}`);
    else setImagePreview(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Services</h1>
      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-primary/20 p-4 bg-black/5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full mb-2 rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
              />
              <RichTextEditor
                value={desc}
                onChange={setDesc}
                placeholder="Description"
              />
              <div className="mt-2 flex items-center gap-3">
                <IconPicker value={icon} onChange={setIcon} />
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <span className="text-sm text-primary/80">Enabled</span>
                </label>
              </div>
            </div>
            <div className="ml-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setNewTitle("");
                  setNewDesc("");
                  setNewIcon(null);
                  setNewFile(null);
                  setNewPreview(null);
                  setNewEnabled(true);
                }}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
              >
                Add New Service
              </button>
              <button
                onClick={() => {
                  if (originalItems) setItems(originalItems);
                }}
                className="rounded-md border border-primary/30 px-3 py-2 text-sm"
              >
                Reset Services
              </button>
            </div>
          </div>

          <div className="mt-3">
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
                  setIcon(null);
                  setEnabled(true);
                  setFile(null);
                  setImagePreview(null);
                }}
                className="ml-3 text-sm text-primary/80"
              >
                Cancel
              </button>
            )}
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f) setImagePreview(URL.createObjectURL(f));
                else setImagePreview(null);
              }}
              className="mt-2 text-sm text-primary/80"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 object-contain rounded-md border border-primary/20"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          {loading ? (
            <div className="text-primary/80">Loading...</div>
          ) : (
            <ul className="space-y-3">
              {items
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((it, idx) => {
                  const Icon = it.icon ? getIconByName(it.icon) : null;
                  return (
                    <li
                      key={it.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer?.setData("text/plain", String(idx));
                        setDraggingIndex(idx);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIndex(idx);
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const from = Number(
                          e.dataTransfer?.getData("text/plain"),
                        );
                        const to = idx;
                        setDraggingIndex(null);
                        setDragOverIndex(null);
                        if (isNaN(from)) return;
                        if (from === to) return;
                        const newItems = [...items];
                        const [moved] = newItems.splice(from, 1);
                        newItems.splice(to, 0, moved);
                        setItems(newItems);
                        try {
                          await Promise.all(
                            newItems.map((item, i) =>
                              fetch(`/api/admin/services/${item.id}`, {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  ...(token
                                    ? { Authorization: `Bearer ${token}` }
                                    : {}),
                                },
                                body: JSON.stringify({ order: i }),
                              }),
                            ),
                          );
                          fetchItems();
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className={`rounded-md border ${dragOverIndex === idx ? "border-primary/40" : "border-primary/20"} p-3 flex items-start justify-between bg-black/5`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="cursor-grab px-2 py-1 rounded bg-primary/5 text-primary/70">
                          ≡
                        </div>
                        {Icon ? (
                          <Icon className="h-6 w-6 text-primary/100" />
                        ) : (
                          <div className="h-6 w-6" />
                        )}
                        <div>
                          <div className="font-semibold text-primary">
                            {it.title}
                          </div>
                          <div
                            className="text-sm text-primary/80"
                            dangerouslySetInnerHTML={{
                              __html:
                                typeof it.description === "string"
                                  ? it.description
                                  : "",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!it.enabled}
                            onChange={() => toggleEnabled(it)}
                          />
                          <span className="text-sm text-primary/80">
                            Enabled
                          </span>
                        </label>
                        <button
                          onClick={() => startEdit(it)}
                          className="text-sm text-primary/80 hover:text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(it.id)}
                          className="text-sm text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div>
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowAddModal(false)}
            />
            <div className="relative z-50 w-full max-w-2xl rounded-md bg-white/5 p-6">
              <h2 className="text-lg font-semibold mb-3">Add New Service</h2>
              <div className="space-y-3">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
                />
                <RichTextEditor
                  value={newDesc}
                  onChange={setNewDesc}
                  placeholder="Description"
                />
                <div className="mt-2 flex items-center gap-3">
                  <IconPicker value={newIcon} onChange={setNewIcon} />
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newEnabled}
                      onChange={(e) => setNewEnabled(e.target.checked)}
                    />
                    <span className="text-sm text-primary/80">Enabled</span>
                  </label>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setNewFile(f);
                    if (f) setNewPreview(URL.createObjectURL(f));
                    else setNewPreview(null);
                  }}
                  className="text-sm text-primary/80"
                />
                {newPreview && (
                  <img
                    src={newPreview}
                    alt="Preview"
                    className="max-h-48 object-contain rounded-md border border-primary/20"
                  />
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-md border border-primary/30 px-3 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      let uploaded: any = null;
                      if (newFile) {
                        uploaded = await uploadFile(newFile);
                      }
                      const payload: any = {
                        title: newTitle,
                        description: newDesc,
                        enabled: newEnabled,
                      };
                      if (newIcon) payload.icon = newIcon;
                      if (uploaded?.id) payload.imageId = uploaded.id;
                      await persistCreate(payload);
                      setShowAddModal(false);
                      setNewTitle("");
                      setNewDesc("");
                      setNewIcon(null);
                      setNewFile(null);
                      setNewPreview(null);
                      setNewEnabled(true);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
                >
                  Add Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmDeleteId(null)}
          />
          <div className="relative z-50 w-full max-w-md rounded-md bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-primary/80">
              Are you sure you want to delete this service? This action cannot
              be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-md border border-primary/30 px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await remove(confirmDeleteId!);
                    setConfirmDeleteId(null);
                  } catch (e) {
                    console.error(e);
                    setConfirmDeleteId(null);
                  }
                }}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
