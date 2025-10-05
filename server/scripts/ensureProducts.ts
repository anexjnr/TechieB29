import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "RetailFlow ERP",
    tagline: "Supermarkets made smarter.",
    description:
      "RetailFlow ERP empowers retailers to manage operations seamlessly with real-time insights, automated purchasing, and intelligent inventory control.",
    keyCapabilities: [
      "Smart inventory management with expiry tracking",
      "Integrated POS with barcode scanning and multi-payment options",
      "Automated supplier orders and replenishment",
      "Daily sales dashboards and profit analytics",
      "Loyalty programs and promotions management",
    ],
    technology: "React.js, Node.js, PostgreSQL",
    clientsCountDisplay: "35+",
    clientsRegion: "India",
    order: 1,
    enabled: true,
  },
  {
    name: "FinanceFlow NBFC Platform",
    tagline: "Redefining digital lending.",
    description:
      "FinanceFlow enables NBFCs to manage the end-to-end loan lifecycle while ensuring compliance and enhancing customer experience.",
    keyCapabilities: [
      "Loan application to closure lifecycle",
      "Automated collections and recovery workflows",
      "Digital KYC and customer onboarding",
      "RBI compliance, CRILC reporting, audit trails",
      "Accounting, provisioning, and financial statements",
      "Portfolio performance analytics",
    ],
    technology: ".NET, WPF, SQL Server, ASP.NET Web API",
    clientsCountDisplay: "5",
    clientsRegion: "India & Dubai",
    order: 2,
    enabled: true,
  },
  {
    name: "MEPFlow Planner",
    tagline: "Deliver projects with confidence.",
    description:
      "MEPFlow helps contractors and consultants plan, allocate, and execute projects efficiently with real-time visibility and compliance management.",
    keyCapabilities: [
      "Gantt chart–based project scheduling",
      "Resource and equipment allocation",
      "Budget monitoring and cost tracking",
      "Building code compliance and safety checklists",
      "Interactive dashboards and client reporting",
    ],
    technology: "Angular 17, ASP.NET Core 8, SQL Server, Redis",
    clientsCountDisplay: "2",
    clientsRegion: "Dubai, Abu Dhabi & Qatar",
    order: 3,
    enabled: true,
  },
  {
    name: "DataBridge",
    tagline: "Secure, reliable, and order-preserving data transfers.",
    description:
      "DataBridge ensures mission-critical data moves safely and efficiently—without compromise.",
    keyCapabilities: [
      "Sequence-preserving transfers for sensitive data",
      "Intelligent chunking and precise resume points",
      "AES-256 encryption and validation checks",
      "Optimized bandwidth usage for faster transfers",
      "Real-time progress visibility and audit history",
    ],
    technology: ".NET Core 8, Azure Service Bus, SQL Server",
    clientsCountDisplay: "5",
    clientsRegion: "Middle East",
    order: 4,
    enabled: true,
  },
];

async function run() {
  try {
    for (const [idx, p] of products.entries()) {
      const existing = await prisma.product.findFirst({ where: { name: p.name } });
      if (existing) {
        await prisma.product.update({ where: { id: existing.id }, data: p });
        console.log(`Updated product ${idx + 1}: ${p.name}`);
      } else {
        await prisma.product.create({ data: p });
        console.log(`Created product ${idx + 1}: ${p.name}`);
      }
    }
  } catch (e) {
    console.error("Ensure products failed", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
