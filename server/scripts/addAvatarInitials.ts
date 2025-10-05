import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function initials(name: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

async function run() {
  try {
    const items = await prisma.about.findMany();
    for (const item of items) {
      const leadership = (item as any).leadership as any[] | null;
      if (!leadership || !Array.isArray(leadership)) continue;
      let changed = false;
      const updated = leadership.map((l: any) => {
        if (l.avatarId || l.avatar) return l;
        if (l.avatarInitials) return l;
        const av = { ...l, avatarInitials: initials(l.name || "") };
        changed = true;
        return av;
      });
      if (changed) {
        await prisma.about.update({
          where: { id: item.id },
          data: { leadership: updated },
        });
        console.log("Updated about", item.id);
      } else {
        console.log("No change for", item.id);
      }
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
