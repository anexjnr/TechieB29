import { prisma } from './prisma';

async function main() {
  const rows = await prisma.section.findMany({ orderBy: { order: 'asc' } });
  console.log(rows.map(r => ({ id: r.id, key: r.key, heading: r.heading, enabled: r.enabled, order: r.order })));
}
main().finally(() => prisma.$disconnect());
