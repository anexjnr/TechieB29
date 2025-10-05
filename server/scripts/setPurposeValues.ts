import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  try {
    const items = await prisma.about.findMany({});
    if (!items || items.length === 0) {
      console.log("No about rows found");
      return;
    }
    const valuesHeading = "Our Purpose & Values";
    const valuesSubheading =
      "The principles that guide everything we do and shape the way we work with our clients.";
    const valuesCards = [
      {
        icon: "sparkles",
        title: "Innovation at Scale",
        subtitle: "Driving impact with cutting-edge solutions",
      },
      {
        icon: "users",
        title: "Client-Centricity",
        subtitle: "Building technology that aligns with business goals",
      },
      {
        icon: "shield",
        title: "Security & Trust",
        subtitle: "Ensuring compliance, protection, and reliability",
      },
      {
        icon: "trophy",
        title: "Excellence in Delivery",
        subtitle: "Consistently meeting global benchmarks",
      },
    ];

    for (const item of items) {
      await prisma.about.update({
        where: { id: item.id },
        data: {
          valuesHeading,
          valuesSubheading,
          valuesCards,
        },
      });
      console.log(`Updated about ${item.id}`);
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
