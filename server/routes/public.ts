import { Router } from "express";
import { prisma } from "../prisma";
import { memoryDb, serveAssetFallback, createItem } from "../dbFallback";
import { z } from "zod";
import nodemailer from "nodemailer";

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
      include: { avatar: { select: { id: true } } } as any,
      orderBy: { author: "asc" } as any,
    });
    if (!items || items.length === 0) return res.json(memoryDb.testimonials);
    const normalized = items.map((item: any) => ({
      id: item.id,
      author: item.author,
      title: item.title,
      company: item.company,
      quote: item.quote,
      avatar:
        item?.avatar && item.avatar?.id
          ? `/api/assets/${item.avatar.id}`
          : null,
    }));
    res.json(normalized);
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
    const items = await prisma.service.findMany({
      orderBy: { order: "asc" } as any,
    });
    if (!items || items.length === 0)
      return res.json(
        Array.isArray(memoryDb.services)
          ? [...memoryDb.services].sort(
              (a: any, b: any) => (a.order || 0) - (b.order || 0),
            )
          : memoryDb.services,
      );
    res.json(items);
  } catch (e) {
    console.warn("Prisma services failed, using memory store", e.message || e);
    res.json(
      Array.isArray(memoryDb.services)
        ? [...memoryDb.services].sort(
            (a: any, b: any) => (a.order || 0) - (b.order || 0),
          )
        : memoryDb.services,
    );
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

router.get("/products", async (_req, res) => {
  try {
    const items = await prisma.product.findMany({
      orderBy: [{ order: "asc" as any }, { id: "desc" as any }],
    } as any);
    res.json(items);
  } catch (e) {
    console.warn("Prisma products failed", e.message || e);
    res.json([]);
  }
});

router.get("/clients", async (_req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=60, stale-while-revalidate=120",
  );
  try {
    const items = await prisma.clientSection.findMany({
      orderBy: { order: "asc" } as any,
      include: { image: true } as any,
    });
    if (!items || items.length === 0) return res.json(memoryDb.clients || []);
    const normalized = items.map((item: any) => {
      const assetUrl =
        item?.image && item.image?.id ? `/api/assets/${item.image.id}` : null;
      const explicitUrl =
        typeof item?.imageUrl === "string" ? item.imageUrl.trim() : null;
      const image = explicitUrl && explicitUrl.length ? explicitUrl : assetUrl;
      return {
        id: item.id,
        heading: item.heading,
        subheading: item.subheading,
        details: item.details || null,
        image,
        enabled: item.enabled,
        order: item.order,
      };
    });
    res.json(normalized);
  } catch (e) {
    console.warn("Prisma clients failed, using memory store", e.message || e);
    res.json(memoryDb.clients || []);
  }
});

router.get("/about", async (_req, res) => {
  try {
    const items = await prisma.about.findMany({
      where: { enabled: true },
      orderBy: { id: "desc" } as any,
    });
    if (!items || items.length === 0) return res.json(memoryDb.about);

    const normalized = items.map((item) => {
      const explicitUrl =
        typeof item.imageUrl === "string" ? item.imageUrl.trim() : "";
      const hasExplicitUrl = explicitUrl.length > 0;
      const image = hasExplicitUrl
        ? explicitUrl
        : item.imageId
          ? `/api/assets/${item.imageId}`
          : null;

      return {
        id: item.id,
        heading: item.heading,
        content: item.content,
        image,
        imageUrl: hasExplicitUrl ? explicitUrl : null,
        enabled: item.enabled,
        // Optional structured content
        awards: (item as any).awards || null,
        leadership: (item as any).leadership || null,
        // Purpose & Values section
        valuesHeading: (item as any).valuesHeading || null,
        valuesSubheading: (item as any).valuesSubheading || null,
        valuesCards: (item as any).valuesCards || null,
        // How We Serve timeline
        serveHeading: (item as any).serveHeading || null,
        serveSubheading: (item as any).serveSubheading || null,
        serveSteps: (item as any).serveSteps || null,
      };
    });

    res.json(normalized);
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
        subheading: true,
        content: true,
        data: true,
        enabled: true,
        order: true,
        imageId: true,
        imageUrl: true,
        image: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!items || items.length === 0) {
      return res.json(memoryDb.sections || []);
    }
    const normalized = items.map((item: any) => {
      const assetUrl =
        item?.image && typeof item.image === "object" && item.image?.id
          ? `/api/assets/${item.image.id}`
          : null;
      const explicitUrl =
        typeof item?.imageUrl === "string" ? item.imageUrl.trim() : null;
      const image = explicitUrl && explicitUrl.length ? explicitUrl : assetUrl;
      const { image: _imageRelation, ...rest } = item;
      return {
        ...rest,
        image,
        imageUrl: image,
      };
    });
    res.json(normalized);
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

    const buffer = Buffer.from(asset.data as Buffer);
    const etag = `"asset-${asset.id}-${buffer.length}"`;
    if (req.headers["if-none-match"] === etag) {
      res.status(304).end();
      return;
    }

    res.setHeader("Content-Type", asset.mime);
    res.setHeader("Content-Length", buffer.length.toString());
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("ETag", etag);
    res.send(buffer);
  } catch (e) {
    console.warn("Prisma asset fetch failed, using fallback", e.message || e);
    serveAssetFallback(id, res);
  }
});

// Contact form endpoint
router.post("/contact", async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      message: z.string().min(1),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.errors });
    }

    const { name, email, message } = parsed.data;
    const wordCount = (message || "").trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 300) {
      return res
        .status(400)
        .json({ ok: false, error: "Message exceeds 300 word limit" });
    }

    // Attempt to send email if SMTP configured
    const smtpHost = process.env.SMTP_HOST;
    const receiver = process.env.CONTACT_RECEIVER || "axpauly@gmail.com";
    const from = process.env.EMAIL_FROM || "noreply@localhost";

    if (smtpHost) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure:
          process.env.SMTP_SECURE === "1" || process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      });

      const mail = {
        from: `${name} <${email}>`,
        to: receiver,
        subject: `Website contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message.replace(/\n/g, "<br />")}</p>`,
      } as any;

      await transporter.sendMail(mail);
      return res.json({ ok: true });
    }

    // Fallback: store in memory DB and log (SMTP not configured)
    console.warn("SMTP not configured, storing contact in memory DB");
    const created = createItem(memoryDb.contact, {
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    } as any);

    console.log("Stored contact message (fallback):", created);
    return res.json({ ok: true, fallback: true });
  } catch (e: any) {
    console.error("Contact endpoint error:", e);
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
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
