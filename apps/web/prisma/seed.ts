import { PrismaClient, Role, ServiceCategory, ClientStatus, ProjectStatus, OrderStatus, InvoiceStatus, PostStatus, LeadSource, LeadStatus, TeamRole } from "@prisma/client";

// ---------------------------------------------------------------------------
// Development Seed Script
// ---------------------------------------------------------------------------
// Creates: 1 admin user, 1 team member, 3 services, 2 clients (with users),
//          5 projects, 3 orders, 2 invoices, 4 LinkedIn posts, 3 leads
//
// Run: npx prisma db seed
// ---------------------------------------------------------------------------

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // =========================================================================
  // 1. Admin User + Team Member
  // =========================================================================

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@nexurops.com" },
    update: {},
    create: {
      email: "admin@nexurops.com",
      name: "Nexurops Admin",
      role: Role.SUPER_ADMIN,
      // DEV ONLY: bcrypt hash of "admin123" (cost 10)
      // In production, users authenticate via OAuth -- password is null
      password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      emailVerified: new Date(),
    },
  });

  await prisma.teamMember.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      role: TeamRole.SUPER_ADMIN,
      department: "Executive",
      permissions: ["all"],
    },
  });

  console.log("  [+] Admin user:", adminUser.email);

  // =========================================================================
  // 2. Services (AI, Cybersecurity, Web Dev)
  // =========================================================================

  const aiService = await prisma.service.upsert({
    where: { slug: "ai-consulting" },
    update: {},
    create: {
      name: "AI Strategy & Implementation",
      description:
        "End-to-end AI consulting: from strategy workshops and use-case discovery through model selection, fine-tuning, RAG pipeline architecture, and production deployment. Includes ongoing optimization and monitoring.",
      slug: "ai-consulting",
      basePrice: 5000.0,
      features: [
        "AI Readiness Assessment",
        "Custom Model Training",
        "RAG Pipeline Architecture",
        "LLM Integration",
        "MLOps Setup",
        "Performance Monitoring",
      ],
      category: ServiceCategory.AI,
    },
  });

  const cyberService = await prisma.service.upsert({
    where: { slug: "cybersecurity-audit" },
    update: {},
    create: {
      name: "Cybersecurity Audit & Hardening",
      description:
        "Comprehensive security assessment covering infrastructure, application, and cloud attack surfaces. Penetration testing, vulnerability scanning, compliance gap analysis (SOC 2, ISO 27001), and remediation roadmap.",
      slug: "cybersecurity-audit",
      basePrice: 8000.0,
      features: [
        "Penetration Testing",
        "Vulnerability Assessment",
        "SOC 2 Gap Analysis",
        "Cloud Security Review",
        "Incident Response Plan",
        "Security Training",
      ],
      category: ServiceCategory.CYBERSECURITY,
    },
  });

  const webService = await prisma.service.upsert({
    where: { slug: "web-development" },
    update: {},
    create: {
      name: "Full-Stack Web Development",
      description:
        "Modern web application development using Next.js, React, Node.js, and PostgreSQL. Responsive design, API development, authentication, payment integration, and deployment to Vercel or AWS.",
      slug: "web-development",
      basePrice: 12000.0,
      features: [
        "Next.js 14 App Router",
        "PostgreSQL + Prisma",
        "Authentication (NextAuth)",
        "Stripe Integration",
        "CI/CD Pipeline",
        "Performance Optimization",
      ],
      category: ServiceCategory.WEB_DEV,
    },
  });

  console.log("  [+] Services: AI, Cybersecurity, Web Dev");

  // =========================================================================
  // 3. Client Users + Client Profiles
  // =========================================================================

  const clientUser1 = await prisma.user.upsert({
    where: { email: "sarah@techcorp.io" },
    update: {},
    create: {
      email: "sarah@techcorp.io",
      name: "Sarah Chen",
      role: Role.CLIENT,
      emailVerified: new Date(),
    },
  });

  const client1 = await prisma.client.upsert({
    where: { email: "contact@techcorp.io" },
    update: {},
    create: {
      userId: clientUser1.id,
      name: "Sarah Chen",
      company: "TechCorp Industries",
      email: "contact@techcorp.io",
      phone: "+1-555-0101",
      status: ClientStatus.ACTIVE,
    },
  });

  const clientUser2 = await prisma.user.upsert({
    where: { email: "marcus@greenleaf.co" },
    update: {},
    create: {
      email: "marcus@greenleaf.co",
      name: "Marcus Johnson",
      role: Role.CLIENT,
      emailVerified: new Date(),
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: "hello@greenleaf.co" },
    update: {},
    create: {
      userId: clientUser2.id,
      name: "Marcus Johnson",
      company: "GreenLeaf Ventures",
      email: "hello@greenleaf.co",
      phone: "+1-555-0202",
      status: ClientStatus.ACTIVE,
    },
  });

  console.log("  [+] Clients: TechCorp, GreenLeaf");

  // =========================================================================
  // 4. Orders
  // =========================================================================

  const order1 = await prisma.order.create({
    data: {
      clientId: client1.id,
      serviceId: aiService.id,
      totalAmount: 5000.0,
      status: OrderStatus.PAID,
      notes: "AI readiness assessment for customer support automation.",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      clientId: client1.id,
      serviceId: cyberService.id,
      totalAmount: 8000.0,
      status: OrderStatus.PAID,
      notes: "SOC 2 compliance preparation.",
    },
  });

  const order3 = await prisma.order.create({
    data: {
      clientId: client2.id,
      serviceId: webService.id,
      totalAmount: 15000.0,
      status: OrderStatus.PENDING,
      notes: "E-commerce platform rebuild with Next.js.",
    },
  });

  console.log("  [+] Orders: 3 created");

  // =========================================================================
  // 5. Projects (5 total)
  // =========================================================================

  await prisma.project.createMany({
    data: [
      {
        clientId: client1.id,
        orderId: order1.id,
        title: "AI Chatbot for Customer Support",
        description:
          "Build a RAG-powered chatbot trained on TechCorp's knowledge base to handle tier-1 customer support inquiries. Target: 60% ticket deflection.",
        status: ProjectStatus.IN_PROGRESS,
        budget: 5000.0,
        startDate: new Date("2024-09-01"),
        deadline: new Date("2024-11-30"),
        metadata: {
          accountManager: "admin@nexurops.com",
          tags: ["ai", "chatbot", "rag"],
          ticketDeflectionTarget: 0.6,
        },
      },
      {
        clientId: client1.id,
        orderId: order2.id,
        title: "SOC 2 Compliance Audit",
        description:
          "Full security audit of TechCorp infrastructure and applications. Deliver SOC 2 Type II readiness report with remediation plan.",
        status: ProjectStatus.REVIEW,
        budget: 8000.0,
        startDate: new Date("2024-08-15"),
        deadline: new Date("2024-10-15"),
        metadata: {
          accountManager: "admin@nexurops.com",
          tags: ["security", "compliance", "soc2"],
          complianceFramework: "SOC 2 Type II",
        },
      },
      {
        clientId: client1.id,
        title: "LinkedIn Growth Campaign Q4",
        description:
          "Content strategy and daily posting for TechCorp's CEO LinkedIn profile. Target: 50k impressions/month, 5% engagement rate.",
        status: ProjectStatus.IN_PROGRESS,
        budget: 3000.0,
        startDate: new Date("2024-10-01"),
        deadline: new Date("2024-12-31"),
        metadata: {
          accountManager: "admin@nexurops.com",
          tags: ["linkedin", "content", "growth"],
          targetImpressions: 50000,
        },
      },
      {
        clientId: client2.id,
        orderId: order3.id,
        title: "GreenLeaf E-Commerce Platform",
        description:
          "Full-stack rebuild of GreenLeaf's e-commerce site. Next.js 14, Stripe payments, inventory management, and admin dashboard.",
        status: ProjectStatus.BACKLOG,
        budget: 15000.0,
        startDate: new Date("2024-11-01"),
        deadline: new Date("2025-02-28"),
        metadata: {
          accountManager: "admin@nexurops.com",
          tags: ["web-dev", "ecommerce", "nextjs"],
          estimatedPages: 25,
        },
      },
      {
        clientId: client2.id,
        title: "SEO Foundation Package",
        description:
          "Technical SEO audit, on-page optimization for 50 pages, keyword strategy, and backlink acquisition plan for GreenLeaf.",
        status: ProjectStatus.COMPLETED,
        budget: 4000.0,
        startDate: new Date("2024-07-01"),
        deadline: new Date("2024-09-30"),
        metadata: {
          accountManager: "admin@nexurops.com",
          tags: ["seo", "technical-seo", "content"],
          pagesOptimized: 50,
        },
      },
    ],
  });

  console.log("  [+] Projects: 5 created");

  // =========================================================================
  // 6. Invoices
  // =========================================================================

  await prisma.invoice.createMany({
    data: [
      {
        clientId: client1.id,
        orderId: order1.id,
        invoiceNumber: "INV-2024-0001",
        amount: 5000.0,
        tax: 0,
        totalAmount: 5000.0,
        status: InvoiceStatus.PAID,
        dueDate: new Date("2024-09-30"),
        paidAt: new Date("2024-09-15"),
      },
      {
        clientId: client1.id,
        orderId: order2.id,
        invoiceNumber: "INV-2024-0002",
        amount: 8000.0,
        tax: 0,
        totalAmount: 8000.0,
        status: InvoiceStatus.SENT,
        dueDate: new Date("2024-11-15"),
      },
    ],
  });

  console.log("  [+] Invoices: 2 created");

  // =========================================================================
  // 7. LinkedIn Posts
  // =========================================================================

  await prisma.linkedInPost.createMany({
    data: [
      {
        clientId: client1.id,
        text: "We just deployed an AI chatbot that handles 60% of our support tickets. Here's what we learned in 90 days...\n\n[Thread]",
        status: PostStatus.PUBLISHED,
        humanizationScore: 0.92,
        impressions: 12500,
        likes: 340,
        comments: 87,
        shares: 45,
        engagementRate: 3.78,
        publishedAt: new Date("2024-10-15"),
      },
      {
        clientId: client1.id,
        text: "SOC 2 compliance isn't just a checkbox. It's a competitive moat.\n\nHere are 5 things most startups get wrong about security audits:",
        status: PostStatus.SCHEDULED,
        humanizationScore: 0.88,
        scheduledAt: new Date("2024-11-01T09:00:00Z"),
      },
      {
        clientId: client2.id,
        text: "We're rebuilding our entire e-commerce platform from scratch. Why? Because technical debt was costing us $50k/month in lost conversions.",
        status: PostStatus.DRAFT,
        humanizationScore: 0.95,
      },
      {
        clientId: client2.id,
        text: "After 6 months of SEO work, our organic traffic grew 340%. The secret? We stopped chasing keywords and started solving problems.",
        status: PostStatus.PUBLISHED,
        humanizationScore: 0.91,
        impressions: 8900,
        likes: 210,
        comments: 52,
        shares: 28,
        engagementRate: 3.26,
        publishedAt: new Date("2024-10-01"),
      },
    ],
  });

  console.log("  [+] LinkedIn Posts: 4 created");

  // =========================================================================
  // 8. LinkedIn Metrics (sample daily aggregates)
  // =========================================================================

  await prisma.linkedInMetrics.createMany({
    data: [
      {
        clientId: client1.id,
        date: new Date("2024-10-15"),
        totalImpressions: 12500,
        totalEngagement: 472,
        postsPublished: 1,
        avgEngagementRate: 3.78,
      },
      {
        clientId: client2.id,
        date: new Date("2024-10-01"),
        totalImpressions: 8900,
        totalEngagement: 290,
        postsPublished: 1,
        avgEngagementRate: 3.26,
      },
    ],
  });

  console.log("  [+] LinkedIn Metrics: 2 daily records");

  // =========================================================================
  // 9. Leads
  // =========================================================================

  await prisma.lead.createMany({
    data: [
      {
        name: "Alex Rivera",
        email: "alex@startup.io",
        phone: "+1-555-0301",
        service: "AI",
        message:
          "Looking for help building an AI-powered recommendation engine for our SaaS platform. ~500k users, need real-time inference.",
        source: LeadSource.WEBSITE,
        utmCampaign: "google-ads-ai",
        utmSource: "google",
        utmMedium: "cpc",
        status: LeadStatus.QUALIFIED,
        metadata: {
          landingPage: "/services/ai-consulting",
          referer: "google.com",
          companySize: "50-100",
        },
      },
      {
        name: "Priya Sharma",
        email: "priya@enterprise.com",
        service: "CYBERSECURITY",
        message:
          "Need a penetration test and SOC 2 readiness assessment for our fintech platform before Series B due diligence.",
        source: LeadSource.LINKEDIN,
        status: LeadStatus.CONTACTED,
        metadata: {
          linkedInProfile: "linkedin.com/in/priya-sharma",
          companySize: "100-500",
          urgency: "high",
        },
      },
      {
        name: "Jordan Lee",
        email: "jordan@agency.co",
        phone: "+1-555-0303",
        service: "WEB_DEV",
        message: "Interested in a Next.js rebuild of our marketing site. Current site loads in 8s.",
        source: LeadSource.OUTREACH,
        utmCampaign: "cold-email-q4",
        status: LeadStatus.NEW,
        metadata: {
          currentStack: "WordPress",
          pageLoadTime: "8s",
        },
      },
    ],
  });

  console.log("  [+] Leads: 3 created");

  // =========================================================================
  // Done
  // =========================================================================

  console.log("\nSeed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
