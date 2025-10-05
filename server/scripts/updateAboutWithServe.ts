import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  try {
    const items = await prisma.about.findMany();
    if (!items || items.length === 0) {
      console.log('No about rows found');
      return;
    }

    for (const item of items) {
      const needServe = (item as any).serveSteps == null ||
        ((item as any).serveSteps && Array.isArray((item as any).serveSteps) && (item as any).serveSteps.length === 0);
      if (!needServe) {
        console.log(`About ${item.id} already has serve fields`);
        continue;
      }

      const serveHeading = 'How We Serve';
      const serveSubheading = 'Our proven methodology that ensures successful project delivery from concept to completion.';
      const serveSteps = [
        {
          phase: '01',
          title: 'Discover',
          description:
            'Align on goals, constraints, and success metrics. We dive deep into understanding your vision and requirements.',
          icon: 'target',
        },
        {
          phase: '02',
          title: 'Design',
          description:
            'Prototype, test, refine with users and stakeholders. Creating user-centered designs that solve real problems.',
          icon: 'globe',
        },
        {
          phase: '03',
          title: 'Build',
          description:
            'Implement iteratively with quality gates and CI. Building robust, scalable solutions with modern technologies.',
          icon: 'trending-up',
        },
        {
          phase: '04',
          title: 'Evolve',
          description:
            'Measure outcomes, learn, and iterate. Continuous improvement based on data and user feedback.',
          icon: 'zap',
        },
      ];

      await prisma.about.update({
        where: { id: item.id },
        data: {
          serveHeading,
          serveSubheading,
          serveSteps,
        },
      });

      console.log(`Updated about ${item.id} with serve fields`);
    }
  } catch (e) {
    console.error('Update failed', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
