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
  role?: string;
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
  content?: string;
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
          content:
            "We partner with organizations to drive efficiency, accelerate growth, and deliver measurable outcomes through AI-powered platforms, digital transformation, and next-generation software solutions.",
          image:
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80",
          enabled: true,
          order: 1,
        },
        {
          id: uid(),
          key: "flowchart",
          heading: "Capabilities",
          content: JSON.stringify([
            {
              icon: "target",
              label: "Strategy",
              desc: "Crisp systems that scale.",
            },
            {
              icon: "palette",
              label: "Design",
              desc: "Crisp systems that scale.",
            },
            {
              icon: "cpu",
              label: "Engineering",
              desc: "Crisp systems that scale.",
            },
            {
              icon: "bar-chart-3",
              label: "Analytics",
              desc: "Crisp systems that scale.",
            },
          ]),
          enabled: true,
          order: 1,
        },
        {
          id: uid(),
          key: "who",
          heading: "Who We Are",
          content:
            "A senior, cross‑functional team with a bias for clarity. We operate with lean process, bold typography, and a focus on measurable outcomes.",
          image:
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80",
          enabled: true,
          order: 2,
        },
        {
          id: uid(),
          key: "services",
          heading: "What We Do",
          content: null as any,
          image: null as any,
          enabled: true,
          order: 3,
        },
        // default editable navigation
        {
          id: uid(),
          key: "nav",
          heading: "Navigation",
          content: JSON.stringify([
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/services", label: "Services" },
            { to: "/insights", label: "Insights" },
            { to: "/careers", label: "Careers" },
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
          role: "CTO, Nimbus",
          quote: "They move fast without breaking clarity.",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: uid(),
          author: "Priya S.",
          role: "VP Eng, Northstar",
          quote: "A true partner from strategy to delivery.",
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
