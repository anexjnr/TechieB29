import Section from "@/components/site/Section";
import TiltCard from "@/components/site/TiltCard";
import { useEffect, useMemo, useState } from "react";

interface Product {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  keyCapabilities?: string[] | null;
  technology?: string | null;
  clientsCountDisplay?: string | null;
  clientsRegion?: string | null;
  order?: number | null;
  enabled?: boolean | null;
}

export default function Products() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = await res.json();
        if (canceled) return;
        const list: Product[] = Array.isArray(arr)
          ? arr.filter((p: any) => p && p.enabled !== false)
          : [];
        setProducts(list);
      } catch (e: any) {
        if (!canceled) setError(e?.message || "Failed to load products");
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  const ordered = useMemo(() => {
    const arr = Array.isArray(products) ? products : [];
    return [...arr].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [products]);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Section>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            Products
          </h1>
          <p className="mt-4 text-foreground/85">Unable to load products.</p>
        </Section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Section>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
          Products
        </h1>
        <p className="mt-4 max-w-prose text-foreground/85">
          Our flagship platforms built for scale, compliance, and operational
          excellence.
        </p>
      </Section>

      <Section
        className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6"
        delay={0.05}
      >
        {(ordered.length ? ordered : []).map((p) => (
          <TiltCard key={p.id} className="h-full">
            <div className="flex items-start gap-5">
              {/* Infographic counter */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full glass-card border border-primary/20 flex items-center justify-center">
                  <div className="text-xl font-extrabold text-foreground">
                    {p.clientsCountDisplay || "—"}
                  </div>
                </div>
                <div className="mt-2 text-xs text-foreground/80 text-center max-w-[6rem]">
                  {p.clientsRegion || "Clients"}
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-2xl font-bold text-foreground">
                  {p.name}
                </div>
                {p.tagline && (
                  <div className="mt-1 text-primary/100 font-semibold">
                    {p.tagline}
                  </div>
                )}
                {p.description && (
                  <p className="mt-3 text-sm text-foreground/85">
                    {p.description}
                  </p>
                )}

                {Array.isArray(p.keyCapabilities) &&
                  p.keyCapabilities.length > 0 && (
                    <ul className="mt-4 text-sm text-foreground/90 list-disc pl-5 space-y-1">
                      {p.keyCapabilities.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  )}

                {p.technology && (
                  <div className="mt-4 text-xs text-foreground/80">
                    <span className="inline-block rounded-full border border-primary/20 px-2 py-1 bg-primary/10">
                      Tech: {p.technology}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </TiltCard>
        ))}
      </Section>
    </div>
  );
}
