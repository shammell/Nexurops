export const navLinks = [
  { href: "/#agents", label: "AI Agents" },
  { href: "/#devops", label: "DevOps" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const agents = [
  {
    tag: "Reliability",
    title: "Incident Response Agent",
    body: "Triages alerts, correlates logs and metrics, runs your runbooks, and pages a human only when judgment is needed.",
  },
  {
    tag: "Cost & scale",
    title: "Predictive Scaling Agent",
    body: "Forecasts load from real traffic patterns and right-sizes clusters ahead of demand instead of after the outage.",
  },
  {
    tag: "Engineering",
    title: "Code & PR Review Agent",
    body: "Reviews pull requests for bugs, security issues and infra drift, and posts actionable comments in your repo.",
  },
  {
    tag: "Operations",
    title: "Ops Copilot",
    body: "A custom agent wired into your tools: tickets, deploys, dashboards and docs, answering in Slack or chat.",
  },
] as const;

export const devops = [
  {
    title: "CI/CD automation",
    body: "Fast, reproducible pipelines with automated tests, gated releases and one-click rollback.",
  },
  {
    title: "Cloud infrastructure",
    body: "Terraform-defined, multi-cloud (AWS, GCP, Azure) environments you can rebuild from scratch.",
  },
  {
    title: "Observability",
    body: "Prometheus, Grafana and ELK dashboards and alerts tuned to signal, not noise.",
  },
  {
    title: "Performance tuning",
    body: "Profiling, caching and capacity work that lowers latency and cloud spend together.",
  },
] as const;

export const security = [
  { title: "Compliance readiness", body: "SOC 2 and HIPAA aligned controls, evidence collection and audit-ready documentation." },
  { title: "DevSecOps", body: "Dependency, container and IaC scanning built into every pipeline run." },
  { title: "Secrets & access", body: "Least-privilege IAM, rotated secrets and auditable access paths." },
] as const;

export const stack = [
  "Terraform",
  "Kubernetes",
  "GitHub Actions",
  "AWS",
  "GCP",
  "Azure",
  "Prometheus",
  "Grafana",
  "Claude",
] as const;

export const scenarios = [
  {
    label: "Sample scenario",
    title: "Pipeline rebuild for a SaaS team",
    body: "Slow, manual releases replaced with automated CI/CD, preview environments and rollback.",
  },
  {
    label: "Sample scenario",
    title: "On-call agent for a fintech API",
    body: "Alert triage and first-response runbooks handled by an agent, with human escalation.",
  },
  {
    label: "Sample scenario",
    title: "Multi-cloud cost and scaling review",
    body: "Right-sizing and predictive scaling across clusters to cut idle spend.",
  },
] as const;

export const processSteps = [
  { step: "01", title: "Discover", body: "We audit your stack, incidents and delivery flow, then agree on measurable goals." },
  { step: "02", title: "Design", body: "Architecture, agent behaviors and guardrails documented before anything ships." },
  { step: "03", title: "Deploy", body: "Iterative rollout with tests, observability and a human in the loop from day one." },
  { step: "04", title: "Operate", body: "Optional: we run, monitor and improve it with you under a monthly engagement." },
] as const;

export const painPoints = [
  {
    title: "Releases are slow and scary",
    body: "Manual deploys, flaky pipelines, and a Friday-afternoon rule nobody wrote down.",
  },
  {
    title: "The cloud bill keeps climbing",
    body: "Idle instances and oversized databases you pay for every month without noticing.",
  },
  {
    title: "Your team drowns in repetitive work",
    body: "Support tickets, alert triage and status questions eat the hours meant for product.",
  },
] as const;

/** Honest risk-reducers shown under every primary CTA. */
export const ctaAssurances = ["Free 30-min call", "Fixed price, no retainer", "10-day refund guarantee"] as const;

/** Price anchor: what the same outcome costs the usual way (US market, approximate). */
export const priceAnchor = [
  { label: "Senior DevOps hire (US)", value: "$12,000+/mo", note: "plus 2–3 months to recruit" },
  { label: "Typical agency retainer", value: "$5,000+/mo", note: "with a 3–6 month minimum" },
  { label: "Nexurops sprint", value: "$750–$1,500", note: "one-time, live in 5–10 days" },
] as const;

/**
 * Real capacity limit, shown as-is. Keep this TRUE: update the number when capacity changes.
 * Fake scarcity destroys trust the moment a buyer notices.
 */
export const capacityNote = "We take on 3 new sprints per month so every one ships on time.";

export const guarantee =
  "Fixed scope, fixed price, 50% upfront. If your sprint isn't live in 10 business days, you get a full refund.";

export const pricing = [
  {
    name: "Cloud & CI/CD Audit",
    price: "$750",
    period: " one-time",
    blurb: "Find where your pipeline and cloud bill are leaking time and money.",
    features: [
      "Review of CI/CD, cloud setup and monthly spend",
      "Written report with prioritized fixes",
      "Top 3 fixes implemented",
      "Delivered in 5 business days",
    ],
    featured: false,
  },
  {
    name: "AI Agent Sprint",
    price: "$1,500",
    period: " one-time",
    blurb: "One production AI agent or automation, live in your tools.",
    features: [
      "Support triage, lead qualifier, doc Q&A or ops workflow",
      "Wired into your stack (Slack, email, CRM, repo)",
      "Guardrails, logging and handover docs",
      "Live in 10 business days or full refund",
    ],
    featured: true,
  },
  {
    name: "Ongoing Ops",
    price: "From $2,500",
    period: "/mo",
    blurb: "After a sprint: we run, monitor and extend what we built.",
    features: ["Monitoring and on-call support", "New agents and automations", "Monthly infra and cost review", "Priority Slack support"],
    featured: false,
  },
] as const;

export const faqs = [
  {
    q: "What is an AI agent in this context?",
    a: "A software worker with access to your tools and clear guardrails. It handles repeatable operational tasks such as alert triage, PR review or scaling decisions, and hands off to a person when it should.",
  },
  {
    q: "Do you replace our DevOps team?",
    a: "No. We either augment your team or run the parts you don't want to own. Agents take the repetitive work so engineers focus on product.",
  },
  {
    q: "Which clouds and tools do you support?",
    a: "AWS, GCP and Azure, with Terraform, Kubernetes, GitHub Actions, Prometheus and Grafana as the common baseline. We adapt to your existing stack.",
  },
  {
    q: "How do you keep agents safe?",
    a: "Least-privilege access, approval gates for risky actions, full audit logs and staged rollouts. Agents propose or act within limits you define.",
  },
  {
    q: "How do we start?",
    a: "Book a 30-minute call. We review your stack, pick a fixed-price sprint, and send a scope within 24 hours. Most clients start with an AI Agent Sprint or a Cloud & CI/CD Audit.",
  },
  {
    q: "How does payment work?",
    a: "50% upfront to start, 50% on delivery, invoiced in USD. We accept bank transfer via Wise or Payoneer; card payment is available on request.",
  },
] as const;

export const serviceOptions = [
  "AI agents",
  "CI/CD automation",
  "Cloud infrastructure",
  "Monitoring & observability",
  "Security & compliance",
  "Not sure yet",
] as const;
