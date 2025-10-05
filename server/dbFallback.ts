import fs from "fs";
import path from "path";
import type { Response } from "express";
import { db as memoryDb, createItem, updateItem, deleteItem } from "./store";

function applyFallbackCaching(
  id: string,
  buffer: Buffer,
  res: Response,
  mime: string,
  mtimeMs: number,
) {
  const etag = `"fallback-${id}-${buffer.length}-${Math.floor(mtimeMs)}"`;
  const requester = (res as any)?.req as
    | { headers?: Record<string, string> }
    | undefined;
  if (requester?.headers && requester.headers["if-none-match"] === etag) {
    res.status(304).end();
    return true;
  }
  res.setHeader("Content-Type", mime);
  res.setHeader("Content-Length", buffer.length.toString());
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.setHeader("ETag", etag);
  res.send(buffer);
  return true;
}

export function serveAssetFallback(id: string, res: Response) {
  // if file exists in public/uploads
  const uploads = path.join(process.cwd(), "public", "uploads");
  const p = path.join(uploads, id);
  if (fs.existsSync(p)) {
    const buffer = fs.readFileSync(p);
    const stats = fs.statSync(p);
    const mime = p.endsWith(".svg")
      ? "image/svg+xml"
      : "application/octet-stream";
    return applyFallbackCaching(id, buffer, res, mime, stats.mtimeMs);
  }
  // serve placeholder
  const placeholder = path.join(process.cwd(), "public", "placeholder.svg");
  if (fs.existsSync(placeholder)) {
    const buffer = fs.readFileSync(placeholder);
    const stats = fs.statSync(placeholder);
    return applyFallbackCaching(
      id,
      buffer,
      res,
      "image/svg+xml",
      stats.mtimeMs,
    );
  }
  res.status(404).send("Not found");
  return false;
}

export { memoryDb, createItem, updateItem, deleteItem };
