import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

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
            title: "Strategy",
            description: "From discovery to roadmap, aligning on outcomes.",
          },
          {
            title: "Design",
            description: "Accessible, modern interfaces with purpose.",
          },
          {
            title: "Engineering",
            description: "Robust web apps, APIs, and infra.",
          },
          {
            title: "Analytics",
            description: "Ship, learn, iterate with data.",
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
        },
      });
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
  } catch (e) {
    console.warn("Seeding failed:", e);
  }
}

// Note: seeding is invoked from server/index.ts during dev server startup
