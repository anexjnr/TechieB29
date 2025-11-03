import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";

export default function Insights() {
  const [news, setNews] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const n = await fetch("/api/news").then((r) => r.json());
        const fetched = Array.isArray(n)
          ? n.filter((x: any) => x.enabled !== false)
          : [];
        setNews(
          fetched.length
            ? fetched
            : [
                {
                  id: "s1",
                  title: "Q4 Highlights",
                  excerpt: "Milestones across platform and growth.",
                  image:
                    "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F9aebb7e90f334acbb611405deeab415d?format=webp&width=1200&q=80",
                },
              ],
        );
      } catch (e) {
        console.error(e);
        setNews([
          {
            id: "s1",
            title: "Q4 Highlights",
            excerpt: "Milestones across platform and growth.",
            image: null,
          },
        ]);
      }
      try {
        const t = await fetch("/api/testimonials").then((r) => r.json());
        const ft = Array.isArray(t)
          ? t.filter((x: any) => x.enabled !== false)
          : [];
        setTestimonials(
          ft.length
            ? ft
            : [
                {
                  id: "tt1",
                  author: "Alex M.",
                  role: "CTO",
                  quote: "They move fast without breaking clarity.",
                  avatar: null,
                },
              ],
        );
      } catch (e) {
        console.error(e);
        setTestimonials([
          {
            id: "tt1",
            author: "Alex M.",
            role: "CTO",
            quote: "They move fast without breaking clarity.",
            avatar: null,
          },
        ]);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Section>
        <AnimatedTitle
          text="Insights"
          className="text-4xl sm:text-5xl font-extrabold text-foreground"
        />
        <p className="mt-4 max-w-prose text-foreground/85">
          News, updates, and voices from our partners.
        </p>
      </Section>
      <Section
        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        delay={0.1}
      >
        {news.map((n) => (
          <article
            key={n.id}
            className="rounded-2xl border border-primary/20 bg-transparent overflow-hidden glass-card"
          >
            {n.image ? (
              typeof n.image === "string" ? (
                <img
                  src={n.image}
                  alt=""
                  className="w-full h-40 md:h-56 lg:h-64 object-cover border-b border-primary/10 img-responsive"
                  loading="eager"
                  decoding="sync"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).onerror = null;
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.svg";
                  }}
                />
              ) : n.image.id ? (
                <img
                  src={`/api/assets/${n.image.id}`}
                  alt=""
                  className="w-full h-40 md:h-56 lg:h-64 object-cover border-b border-primary/10 img-responsive"
                  loading="eager"
                  decoding="sync"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).onerror = null;
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.svg";
                  }}
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt=""
                  className="w-full h-40 md:h-56 lg:h-64 object-cover border-b border-primary/10 img-responsive"
              />
              )
            ) : (
              <img
                src="/placeholder.svg"
                alt=""
                className="w-full h-40 md:h-56 lg:h-64 object-cover border-b border-primary/10 img-responsive"
              />
            )}
            <div className="p-6">
              <h3 className="font-semibold text-foreground">{n.title}</h3>
              <p className="mt-2 text-sm text-foreground/90">{n.excerpt}</p>
              <button className="mt-4 text-sm font-semibold text-foreground/90 hover:text-foreground">
                Read more →
              </button>
            </div>
          </article>
        ))}
      </Section>
      <Section className="mt-16" delay={0.15}>
        <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="rounded-2xl border border-primary/20 p-6 glass-card"
            >
              <Quote className="h-5 w-5 text-foreground/90" />
              <blockquote className="mt-3 text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm text-foreground/90">
                {t.author}
                {t.role ? `, ${t.role}` : ""}
              </figcaption>
              {t.avatar ? (
                typeof t.avatar === "string" ? (
                  <img
                    src={t.avatar}
                    alt="avatar"
                    className="mt-3 h-12 w-12 rounded-full object-cover"
                  />
                ) : t.avatar.id ? (
                  <img
                    src={`/api/assets/${t.avatar.id}`}
                    alt="avatar"
                    className="mt-3 h-12 w-12 rounded-full object-cover"
                  />
                ) : null
              ) : null}
            </figure>
          ))}
        </div>
      </Section>
    </div>
  );
}
