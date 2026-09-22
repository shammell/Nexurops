# Nexurops Agency Platform - Implementation Plan

## Context

**Problem:** User has LinkedIn Content Assistant (Phase 1 scaffolding only) but needs full agency website to attract clients and generate revenue. Services: AI, cybersecurity, web dev, marketing, SEO. Target scale: Y Combinator level (100k+ users).

**Current State:**
- `C:\Users\AK\Desktop\Linkedin\` - LinkedIn bot (config files + empty Python modules)
- Logo exists: `WhatsApp Image 2026-09-21 at 2.14.24 AM.jpeg` (needs rename)
- Database schema ready (SQLite: posts, api_usage, memory_log)
- No .gitignore (.env exposed)
- MEMORY.md file (internal notes, should be removed)
- No implementation yet (only `init_db.py` works)

**Goal:** Build integrated platform combining:
1. Marketing website (portfolio + services + lead capture)
2. Client portal (dashboard + projects + invoices + LinkedIn analytics)
3. Admin panel (team + clients + payments + bot management)
4. LinkedIn bot (autonomous content generation for lead acquisition)

**Architecture Decision:** Turborepo monorepo with Next.js 14 (website) + Python/FastAPI (LinkedIn bot) + PostgreSQL (main) + SQLite (bot isolation).

---

## Architecture Overview

### Monorepo Structure

```
nexurops-platform/
├── apps/
│   ├── web/                      # Next.js 14 (marketing + client portal + admin)
│   │   ├── app/
│   │   │   ├── (marketing)/     # Public: landing, services, portfolio, contact
│   │   │   ├── (client)/        # Auth-required: dashboard, projects, invoices, linkedin
│   │   │   ├── (admin)/         # Role-gated: clients, team, payments, bot controls
│   │   │   └── api/             # Next.js API routes + tRPC
│   │   ├── components/          # React components (shadcn/ui)
│   │   ├── lib/                 # Utils (auth, db, stripe, trpc)
│   │   ├── prisma/              # PostgreSQL schema
│   │   ├── public/              # Static assets + logo
│   │   └── [config files]
│   │
│   └── linkedin-bot/             # Python service (relocated from current folder)
│       ├── src/
│       │   ├── core/            # linkedin_auth.py, linkedin_api.py, llm_client.py, rate_limiter.py
│       │   ├── content/         # generator.py, humanizer.py, planner.py
│       │   ├── workflow/        # approval.py, publisher.py
│       │   ├── analytics/       # tracker.py, memory_log.py, insights.py
│       │   ├── api/             # FastAPI server (main.py, routes/)
│       │   └── database/        # SQLite schema + models
│       ├── config/              # voice.md, hooks.json, slop.json
│       ├── data/                # Runtime: linkedin.db, memory logs
│       ├── scripts/             # init_db.py, scheduler.py
│       └── [config files]
│
├── packages/
│   ├── database/                # Shared Prisma client
│   ├── ui/                      # Shared shadcn/ui components
│   └── types/                   # Shared TypeScript types
│
├── .github/workflows/           # CI/CD (tests, deploy)
├── turbo.json                   # Turborepo config
├── package.json                 # Root workspace
└── README.md
```

**Key Design Decisions:**
- **Route groups:** `(marketing)`, `(client)`, `(admin)` for clean URLs
- **Database isolation:** PostgreSQL for website, SQLite for bot, webhook sync for analytics
- **FastAPI inside bot:** No separate api-bridge app
- **No root mess:** Only essential files at root (turbo.json, package.json, README.md)

### Tech Stack

**Frontend:**
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS + shadcn/ui components
- Framer Motion (animations)

**Backend:**
- Next.js API routes + tRPC (type-safe APIs)
- Prisma ORM (PostgreSQL)
- NextAuth.js (authentication)
- Stripe SDK (payments)

**Python Services:**
- FastAPI (REST API bridge)
- SQLite (bot database)
- Anthropic Claude API (content generation)

**Infrastructure:**
- PostgreSQL (Supabase - main database)
- Redis (Upstash - job queue + caching)
- Vercel (Next.js deployment)
- Railway (Python deployment)
- GitHub Actions (CI/CD)

### Database Strategy

**PostgreSQL (apps/web/prisma/schema.prisma):**
- Users (auth: email, password, role)
- Clients (name, company, status, billing)
- Projects (title, description, status, budget, timeline)
- Invoices (amount, status, dueDate, stripeInvoiceId)
- Services (name, description, basePrice, features)
- Orders (serviceId, clientId, status, totalAmount)
- Leads (name, email, source, utmCampaign, status)
- LinkedInPosts (synced from bot via webhook: url, text, impressions, likes, comments)

**SQLite (apps/linkedin-bot/src/database/schema.sql):**
- posts (content tracking, status, metrics)
- api_usage (rate limit tracking: 150 req/day)
- memory_log (performance learning)

**Webhook Sync:**
Bot publishes post → FastAPI webhook → Next.js API → PostgreSQL LinkedInPosts table

---

## Critical Files to Create

### Week 1: Foundation

**1. Root Configuration**
- `nexurops-platform/turbo.json` - Turborepo config (build order, caching)
- `nexurops-platform/package.json` - Workspace root with pnpm
- `nexurops-platform/pnpm-workspace.yaml` - Define apps/* and packages/*
- `nexurops-platform/.gitignore` - Comprehensive (node_modules/, .env*, dist/, data/, logs/, *.db)

**2. Database Schema**
- `apps/web/prisma/schema.prisma` - PostgreSQL schema (Users, Clients, Projects, Invoices, Services, Orders, Leads, LinkedInPosts)

**3. Next.js App Structure**
- `apps/web/app/layout.tsx` - Root layout (providers, fonts, metadata)
- `apps/web/app/(marketing)/page.tsx` - Landing page (hero, services grid, portfolio, pricing, lead form)
- `apps/web/app/(client)/dashboard/page.tsx` - Client dashboard (projects, invoices, LinkedIn analytics)
- `apps/web/app/(admin)/dashboard/page.tsx` - Admin dashboard (clients, team, revenue chart, bot controls)
- `apps/web/app/api/auth/[...nextauth]/route.ts` - NextAuth.js config
- `apps/web/app/api/trpc/[trpc]/route.ts` - tRPC handler
- `apps/web/app/api/webhooks/stripe/route.ts` - Stripe webhook handler
- `apps/web/app/api/webhooks/linkedin/route.ts` - LinkedIn bot webhook receiver

**4. LinkedIn Bot Implementation**
- `apps/linkedin-bot/src/core/linkedin_auth.py` - OAuth 2.0 (token storage, refresh)
- `apps/linkedin-bot/src/core/linkedin_api.py` - LinkedIn API client (share post, get analytics)
- `apps/linkedin-bot/src/core/llm_client.py` - Multi-provider LLM (Anthropic Claude, OpenAI, Google)
- `apps/linkedin-bot/src/core/rate_limiter.py` - Rate limit tracking (150 req/day)
- `apps/linkedin-bot/src/content/generator.py` - Content generation (21 hook formulas)
- `apps/linkedin-bot/src/content/humanizer.py` - 5-check humanization panel
- `apps/linkedin-bot/src/workflow/publisher.py` - Post publishing workflow
- `apps/linkedin-bot/src/analytics/tracker.py` - Metrics tracking
- `apps/linkedin-bot/src/api/main.py` - FastAPI server (CORS, routes, startup)
- `apps/linkedin-bot/src/api/routes/posts.py` - POST /generate, GET /posts, POST /publish
- `apps/linkedin-bot/src/api/routes/analytics.py` - GET /analytics, GET /insights
- `apps/linkedin-bot/src/api/routes/webhooks.py` - POST /webhooks/publish (notify Next.js)

**5. Deployment Configuration**
- `apps/linkedin-bot/Dockerfile` - Python container (multi-stage build)
- `.github/workflows/ci.yml` - Run tests on PR
- `.github/workflows/deploy-web.yml` - Deploy Next.js to Vercel
- `.github/workflows/deploy-bot.yml` - Deploy Python to Railway

### Week 2-4: Core Features

**6. Marketing Pages**
- `apps/web/app/(marketing)/services/page.tsx` - Service catalog
- `apps/web/app/(marketing)/services/[slug]/page.tsx` - Service detail + Stripe checkout
- `apps/web/app/(marketing)/portfolio/page.tsx` - Case studies grid
- `apps/web/app/(marketing)/contact/page.tsx` - Lead capture form (→ PostgreSQL Leads table)

**7. Client Portal**
- `apps/web/app/(client)/projects/page.tsx` - Projects list (status, progress bars)
- `apps/web/app/(client)/projects/[id]/page.tsx` - Project detail (files, timeline, messages)
- `apps/web/app/(client)/invoices/page.tsx` - Invoices list (pay button → Stripe)
- `apps/web/app/(client)/linkedin/page.tsx` - LinkedIn analytics (metrics chart, posts table, generate button)

**8. Admin Panel**
- `apps/web/app/(admin)/clients/page.tsx` - Clients CRUD (table, create modal, edit modal)
- `apps/web/app/(admin)/projects/page.tsx` - Projects Kanban board (drag-drop status change)
- `apps/web/app/(admin)/team/page.tsx` - Team management (invite, roles, permissions)
- `apps/web/app/(admin)/payments/page.tsx` - Revenue dashboard (MRR chart, recent payments)
- `apps/web/app/(admin)/linkedin-bot/page.tsx` - Bot controls (enable/disable per client, view logs)

---

## Implementation Phases

### Phase 1: Migration & Foundation (Week 1)

**Goals:**
- Create monorepo structure
- Migrate LinkedIn bot to `apps/linkedin-bot/`
- Clean up files (rename logo, delete MEMORY.md, add .gitignore)
- Initialize git with clean commit

**Steps:**
1. Create `C:\nexurops-platform\` directory
2. Setup Turborepo (turbo.json, package.json, pnpm-workspace.yaml)
3. Create `apps/web/` and `apps/linkedin-bot/` directories
4. Copy files from `C:\Users\AK\Desktop\Linkedin\` to `apps/linkedin-bot/`:
   - Reorganize: `core/ → src/core/`, `content/ → src/content/`, etc.
   - Keep config files: voice.md, hooks.json, slop.json
   - Delete MEMORY.md
5. Rename logo: `WhatsApp Image 2026-09-21 at 2.14.24 AM.jpeg` → `apps/web/public/nexurops-logo.jpg`
6. Create comprehensive .gitignore
7. Initialize Next.js app: `pnpm create next-app apps/web --typescript --tailwind --app --src-dir`
8. Setup Prisma: `pnpm add prisma @prisma/client -w` + create schema.prisma
9. Git init + initial commit

**Files to Create:**
- turbo.json, package.json, pnpm-workspace.yaml, .gitignore
- apps/web/prisma/schema.prisma
- apps/linkedin-bot/pyproject.toml, Dockerfile

### Phase 2: Marketing Website (Week 2)

**Goals:**
- Build landing page (hero, services, portfolio, pricing, lead capture)
- Setup shadcn/ui components
- Implement Stripe checkout
- Deploy to Vercel

**Steps:**
1. Install shadcn/ui: `pnpm dlx shadcn-ui@latest init`
2. Add components: Button, Card, Input, Form, Dialog
3. Build landing page:
   - Hero section (headline, subheadline, CTA)
   - Services grid (AI, cybersecurity, web dev, marketing, SEO)
   - Portfolio section (3-4 case studies)
   - Pricing section (service packages)
   - Lead capture form (name, email, service interest, message)
4. Setup Stripe:
   - Create products in Stripe dashboard
   - Install Stripe SDK: `pnpm add stripe`
   - Create checkout session API route
   - Add webhook handler (payment.succeeded → create Order in database)
5. Deploy to Vercel:
   - Connect GitHub repo
   - Add environment variables (DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
   - Deploy

**Files to Create:**
- apps/web/app/(marketing)/page.tsx
- apps/web/app/(marketing)/services/page.tsx
- apps/web/app/(marketing)/services/[slug]/page.tsx
- apps/web/app/(marketing)/contact/page.tsx
- apps/web/app/api/checkout/route.ts
- apps/web/app/api/webhooks/stripe/route.ts
- apps/web/components/marketing/* (Hero, ServiceCard, PortfolioCard, PricingCard, LeadForm)

### Phase 3: Client Portal (Week 3)

**Goals:**
- Implement authentication (NextAuth.js)
- Build client dashboard
- Project tracking
- Invoice payment
- LinkedIn analytics view

**Steps:**
1. Setup NextAuth.js:
   - Install: `pnpm add next-auth`
   - Configure providers (Google, GitHub, credentials)
   - Create auth API route: `apps/web/app/api/auth/[...nextauth]/route.ts`
   - Add middleware for protected routes
2. Build dashboard:
   - Active projects widget (title, status, progress bar)
   - Recent invoices widget (amount, dueDate, pay button)
   - LinkedIn analytics widget (impressions, engagement rate, recent posts)
   - Support tickets widget
3. Build projects page:
   - Projects list (table: title, status, budget, timeline)
   - Project detail page (description, files, timeline, messages)
4. Build invoices page:
   - Invoices list (table: date, amount, status, dueDate)
   - Pay button (→ Stripe checkout)
5. Build LinkedIn analytics page:
   - Metrics overview (total impressions, avg engagement, posts published)
   - Performance chart (impressions over time)
   - Recent posts table (text preview, impressions, likes, comments, engagement rate)
   - Generate post button (modal → call FastAPI /generate → display draft)

**Files to Create:**
- apps/web/app/api/auth/[...nextauth]/route.ts
- apps/web/lib/auth.ts (NextAuth.js config)
- apps/web/middleware.ts (protect /client/* routes)
- apps/web/app/(client)/dashboard/page.tsx
- apps/web/app/(client)/projects/page.tsx
- apps/web/app/(client)/projects/[id]/page.tsx
- apps/web/app/(client)/invoices/page.tsx
- apps/web/app/(client)/linkedin/page.tsx
- apps/web/components/client/* (ProjectCard, InvoiceTable, LinkedInChart, GeneratePostModal)

### Phase 4: Admin Panel (Week 4)

**Goals:**
- Role-based access control
- Clients CRUD
- Team management
- Revenue dashboard
- LinkedIn bot controls

**Steps:**
1. Add role check middleware:
   - Check `user.role` in session
   - Redirect if not ADMIN or SUPER_ADMIN
2. Build clients page:
   - Clients table (name, company, status, created date)
   - Create client modal (form: name, email, company, billing info)
   - Edit client modal
   - Delete confirmation dialog
3. Build projects page:
   - Projects Kanban board (columns: backlog, in-progress, review, completed)
   - Drag-drop to change status
   - Create project modal (client select, title, budget, timeline)
4. Build team page:
   - Team members table (name, email, role, status)
   - Invite modal (send email with setup link)
   - Change role dropdown (CLIENT, ADMIN, SUPER_ADMIN)
5. Build payments page:
   - Revenue chart (MRR over time)
   - Recent payments table (date, client, amount, service)
   - Filters (date range, client, service)
6. Build LinkedIn bot controls page:
   - Enable/disable per client (toggle switch)
   - View bot logs (recent activity)
   - Manual post generation (client select, topic input, generate button)
   - Analytics overview (posts published, avg engagement)

**Files to Create:**
- apps/web/app/(admin)/dashboard/page.tsx
- apps/web/app/(admin)/clients/page.tsx
- apps/web/app/(admin)/projects/page.tsx
- apps/web/app/(admin)/team/page.tsx
- apps/web/app/(admin)/payments/page.tsx
- apps/web/app/(admin)/linkedin-bot/page.tsx
- apps/web/components/admin/* (ClientTable, ProjectKanban, TeamTable, RevenueChart, BotControls)

### Phase 5: LinkedIn Bot Implementation (Weeks 5-7)

**Goals:**
- Implement all Python modules (core, content, workflow, analytics)
- Build FastAPI server
- Setup webhook sync to PostgreSQL
- Deploy to Railway

**Steps:**

**Week 5: Core Modules**
1. Implement `linkedin_auth.py`:
   - OAuth 2.0 flow (authorization URL, callback handling)
   - Token storage (SQLite table: user_id, access_token, refresh_token, expires_at)
   - Token refresh logic
   - Encryption (Fernet)
2. Implement `linkedin_api.py`:
   - Share post endpoint (POST /shares)
   - Get post analytics (GET /shares/{id}/analytics)
   - Error handling (rate limit, auth failure)
3. Implement `llm_client.py`:
   - Multi-provider support (Anthropic Claude, OpenAI, Google)
   - Prompt templates
   - Token counting
   - Retry logic
4. Implement `rate_limiter.py`:
   - Track requests per day (SQLite api_usage table)
   - Check quota before request
   - Reset daily counter

**Week 6: Content Generation**
1. Implement `generator.py`:
   - Load voice profile (config/voice.md)
   - Load hook formulas (config/hooks.json)
   - Select random hook formula
   - Generate content via LLM
   - 3-pass text cleaning (invisible chars, typography, lexicon)
2. Implement `humanizer.py`:
   - 5-check humanization panel:
     - Burstiness (sentence length variance)
     - Specificity (concrete details, numbers, names)
     - Slop density (AI cliché count per 100 words)
     - Fingerprint (repetitive phrasing)
     - Voice match (cosine similarity to user's examples)
   - Score 0-100
   - Verdict: PASS (80+), REVIEW (60-79), FLAGGED (<60)
3. Implement `planner.py`:
   - Weekly content planning (topic suggestions)
   - Optimal posting times (based on historical engagement)
   - Content mix (primary 80%, secondary 15%, off-limits 0%)

**Week 7: Workflow & Analytics**
1. Implement `publisher.py`:
   - Save draft to database (status: draft)
   - Approval workflow (CLI prompt: edit/regenerate/schedule/publish/discard)
   - Schedule post (status: scheduled, scheduled_for timestamp)
   - Publish immediately (call linkedin_api.share_post, status: published)
   - Update database (published_at timestamp)
2. Implement `tracker.py`:
   - Fetch analytics from LinkedIn API (impressions, likes, comments, shares)
   - Calculate engagement rate
   - Update posts table (metrics_updated_at timestamp)
   - Run daily (scheduler.py)
3. Implement `memory_log.py`:
   - Log post outcomes (hook_formula → engagement_rate)
   - Reflection generation (via LLM: "Why did this post perform well/poorly?")
   - Weekly insights report
4. Implement FastAPI server (`api/main.py`):
   - CORS (whitelist: Vercel domain)
   - Routes:
     - POST /generate (topic, voice_profile_id → draft + humanization_score)
     - GET /posts (status filter, pagination)
     - POST /publish (post_id)
     - GET /analytics (date_range, aggregation)
     - POST /webhooks/publish (notify Next.js when post published)
   - Startup: load voice profiles, initialize database connection
5. Deploy to Railway:
   - Create Railway project
   - Connect GitHub repo
   - Add environment variables (LINKEDIN_CLIENT_ID, ANTHROPIC_API_KEY, DATABASE_URL, etc.)
   - Deploy
   - Test endpoints

**Files to Create:**
- apps/linkedin-bot/src/core/linkedin_auth.py
- apps/linkedin-bot/src/core/linkedin_api.py
- apps/linkedin-bot/src/core/llm_client.py
- apps/linkedin-bot/src/core/rate_limiter.py
- apps/linkedin-bot/src/content/generator.py
- apps/linkedin-bot/src/content/humanizer.py
- apps/linkedin-bot/src/content/planner.py
- apps/linkedin-bot/src/workflow/approval.py
- apps/linkedin-bot/src/workflow/publisher.py
- apps/linkedin-bot/src/analytics/tracker.py
- apps/linkedin-bot/src/analytics/memory_log.py
- apps/linkedin-bot/src/analytics/insights.py
- apps/linkedin-bot/src/api/main.py
- apps/linkedin-bot/src/api/routes/posts.py
- apps/linkedin-bot/src/api/routes/analytics.py
- apps/linkedin-bot/src/api/routes/webhooks.py

### Phase 6: Integration & Testing (Week 8)

**Goals:**
- Connect Next.js to FastAPI
- Setup tRPC
- Webhook flow testing
- End-to-end testing

**Steps:**
1. Setup tRPC:
   - Install: `pnpm add @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query`
   - Create tRPC router: `apps/web/lib/trpc/server.ts`
   - Define procedures:
     - `linkedin.generatePost(topic: string)` → POST /generate to FastAPI
     - `linkedin.getPosts()` → GET /posts from FastAPI
     - `linkedin.publishPost(postId: string)` → POST /publish to FastAPI
     - `linkedin.getAnalytics(dateRange)` → GET /analytics from FastAPI
   - Create tRPC client: `apps/web/lib/trpc/client.ts`
   - Wrap app in tRPC provider
2. Update client portal:
   - LinkedIn analytics page: fetch data via `trpc.linkedin.getAnalytics.useQuery()`
   - Generate post button: call `trpc.linkedin.generatePost.useMutation()`
3. Update admin panel:
   - Bot controls page: enable/disable (store in database: Client.linkedinBotEnabled)
   - Manual generation: call `trpc.linkedin.generatePost.useMutation()`
4. Test webhook flow:
   - Publish post from admin panel
   - FastAPI calls POST /api/webhooks/linkedin (Next.js)
   - Next.js creates LinkedInPost record in PostgreSQL
   - Verify record appears in client analytics page
5. End-to-end testing:
   - User flow: signup → browse services → checkout → order created → project created
   - Client flow: login → view projects → view invoices → pay invoice
   - Admin flow: login → create client → create project → assign project → view revenue
   - LinkedIn flow: admin generates post → bot creates draft → admin publishes → webhook syncs → client views analytics

**Files to Create:**
- apps/web/lib/trpc/server.ts
- apps/web/lib/trpc/client.ts
- apps/web/lib/trpc/routers/linkedin.ts
- apps/web/app/api/trpc/[trpc]/route.ts

### Phase 7: Production Hardening (Week 9-10)

**Goals:**
- Security audit
- Performance optimization
- Monitoring setup
- Load testing

**Steps:**
1. Security audit:
   - Review all API routes (check authentication, authorization)
   - Test CSRF protection
   - Test SQL injection (Prisma parameterized queries)
   - Test XSS (sanitize user input)
   - Verify .env files not committed
   - Rotate all API keys
   - Enable HTTPS everywhere
2. Performance optimization:
   - Add Next.js ISR to marketing pages (revalidate: 3600)
   - Add Redis caching to tRPC procedures (LinkedIn analytics)
   - Optimize database queries (add indexes, use select only needed fields)
   - Add database connection pooling (PgBouncer)
   - Lazy load components
   - Image optimization (next/image)
   - Code splitting (dynamic imports)
3. Monitoring setup:
   - Add Sentry (error tracking)
   - Add Vercel Analytics (Next.js)
   - Add Railway Metrics (Python)
   - Setup alerts (error rate > 1%, response time > 2s)
4. Load testing:
   - Use k6 or Artillery
   - Test 1000 concurrent users on landing page
   - Test 100 concurrent API requests
   - Verify auto-scaling works
   - Check database connection pool doesn't exhaust

**Files to Create:**
- apps/web/lib/sentry.ts
- apps/web/middleware.ts (add rate limiting)
- load-tests/k6-script.js

### Phase 8: Launch Prep (Week 11)

**Goals:**
- Content creation (portfolio case studies)
- User documentation
- Admin training
- Beta testing

**Steps:**
1. Content creation:
   - Write 4-6 case studies (portfolio page)
   - Create service descriptions (services page)
   - Write pricing copy (pricing section)
   - Design email templates (welcome, invoice, project update)
2. User documentation:
   - Client guide (how to login, view projects, pay invoices, view LinkedIn analytics)
   - Admin guide (how to create clients, projects, manage team, use bot controls)
3. Beta testing:
   - Invite 5-10 users
   - Collect feedback (bugs, UX issues, feature requests)
   - Fix critical bugs
   - Prioritize feature requests for post-launch
4. Marketing prep:
   - Setup Google Analytics
   - Setup Meta Pixel
   - Create Facebook/LinkedIn ads
   - Write launch announcement (LinkedIn, Twitter, email list)

**Files to Create:**
- apps/web/app/(marketing)/portfolio/data.ts (case studies data)
- docs/client-guide.md
- docs/admin-guide.md

### Phase 9: Launch (Week 12)

**Goals:**
- Go live
- Monitor closely
- Respond to issues quickly

**Steps:**
1. Final checks:
   - All tests passing
   - No console errors
   - All environment variables set
   - Database backups enabled
2. Deploy:
   - Deploy Next.js to Vercel (production)
   - Deploy Python to Railway (production)
   - Verify DNS records
   - Verify SSL certificates
3. Monitor:
   - Watch error logs (Sentry)
   - Watch performance metrics (Vercel Analytics, Railway Metrics)
   - Watch user signups, orders, revenue
4. Marketing:
   - Post launch announcement (LinkedIn, Twitter)
   - Send email to list
   - Run ads (Facebook, LinkedIn)
   - Reach out to leads
5. Support:
   - Respond to support tickets within 24 hours
   - Fix critical bugs within 48 hours
   - Release bug fix patch ASAP

---

## Migration Strategy

**Current Location:** `C:\Users\AK\Desktop\Linkedin\`

**New Location:** `C:\nexurops-platform\apps\linkedin-bot\`

**Migration Steps:**

1. **Create monorepo structure:**
   ```bash
   mkdir C:\nexurops-platform
   cd C:\nexurops-platform
   mkdir -p apps/web apps/linkedin-bot packages/{database,ui,types}
   ```

2. **Copy LinkedIn bot files:**
   ```bash
   # Core modules
   cp -r C:\Users\AK\Desktop\Linkedin\core apps\linkedin-bot\src\core
   cp -r C:\Users\AK\Desktop\Linkedin\content apps\linkedin-bot\src\content
   cp -r C:\Users\AK\Desktop\Linkedin\workflow apps\linkedin-bot\src\workflow
   cp -r C:\Users\AK\Desktop\Linkedin\analytics apps\linkedin-bot\src\analytics
   
   # Config files
   cp -r C:\Users\AK\Desktop\Linkedin\config apps\linkedin-bot\config
   
   # Database
   cp -r C:\Users\AK\Desktop\Linkedin\database apps\linkedin-bot\src\database
   
   # Scripts
   cp -r C:\Users\AK\Desktop\Linkedin\scripts apps\linkedin-bot\scripts
   
   # Data directory (empty, for runtime)
   mkdir apps\linkedin-bot\data
   
   # Python config
   cp C:\Users\AK\Desktop\Linkedin\requirements.txt apps\linkedin-bot\requirements.txt
   ```

3. **Rename logo:**
   ```bash
   cp "C:\Users\AK\Desktop\Linkedin\WhatsApp Image 2026-09-21 at 2.14.24 AM.jpeg" apps\web\public\nexurops-logo.jpg
   ```

4. **Delete MEMORY.md:**
   ```bash
   rm C:\Users\AK\Desktop\Linkedin\MEMORY.md
   rm apps\linkedin-bot\MEMORY.md  # if copied
   ```

5. **Create .gitignore:**
   ```bash
   # Create comprehensive .gitignore at root
   cat > .gitignore << 'EOF'
   # Dependencies
   node_modules/
   .pnp
   .pnp.js
   __pycache__/
   *.pyc
   *.pyo
   *.egg-info/
   
   # Environment
   .env
   .env*.local
   
   # Build outputs
   dist/
   build/
   .next/
   .turbo/
   
   # Databases
   *.db
   *.sqlite
   *.sqlite3
   
   # Logs
   logs/
   *.log
   
   # Runtime data
   data/
   
   # OS
   .DS_Store
   Thumbs.db
   
   # IDE
   .vscode/
   .idea/
   *.swp
   EOF
   ```

6. **Initialize git:**
   ```bash
   git init
   git add .
   git commit -m "chore: initialize Nexurops monorepo"
   ```

**Verification:**
```bash
# Check structure
tree -L 3 nexurops-platform/

# Expected output:
# nexurops-platform/
# ├── apps/
# │   ├── web/
# │   │   ├── app/
# │   │   ├── components/
# │   │   ├── lib/
# │   │   ├── prisma/
# │   │   ├── public/
# │   │   │   └── nexurops-logo.jpg
# │   │   └── [config files]
# │   └── linkedin-bot/
# │       ├── src/
# │       │   ├── core/
# │       │   ├── content/
# │       │   ├── workflow/
# │       │   ├── analytics/
# │       │   ├── api/
# │       │   └── database/
# │       ├── config/
# │       │   ├── voice.md
# │       │   ├── hooks.json
# │       │   └── slop.json
# │       ├── data/
# │       ├── scripts/
# │       └── [config files]
# ├── packages/
# │   ├── database/
# │   ├── ui/
# │   └── types/
# ├── .gitignore
# ├── turbo.json
# ├── package.json
# └── README.md

# Verify git status
git status
# Should show: On branch main, nothing to commit, working tree clean

# Verify logo renamed
ls apps/web/public/nexurops-logo.jpg

# Verify MEMORY.md deleted
ls C:\Users\AK\Desktop\Linkedin\MEMORY.md  # Should not exist
```

---

## Scalability & Security

### Scalability (100k+ users)

**Load Balancing:**
- Vercel auto load balances Next.js (edge functions)
- Railway auto-scales Python (CPU/memory-based)

**Database:**
- PostgreSQL connection pooling (PgBouncer - 100 max connections)
- Read replicas for analytics queries
- Prisma query optimization (select only needed fields, use indexes)

**Caching:**
- Next.js ISR (revalidate: 3600) for marketing pages
- Redis cache (Upstash) for LinkedIn analytics (TTL: 300s)
- CDN for static assets (Vercel automatic)

**Job Queue:**
- Redis + BullMQ for async operations:
  - LinkedIn post scheduling
  - Email notifications (welcome, invoice, project update)
  - Webhook processing (Stripe, LinkedIn bot)

**Rate Limiting:**
- LinkedIn API: 150 req/day (tracked in SQLite api_usage table)
- Next.js API routes: 1000 req/hour per IP (middleware)
- Stripe webhook: HMAC verification

**Monitoring:**
- Vercel Analytics (Next.js performance)
- Railway Metrics (Python service health)
- Sentry (error tracking)
- Alerts (error rate > 1%, response time > 2s)

### Security

**Authentication:**
- NextAuth.js with JWT sessions (HTTP-only cookies)
- OAuth (Google, GitHub) for clients
- Password + 2FA for admin (TOTP)
- Session timeout: 7 days (sliding)

**Authorization:**
- Role-based access control (SUPER_ADMIN, ADMIN, CLIENT)
- Row-level security in PostgreSQL (clients can only see their own data)
- Middleware checks on all protected routes

**Data Protection:**
- Encrypt LinkedIn tokens (Fernet - Python cryptography library)
- HTTPS everywhere (auto-provisioned SSL)
- CORS whitelist (FastAPI → Vercel domain only)
- Sanitize user input (prevent XSS)
- Parameterized queries (prevent SQL injection)

**Secret Management:**
- Vercel environment variables (Next.js)
- Railway secrets (Python)
- Never commit .env files (.gitignore)
- Rotate API keys quarterly

**DDoS Protection:**
- Vercel DDoS protection (automatic)
- Rate limiting on API routes (middleware)

**Compliance:**
- GDPR (data deletion endpoint: DELETE /api/user/data)
- PCI DSS (Stripe handles payments - no card data stored)
- LinkedIn API ToS compliance (no scraping, no automation outside API)

---

## Deployment Architecture

### Environments

**Development:**
- Local: `localhost:3000` (Next.js) + `localhost:8000` (FastAPI)
- Database: Local PostgreSQL (Docker) + SQLite (file)

**Staging:**
- Next.js: Vercel Preview (branch: staging)
- Python: Railway Preview
- Database: Supabase staging project

**Production:**
- Next.js: Vercel Production (branch: main)
- Python: Railway Production
- Database: Supabase production project

### CI/CD Pipeline

**GitHub Actions Workflows:**

1. **`.github/workflows/ci.yml`** (runs on all PRs):
   - Install dependencies
   - Run linters (ESLint, Prettier, Ruff)
   - Run type checks (TypeScript, mypy)
   - Run unit tests (Jest, pytest)
   - Run integration tests
   - Build (ensure no build errors)

2. **`.github/workflows/deploy-web.yml`** (runs on push to main):
   - Trigger Vercel deployment
   - Wait for deployment
   - Run smoke tests
   - Notify Slack on success/failure

3. **`.github/workflows/deploy-bot.yml`** (runs on push to main):
   - Build Docker image
   - Push to Railway
   - Run health check
   - Notify Slack on success/failure

### Infrastructure Costs

**Monthly Estimate:**
- Vercel Pro: $20 (Next.js hosting, edge functions, analytics)
- Railway: $20-50 (Python hosting, auto-scaling, 1-4GB RAM)
- Supabase Pro: $25 (PostgreSQL, 8GB database, connection pooling, daily backups)
- Upstash Redis: $10 (job queue + caching, 1GB)
- Sentry: $0-26 (error tracking, 5k events/month free, $26 for 50k)
- Domain: $12/year (~$1/month)

**Total: ~$75-105/month** (scales with usage)

---

## Verification Steps

### Phase 1 Verification (Migration complete)

```bash
# 1. Check monorepo structure
tree -L 3 C:\nexurops-platform

# 2. Verify LinkedIn bot relocated
ls C:\nexurops-platform\apps\linkedin-bot\src\core
ls C:\nexurops-platform\apps\linkedin-bot\config\voice.md

# 3. Verify logo renamed
ls C:\nexurops-platform\apps\web\public\nexurops-logo.jpg

# 4. Verify MEMORY.md deleted
ls C:\Users\AK\Desktop\Linkedin\MEMORY.md  # Should not exist

# 5. Verify .gitignore working
cat C:\nexurops-platform\.gitignore
git status  # .env, data/, logs/ should not appear

# 6. Verify git initialized
git log  # Should show initial commit
```

### Phase 2 Verification (Marketing website)

```bash
# 1. Start dev server
cd C:\nexurops-platform\apps\web
pnpm dev

# 2. Open browser: http://localhost:3000
# 3. Check pages:
#    - Landing page renders (hero, services, portfolio, pricing, lead form)
#    - Services page renders (service cards clickable)
#    - Service detail page renders (Stripe checkout button works)
#    - Contact page renders (lead form submits → creates Lead record)

# 4. Check database
psql $DATABASE_URL
SELECT * FROM "Lead" ORDER BY "createdAt" DESC LIMIT 5;

# 5. Test Stripe checkout
# Click "Buy Now" button → Stripe checkout page opens → complete payment → webhook triggers → Order created

# 6. Verify deployment
# Visit Vercel domain → landing page loads → no console errors
```

### Phase 3 Verification (Client portal)

```bash
# 1. Test authentication
# Signup with Google → redirects to /client/dashboard
# Logout → redirects to landing page
# Login again → redirects to /client/dashboard

# 2. Check dashboard widgets
# Projects widget shows active projects
# Invoices widget shows unpaid invoices
# LinkedIn widget shows metrics

# 3. Test projects page
# Click project → detail page loads
# View files, timeline, messages

# 4. Test invoices page
# Click "Pay" button → Stripe checkout opens
# Complete payment → invoice status changes to "paid"

# 5. Test LinkedIn analytics page
# Metrics overview shows data
# Performance chart renders
# Recent posts table shows posts
# Click "Generate Post" → modal opens → enter topic → draft generated → humanization score shown
```

### Phase 4 Verification (Admin panel)

```bash
# 1. Login as admin
# Visit /admin/dashboard → redirects to login if not admin role
# Login with admin account → dashboard loads

# 2. Test clients CRUD
# Click "New Client" → modal opens → fill form → submit → client created
# Click "Edit" → modal opens → change name → save → client updated
# Click "Delete" → confirmation dialog → confirm → client deleted

# 3. Test projects Kanban
# Drag project from "backlog" to "in-progress" → status updates
# Create new project → appears in "backlog" column

# 4. Test team management
# Click "Invite" → modal opens → enter email → send invite → user receives email
# Change user role → dropdown → select ADMIN → save → role updated

# 5. Test payments dashboard
# Revenue chart shows MRR over time
# Recent payments table shows payments
# Filters work (date range, client, service)

# 6. Test LinkedIn bot controls
# Toggle "Enable" for client → Client.linkedinBotEnabled = true
# Click "Generate Post" → select client → enter topic → draft generated
# View logs → recent activity shown
```

### Phase 5 Verification (LinkedIn bot)

```bash
# 1. Test OAuth flow
cd C:\nexurops-platform\apps\linkedin-bot
python scripts/authenticate.py
# Opens browser → LinkedIn OAuth page → authorize → callback → token saved

# 2. Test content generation
python scripts/generate_post.py --topic "Building RAG systems"
# Generates draft → humanization score shown → verdict: PASS/REVIEW/FLAGGED

# 3. Test publishing
python scripts/publish_post.py --post-id 123
# Publishes to LinkedIn → post URL returned → database updated

# 4. Test analytics tracking
python scripts/fetch_analytics.py
# Fetches metrics from LinkedIn API → updates posts table → metrics shown

# 5. Test FastAPI server
cd C:\nexurops-platform\apps\linkedin-bot
uvicorn src.api.main:app --reload
# Visit http://localhost:8000/docs → Swagger UI loads
# Test POST /generate → returns draft + score
# Test GET /posts → returns posts list
# Test POST /publish → publishes post
# Test GET /analytics → returns metrics

# 6. Test webhook
# Publish post → FastAPI calls POST http://localhost:3000/api/webhooks/linkedin
# Next.js creates LinkedInPost record in PostgreSQL
# Visit /client/linkedin → new post appears in table
```

### Phase 6 Verification (Integration)

```bash
# 1. Test tRPC connection
# Open /client/linkedin → click "Generate Post" button
# tRPC calls FastAPI /generate → draft returned → modal shows draft
# Click "Publish" → tRPC calls FastAPI /publish → post published
# Webhook triggers → Next.js creates LinkedInPost record
# Page refreshes → new post appears in table

# 2. Test end-to-end flow (user journey)
# User visits landing page
# Clicks "Get Started" on service card
# Redirects to /services/ai-automation
# Clicks "Buy Now"
# Stripe checkout opens
# Completes payment
# Webhook triggers → Order created → Project created
# User receives welcome email
# User logs in → /client/dashboard shows new project

# 3. Test end-to-end flow (admin journey)
# Admin logs in → /admin/dashboard
# Clicks "Clients" → clicks "New Client" → fills form → submits
# Client created → receives invite email
# Admin clicks "Projects" → clicks "New Project" → selects client → fills form → submits
# Project created → appears in Kanban board
# Admin clicks "LinkedIn Bot" → toggles "Enable" for client
# Admin clicks "Generate Post" → selects client → enters topic → submits
# Draft generated → admin clicks "Publish"
# Post published to LinkedIn → webhook triggers → Next.js syncs to database
# Client logs in → /client/linkedin → sees new post
```

### Phase 7 Verification (Production readiness)

```bash
# 1. Security audit
# Run npm audit → fix vulnerabilities
# Run OWASP ZAP → no high/critical findings
# Review all API routes → authentication required
# Test CSRF protection → works
# Test SQL injection → Prisma prevents
# Test XSS → sanitized
# Verify .env files not committed → not in git

# 2. Performance testing
# Run k6 load test → 1000 concurrent users → avg response time < 500ms
# Check Vercel Analytics → Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)
# Check Railway Metrics → CPU < 70%, memory < 80%
# Check database connections → PgBouncer limits respected

# 3. Monitoring
# Sentry configured → errors logged
# Vercel Analytics configured → metrics tracked
# Railway Metrics configured → service health monitored
# Alerts configured → Slack notifications on errors

# 4. Final checks
# All tests passing (unit, integration, e2e)
# No console errors
# All environment variables set (Vercel, Railway, Supabase)
# Database backups enabled (Supabase automatic daily backups)
# SSL certificates valid
# DNS records correct
```

### Phase 8 Verification (Launch)

```bash
# 1. Deploy to production
# Merge main branch → Vercel deploys Next.js → Railway deploys Python
# Visit production domain → landing page loads
# Test user signup → works
# Test order checkout → works
# Test LinkedIn bot → works

# 2. Monitor launch
# Watch Sentry for errors → fix critical bugs within 48 hours
# Watch Vercel Analytics → track page views, bounce rate
# Watch Railway Metrics → CPU, memory, requests
# Watch signups, orders, revenue

# 3. Marketing
# Post launch announcement (LinkedIn, Twitter)
# Send email to list
# Run ads (Facebook, LinkedIn)

# 4. Support
# Respond to support tickets within 24 hours
# Fix bugs
# Release patches
```

---

## Success Metrics

**Week 1-4 (MVP Launch):**
- ✅ Monorepo created + git initialized
- ✅ Marketing website live (landing, services, portfolio, contact)
- ✅ Stripe checkout working (orders created)
- ✅ Lead capture form working (leads saved)

**Week 5-8 (Client Portal + Admin Panel):**
- ✅ Authentication working (signup, login, logout)
- ✅ Client dashboard showing data (projects, invoices, LinkedIn analytics)
- ✅ Admin panel working (clients, projects, team, payments, bot controls)
- ✅ LinkedIn bot implementation complete (all Python modules)
- ✅ FastAPI server deployed to Railway

**Week 9-12 (Integration + Launch):**
- ✅ tRPC integration working (Next.js ↔ FastAPI)
- ✅ Webhook sync working (LinkedIn bot → Next.js)
- ✅ Security audit passed (no high/critical findings)
- ✅ Performance testing passed (1000 concurrent users, <500ms avg response time)
- ✅ Production deployment successful
- ✅ 10+ signups in first week
- ✅ 3+ orders in first week

**Post-Launch (Month 1-3):**
- 100+ signups
- 20+ orders
- $5k+ revenue
- <1% error rate
- >95% uptime
- 4.5+ rating (user feedback)

---

## Risk Mitigation

**Risk 1: LinkedIn API rate limits (150 req/day)**
- Mitigation: Track usage in SQLite api_usage table, queue requests if quota exceeded
- Fallback: Manual posting (admin generates post, client copies to LinkedIn)

**Risk 2: FastAPI performance bottleneck**
- Mitigation: Auto-scaling on Railway (CPU-based), load testing before launch
- Fallback: Increase Railway plan (more CPU/RAM)

**Risk 3: Database connection exhaustion**
- Mitigation: Connection pooling (PgBouncer 100 max), read replicas for analytics
- Fallback: Increase Supabase plan (more connections)

**Risk 4: Stripe payment failures**
- Mitigation: Webhook handler with retries (exponential backoff), idempotency keys
- Fallback: Manual invoice creation (admin marks as paid)

**Risk 5: Low user signups**
- Mitigation: A/B testing on landing page, ads optimization, SEO
- Fallback: Outbound sales (cold outreach on LinkedIn, Upwork)

---

## Next Steps

1. **Review this plan** - Confirm architecture makes sense
2. **Ask clarifying questions** - Any unclear requirements?
3. **Begin Phase 1** - Create monorepo + migrate LinkedIn bot
4. **Track progress** - Use tasks to track implementation
5. **Iterate based on feedback** - Adjust plan as needed

**Estimated Total Time:** 12 weeks (full-time)  
**Estimated Total Cost:** ~$1,000 (infrastructure + tools for 12 weeks)

---

## Summary

**What We're Building:**
- Full-stack agency platform (Nexurops)
- Services: AI, cybersecurity, web dev, marketing, SEO
- Marketing website + client portal + admin panel + LinkedIn bot
- Scale: 100k+ users (Y Combinator level)

**Tech Stack:**
- Next.js 14 + React 18 + TypeScript + Tailwind
- FastAPI + Python + SQLite (LinkedIn bot)
- PostgreSQL + Redis + Prisma
- Vercel + Railway + Supabase + Upstash

**Key Features:**
- Portfolio showcase + service catalog + lead capture
- Stripe checkout + order management
- Client dashboard (projects, invoices, LinkedIn analytics)
- Admin panel (clients, team, payments, bot controls)
- LinkedIn bot (autonomous content generation, humanization, analytics)

**Implementation Phases:**
- Week 1: Migration + foundation
- Weeks 2-4: Marketing website + client portal + admin panel
- Weeks 5-7: LinkedIn bot implementation
- Week 8: Integration + testing
- Weeks 9-10: Production hardening
- Week 11: Launch prep
- Week 12: Launch

**Clean Structure:**
- Turborepo monorepo
- Route groups for clean URLs
- No root folder mess (only essential files)
- Comprehensive .gitignore
- Logo renamed, MEMORY.md deleted

**Production-Grade:**
- Auto-scaling (Vercel + Railway)
- Connection pooling + read replicas
- Redis caching + job queue
- Rate limiting + DDoS protection
- Error tracking + monitoring + alerts
- CI/CD pipeline (GitHub Actions)
- Security hardening (HTTPS, CORS, encryption, RBAC)
