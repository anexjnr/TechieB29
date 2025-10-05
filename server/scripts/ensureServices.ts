import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    title: "Enterprise Architecture Services",
    description:
      "Align technology with business objectives for scale, security, and agility.",
    icon: "cpu",
  },
  {
    title: "Cloud Enablement",
    description: "Drive cloud adoption, optimization, and resilience.",
    icon: "cloud",
  },
  {
    title: "AI Augmentation",
    description: "Integrate intelligence into decision-making and operations.",
    icon: "zap",
  },
  {
    title: "Cybersecurity & Vulnerability Assessments",
    description: "Protect your enterprise with proactive risk management.",
    icon: "shield",
  },
];

async function run() {
  try {
    for (const s of services) {
      const existing = await prisma.service.findFirst({
        where: { title: s.title },
      });
      if (existing) {
        console.log(`Service exists: ${s.title}`);
        // update description/icon if missing
        await prisma.service.update({
          where: { id: existing.id },
          data: { description: s.description, icon: s.icon },
        });
      } else {
        await prisma.service.create({ data: s });
        console.log(`Created service: ${s.title}`);
      }
    }
    const count = await prisma.service.count();
    console.log(`Total services: ${count}`);
  } catch (e) {
    console.error("Ensure services failed", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
