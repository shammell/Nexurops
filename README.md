# Nexurops Platform

Production-grade Turborepo monorepo for Nexurops - AI-Powered DevOps & Cloud Solutions platform.

## 📦 Monorepo Structure

```
nexurops-platform/
├── apps/
│   ├── web/                 # Next.js 14 web application
│   └── linkedin-bot/        # Python LinkedIn automation bot
├── packages/
│   ├── types/              # Shared TypeScript type definitions
│   ├── ui/                 # Shared UI component library
│   └── database/           # Database utilities (future)
├── turbo.json              # Turborepo configuration
├── package.json            # Root workspace configuration
└── pnpm-workspace.yaml     # pnpm workspace definition
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL (for database)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your actual values

# Generate Prisma client
cd apps/web && pnpm db:generate

# Run development servers
pnpm dev
```

The Next.js app will be available at http://localhost:3000

## 🛠️ Available Commands

### Root Commands

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps for production
pnpm test         # Run tests across all packages
pnpm lint         # Lint all packages
pnpm type-check   # TypeScript type checking
pnpm clean        # Clean build artifacts
pnpm format       # Format code with Prettier
```

### Web App Commands

```bash
cd apps/web

pnpm dev             # Start Next.js dev server
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Lint code
pnpm type-check      # Check TypeScript types

# Database commands
pnpm db:generate     # Generate Prisma client
pnpm db:migrate      # Run migrations (dev)
pnpm db:push         # Push schema changes
pnpm db:studio       # Open Prisma Studio
pnpm db:seed         # Seed database
```

## 📁 Package Details

### @nexurops/web

Next.js 14 application with:
- App Router architecture
- TypeScript strict mode
- Tailwind CSS styling
- Route groups: (marketing), (client), (admin)
- API routes with health check endpoint
- Server Components
- Image optimization
- Security headers

### @nexurops/types

Shared TypeScript types:
- User & Authentication types
- Client & Project types
- Order & Invoice types
- LinkedIn campaign types
- Analytics types
- API response types

### @nexurops/ui

Shared UI component library:
- Button component
- Card components
- Utility functions (cn)
- Tailwind CSS integration

### apps/linkedin-bot

Python-based LinkedIn automation (existing):
- Lead generation
- Message automation
- Analytics tracking

## 🏗️ Technology Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui components

### Backend
- Next.js API Routes
- tRPC (type-safe APIs)
- NextAuth.js (authentication)
- Prisma ORM
- PostgreSQL

### Infrastructure
- Turborepo (monorepo management)
- pnpm (package manager)
- ESLint + Prettier (code quality)

### Deployment
- Vercel (recommended for Next.js)
- Docker (self-hosting option)

## 🔐 Environment Variables

See `apps/web/.env.example` for all required environment variables:

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# LinkedIn Bot
LINKEDIN_BOT_URL=...
LINKEDIN_BOT_API_KEY=...

# LLM APIs
ANTHROPIC_API_KEY=...

# Monitoring
SENTRY_DSN=...
```

## 🎨 Landing Page

The marketing landing page includes:
- Hero section with CTA
- Services grid (6 core services)
- Portfolio section (placeholder)
- Pricing tiers (3 plans)
- Contact form
- Responsive navigation
- SEO-optimized metadata
- Production-ready security headers

## 📊 Performance

- Lighthouse score target: 90+
- Core Web Vitals optimized
- Image optimization enabled
- Font optimization (Inter + Lexend)
- Bundle size monitoring with Turborepo cache

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Self-Hosting with Docker

```bash
# Build production
pnpm build

# Start production server
cd apps/web && pnpm start
```

## 📝 Next Steps

1. **Database Setup**
   - Configure PostgreSQL database
   - Run migrations: `pnpm db:migrate`
   - Seed data: `pnpm db:seed`

2. **Authentication**
   - Configure OAuth providers in `.env.local`
   - Set up NextAuth callbacks

3. **Stripe Integration**
   - Add Stripe keys to environment
   - Configure webhook endpoints

4. **LinkedIn Bot Integration**
   - Set up bot API connection
   - Configure webhook handlers

5. **Content**
   - Add real portfolio case studies
   - Customize pricing plans
   - Update service descriptions

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request

## 📄 License

Proprietary - All rights reserved

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
