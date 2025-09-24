import { Router } from "express";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import { authMiddleware, requireRole, hashPassword } from "../auth";
import { prisma } from "../prisma";
import { memoryDb, createItem, updateItem, deleteItem, serveAssetFallback } from '../dbFallback';

const router = Router();
const upload = multer(); // memory storage

router.use(authMiddleware);

// Users management (RBAC: only ADMIN)
router.get('/users', requireRole(['ADMIN']), async (_req, res) => {
  try {
    const users = await prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(users);
  } catch (e) {
    console.warn('Falling back to memoryDb users', e);
    res.json(memoryDb.admins);
  }
});

router.post('/users', requireRole(['ADMIN']), async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const pw = await hashPassword(password);
    const created = await prisma.adminUser.create({ data: { email, passwordHash: pw, role: role || 'EDITOR' } });
    res.status(201).json(created);
  } catch (e) {
    try {
      const created = createItem(memoryDb.admins as any, { email, passwordHash: await hashPassword(password), role: role || 'EDITOR' } as any);
      res.status(201).json(created);
    } catch (e2) {
      console.error(e2);
      res.status(500).json({ error: 'Create user failed' });
    }
  }
});

router.put('/users/:id', requireRole(['ADMIN']), async (req, res) => {
  const id = String(req.params.id);
  const { role, password } = req.body || {};
  try {
    const data: any = {};
    if (role) data.role = role;
    if (password) data.passwordHash = await hashPassword(password);
    const updated = await prisma.adminUser.update({ where: { id }, data });
    res.json(updated);
  } catch (e) {
    try {
      const updated = updateItem(memoryDb.admins as any, id, { ...(role ? { role } : {}), ...(password ? { passwordHash: await hashPassword(password) } : {}) } as any);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (e2) {
      console.error(e2);
      res.status(500).json({ error: 'Update failed' });
    }
  }
});

router.delete('/users/:id', requireRole(['ADMIN']), async (req, res) => {
  const id = String(req.params.id);
  try {
    await prisma.adminUser.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    try {
      const ok = deleteItem(memoryDb.admins as any, id);
      res.json({ ok });
    } catch (e2) {
      console.error(e2);
      res.status(500).json({ error: 'Delete failed' });
    }
  }
});

router.get("/me", async (_req, res) => {
  res.json({ ok: true });
});

// Dashboard stats: counts of primary models
router.get("/stats", async (_req, res) => {
  try {
    const [servicesCount, projectsCount, newsCount, testimonialsCount, jobsCount, sectionsCount] = await Promise.all([
      prisma.service.count(),
      prisma.project.count(),
      prisma.news.count(),
      prisma.testimonial.count(),
      prisma.job.count(),
      prisma.section.count(),
    ]);
    return res.json({ services: servicesCount, projects: projectsCount, news: newsCount, testimonials: testimonialsCount, jobs: jobsCount, sections: sectionsCount });
  } catch (e) {
    // fallback to memory DB counts
    return res.json({
      services: memoryDb.services.length,
      projects: memoryDb.projects.length,
      news: memoryDb.news.length,
      testimonials: memoryDb.testimonials.length,
      jobs: memoryDb.jobs.length,
      sections: memoryDb.sections ? memoryDb.sections.length : 0,
    });
  }
});

// Upload to DB as Asset and return a URL to fetch the asset
router.post("/upload", upload.single("file"), async (req, res) => {
  const f = req.file as Express.Multer.File | undefined;
  if (!f) return res.status(400).json({ error: "No file" });
  try {
    const created = await prisma.asset.create({
      data: {
        filename: f.originalname,
        mime: f.mimetype,
        data: f.buffer,
      },
    });
    const url = `/api/admin/assets/${created.id}`;
    res.json({ url, id: created.id });
  } catch (e) {
    console.warn('Prisma upload failed, falling back to disk storage', e.message || e);
    try {
      const uploads = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
      const name = `${Date.now()}-${f.originalname}`.replace(/\s+/g, '-');
      const p = path.join(uploads, name);
      fs.writeFileSync(p, f.buffer);
      const url = `/uploads/${name}`;
      res.json({ url, id: name });
    } catch (e2) {
      console.error('Fallback upload failed', e2);
      res.status(500).json({ error: "Upload failed" });
    }
  }
});

// Serve asset bytes
router.get('/assets/:id', async (req, res) => {
  const id = String(req.params.id);
  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return serveAssetFallback(id, res);
    res.setHeader('Content-Type', asset.mime);
    res.send(Buffer.from(asset.data as Buffer));
  } catch (e) {
    console.warn('Prisma asset fetch failed, using fallback', e.message || e);
    serveAssetFallback(id, res);
  }
});

// Admin assets list & delete
router.get('/assets', async (_req, res) => {
  try {
    const items = await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } as any });
    res.json(items.map((a:any)=>({ id: a.id, filename: a.filename, createdAt: a.createdAt })));
  } catch (e) {
    try {
      const uploads = path.join(process.cwd(), 'public', 'uploads');
      const files = fs.existsSync(uploads) ? fs.readdirSync(uploads) : [];
      const list = files.map((f:any) => ({ id: f, filename: f, url: `/uploads/${f}` }));
      res.json(list);
    } catch (e2) { console.error(e2); res.json([]); }
  }
});

router.delete('/assets/:id', async (req, res) => {
  const id = String(req.params.id);
  try {
    await prisma.asset.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (e) {
    // fallback: remove file from public/uploads
    try {
      const uploads = path.join(process.cwd(), 'public', 'uploads');
      const p = path.join(uploads, id);
      if (fs.existsSync(p)) fs.unlinkSync(p);
      return res.json({ ok: true });
    } catch (e2) { console.error(e2); return res.status(500).json({ error: 'Delete failed' }); }
  }
});

// Policies (policy_document table)
router.get('/policies', async (_req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe('SELECT id, title, content, created_at as "createdAt" FROM policy_document ORDER BY created_at DESC');
    return res.json(rows);
  } catch (e) {
    return res.json(memoryDb.policies);
  }
});

router.post('/policies', async (req, res) => {
  const { title, content } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });
  try {
    const inserted = await prisma.$executeRawUnsafe('INSERT INTO policy_document (id, title, content, created_at) VALUES (gen_random_uuid()::text, $1, $2, now())', title, content || null);
    // return fresh list
    const rows = await prisma.$queryRawUnsafe('SELECT id, title, content, created_at as "createdAt" FROM policy_document ORDER BY created_at DESC');
    return res.status(201).json(rows[0] || rows);
  } catch (e) {
    const created = createItem(memoryDb.policies as any, { title, content });
    return res.status(201).json(created);
  }
});

router.delete('/policies/:id', async (req, res) => {
  const id = String(req.params.id);
  try {
    await prisma.$executeRawUnsafe('DELETE FROM policy_document WHERE id = $1', id);
    return res.json({ ok: true });
  } catch (e) {
    const ok = deleteItem(memoryDb.policies as any, id);
    return res.json({ ok });
  }
});

// Contact inquiries
router.get('/contact', async (_req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe('SELECT id, name, email, message, created_at as "createdAt" FROM contact_inquiry ORDER BY created_at DESC');
    return res.json(rows);
  } catch (e) {
    return res.json(memoryDb.contact);
  }
});

router.delete('/contact/:id', async (req, res) => {
  const id = String(req.params.id);
  try {
    await prisma.$executeRawUnsafe('DELETE FROM contact_inquiry WHERE id = $1', id);
    return res.json({ ok: true });
  } catch (e) {
    const ok = deleteItem(memoryDb.contact as any, id);
    return res.json({ ok });
  }
});

// Applications (resume uploads)
router.get('/applications', async (_req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe('SELECT id, name, email, position, resume_asset_id as "resumeAssetId", applied_at as "appliedAt" FROM application ORDER BY applied_at DESC');
    return res.json(rows);
  } catch (e) {
    return res.json(memoryDb.applications);
  }
});

router.post('/applications', upload.single('resume'), async (req, res) => {
  const f = req.file as Express.Multer.File | undefined;
  const { name, email, position } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  try {
    let resumeAssetId: string | null = null;
    if (f) {
      const asset = await prisma.asset.create({ data: { filename: f.originalname, mime: f.mimetype, data: f.buffer } });
      resumeAssetId = asset.id;
    }
    const inserted = await prisma.$executeRawUnsafe('INSERT INTO application (id, name, email, position, resume_asset_id, applied_at) VALUES (gen_random_uuid()::text, $1, $2, $3, $4, now())', name, email, position || null, resumeAssetId);
    const rows = await prisma.$queryRawUnsafe('SELECT id, name, email, position, resume_asset_id as "resumeAssetId", applied_at as "appliedAt" FROM application ORDER BY applied_at DESC');
    return res.status(201).json(rows[0] || rows);
  } catch (e) {
    console.warn('Creating application failed, using memory fallback', e);
    const created = createItem(memoryDb.applications as any, { name, email, position, resumeUrl: f ? `/uploads/${Date.now()}-${f.originalname}` : undefined, appliedAt: new Date().toISOString() } as any);
    // If file provided, write to disk fallback
    if (f) {
      try {
        const uploads = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
        const nameFile = `${Date.now()}-${f.originalname}`.replace(/\s+/g, '-');
        fs.writeFileSync(path.join(uploads, nameFile), f.buffer);
      } catch (e2) { console.error(e2); }
    }
    return res.status(201).json(created);
  }
});

router.delete('/applications/:id', async (req, res) => {
  const id = String(req.params.id);
  try {
    await prisma.$executeRawUnsafe('DELETE FROM application WHERE id = $1', id);
    return res.json({ ok: true });
  } catch (e) {
    const ok = deleteItem(memoryDb.applications as any, id);
    return res.json({ ok });
  }
});

// Serve steps (How We Serve)
router.get('/serve', async (_req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe('SELECT id, title, description, "order" FROM serve_step ORDER BY "order" ASC');
    return res.json(rows);
  } catch (e) {
    return res.json(memoryDb.serve);
  }
});

router.post('/serve', async (req, res) => {
  const { title, description, order } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });
  try {
    await prisma.$executeRawUnsafe('INSERT INTO serve_step (id, title, description, "order") VALUES (gen_random_uuid()::text, $1, $2, $3)', title, description || null, order || null);
    const rows = await prisma.$queryRawUnsafe('SELECT id, title, description, "order" FROM serve_step ORDER BY "order" ASC');
    return res.status(201).json(rows[0] || rows);
  } catch (e) {
    const created = createItem(memoryDb.serve as any, { title, description } as any);
    return res.status(201).json(created);
  }
});

// Scheduled posts
router.get('/scheduled_posts', async (_req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe('SELECT id, news_id as "newsId", publish_at as "publishAt", status FROM scheduled_post ORDER BY publish_at DESC');
    return res.json(rows);
  } catch (e) {
    return res.json([]);
  }
});

router.post('/scheduled_posts', async (req, res) => {
  const { newsId, publishAt } = req.body || {};
  if (!newsId || !publishAt) return res.status(400).json({ error: 'newsId and publishAt required' });
  try {
    await prisma.$executeRawUnsafe('INSERT INTO scheduled_post (id, news_id, publish_at, status) VALUES (gen_random_uuid()::text, $1, $2, $3)', newsId, new Date(publishAt), 'scheduled');
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Schedule failed' });
  }
});

// Generic mapping of sections to prisma model operations
function modelFor(section: string) {
  switch (section) {
    case 'services': return prisma.service;
    case 'projects': return prisma.project;
    case 'news': return prisma.news;
    case 'testimonials': return prisma.testimonial;
    case 'jobs': return prisma.job;
    case 'about': return prisma.about;
    case 'sections': return prisma.section;
    default: return null;
  }
}

router.get('/:section', async (req, res) => {
  const section = String(req.params.section);
  const model = modelFor(section);
  if (!model) return res.status(404).json({ error: 'Unknown section' });

  // include related asset where applicable
  const include: any = {};
  if (section === 'news') include.image = true;
  if (section === 'projects') include.image = true;
  if (section === 'about') include.image = true;
  if (section === 'testimonials') include.avatar = true;

  // Choose sensible ordering per model
  let orderBy: any = undefined;
  if (section === 'news') orderBy = { date: 'desc' };
  else orderBy = { id: 'desc' };

  try {
    const items = await model.findMany({ orderBy: orderBy as any, include: Object.keys(include).length ? include : undefined });
    res.json(items);
  } catch (e) {
    console.warn('Prisma unavailable, falling back to memory store for', section, e.message || e);
    // fallback mapping
    switch (section) {
      case 'about':
        return res.json(memoryDb.about);
      case 'services':
        return res.json(memoryDb.services);
      case 'projects':
        return res.json(memoryDb.projects);
      case 'news':
        return res.json(memoryDb.news);
      case 'testimonials':
        return res.json(memoryDb.testimonials);
      case 'jobs':
        return res.json(memoryDb.jobs);
      case 'sections':
        return res.json(memoryDb.sections || []);
      default:
        return res.json([]);
    }
  }
});

router.post('/:section', async (req, res) => {
  const section = String(req.params.section);
  const model = modelFor(section);
  if (!model) return res.status(404).json({ error: 'Unknown section' });
  try {
    const payload = req.body || {};
    const created = await model.create({ data: payload });
    res.status(201).json(created);
  } catch (e) {
    console.warn('Prisma create failed, using memory store', e.message || e);
    try {
      // use memory DB
      let created: any = null;
      switch (section) {
        case 'about':
          created = createItem(memoryDb.about, payload);
          break;
        case 'services':
          created = createItem(memoryDb.services, payload);
          break;
        case 'projects':
          created = createItem(memoryDb.projects, payload);
          break;
        case 'news':
          created = createItem(memoryDb.news, payload);
          break;
        case 'testimonials':
          created = createItem(memoryDb.testimonials, payload);
          break;
        case 'jobs':
          created = createItem(memoryDb.jobs, payload);
          break;
        case 'sections':
          created = createItem(memoryDb.sections, payload);
          break;
        default:
          return res.status(500).json({ error: 'Create failed' });
      }
      res.status(201).json(created);
    } catch (e2) {
      console.error(e2);
      res.status(500).json({ error: 'Create failed' });
    }
  }
});

router.put('/:section/:id', async (req, res) => {
  const section = String(req.params.section);
  const id = String(req.params.id);
  const model = modelFor(section);
  if (!model) return res.status(404).json({ error: 'Unknown section' });
  try {
    const updated = await model.update({ where: { id }, data: req.body || {} });
    res.json(updated);
  } catch (e) {
    console.warn('Prisma update failed, using memory store', e.message || e);
    try {
      let updated: any = null;
      switch (section) {
        case 'about':
          updated = updateItem(memoryDb.about as any, id, req.body || {} as any);
          break;
        case 'services':
          updated = updateItem(memoryDb.services as any, id, req.body || {} as any);
          break;
        case 'projects':
          updated = updateItem(memoryDb.projects as any, id, req.body || {} as any);
          break;
        case 'news':
          updated = updateItem(memoryDb.news as any, id, req.body || {} as any);
          break;
        case 'testimonials':
          updated = updateItem(memoryDb.testimonials as any, id, req.body || {} as any);
          break;
        case 'jobs':
          updated = updateItem(memoryDb.jobs as any, id, req.body || {} as any);
          break;
        case 'sections':
          updated = updateItem(memoryDb.sections as any, id, req.body || {} as any);
          break;
        default:
          return res.status(500).json({ error: 'Update failed' });
      }
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (e2) {
      console.error(e2);
      res.status(500).json({ error: 'Update failed' });
    }
  }
});

router.delete('/:section/:id', async (req, res) => {
  const section = String(req.params.section);
  const id = String(req.params.id);
  const model = modelFor(section);
  if (!model) return res.status(404).json({ error: 'Unknown section' });
  try {
    await model.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.warn('Prisma delete failed, using memory store', e.message || e);
    try {
      let ok = false;
      switch (section) {
        case 'about':
          ok = deleteItem(memoryDb.about as any, id);
          break;
        case 'services':
          ok = deleteItem(memoryDb.services as any, id);
          break;
        case 'projects':
          ok = deleteItem(memoryDb.projects as any, id);
          break;
        case 'news':
          ok = deleteItem(memoryDb.news as any, id);
          break;
        case 'testimonials':
          ok = deleteItem(memoryDb.testimonials as any, id);
          break;
        case 'jobs':
          ok = deleteItem(memoryDb.jobs as any, id);
          break;
        case 'sections':
          ok = deleteItem(memoryDb.sections as any, id);
          break;
        default:
          return res.status(500).json({ error: 'Delete failed' });
      }
      res.json({ ok });
    } catch (e2) {
      console.error(e2);
      res.status(500).json({ error: 'Delete failed' });
    }
  }
});

export default router;
