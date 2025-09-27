// client/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error('Root element not found');
} else {
  // Ensure purplemix theme is applied globally
  document.documentElement.setAttribute('data-theme', 'purplemix');
  console.log('Mounting App at', rootEl);
  createRoot(rootEl).render(<App />);
}
