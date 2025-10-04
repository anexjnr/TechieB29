import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

export async function seed() {
  // create a placeholder asset from public/placeholder.svg
  try {
    const svgPath = path.join(process.cwd(), 'public', 'placeholder.svg');
    const buffer = fs.readFileSync(svgPath);

    const asset = await prisma.asset.create({
      data: {
        filename: 'placeholder.svg',
        mime: 'image/svg+xml',
        data: buffer,
      },
    });


    const projCount = await prisma.project.count();
    if (projCount === 0) {
      await prisma.project.createMany({
        data: [
          { title: 'Project Atlas', description: 'Revamp of platform', imageId: asset.id },
          { title: 'Design System', description: 'Reusable components', imageId: asset.id },
          { title: 'Analytics Suite', description: 'Measure impact', imageId: asset.id },
        ],
      });
    }

    const tCount = await prisma.testimonial.count();
    if (tCount === 0) {
      await prisma.testimonial.createMany({
        data: [
          { author: 'Alex M.', role: 'CTO, Nimbus', quote: 'They move fast without breaking clarity.', avatarId: asset.id },
          { author: 'Priya S.', role: 'VP Eng, Northstar', quote: 'A true partner from strategy to delivery.', avatarId: asset.id },
        ],
      });
    }

    const svcCount = await prisma.service.count();
    if (svcCount === 0) {
      await prisma.service.createMany({
        data: [
          { title: 'Strategy', description: 'From discovery to roadmap, aligning on outcomes.' },
          { title: 'Design', description: 'Accessible, modern interfaces with purpose.' },
          { title: 'Engineering', description: 'Robust web apps, APIs, and infra.' },
          { title: 'Analytics', description: 'Ship, learn, iterate with data.' },
        ],
      });
    }

    const aboutCount = await prisma.about.count();
    if (aboutCount === 0) {
      await prisma.about.create({ data: { heading: 'We design bold, resilient systems.', content: 'We are a compact team focused on clarity, velocity, and measurable outcomes.', imageId: asset.id } });
    }

    // Sections seed
    const sectionCount = await prisma.section.count();
    if (sectionCount === 0) {
      await prisma.section.createMany({
        data: [
          { key: 'hero', heading: 'Building clear, resilient products for modern companies', content: 'We partner with teams to design, build, and evolve software that ships value fast—without the clutter.', imageId: asset.id, order: 1 },
          { key: 'who', heading: 'Who We Are', content: 'A senior, cross‑functional team with a bias for clarity. We operate with lean process, bold typography, and a focus on measurable outcomes.', imageId: asset.id, order: 2 },
          { key: 'services', heading: 'What We Do', content: null, imageId: null, order: 3 },
        ],
      });
    }
  } catch (e) {
    console.warn('Seeding failed:', e);
  }
}

// Note: seeding is invoked from server/index.ts during dev server startup
