import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const payload = {
  heading: "Clients & Reach",
  subheading: "Trusted by forward-looking organizations across industries:",
  details: [
    { industry: "Retail", count: "35+", region: "India" },
    {
      industry: "Financial Services (NBFCs)",
      count: "5",
      region: "India & Dubai",
    },
    {
      industry: "Engineering (MEP)",
      count: "2",
      region: "Dubai, Abu Dhabi & Qatar",
    },
    { industry: "Data & Infrastructure", count: "5", region: "Middle East" },
  ],
  enabled: true,
  order: 0,
};

async function run() {
  try {
    const existing = await prisma.clientSection.findFirst({
      where: { heading: payload.heading },
    });
    if (existing) {
      await prisma.clientSection.update({
        where: { id: existing.id },
        data: payload,
      });
      console.log("Updated clients section");
    } else {
      await prisma.clientSection.create({ data: payload });
      console.log("Created clients section");
    }
  } catch (e) {
    console.error("Ensure clients failed", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
