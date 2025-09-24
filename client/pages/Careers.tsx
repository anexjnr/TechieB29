import Section from "@/components/site/Section";

export default function Careers() {
  const jobs = [
    { title: "Senior Frontend Engineer", location: "Remote", type: "Full‑time" },
    { title: "Product Designer", location: "Remote", type: "Full‑time" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Section>
        <h1 className="text-4xl sm:text-5xl font-extrabold">Careers</h1>
        <p className="mt-4 max-w-prose text-primary/85">Join a compact team that values clarity and craft.</p>
      </Section>
      <Section className="mt-10 space-y-4" delay={0.1}>
        {jobs.map((j, i) => (
          <div key={i} className="rounded-2xl border border-primary/20 bg-black/10 p-6 flex items-center justify-between">
            <div>
              <div className="font-semibold">{j.title}</div>
              <div className="text-sm text-primary/75">{j.location} • {j.type}</div>
            </div>
            <a href="#apply" className="text-sm font-semibold text-primary/80 hover:text-primary">Apply →</a>
          </div>
        ))}
      </Section>
    </div>
  );
}
