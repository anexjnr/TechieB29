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

  const startEdit = (s: any) => {
    const existingImageUrl =
      typeof s.imageUrl === "string" && s.imageUrl.trim().length
        ? s.imageUrl.trim()
        : typeof s.image === "string" && s.image.trim().length
          ? s.image.trim()
          : "";
    setEditing({
      [s.id]: {
        heading: s.heading || "",
        content: s.content || "",
        order: s.order ?? "",
        imageUrl: existingImageUrl,
      },
    });
  };
  const cancelEdit = () => setEditing({});
  const onEditChange = (id: string, field: string, value: any) =>
    setEditing((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));

  const saveEdit = async (id: string) => {
    const payload = editing[id] || {};
    try {
      const normalizedImageUrl =
        typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "";
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
          imageUrl: normalizedImageUrl.length ? normalizedImageUrl : null,
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
        {sections.map((s) => {
          const current = editing[s.id] || {};
          const isEditing = Boolean(editing[s.id]);
          const trimmedCurrent =
            typeof current.imageUrl === "string" ? current.imageUrl.trim() : "";
          const fallbackImage =
            typeof s.imageUrl === "string" && s.imageUrl.trim().length
              ? s.imageUrl.trim()
              : typeof s.image === "string" && s.image.trim().length
                ? s.image.trim()
                : s.imageId
                  ? `/api/assets/${s.imageId}`
                  : null;
          const previewUrl =
            trimmedCurrent.length > 0 ? trimmedCurrent : fallbackImage;
          return (
            <div
              key={s.id}
              className="rounded-md border border-primary/20 p-4 bg-black/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-primary">{s.key}</div>
                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <input
                        value={current.heading ?? ""}
                        onChange={(e) =>
                          onEditChange(s.id, "heading", e.target.value)
                        }
                        placeholder="Heading"
                        className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
                      />
                      <textarea
                        value={current.content ?? ""}
                        onChange={(e) =>
                          onEditChange(s.id, "content", e.target.value)
                        }
                        placeholder="Content"
                        className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
                      />
                      <input
                        value={current.order ?? ""}
                        onChange={(e) =>
                          onEditChange(s.id, "order", e.target.value)
                        }
                        placeholder="Order"
                        className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
                      />
                      <input
                        value={current.imageUrl ?? ""}
                        onChange={(e) =>
                          onEditChange(s.id, "imageUrl", e.target.value)
                        }
                        placeholder="Image URL"
                        className="w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
                      />
                      {previewUrl ? (
                        <div className="mt-2 rounded-md border border-primary/20 bg-black/20 p-2">
                          <img
                            src={previewUrl}
                            alt={`${s.key} preview`}
                            className="max-h-40 w-full object-contain"
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-primary/80">{s.heading}</div>
                      {fallbackImage ? (
                        <div className="mt-3 rounded-md border border-primary/20 bg-black/20 p-2">
                          <img
                            src={fallbackImage}
                            alt={`${s.key} preview`}
                            className="max-h-40 w-full object-contain"
                          />
                        </div>
                      ) : null}
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
                {isEditing ? null : s.content}
              </div>
              <div className="mt-3 flex items-center gap-2">
                {isEditing ? (
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
          );
        })}
      </div>
    </div>
  );
}
