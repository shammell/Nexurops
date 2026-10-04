import Image from "next/image";
import {
  agents,
  devops,
  faqs,
  pricing,
  processSteps,
  scenarios,
  security,
  stack,
} from "@/lib/marketing/content";
import { cn } from "@/lib/utils";
import { CalendlyButton } from "./CalendlyButton";
import { Reveal } from "./Reveal";

const wrap = "mx-auto w-full max-w-6xl px-6";
const eyebrow = "font-mono text-[11px] uppercase tracking-[0.3em] text-primary-300";
const h2 = "mt-4 font-display text-3xl font-light leading-tight tracking-tight text-balance md:text-5xl";
const card =
  "rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-md transition-colors hover:border-primary-400/40";

/** Hero is server-rendered with CSS animation so LCP never waits on JS or WebGL. */
export function Hero() {
  return (
    <section data-scene="0" className="flex min-h-screen items-center pt-28">
      <div className={wrap}>
        <p className={cn(eyebrow, "animate-fade-in")}>AI agents · DevOps · Cloud</p>
        <h1 className="mt-6 max-w-3xl animate-slide-up font-display text-5xl font-light leading-[1.05] tracking-tight text-balance md:text-7xl">
          AI agents that{" "}
          <span className="bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
            run your infrastructure.
          </span>
        </h1>
        <p className="mt-6 max-w-xl animate-slide-up text-lg text-muted-foreground">
          Nexurops builds custom AI agents and the DevOps foundation under them: CI/CD, cloud,
          monitoring and security, operated with you.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4 animate-slide-up">
          <CalendlyButton size="lg" className="rounded-full">
            Book a strategy call ↗
          </CalendlyButton>
          <a
            href="#agents"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            See what we build →
          </a>
        </div>
        <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {stack.map((s) => (
            <li key={s}>[ {s} ]</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Agents() {
  return (
    <section id="agents" data-scene="1" className="py-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>01 / AI agents</p>
          <h2 className={cn(h2, "max-w-2xl")}>Software workers that take on the repetitive operations.</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Each agent has scoped access, approval gates and an audit trail. They act inside limits you
            define and hand off to a person when it matters.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {agents.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <article className={card}>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-300">{a.tag}</p>
                <h3 className="mt-3 font-display text-xl font-medium">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DevOps() {
  return (
    <section id="devops" data-scene="2" className="py-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>02 / DevOps &amp; cloud</p>
          <h2 className={cn(h2, "max-w-2xl")}>A delivery pipeline the agents can stand on.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {devops.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.08}>
              <article className={card}>
                <h3 className="font-display text-lg font-medium">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Security() {
  return (
    <section id="security" data-scene="3" className="py-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>03 / Security</p>
          <h2 className={cn(h2, "max-w-2xl")}>Secure by default, auditable by design.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {security.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <article className={card}>
                <h3 className="font-display text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section id="work" className="py-24">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>04 / Engagements</p>
          <h2 className={cn(h2, "max-w-2xl")}>What a typical engagement looks like.</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Illustrative scenarios. Named case studies will be published here.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {scenarios.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <article className={card}>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{s.label}</p>
                <h3 className="mt-3 font-display text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="py-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>05 / Process</p>
          <h2 className={cn(h2, "max-w-2xl")}>From audit to always-on in four steps.</h2>
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {processSteps.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.08}>
              <li className={cn(card, "h-full list-none")}>
                <span className="font-mono text-xs text-primary-300">{p.step}</span>
                <h3 className="mt-3 font-display text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>06 / Pricing</p>
          <h2 className={cn(h2, "max-w-2xl")}>Simple monthly engagements.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {pricing.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <article
                className={cn(
                  card,
                  "flex h-full flex-col",
                  p.featured && "border-primary-400/50 bg-primary-500/10",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-full bg-primary-400/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary-200">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-4 font-display text-4xl font-light">
                  {p.price}
                  <span className="text-base text-muted-foreground">{p.period}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
                <ul className="mt-6 flex-1 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden className="text-primary-300">
                        +
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <CalendlyButton
                  variant={p.featured ? "default" : "outline"}
                  className="mt-8 w-full rounded-full"
                >
                  Book a call
                </CalendlyButton>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-32">
      <div className={cn(wrap, "max-w-3xl")}>
        <Reveal>
          <p className={eyebrow}>07 / FAQ</p>
          <h2 className={h2}>Questions, answered.</h2>
        </Reveal>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-light">
                {f.q}
                <span aria-hidden className="text-primary-300 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-10">
      <div className={cn(wrap, "flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row")}>
        <div className="flex items-center gap-2">
          <Image src="/nexurops-logo.jpg" alt="" width={22} height={22} className="rounded" />
          <span className="font-display">Nexurops</span>
        </div>
        <p>© {new Date().getFullYear()} Nexurops. AI agents &amp; DevOps automation.</p>
      </div>
    </footer>
  );
}
