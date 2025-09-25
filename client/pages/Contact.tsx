import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";

export default function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Section>
        <AnimatedTitle
          text="Contact"
          className="text-4xl sm:text-5xl font-extrabold text-foreground"
        />
        <p className="mt-4 max-w-prose text-foreground/85">
          Tell us about your goals. We’ll get back within 1 business day.
        </p>
      </Section>
      <Section
        className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8"
        delay={0.1}
      >
        <form className="rounded-2xl border border-primary/20 bg-black/10 p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold">Name</label>
            <input
              className="mt-1 w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="jane@acme.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Message</label>
            <textarea
              rows={5}
              className="mt-1 w-full rounded-md bg-transparent border border-primary/30 px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-primary/10"
          >
            Send
          </button>
        </form>
        <div className="rounded-2xl border border-primary/20 bg-black/10 p-6">
          <div className="font-semibold text-foreground">AUIO HQ</div>
          <p className="mt-2 text-sm text-foreground/80">
            Remote‑first with offices in SF and Berlin.
          </p>
          <div className="mt-6 h-64 w-full rounded-xl border border-primary/20 bg-black/20" />
        </div>
      </Section>
    </div>
  );
}
