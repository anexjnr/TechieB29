import { Router } from "express";
import { prisma } from "../prisma";
import { memoryDb, serveAssetFallback } from "../dbFallback";

const router = Router();

router.get("/news", async (_req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=30, stale-while-revalidate=60",
  );
  try {
    const items = await prisma.techNews.findMany({
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
    const mapped = (items || []).map((n: any) => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt || "",
      image: n.imageUrl || null,
      link: n.url,
      date: n.publishedAt,
    }));
    res.json(mapped);
  } catch (e) {
    console.warn("TechNews fetch failed", e.message || e);
    res.json([]);
  }
});

router.get("/testimonials", async (_req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=60, stale-while-revalidate=120",
  );
  try {
    const items = await prisma.testimonial.findMany({
      include: { avatar: true } as any,
    });
    if (!items || items.length === 0) return res.json(memoryDb.testimonials);
    res.json(items);
  } catch (e) {
    console.warn(
      "Prisma testimonials failed, using memory store",
      e.message || e,
    );
    res.json(memoryDb.testimonials);
  }
});

router.get("/services", async (_req, res) => {
  try {
    const items = await prisma.service.findMany();
    if (!items || items.length === 0) return res.json(memoryDb.services);
    res.json(items);
  } catch (e) {
    console.warn("Prisma services failed, using memory store", e.message || e);
    res.json(memoryDb.services);
  }
});

router.get("/projects", async (_req, res) => {
  try {
    const items = await prisma.project.findMany({
      include: { image: true } as any,
    });
    if (!items || items.length === 0) return res.json(memoryDb.projects);
    res.json(items);
  } catch (e) {
    console.warn("Prisma projects failed, using memory store", e.message || e);
    res.json(memoryDb.projects);
  }
});

router.get("/about", async (_req, res) => {
  try {
    const items = await prisma.about.findMany({
      include: { image: true } as any,
    });
    if (!items || items.length === 0) return res.json(memoryDb.about);
    res.json(items);
  } catch (e) {
    console.warn("Prisma about failed, using memory store", e.message || e);
    res.json(memoryDb.about);
  }
});

router.get("/sections", async (_req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=30, stale-while-revalidate=60",
  );
  try {
    const items = await prisma.section.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        key: true,
        heading: true,
        content: true,
        enabled: true,
        order: true,
      },
    });
    if (!items || items.length === 0) {
      return res.json(memoryDb.sections || []);
    }
    res.json(items);
  } catch (e) {
    console.warn("Prisma sections failed, using memory store", e.message || e);
    res.json(memoryDb.sections || []);
  }
});

router.get("/jobs", async (_req, res) => {
  try {
    const items = await prisma.job.findMany();
    if (!items || items.length === 0) return res.json(memoryDb.jobs);
    res.json(items);
  } catch (e) {
    console.warn("Prisma jobs failed, using memory store", e.message || e);
    res.json(memoryDb.jobs);
  }
});

// Serve asset bytes publicly
router.get("/assets/:id", async (req, res) => {
  const id = String(req.params.id);
  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return serveAssetFallback(id, res);
    res.setHeader("Content-Type", asset.mime);
    res.send(Buffer.from(asset.data as Buffer));
  } catch (e) {
    console.warn("Prisma asset fetch failed, using fallback", e.message || e);
    serveAssetFallback(id, res);
  }
});

// Manual refresh endpoint (for admins/operators). Triggers fetch + upsert.
router.get("/technews/refresh", async (_req, res) => {
  try {
    const { refreshTechNews } = await import("../techNews");
    await refreshTechNews();
    const count = await prisma.techNews.count();
    res.json({ ok: true, count });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

export default router;
