import { useEffect, useState } from "react";

export default function HomepageAdmin() {
  const [sections, setSections] = useState<any[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>({});
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/admin/sections", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      setSections(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const toggle = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/admin/sections/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ enabled: !enabled }),
      });
      if (res.ok) fetchSections();
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (s: any) =>
    setEditing({
      [s.id]: {
        heading: s.heading || "",
        content: s.content || "",
        order: s.order ?? "",
      },
    });
  const cancelEdit = () => setEditing({});
  const onEditChange = (id: string, field: string, value: any) =>
    setEditing((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));

  const saveEdit = async (id: string) => {
    const payload = editing[id] || {};
    try {
      const res = await fetch(`/api/admin/sections/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          heading: payload.heading,
          content: payload.content,
          order: payload.order === "" ? undefined : Number(payload.order),
        }),
      });
      if (res.ok) {
        setEditing({});
        fetchSections();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sections/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) fetchSections();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Homepage / Sections</h1>
      <p className="text-sm text-primary/80 mt-2">
        Manage homepage hero, banners and section content.
      </p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <div
            key={s.id}
            className="rounded-md border border-primary/20 p-4 bg-black/5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-primary">{s.key}</div>
                {editing[s.id] ? (
                  <div className="space-y-2 mt-2">
                    <input
                      value={editing[s.id].heading}
                      onChange={(e) =>
                        onEditChange(s.id, "heading", e.target.value)
                      }
                      placeholder="Heading"
                      className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
                    />
                    <textarea
                      value={editing[s.id].content}
                      onChange={(e) =>
                        onEditChange(s.id, "content", e.target.value)
                      }
                      placeholder="Content"
                      className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
                    />
                    <input
                      value={editing[s.id].order}
                      onChange={(e) =>
                        onEditChange(s.id, "order", e.target.value)
                      }
                      placeholder="Order"
                      className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-primary/80">{s.heading}</div>
                  </>
                )}
              </div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!s.enabled}
                  onChange={() => toggle(s.id, !!s.enabled)}
                />
                <span className="text-sm text-primary/80">Enabled</span>
              </label>
            </div>
            <div className="mt-3 text-sm text-primary/80">
              {editing[s.id] ? null : s.content}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {editing[s.id] ? (
                <>
                  <button
                    onClick={() => saveEdit(s.id)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-sm text-primary/80"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(s)}
                    className="text-sm text-primary/80 hover:text-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    className="text-sm text-red-300"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
