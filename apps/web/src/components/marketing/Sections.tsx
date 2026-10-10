import Image from "next/image";
import {
  agents,
  capacityNote,
  ctaAssurances,
  devops,
  faqs,
  guarantee,
  painPoints,
  priceAnchor,
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

/** Risk-reducers right under a CTA: answers "what does clicking cost me?" before it's asked. */
export function Assurances({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground", className)}>
      {ctaAssurances.map((a) => (
        <li key={a} className="flex items-center gap-1.5">
          <span aria-hidden className="text-emerald-400">✓</span>
          {a}
        </li>
      ))}
    </ul>
  );
}

/** Hero is server-rendered with CSS animation so LCP never waits on JS or WebGL. */
export function Hero() {
  return (
    <section data-scene="0" className="flex min-h-screen items-center pt-28">
      <div className={wrap}>
        <p className={cn(eyebrow, "animate-fade-in")}>AI agents · DevOps · Cloud</p>
        <h1 className="mt-6 max-w-3xl animate-slide-up font-display text-5xl font-light leading-[1.05] tracking-tight text-balance md:text-7xl">
          AI agents that take the{" "}
          <span className="bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
            busywork off your team.
          </span>
        </h1>
        <p className="mt-6 max-w-xl animate-slide-up text-lg text-muted-foreground">
          Fixed-price sprints: a production AI agent, or a cloud and CI/CD clean-up.{" "}
          <span className="text-foreground">Live in 10 business days, or your money back.</span>
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4 animate-slide-up">
          <CalendlyButton variant="cta" size="lg" className="rounded-full">
            Book your free 30-min call →
          </CalendlyButton>
          <a
            href="#pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            See fixed prices →
          </a>
        </div>
        <Assurances className="mt-5 animate-fade-in" />
        <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {stack.map((s) => (
            <li key={s}>[ {s} ]</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Name the pain before the solution: buyers act on problems they recognise, not features. */
export function Problem() {
  return (
    <section id="problem" className="py-24">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>Sound familiar?</p>
          <h2 className={cn(h2, "max-w-2xl")}>Your engineers should be shipping product, not babysitting infrastructure.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {painPoints.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className={cn(card, "h-full")}>
                <span aria-hidden className="font-mono text-xs text-red-400/80">✕</span>
                <h3 className="mt-3 font-display text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-2xl text-lg">
            We fix one of these in a fixed-price sprint, then hand it over working, documented and
            yours.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Agents() {
  return (
    <section id="agents" data-scene="1" className="py-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>AI agents</p>
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
          <p className={eyebrow}>DevOps &amp; cloud</p>
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
          <p className={eyebrow}>Security</p>
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
          <p className={eyebrow}>Engagements</p>
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
          <p className={eyebrow}>Process</p>
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
          <p className={eyebrow}>Pricing</p>
          <h2 className={cn(h2, "max-w-2xl")}>Start with a fixed-price sprint.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            No retainer, no surprise invoices. You know the price and the deadline before we start.
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {priceAnchor.map((a, i) => {
              const ours = i === priceAnchor.length - 1;
              return (
                <div key={a.label} className={cn("bg-background/80 p-5", ours && "bg-emerald-500/10")}>
                  <dt className="text-xs text-muted-foreground">{a.label}</dt>
                  <dd
                    className={cn(
                      "mt-1 font-display text-2xl font-light",
                      ours ? "text-emerald-300" : "text-white/50 line-through decoration-white/30",
                    )}
                  >
                    {a.value}
                  </dd>
                  <dd className="mt-1 text-xs text-muted-foreground">{a.note}</dd>
                </div>
              );
            })}
          </dl>
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
                      Recommended
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
                  variant={p.featured ? "cta" : "outline"}
                  className="mt-8 w-full rounded-full"
                >
                  {p.featured ? "Book my free call →" : "Book a call"}
                </CalendlyButton>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-6 md:flex-row md:items-center">
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-xl text-emerald-300"
            >
              ✓
            </span>
            <div>
              <h3 className="font-display text-lg font-medium">The 10-day guarantee</h3>
              <p className="mt-1 text-sm text-muted-foreground">{guarantee}</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">{capacityNote}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Closing CTA: restate the outcome, the price certainty and the guarantee in one place. */
export function FinalCta() {
  return (
    <section className="py-24">
      <div className={wrap}>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-background/60 to-primary-500/10 p-10 text-center md:p-16">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-light leading-tight tracking-tight text-balance md:text-5xl">
              One 30-minute call. A fixed price. Live in 10 days.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Tell us what's slowing your team down. You'll leave the call with a clear scope and price,
              whether or not you work with us.
            </p>
            <div className="mt-8 flex justify-center">
              <CalendlyButton variant="cta" size="lg" className="rounded-full">
                Book your free 30-min call →
              </CalendlyButton>
            </div>
            <Assurances className="mt-5 justify-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-32">
      <div className={cn(wrap, "max-w-3xl")}>
        <Reveal>
          <p className={eyebrow}>FAQ</p>
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
