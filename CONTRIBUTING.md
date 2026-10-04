# Contributing to Nexurops

Turborepo + pnpm monorepo. Web app: `apps/web` (Next.js 14, tRPC 10, Prisma, NextAuth). LinkedIn bot (`apps/linkedin-bot`) is still scaffolding.

## Setup
```bash
git clone https://github.com/shammell/Nexurops.git
cd Nexurops
pnpm install
cd apps/web
pnpm db:generate
```

### Environment
`.env` files are **never committed**. Ask the repo owner for the values over a private channel and put them in both `apps/web/.env` (Prisma CLI reads this) and `apps/web/.env.local` (Next.js reads this). Keep the two identical. Variable names are listed in `apps/web/.env.example`.

Do not point two people at the same Supabase database for experiments: use your own Supabase project or a local Postgres (Docker) and run `pnpm db:push` against that.

Optional: `NEXT_PUBLIC_CALENDLY_URL` enables the booking popup (without it, "Book a call" links to the contact form).

## Run
```bash
cd apps/web
pnpm dev          # http://localhost:3000
```

## Before opening a PR
```bash
cd apps/web
pnpm type-check   # must pass
pnpm test:unit    # tRPC authorization tests
pnpm test:e2e     # Playwright (starts the dev server itself)
```
`pnpm lint` has pre-existing errors in older files; just don't add new ones.

## Workflow
- Branch from `master`: `feat/<topic>` or `fix/<topic>`. Do not push directly to `master`.
- Small, focused commits; open a Pull Request for review.
- Never commit `.env*` (except `.env.example`), `test-results/`, `*.tsbuildinfo` or large media.

## Where things live
- Marketing site + 3D: `apps/web/src/app/(marketing)`, `src/components/marketing`, `src/lib/marketing`
- Portal routes: `(client)/client/*` and `(admin)/admin/*` (route groups are not part of the URL; middleware protects `/client/*` and `/admin/*`)
- tRPC routers (the only served tree): `src/lib/trpc/routers`; shared authz helpers: `src/lib/trpc/access.ts`
- Rule: reads are owner-scoped, project/invoice writes are admin-only. Add a case to `authz.test.ts` when you add a procedure.
