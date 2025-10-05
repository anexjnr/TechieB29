import React, { useEffect, useState } from "react";

export default function ClientsInfographic() {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/api/clients", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = await res.json();
        if (canceled) return;
        if (Array.isArray(arr) && arr.length) {
          const first = arr.find((x: any) => x && x.enabled !== false) || arr[0];
          setData(first || null);
        } else {
          setData(null);
        }
      } catch (e: any) {
        if (!canceled) setError(e?.message || "Failed to load clients");
        console.error("Failed to load clients", e);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  if (error) {
    return (
      <section className="mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-foreground">Clients</h2>
          <p className="mt-3 text-foreground/85">Unable to load clients.</p>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const items = Array.isArray(data.details) ? data.details : [];

  return (
    <section className="mt-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-foreground">
          {data.heading}
        </h2>
        {data.subheading && (
          <p className="mt-3 text-foreground/85">{data.subheading}</p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto items-start">
        {items.map((it: any, idx: number) => {
          const duration = 6 + (idx % 3) * 1.5;
          const delay = idx * 0.25;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 group"
            >
              <div
                className="flex items-center justify-center h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 glass-card will-change-transform"
                style={{
                  animation: `floaty ${duration}s ease-in-out ${delay}s infinite`,
                }}
              >
                <div className="text-2xl font-extrabold text-foreground">
                  {it.count}
                </div>
              </div>
              <div className="mt-4 font-semibold text-foreground">
                {it.industry}
              </div>
              <div className="mt-1 text-sm text-foreground/80">{it.region}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
