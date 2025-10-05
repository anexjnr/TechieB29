import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

function avatarSvg(initials: string, color: string) {
  const safe = initials
    .replace(/[^A-Z0-9]/gi, "")
    .slice(0, 2)
    .toUpperCase();
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="96" height="96" rx="16" fill="url(#g)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Poppins, Arial, sans-serif" font-size="34" fill="white" font-weight="700">${safe}</text>
</svg>`;
}

async function ensureAsset(filename: string, svg: string) {
  const existing = await prisma.asset.findFirst({ where: { filename } });
  if (existing) return existing.id;
  const created = await prisma.asset.create({
    data: {
      filename,
      mime: "image/svg+xml",
      data: Buffer.from(svg, "utf-8"),
    },
  });
  return created.id;
}

async function ensureTestimonial(
  author: string,
  title: string,
  company: string,
  quote: string,
  avatarId: string,
) {
  const existing = await prisma.testimonial.findFirst({ where: { author } });
  if (existing) {
    await prisma.testimonial.update({
      where: { id: existing.id },
      data: { title, company, quote, avatarId },
    });
    return existing.id;
  }
  const created = await prisma.testimonial.create({
    data: { author, title, company, quote, avatarId },
  });
  return created.id;
}

export async function seed() {
  // create a placeholder asset from public/placeholder.svg
  try {
    const svgPath = path.join(process.cwd(), "public", "placeholder.svg");
    const buffer = fs.readFileSync(svgPath);

    const asset = await prisma.asset.create({
      data: {
        filename: "placeholder.svg",
        mime: "image/svg+xml",
        data: buffer,
      },
    });

    const projCount = await prisma.project.count();
    if (projCount === 0) {
      await prisma.project.createMany({
        data: [
          {
            title: "Project Atlas",
            description: "Revamp of platform",
            imageId: asset.id,
          },
          {
            title: "Design System",
            description: "Reusable components",
            imageId: asset.id,
          },
          {
            title: "Analytics Suite",
            description: "Measure impact",
            imageId: asset.id,
          },
        ],
      });
    }

    const tCount = await prisma.testimonial.count();
    if (tCount === 0) {
      await prisma.testimonial.createMany({
        data: [
          {
            author: "Alex M.",
            title: "Chief Technology Officer",
            company: "Nimbus",
            quote: "They move fast without breaking clarity.",
            avatarId: asset.id,
          },
          {
            author: "Priya S.",
            title: "VP Engineering",
            company: "Northstar",
            quote: "A true partner from strategy to delivery.",
            avatarId: asset.id,
          },
          {
            author: "Alex J.",
            title: "Chief Executive Officer",
            company: "Inn Solutions",
            quote: "Working with AUIO was a game-changer.",
            avatarId: asset.id,
          },
          {
            author: "Sam R.",
            title: "Product Lead",
            company: "Gamma",
            quote: "A focused team that delivers measurable outcomes.",
            avatarId: asset.id,
          },
        ],
      });
    }

    const svcCount = await prisma.service.count();
    if (svcCount === 0) {
      await prisma.service.createMany({
        data: [
          {
            title: "Enterprise Architecture Services",
            description: "Align technology with business objectives for scale, security, and agility.",
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
        ],
      });
    }

    const aboutCount = await prisma.about.count();
    if (aboutCount === 0) {
      await prisma.about.create({
        data: {
          heading: "We design bold, resilient systems.",
          content:
            "We are a compact team focused on clarity, velocity, and measurable outcomes.",
          imageId: asset.id,
          // How We Serve timeline
          serveHeading: "How We Serve",
          serveSubheading:
            "Our proven methodology that ensures successful project delivery from concept to completion.",
          serveSteps: [
            {
              phase: "01",
              title: "Discover",
              description:
                "Align on goals, constraints, and success metrics. We dive deep into understanding your vision and requirements.",
              icon: "target",
            },
            {
              phase: "02",
              title: "Design",
              description:
                "Prototype, test, refine with users and stakeholders. Creating user-centered designs that solve real problems.",
              icon: "globe",
            },
            {
              phase: "03",
              title: "Build",
              description:
                "Implement iteratively with quality gates and CI. Building robust, scalable solutions with modern technologies.",
              icon: "trending-up",
            },
            {
              phase: "04",
              title: "Evolve",
              description:
                "Measure outcomes, learn, and iterate. Continuous improvement based on data and user feedback.",
              icon: "zap",
            },
          ],
          awards: [
            {
              icon: "award",
              title: "Tech Innovation Award",
              subtitle: "TechCrunch • 2023",
            },
            {
              icon: "star",
              title: "Best UX Design",
              subtitle: "Awwwards • 2022",
            },
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
          ],
          leadership: [
            {
              name: "Sarah Johnson",
              role: "CEO & Co-Founder",
              bio: "Former VP at Google, leading our vision and strategy",
              avatarId: asset.id,
            },
            {
              name: "Michael Chen",
              role: "CTO & Co-Founder",
              bio: "Ex-Tesla engineer, driving our technical innovation",
              avatarId: asset.id,
            },
            {
              name: "Emily Rodriguez",
              role: "VP of Design",
              bio: "Award-winning designer with 15+ years experience",
              avatarId: asset.id,
            },
          ],
          valuesHeading: "Our Purpose & Values",
          valuesSubheading:
            "The principles that guide everything we do and shape the way we work with our clients.",
          valuesCards: [
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
          ],
        },
      });
    } else {
      // Update first about entry with Purpose & Values if not present
      const first = await prisma.about.findFirst({});
      if (first) {
        await prisma.about.update({
          where: { id: first.id },
          data: {
            valuesHeading: "Our Purpose & Values",
            valuesSubheading:
              "The principles that guide everything we do and shape the way we work with our clients.",
            valuesCards: [
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
            ],
            // How We Serve timeline
            serveHeading: "How We Serve",
            serveSubheading:
              "Our proven methodology that ensures successful project delivery from concept to completion.",
            serveSteps: [
              {
                phase: "01",
                title: "Discover",
                description:
                  "Align on goals, constraints, and success metrics. We dive deep into understanding your vision and requirements.",
                icon: "target",
              },
              {
                phase: "02",
                title: "Design",
                description:
                  "Prototype, test, refine with users and stakeholders. Creating user-centered designs that solve real problems.",
                icon: "globe",
              },
              {
                phase: "03",
                title: "Build",
                description:
                  "Implement iteratively with quality gates and CI. Building robust, scalable solutions with modern technologies.",
                icon: "trending-up",
              },
              {
                phase: "04",
                title: "Evolve",
                description:
                  "Measure outcomes, learn, and iterate. Continuous improvement based on data and user feedback.",
                icon: "zap",
              },
            ],
          },
        });
      }
    }

    // Sections seed
    const sectionCount = await prisma.section.count();
    if (sectionCount === 0) {
      await prisma.section.createMany({
        data: [
          {
            key: "hero",
            heading: "Transforming Businesses with AI and Digital Innovation",
            subheading:
              "We partner with organizations to drive efficiency, accelerate growth, and deliver measurable outcomes through AI-powered platforms, digital transformation, and next-generation software solutions.",
            content:
              "We partner with organizations to drive efficiency, accelerate growth, and deliver measurable outcomes through AI-powered platforms, digital transformation, and next-generation software solutions.",
            data: {
              ctas: [
                { label: "Explore Products", href: "/products" },
                { label: "Speak to an Expert", href: "/contact" },
              ],
            },
            imageId: asset.id,
            order: 1,
          },
          {
            key: "info-cards",
            heading: "Capabilities",
            subheading: "Where we focus impact",
            data: {
              cards: [
                {
                  icon: "target",
                  title: "Strategy",
                  subtitle:
                    "From discovery to roadmap, we align teams on outcomes.",
                },
                {
                  icon: "palette",
                  title: "Design",
                  subtitle: "Accessible, modern interfaces with purpose.",
                },
                {
                  icon: "cpu",
                  title: "Engineering",
                  subtitle: "Robust web apps, APIs, and infra.",
                },
                {
                  icon: "bar-chart-3",
                  title: "Analytics",
                  subtitle: "Ship, learn, iterate with data.",
                },
              ],
            },
            order: 2,
          },
          {
            key: "who-we-are",
            heading: "Who We Are",
            subheading:
              "A senior, cross-functional team with a bias for clarity and measurable outcomes.",
            content:
              "Operating as a remote-first company with strategic offices globally, we emphasize clarity, fast feedback loops, and long-term partnerships that prioritize user value and technical excellence.",
            data: {
              paragraphs: [
                "A senior, cross-functional team that designs, builds, and scales products people love. We blend strategy, design, engineering, and analytics to deliver measurable impact.",
                "We partner with leadership to translate uncertain opportunities into clear roadmaps — combining user research, pragmatic engineering, and measurable outcomes.",
                "Operating as a remote-first company with strategic offices globally, we emphasize clarity, fast feedback loops, and long-term partnerships that prioritize user value and technical excellence.",
              ],
            },
            imageId: asset.id,
            order: 3,
          },
          {
            key: "what-we-do",
            heading: "What We Do",
            subheading:
              "Integrated consulting, product, and engineering partnerships.",
            data: {
              tiles: [
                {
                  icon: "target",
                  title: "AI & Digital Transformation",
                  subtitle:
                    "Reimagine processes with intelligence and automation.",
                },
                {
                  icon: "bar-chart-3",
                  title: "Enterprise Products",
                  subtitle:
                    "Future-ready platforms across Retail, NBFC, MEP, and Data Transfer.",
                },
                {
                  icon: "cpu",
                  title: "Technology Services",
                  subtitle:
                    "Architecture review, cloud enablement, AI augmentation, and enterprise security.",
                },
              ],
            },
            order: 4,
          },
          {
            key: "impact",
            heading: "Impact Snapshot",
            data: {
              items: [
                {
                  type: "description",
                  icon: "globe",
                  heading: "Presence across India & the Middle East",
                },
                {
                  type: "stat",
                  value: 45,
                  suffix: "+",
                  label: "Clients served",
                  href: "/clients",
                },
                {
                  type: "stat",
                  value: 4,
                  label: "Flagship enterprise products",
                  href: "/products",
                },
              ],
            },
            order: 5,
          },
          {
            key: "nav",
            heading: "Navigation",
            content: JSON.stringify([
              { to: "/about", label: "About Us" },
              { to: "/products", label: "Products" },
              { to: "/services", label: "Services" },
              { to: "/clients", label: "Clients" },
              { to: "/contact", label: "Contact" },
            ]),
            order: 0,
          },
        ],
      });
    }

    // Ensure compact What We Do section exists/updated
    await prisma.section.upsert({
      where: { key: "what-we-do-compact" },
      update: {
        heading: "What We Do",
        subheading: "",
        data: [
          {
            icon: "target",
            heading: "AI & Digital Transformation",
            subheading: "Reimagine processes with intelligence and automation.",
          },
          {
            icon: "bar-chart-3",
            heading: "Enterprise Products",
            subheading:
              "Future-ready platforms across Retail, NBFC, MEP, and Data Transfer.",
          },
          {
            icon: "cpu",
            heading: "Technology Services",
            subheading:
              "Architecture review, cloud enablement, AI augmentation, and enterprise security.",
          },
        ],
        order: 4,
        enabled: true,
      },
      create: {
        key: "what-we-do-compact",
        heading: "What We Do",
        subheading: "",
        data: [
          {
            icon: "target",
            heading: "AI & Digital Transformation",
            subheading: "Reimagine processes with intelligence and automation.",
          },
          {
            icon: "bar-chart-3",
            heading: "Enterprise Products",
            subheading:
              "Future-ready platforms across Retail, NBFC, MEP, and Data Transfer.",
          },
          {
            icon: "cpu",
            heading: "Technology Services",
            subheading:
              "Architecture review, cloud enablement, AI augmentation, and enterprise security.",
          },
        ],
        order: 4,
        enabled: true,
      },
    });

    // Ensure 'who' section exists with image
    await prisma.section.upsert({
      where: { key: "who" },
      update: {
        heading: "Who We Are",
        content:
          "We are a senior, cross-functional team focused on clarity, velocity, and measurable outcomes across regulated and consumer markets.\nOur operators blend research, design, and engineering disciplines to translate uncertain opportunities into compounding value.",
        data: {
          paragraphs: [
            "We are a senior, cross-functional team focused on clarity, velocity, and measurable outcomes across regulated and consumer markets.",
            "Our operators blend research, design, and engineering disciplines to translate uncertain opportunities into compounding value.",
            "Operating as a remote-first company with strategic offices globally, we emphasize clarity, fast feedback loops, and long-term partnerships that prioritize user value and technical excellence.",
          ],
        },
        imageId: asset.id,
        order: 4,
        enabled: true,
      },
      create: {
        key: "who",
        heading: "Who We Are",
        content:
          "We are a senior, cross-functional team focused on clarity, velocity, and measurable outcomes across regulated and consumer markets.\nOur operators blend research, design, and engineering disciplines to translate uncertain opportunities into compounding value.",
        data: {
          paragraphs: [
            "We are a senior, cross-functional team focused on clarity, velocity, and measurable outcomes across regulated and consumer markets.",
            "Our operators blend research, design, and engineering disciplines to translate uncertain opportunities into compounding value.",
            "Operating as a remote-first company with strategic offices globally, we emphasize clarity, fast feedback loops, and long-term partnerships that prioritize user value and technical excellence.",
          ],
        },
        imageId: asset.id,
        order: 4,
        enabled: true,
      },
    });

    // Ensure 4 avatar assets and testimonials
    const avatarIds = await Promise.all([
      ensureAsset("avatar-ava.svg", avatarSvg("AT", "#7C3AED")),
      ensureAsset("avatar-daniel.svg", avatarSvg("DL", "#22D3EE")),
      ensureAsset("avatar-priya.svg", avatarSvg("PS", "#F59E0B")),
      ensureAsset("avatar-omar.svg", avatarSvg("OR", "#34D399")),
    ]);

    await ensureTestimonial(
      "Ava Thompson",
      "Product Manager",
      "Horizon Labs",
      "The team delivered quickly and aligned outcomes with business goals.",
      avatarIds[0],
    );
    await ensureTestimonial(
      "Daniel Lee",
      "CTO",
      "CirrusTech",
      "Rock-solid engineering and clear communication throughout.",
      avatarIds[1],
    );
    await ensureTestimonial(
      "Priya Shah",
      "Head of Analytics",
      "DataForge",
      "They helped us instrument, measure, and iterate with confidence.",
      avatarIds[2],
    );
    await ensureTestimonial(
      "Omar Reyes",
      "Engineering Manager",
      "Nova Systems",
      "A pragmatic partner from strategy to scalable delivery.",
      avatarIds[3],
    );
  } catch (e) {
    console.warn("Seeding failed:", e);
  }
}

// Note: seeding is invoked from server/index.ts during dev server startup
