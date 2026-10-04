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
  { step: "04", title: "Operate", body: "We run, monitor and improve it with you under a monthly engagement." },
] as const;

export const pricing = [
  {
    name: "Starter",
    price: "$2,500",
    period: "/mo",
    blurb: "For teams getting their delivery and monitoring in order.",
    features: ["CI/CD pipeline setup", "Basic monitoring and alerts", "Monthly infra review", "Email support"],
    featured: false,
  },
  {
    name: "Professional",
    price: "$5,000",
    period: "/mo",
    blurb: "AI agents and hands-on DevOps for growing products.",
    features: ["Everything in Starter", "1 custom AI agent", "Multi-cloud IaC (Terraform)", "DevSecOps scanning", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    blurb: "Compliance-driven, multi-team programs.",
    features: ["Multiple custom agents", "SOC 2 / HIPAA readiness", "Dedicated engineer", "SLA and on-call"],
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
    a: "Book a call. We review your stack, agree on scope, and propose a first engagement.",
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
