import { useEffect, useState } from "react";

export default function AssetsAdmin() {
  const [assets, setAssets] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/admin/assets", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      setAssets(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/assets/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) fetchAssets();
    } catch (e) {
      console.error(e);
    }
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await (await import("@/lib/fetchUtils")).parseResponse(res);
      if (data?.url) {
        setPreviewUrl(data.url);
        fetchAssets();
      }
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Assets / Media</h1>
      <p className="text-sm text-primary/80 mt-2">
        List uploaded images and files. You can delete unused assets here.
      </p>

      <div className="mt-4 rounded-md border border-primary/20 p-4 bg-black/5">
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setPreviewUrl(null);
            }}
          />
          <button
            onClick={upload}
            disabled={uploading || !file}
            className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-3 py-2 text-sm font-semibold text-primary"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary/80"
            >
              Preview
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {assets.map((a) => (
          <div
            key={a.id}
            className="rounded-md border border-primary/20 p-3 bg-black/5 text-center"
          >
            <div className="font-semibold text-primary text-sm">
              {a.filename}
            </div>
            <div className="text-xs text-primary/80 mt-2">{a.createdAt}</div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <a
                href={`/api/admin/assets/${a.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary/80"
              >
                View
              </a>
              <button
                onClick={() => setConfirmDeleteId(a.id)}
                className="text-sm text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmDeleteId(null)}
          />
          <div className="relative z-50 w-full max-w-md rounded-md bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p className="mt-2 text-sm text-primary/80">
              Are you sure you want to delete this asset? This action cannot be
              undone.
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
