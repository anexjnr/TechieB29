import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const defaultNav = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/insights", label: "Insights" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState(defaultNav);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sections");
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const navSection = data.find(
          (s: any) => s.key === "nav" || s.key === "navigation",
        );
        if (!navSection || !navSection.content) return;
        try {
          const parsed =
            typeof navSection.content === "string"
              ? JSON.parse(navSection.content)
              : navSection.content;
          if (Array.isArray(parsed)) {
            const mapped = parsed
              .map((i: any) => ({
                to: i.to || i.href || "/",
                label: i.label || i.title || "Item",
              }))
              .filter((i: any) => i.to !== "/" && i.label?.toLowerCase() !== "home");
            if (mapped.length) setNav(mapped);
          }
        } catch (e) {
          // ignore parse errors
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-colors border-0 ${scrolled ? "bg-gradient-to-b from-black/55 to-transparent backdrop-blur-sm" : "bg-transparent"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link
            to="/"
            className="font-extrabold tracking-tight text-xl text-primary/100 px-3 py-2 rounded-md"
          >
            AUIO
          </Link>
          <nav className="hidden md:flex items-center gap-8 ml-auto">
            {nav.map((n) => (
              <NavLink
                key={n.to + n.label}
                to={n.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors px-2 py-1 ${isActive ? "text-primary" : "text-primary/80 hover:text-primary"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="md:hidden ml-auto">
            <button
              aria-label="Menu"
              onClick={() => setOpen(!open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 text-primary hover:bg-primary/10"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gradient-to-b from-black/80 to-transparent border-0">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-2">
            {nav.map((n) => (
              <NavLink
                key={n.to + n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-sm font-semibold ${isActive ? "text-primary" : "text-primary/80"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
