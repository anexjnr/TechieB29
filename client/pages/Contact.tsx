import Section from "@/components/site/Section";
import AnimatedTitle from "@/components/site/AnimatedTitle";
import InteractiveMap from "@/components/site/InteractiveMap";
import ContactForm from "@/components/ContactForm";

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
        <ContactForm />
        <div className="rounded-2xl border border-primary/20 bg-black/10 p-6">
          <div className="font-semibold text-foreground">TBT HQ</div>
          <p className="mt-2 text-sm text-foreground/80">
            Remote‑first with offices in SF and Berlin.
          </p>
          <div className="mt-6">
            <InteractiveMap />
          </div>
        </div>
      </Section>
    </div>
  );
}
