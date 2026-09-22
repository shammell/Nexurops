# Nexurops Platform - Session Memory

## Current State (2026-09-22)

**Project:** Nexurops - AI-powered DevOps agency platform
**Branch:** master (clean)
**Last commit:** flatten nested folder structure

### Completed Phases
- ✅ Phase 1: Monorepo initialized (Turborepo + pnpm workspaces)
- ✅ Phase 2: LinkedIn bot relocated to apps/linkedin-bot/
- ✅ Phase 3: Landing page + client dashboard + tRPC setup (per README)
- ✅ Logo renamed to nexurops-logo.jpg
- ✅ .gitignore added (comprehensive)
- ✅ Database schema: Prisma + PostgreSQL defined

### Known Issues / TODOs

**1. tRPC Mutations (DOCUMENTED - needs verification)**
   - File: `TRPC_MUTATIONS_FIXES.md`
   - Issue: Mutations don't match Prisma schema nullability
   - Routers affected:
     - `linkedin.ts` - publishPost needs clientId
     - `invoices.ts` - create needs all financial fields explicit
     - `clients.ts` - company field optional
     - `projects.ts` - explicit field mapping for optional fields
   - Status: Fixes documented, need to verify applied to code

**2. Environment Setup**
   - DATABASE_URL not set (need PostgreSQL)
   - NextAuth secrets not configured
   - Stripe keys missing
   - ANTHROPIC_API_KEY missing for LinkedIn bot

**3. Missing Components/Routes**
   - Admin panel not started (Phase 4)
   - LinkedIn bot FastAPI server not running
   - Webhook handlers not tested
   - tRPC client not fully integrated

### Tech Stack
- Frontend: Next.js 14, React 18, TypeScript, Tailwind, shadcn/ui
- Backend: tRPC, NextAuth.js, Prisma ORM
- Python: FastAPI (LinkedIn bot), SQLite
- DB: PostgreSQL (main), SQLite (bot)
- Deployment: Vercel (Next.js), Railway (Python)

### Architecture
```
nexurops-platform/
├── apps/
│   ├── web/               # Next.js 14 (marketing + client portal + admin)
│   │   └── src/
│   │       ├── app/       # Route groups: (marketing), (client), (admin)
│   │       ├── lib/trpc/  # tRPC routers
│   │       ├── components/
│   │       └── prisma/    # Database schema
│   └── linkedin-bot/      # Python FastAPI service
├── packages/
│   ├── types/             # Shared types
│   ├── ui/                # Shared components
│   └── database/          # Shared Prisma
└── turbo.json
```

### Next Steps (Priority Order)
1. **Verify & Fix tRPC Mutations** - Run type-check, apply TRPC_MUTATIONS_FIXES.md to code
2. **Setup Environment** - .env.local with DATABASE_URL, NextAuth secret
3. **Test Development** - pnpm dev, check landing page + auth
4. **Implement Admin Panel** - Phase 4
5. **Build LinkedIn Bot FastAPI** - Phase 5
6. **Deploy & Test** - Phase 6-9

### Dev Commands
```bash
pnpm dev          # Start all apps
pnpm build        # Production build
pnpm type-check   # TypeScript validation
pnpm lint         # Code quality
pnpm test         # Run tests
```

### Key Files
- Plan: `/abhi-aik-phd-plan-zesty-locket.md` (12-week implementation plan)
- Mutations fixes: `/TRPC_MUTATIONS_FIXES.md`
- Main README: `/README.md`
- Prisma schema: `apps/web/src/prisma/schema.prisma`
- tRPC routers: `apps/web/src/lib/trpc/routers/`

---

## Session Notes

### Questions for Next Session
- Did tRPC fixes get applied? Check git diff
- What's the exact DATABASE_URL setup? (Supabase?)
- Do we start with admin panel or LinkedIn bot next?
- Scale priority: ship working MVP or perfect infrastructure?

### Decisions Made
- Monorepo approach (Turborepo) - keeps web + bot + shared packages organized
- NextAuth + tRPC - type-safe, minimal boilerplate
- Prisma - ORM with strong types
- No root clutter - only config files at root level

---

## For Future Claude Sessions

**Read these first:**
1. This file (MEMORY.md)
2. `/abhi-aik-phd-plan-zesty-locket.md` - full 12-week plan
3. `/TRPC_MUTATIONS_FIXES.md` - known fixes
4. `/CLAUDE.md` - project guidelines

**Fast status check:**
```bash
git log --oneline -5          # See last commits
ls -la apps/web/src/lib/trpc/routers/  # Check routers exist
pnpm type-check 2>&1 | head   # Quick type errors
```

**To resume work:**
- Check git status (should be clean)
- Check which Phase we're on
- Pick next task from "Next Steps" above
- Update this file when done
