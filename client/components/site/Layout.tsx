import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import BackgroundOrnaments from "@/components/site/BackgroundOrnaments";

export default function Layout() {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = document.documentElement;
      const reached = window.innerHeight + window.scrollY >= el.scrollHeight - 80;
      const scrolledBeyond = window.scrollY > 600; // show for long pages as well
      setAtBottom(reached || scrolledBeyond);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      // fallback
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen text-primary relative">
      <BackgroundOrnaments />
      <div className="relative z-20">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>

      {atBottom && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-[#0a0a0b] text-primary border border-primary/30 shadow-lg hover:-translate-y-0.5 transition z-[250]"
        >
          ↑
        </button>
      )}
    </div>
  );
}
