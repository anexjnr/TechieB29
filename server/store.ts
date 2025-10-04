import { hashPassword } from "./auth";

export type ID = string;

export interface AdminUser {
  id: ID;
  email: string;
  passwordHash: string;
  role?: string;
}

export interface ServiceItem {
  id: ID;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  order?: number;
}
export interface ProjectItem {
  id: ID;
  title: string;
  description: string;
  image?: string;
}
export interface NewsItem {
  id: ID;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
}
export interface TestimonialItem {
  id: ID;
  author: string;
  title?: string;
  company?: string;
  quote: string;
  avatar?: string;
}
export interface JobItem {
  id: ID;
  title: string;
  location?: string;
  type?: string;
  description: string;
}
export interface AboutContent {
  id: ID;
  heading: string;
  content: string;
  image?: string;
}
export interface ServeStep {
  id: ID;
  title: string;
  description: string;
}
export interface SectionItem {
  id: ID;
  key: string;
  heading?: string;
  subheading?: string;
  content?: string;
  data?: any;
  image?: string;
  enabled?: boolean;
  order?: number;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

class MemoryDB {
  admins: AdminUser[] = [];
  about: AboutContent[] = [];
  services: ServiceItem[] = [];
  projects: ProjectItem[] = [];
  news: NewsItem[] = [];
  testimonials: TestimonialItem[] = [];
  jobs: JobItem[] = [];
  serve: ServeStep[] = [];
  sections: SectionItem[] = [];
  policies: { id: ID; title: string; content?: string; createdAt?: string }[] =
    [];
  contact: {
    id: ID;
    name?: string;
    email?: string;
    message?: string;
    createdAt?: string;
  }[] = [];
  applications: {
    id: ID;
    name?: string;
    email?: string;
    position?: string;
    resumeUrl?: string;
    appliedAt?: string;
  }[] = [];

  async seed() {
    if (this.admins.length === 0) {
      const password = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
      const passwordHash = await hashPassword(password);
      this.admins.push({
        id: uid(),
        email: process.env.ADMIN_EMAIL || "admin@company.com",
        passwordHash,
        role: "ADMIN",
      });
    }
    if (this.about.length === 0) {
      this.about.push({
        id: uid(),
        heading: "We design bold, resilient systems.",
        content:
          "We are a compact team focused on clarity, velocity, and measurable outcomes.",
        image:
          "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80",
      });
    }
    if (this.services.length === 0) {
      this.services.push(
        {
          id: uid(),
          title: "Strategy",
          description: "From discovery to roadmap, we align teams on outcomes.",
          icon: "target",
          image: null as any,
          order: 0,
        },
        {
          id: uid(),
          title: "Design",
          description: "Accessible, modern interfaces with purpose.",
          icon: "palette",
          image: null as any,
          order: 1,
        },
        {
          id: uid(),
          title: "Engineering",
          description: "Robust web apps, APIs, and infra.",
          icon: "cpu",
          image: null as any,
          order: 2,
        },
        {
          id: uid(),
          title: "Analytics",
          description: "Ship, learn, iterate with data.",
          icon: "bar-chart-3",
          image: null as any,
          order: 3,
        },
      );
    }
    if (this.serve.length === 0) {
      this.serve.push(
        {
          id: uid(),
          title: "Discover",
          description: "Define goals and constraints.",
        },
        { id: uid(), title: "Design", description: "Prototype, test, refine." },
        {
          id: uid(),
          title: "Build",
          description: "Implement with quality gates.",
        },
        { id: uid(), title: "Evolve", description: "Measure and iterate." },
      );
    }

    if (this.sections.length === 0) {
      this.sections.push(
        {
          id: uid(),
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
          image:
            "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F4ed1abb4e7b8432696da3fc4bf216ad1?format=webp&width=800",
          enabled: true,
          order: 1,
        },
        {
          id: uid(),
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
          enabled: true,
          order: 2,
        },
        {
          id: uid(),
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
          image:
            "https://cdn.builder.io/api/v1/image/assets%2Fee358a6e64744467b38bd6a3468eaeb9%2F4ed1abb4e7b8432696da3fc4bf216ad1?format=webp&width=800",
          enabled: true,
          order: 3,
        },
        {
          id: uid(),
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
          enabled: true,
          order: 4,
        },
        {
          id: uid(),
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
          enabled: true,
          order: 5,
        },
        // default editable navigation
        {
          id: uid(),
          key: "nav",
          heading: "Navigation",
          content: JSON.stringify([
            { to: "/about", label: "About Us" },
            { to: "/products", label: "Products" },
            { to: "/services", label: "Services" },
            { to: "/clients", label: "Clients" },
            { to: "/contact", label: "Contact" },
          ]),
          enabled: true,
          order: 0,
        },
      );
    }

    if (this.testimonials.length === 0) {
      this.testimonials.push(
        {
          id: uid(),
          author: "Alex M.",
          title: "Chief Technology Officer",
          company: "Nimbus",
          quote: "They move fast without breaking clarity.",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: uid(),
          author: "Priya S.",
          title: "VP Engineering",
          company: "Northstar",
          quote: "A true partner from strategy to delivery.",
          avatar:
            "https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: uid(),
          author: "Alex J.",
          title: "CEO",
          company: "Inn Solutions",
          quote: "Working with AUIO was a game-changer.",
          avatar:
            "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: uid(),
          author: "Sam R.",
          title: "Product Lead",
          company: "Gamma",
          quote: "A focused team that delivers measurable outcomes.",
          avatar:
            "https://images.unsplash.com/photo-1531123414780-f0b5f9d9d0a6?auto=format&fit=crop&w=400&q=80",
        },
      );
    }
    if (this.news.length === 0) {
      const now = new Date().toISOString();
      this.news.push(
        {
          id: uid(),
          title: "Q4 Highlights",
          excerpt: "Milestones across platform and growth.",
          content: "Full report...",
          date: now,
          image:
            "https://images.unsplash.com/photo-1503481766315-1f9d1d9c7f1a?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: uid(),
          title: "New Office",
          excerpt: "We expanded to Berlin.",
          content: "Details...",
          date: now,
          image:
            "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: uid(),
          title: "Open Roles",
          excerpt: "We're hiring across the stack.",
          content: "See careers",
          date: now,
          image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        },
      );
    }
    if (this.jobs.length === 0) {
      this.jobs.push(
        {
          id: uid(),
          title: "Senior Frontend Engineer",
          location: "Remote",
          type: "Full-time",
          description: "Own key surfaces across the app.",
        },
        {
          id: uid(),
          title: "Product Designer",
          location: "Remote",
          type: "Full-time",
          description: "Design with systems thinking.",
        },
      );
    }

    if (this.policies.length === 0) {
      this.policies.push({
        id: uid(),
        title: "Terms & Conditions",
        content: "Default terms and conditions...",
      });
    }

    if (this.contact.length === 0) {
      this.contact.push({
        id: uid(),
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Hello, I have a question about services.",
      });
    }

    if (this.applications.length === 0) {
      this.applications.push({
        id: uid(),
        name: "Alice Candidate",
        email: "alice@example.com",
        position: "Senior Frontend Engineer",
        resumeUrl: "https://example.com/resume.pdf",
        appliedAt: new Date().toISOString(),
      });
    }
  }
}

export const db = new MemoryDB();

export function createItem<T extends { id: ID }>(
  arr: T[],
  item: Omit<T, "id">,
): T {
  const created = { ...(item as any), id: uid() } as T;
  arr.unshift(created);
  return created;
}

export function updateItem<T extends { id: ID }>(
  arr: T[],
  id: ID,
  patch: Partial<T>,
): T | undefined {
  const idx = arr.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  arr[idx] = { ...arr[idx], ...patch } as T;
  return arr[idx];
}

export function deleteItem<T extends { id: ID }>(arr: T[], id: ID): boolean {
  const idx = arr.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  arr.splice(idx, 1);
  return true;
}
