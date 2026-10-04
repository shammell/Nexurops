import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Reveal } from "@/components/marketing/Reveal";
import {
  Agents,
  DevOps,
  Faq,
  Hero,
  Pricing,
  Process,
  Security,
  Work,
} from "@/components/marketing/Sections";

export const metadata: Metadata = {
  title: "Nexurops | AI Agents & DevOps Automation",
  description:
    "Custom AI agents plus the DevOps foundation under them: CI/CD, cloud, observability and security. Book a strategy call.",
  openGraph: {
    title: "Nexurops | AI Agents & DevOps Automation",
    description: "AI agents that run your infrastructure.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nexurops",
  description: "AI agents and DevOps automation for engineering teams.",
  serviceType: ["AI agents", "DevOps", "Cloud infrastructure", "Security and compliance"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Agents />
      <DevOps />
      <Security />
      <Work />
      <Process />
      <Pricing />
      <Faq />
      <section id="contact" data-scene="4" className="py-32">
        <div className="mx-auto w-full max-w-3xl px-6">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-300">08 / Contact</p>
            <h2 className="mt-4 font-display text-4xl font-light tracking-tight md:text-6xl">Let's talk.</h2>
            <p className="mt-3 text-muted-foreground">
              Tell us what you're running. We'll come back with where agents and automation help most.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
