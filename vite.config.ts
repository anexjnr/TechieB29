import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname, "client"), // 👈 this fixes 403 error
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        path.resolve(__dirname, "client"), // ✅ allowed
        path.resolve(__dirname, "shared"), // ✅ shared modules
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/spa"), // make it absolute
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return null;
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/');
            const pkg = parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
            return `vendor.${pkg.replace('@', '').replace('/', '_')}`;
          }
        },
      },
    },
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      const mod = await import("./server/index.ts");
      const app = mod.createServer();
      server.middlewares.use(app);
    },
  };
}
