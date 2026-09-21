import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/nexurops-logo.jpg"
              alt="Nexurops"
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg"
            />
            <span className="font-display text-2xl font-bold">Nexurops</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="#services" className="text-sm font-medium hover:text-primary">
              Services
            </Link>
            <Link href="#portfolio" className="text-sm font-medium hover:text-primary">
              Portfolio
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/client"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Client Portal
            </Link>
            <Link
              href="#contact"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-display text-5xl font-bold tracking-tight md:text-7xl">
            AI-Powered DevOps &{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cloud Solutions
            </span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            Transform your infrastructure with intelligent automation, optimization, and monitoring.
            Built for scale, designed for reliability.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#contact"
              className="w-full rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              Start Your Project
            </Link>
            <Link
              href="#services"
              className="w-full rounded-lg border border-input bg-background px-8 py-4 text-lg font-medium hover:bg-accent sm:w-auto"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="border-t bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold">Our Services</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Comprehensive DevOps and cloud solutions tailored to your business needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="group rounded-xl border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{service.icon}</div>
                <h3 className="mb-3 font-display text-2xl font-semibold">{service.title}</h3>
                <p className="mb-4 text-muted-foreground">{service.description}</p>
                <Link
                  href="#contact"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold">Portfolio</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Real results from real projects. See how we've helped businesses scale.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">
              Portfolio case studies coming soon. Contact us to discuss your project.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold">Pricing</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Flexible pricing to match your project scope and budget
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={cn(
                  'rounded-xl border bg-card p-8',
                  tier.featured && 'border-primary shadow-lg'
                )}
              >
                {tier.featured && (
                  <div className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="mb-2 font-display text-2xl font-semibold">{tier.name}</h3>
                <div className="mb-4">
                  <span className="font-display text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <p className="mb-6 text-muted-foreground">{tier.description}</p>
                <Link
                  href="#contact"
                  className={cn(
                    'block rounded-lg border px-6 py-3 text-center font-medium',
                    tier.featured
                      ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border-input bg-background hover:bg-accent'
                  )}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 font-display text-4xl font-bold">Get In Touch</h2>
              <p className="text-lg text-muted-foreground">
                Ready to transform your infrastructure? Let's discuss your project.
              </p>
            </div>
            <form className="space-y-6 rounded-xl border bg-card p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="mb-2 block text-sm font-medium">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground hover:bg-primary/90"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/nexurops-logo.jpg"
                alt="Nexurops"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="font-display text-xl font-bold">Nexurops</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Nexurops. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const services = [
  {
    icon: '🚀',
    title: 'CI/CD Pipeline Automation',
    description:
      'Streamline your deployment process with intelligent automation, zero-downtime releases, and comprehensive testing pipelines.',
  },
  {
    icon: '☁️',
    title: 'Cloud Infrastructure',
    description:
      'Multi-cloud architecture design and implementation with Terraform, optimized for cost, performance, and reliability.',
  },
  {
    icon: '🔍',
    title: 'Monitoring & Observability',
    description:
      'Real-time monitoring, alerting, and observability solutions using Prometheus, Grafana, and ELK stack.',
  },
  {
    icon: '🛡️',
    title: 'Security & Compliance',
    description:
      'Implement security best practices, vulnerability scanning, and compliance automation for SOC2, HIPAA, and more.',
  },
  {
    icon: '📈',
    title: 'Performance Optimization',
    description:
      'Identify bottlenecks, optimize resource utilization, and improve application performance through data-driven insights.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Automation',
    description:
      'Leverage AI for intelligent incident response, predictive scaling, and automated infrastructure management.',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: '$2,500',
    period: '/month',
    description: 'Perfect for small teams getting started with DevOps',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$5,000',
    period: '/month',
    description: 'Comprehensive DevOps for growing businesses',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large-scale operations',
    featured: false,
  },
];
