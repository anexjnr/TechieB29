// client/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootEl = document.getElementById("root");

// Monkey-patch window.fetch to convert synchronous throws (from wrappers like FullStory)
// into rejected promises so callers can handle via try/catch.
if (typeof window !== "undefined" && typeof window.fetch === "function") {
  try {
    const _origFetch = window.fetch.bind(window as any);
    (window as any).fetch = function (...args: any[]) {
      try {
        const result = _origFetch(...args);
        return result;
      } catch (err) {
        // Convert sync throw into a rejected promise
        console.warn("fetch wrapper caught synchronous error:", err);
        return Promise.reject(err);
      }
    };
  } catch (e) {
    console.warn("Could not wrap window.fetch:", e);
  }
}

if (!rootEl) {
  console.error("Root element not found");
} else {
  // Ensure purplemix theme is applied globally
  document.documentElement.setAttribute("data-theme", "purplemix");
  console.log("Mounting App at", rootEl);
  createRoot(rootEl).render(<App />);
}
