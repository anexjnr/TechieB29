import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import path from "path";
import { adminLogin } from "./routes/auth";
import adminRouter from "./routes/admin";
import { db } from "./store";
import { prisma } from "./prisma";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Seed initial content in memory (deprecated) and seed Prisma DB
  db.seed().catch(() => void 0);

  // Prisma DB connection check & seed sample data
  prisma
    .$connect()
    .then(() => {
      const seedFlag = String(
        process.env.RUN_SEED_ON_START ?? "",
      ).toLowerCase();
      const shouldSeed = seedFlag === "1" || seedFlag === "true";
      if (shouldSeed) {
        // lazy import to avoid top-level module cycles
        import("./seed")
          .then((m) => m.seed())
          .catch((e) => console.warn("Seed failed", e));
      }
    })
    .catch((e) => {
      console.warn("Prisma connect failed (if running without DB):", e.message);
    });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Public API for site content (no auth)
  import("./routes/public")
    .then((m) => app.use("/api", m.default))
    .catch(() => {});

  // Tech news scheduler (server-start + every 24h)
  import("./techNews").then((m) => m.startTechNewsScheduler()).catch(() => {});

  // Auth
  app.post("/api/admin/login", adminLogin);
  app.use("/api/admin", adminRouter);

  // serve asset via admin router already at /api/admin/assets/:id

  // In production, serve the built SPA files (dist/spa)
  const distSpaPath = path.join(__dirname, "../spa");
  app.use(express.static(distSpaPath));

  // SPA fallback: serve index.html for non-API routes
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api/") && !req.path.startsWith("/health")) {
      return res.sendFile(path.join(distSpaPath, "index.html"));
    }
    next();
  });

  return app;
}

// Production entry point
if (require.main === module || process.env.NODE_ENV === "production") {
  const port = process.env.PORT || 3000;
  const app = createServer();

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📱 http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 Received SIGTERM, shutting down gracefully");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("🛑 Received SIGINT, shutting down gracefully");
    process.exit(0);
  });
}
