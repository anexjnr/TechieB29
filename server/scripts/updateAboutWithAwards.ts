import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  try {
    const items = await prisma.about.findMany();
    if (!items || items.length === 0) {
      console.log("No about rows found");
      return;
    }

    for (const item of items) {
      const needAwards = (item as any).awards == null;
      const needLeadership = (item as any).leadership == null;
      if (!needAwards && !needLeadership) {
        console.log(`About ${item.id} already has awards/leadership`);
        continue;
      }

      const awards = [
        {
          icon: "award",
          title: "Tech Innovation Award",
          subtitle: "TechCrunch • 2023",
        },
        { icon: "star", title: "Best UX Design", subtitle: "Awwwards • 2022" },
        {
          icon: "award",
          title: "Startup of the Year",
          subtitle: "Forbes • 2021",
        },
        {
          icon: "sparkles",
          title: "Excellence in AI",
          subtitle: "AI Summit • 2023",
        },
      ];

      const leadership = [
        {
          name: "Sarah Johnson",
          role: "CEO & Co-Founder",
          bio: "Former VP at Google, leading our vision and strategy",
          avatarId: null,
        },
        {
          name: "Michael Chen",
          role: "CTO & Co-Founder",
          bio: "Ex-Tesla engineer, driving our technical innovation",
          avatarId: null,
        },
        {
          name: "Emily Rodriguez",
          role: "VP of Design",
          bio: "Award-winning designer with 15+ years experience",
          avatarId: null,
        },
      ];

      await prisma.about.update({
        where: { id: item.id },
        data: {
          awards: needAwards ? awards : undefined,
          leadership: needLeadership ? leadership : undefined,
        },
      });

      console.log(`Updated about ${item.id} with awards/leadership`);
    }
  } catch (e) {
    console.error("Update failed", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
