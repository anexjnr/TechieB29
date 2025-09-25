import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";

export default function Careers() {
  const jobs = [
    {
      title: "Senior Frontend Engineer",
      location: "Remote",
      type: "Full‑time",
    },
    { title: "Product Designer", location: "Remote", type: "Full‑time" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Section>
        <AnimatedTitle
          text="Careers"
          className="text-4xl sm:text-5xl font-extrabold text-foreground"
        />
        <p className="mt-4 max-w-prose text-foreground/85">
          Join a compact team that values clarity and craft.
        </p>
      </Section>
      <Section className="mt-10 space-y-4" delay={0.1}>
        {jobs.map((j, i) => (
          <div
            key={i}
            className="rounded-2xl border border-primary/20 bg-black/10 p-6 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-foreground">{j.title}</div>
              <div className="text-sm text-foreground/75">
                {j.location} • {j.type}
              </div>
            </div>
            <a
              href="#apply"
              className="text-sm font-semibold text-foreground/80 hover:text-foreground"
            >
              Apply →
            </a>
          </div>
        ))}
      </Section>
    </div>
  );
}
