import type { RequestHandler } from "express";
import { comparePassword, signToken, hashPassword } from "../auth";
import { prisma } from "../prisma";
import { memoryDb, createItem } from '../dbFallback';

export const adminLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  // ensure there is at least one admin (seed)
  const adminEmail = process.env.ADMIN_EMAIL || "admin@company.com";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";

  try {
    let admin = await prisma.adminUser.findUnique({ where: { email: adminEmail } }).catch(() => null as any);
    if (!admin) {
      const pw = await hashPassword(adminPassword);
      admin = await prisma.adminUser.create({ data: { email: adminEmail, passwordHash: pw, role: 'ADMIN' } });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } }).catch(() => null as any);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ sub: user.id, email: user.email, role: (user as any).role || 'ADMIN' });
    {
      const cookieParts = [`token=${token}`, 'HttpOnly', 'Path=/', `Max-Age=${7*24*3600}`, 'SameSite=Lax'];
      if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');
      res.setHeader('Set-Cookie', cookieParts.join('; '));
      return res.json({ token });
    }
  } catch (e) {
    console.warn('Prisma not available for auth, falling back to memory DB');
    // ensure seed admin exists
    if (memoryDb.admins.length === 0) {
      const pw = await hashPassword(adminPassword);
      createItem(memoryDb.admins, { email: adminEmail, passwordHash: pw, role: 'ADMIN' } as any);
    }
    const user = memoryDb.admins.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ sub: user.id, email: user.email, role: user.role || 'ADMIN' });
    {
      const cookieParts = [`token=${token}`, 'HttpOnly', 'Path=/', `Max-Age=${7*24*3600}`, 'SameSite=Lax'];
      if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');
      res.setHeader('Set-Cookie', cookieParts.join('; '));
      return res.json({ token });
    }
  }
};
