// client/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error('Root element not found');
} else {
  console.log('Mounting App at', rootEl);
  createRoot(rootEl).render(<App />);
}
