import { Router } from "express";
import { prisma } from "../prisma";
import { memoryDb, serveAssetFallback } from "../dbFallback";

const router = Router();

router.get("/news", async (_req, res) => {
  try {
    const items = await prisma.news.findMany({
      orderBy: { date: "desc" },
      include: { image: true } as any,
    });
    res.json(items);
  } catch (e) {
    console.warn("Prisma news failed, using memory store", e.message || e);
    res.json(memoryDb.news);
  }
});

router.get("/testimonials", async (_req, res) => {
  try {
    const items = await prisma.testimonial.findMany({
      include: { avatar: true } as any,
    });
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
    res.json(items);
  } catch (e) {
    console.warn("Prisma about failed, using memory store", e.message || e);
    res.json(memoryDb.about);
  }
});

router.get("/sections", async (_req, res) => {
  try {
    const items = await prisma.section.findMany({
      orderBy: { order: "asc" },
      include: { image: true } as any,
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

export default router;
