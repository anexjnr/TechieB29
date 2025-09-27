import fs from "fs";
import path from "path";
import { db as memoryDb, createItem, updateItem, deleteItem } from "./store";

export function serveAssetFallback(id: string, res: any) {
  // if file exists in public/uploads
  const uploads = path.join(process.cwd(), "public", "uploads");
  const p = path.join(uploads, id);
  if (fs.existsSync(p)) {
    const mime = p.endsWith(".svg")
      ? "image/svg+xml"
      : "application/octet-stream";
    res.setHeader("Content-Type", mime);
    res.send(fs.readFileSync(p));
    return true;
  }
  // serve placeholder
  const placeholder = path.join(process.cwd(), "public", "placeholder.svg");
  if (fs.existsSync(placeholder)) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(fs.readFileSync(placeholder));
    return true;
  }
  res.status(404).send("Not found");
  return false;
}

export { memoryDb, createItem, updateItem, deleteItem };
