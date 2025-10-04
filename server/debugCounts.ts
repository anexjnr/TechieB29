import { prisma } from './prisma';

async function main() {
  try {
    await prisma.$connect();
    const [news, projects, testimonials, services, sections, assets, about, jobs, users] = await Promise.all([
      prisma.news.count(),
      prisma.project.count(),
      prisma.testimonial.count(),
      prisma.service.count(),
      prisma.section.count(),
      prisma.asset.count(),
      prisma.about.count(),
      prisma.job.count(),
      prisma.adminUser.count(),
    ]);
    console.log(JSON.stringify({ news, projects, testimonials, services, sections, assets, about, jobs, users }, null, 2));
  } catch (e:any) {
    console.error('DB inspect error:', e?.message || e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
