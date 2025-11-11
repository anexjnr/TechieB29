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

      {/* ScaNova Section */}
      <Section className="mt-10" delay={0.05}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Image */}
          <div className="order-2 lg:order-1">
            <TiltCard>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc787008d41374f06b8049baaa19bb0f7%2Fa95ef8b276434e55b2646c997d8de9ea?format=webp&width=800"
                alt="ScaNova AI Platform"
                className="w-full h-auto rounded-lg"
              />
            </TiltCard>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              ScaNova
            </h2>
            <p className="mt-2 text-lg text-primary/100 font-semibold">
              AI-Driven Contextual Intelligence Platform
            </p>
            <p className="mt-4 text-foreground/85">
              ScaNova is a flagship AI platform powered by our proprietary
              pretrained model MYRA. It seamlessly extracts, understands, and
              integrates content into real-world business contexts—enabling
              organizations to transform raw data into actionable intelligence.
            </p>

            {/* Current Capabilities */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Current Capabilities
              </h3>
              <p className="mt-2 text-sm text-foreground/85">
                ScaNova currently delivers contextual data extraction from
                invoices and structured documents, powered by an advanced
                combination of AI and OCR.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                <li className="flex items-start gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>
                    <strong>API Integration:</strong> Enables smooth integration
                    with existing enterprise applications.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>
                    <strong>Custom Solutions:</strong> Tailored configurations
                    for industry-specific workflows.
                  </span>
                </li>
              </ul>
            </div>

            {/* Current Platforms */}
            <div className="mt-6 pt-6 border-t border-primary/20">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Current Platforms
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                  <div className="text-sm font-semibold text-foreground">
                    RetailFlow ERP
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                  <div className="text-sm font-semibold text-foreground">
                    FinanceFlow
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                  <div className="text-sm font-semibold text-foreground">
                    MepFlow
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                  <div className="text-sm font-semibold text-foreground">
                    DataBridge
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Product Tiles Section */}
      <Section className="mt-16" delay={0.1}>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Integrated Business Solutions
        </h2>
        <p className="mt-3 max-w-prose text-foreground/85">
          Enterprise platforms purpose-built for specific industries and
          workflows.
        </p>
      </Section>

      <Section
        className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        delay={0.15}
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
