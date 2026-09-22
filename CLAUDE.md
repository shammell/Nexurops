# Claude.md - Project Guidelines

## Working Style
- **Mode:** Caveman (terse, no fluff, direct)
- **Commitment:** Full-stack implementation, not just planning
- **Rigor:** Type safety first, test as we go
- **Communication:** One-liner updates at key moments

## How to Work on Nexurops

### 1. Before Starting
```bash
git status              # Must be clean (or commit pending work)
git log --oneline -3    # Understand recent context
```

### 2. Task Selection
- Pick one clear task (not "improve the app")
- Link to TRPC_MUTATIONS_FIXES.md or abhi-aik-phd-plan-zesty-locket.md
- Estimate: <2 hours for "done" state (working code, tested)

### 3. Implementation
- Read file before editing (always)
- Edit in-place (don't recreate files)
- Use Glob/Grep for navigation (not manual exploring)
- Type-check after changes: `pnpm type-check`
- Run dev server to verify: `pnpm dev`

### 4. Commit
- Descriptive message (reference Phases/docs)
- Example: `fix: tRPC mutations align with Prisma schema`
- Run tests before committing (if tests exist)

### 5. Update MEMORY.md
- Mark completed items ✅
- Add blockers if stuck
- Suggest next steps

## Code Patterns

### tRPC Routers
- File: `apps/web/src/lib/trpc/routers/[name].ts`
- Pattern: procedure → input validation → db call → return
- Schema: Zod object matching Prisma nullable fields exactly
- Example:
```typescript
const createSchema = z.object({
  clientId: z.string(),
  name: z.string().min(1),
  budget: z.number().positive().optional().nullable(),
});

export const exampleRouter = router({
  create: protectedProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.thing.create({ data: input });
    }),
});
```

### Database (Prisma)
- Schema: `apps/web/src/prisma/schema.prisma`
- Non-nullable fields required in mutation input
- Optional fields: `.optional().nullable()` in Zod
- Enums imported from `@prisma/client`, not `@nexurops/types`

### Components (Next.js)
- Use shadcn/ui (already setup)
- Route groups: `(marketing)`, `(client)`, `(admin)`
- Server components by default (faster)
- Tailwind + Framer Motion for animations

### Auth
- NextAuth.js config: `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- Session: `useSession()` hook in client components
- Protected routes: middleware.ts checks `user.role`

## Common Tasks

### "Fix type errors"
```bash
pnpm type-check
# Read errors → locate file:line
# Read file → understand type mismatch
# Fix schema or mutation
# Verify: pnpm type-check (should pass)
```

### "Test a page"
```bash
pnpm dev
# Open http://localhost:3000
# Navigate to page
# Check console (F12)
# Check network (dev tools → Network tab)
# Stop: Ctrl+C
```

### "Add a new route"
```bash
# 1. Create file: apps/web/src/app/(group)/[route]/page.tsx
# 2. Add component (use shadcn/ui)
# 3. Update navigation (header/sidebar)
# 4. Test: pnpm dev → navigate to route
# 5. Commit
```

### "Add a tRPC mutation"
```bash
# 1. Edit apps/web/src/lib/trpc/routers/[name].ts
# 2. Add input schema (Zod)
# 3. Add procedure (protectedProcedure.input.mutation)
# 4. Test: pnpm dev → open app → call mutation via trpc.use...
# 5. Check database (Prisma Studio or SQL query)
# 6. Commit
```

## File Structure
```
apps/web/src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public pages (no auth)
│   │   ├── page.tsx             # Landing
│   │   ├── services/
│   │   ├── portfolio/
│   │   └── contact/
│   ├── (client)/                # Authenticated (role: CLIENT)
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── invoices/
│   │   └── linkedin/
│   ├── (admin)/                 # Authenticated (role: ADMIN/SUPER_ADMIN)
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── projects/
│   │   ├── team/
│   │   ├── payments/
│   │   └── linkedin-bot/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── trpc/[trpc]/
│   │   ├── webhooks/
│   │   └── [other routes]
│   ├── layout.tsx               # Root layout
│   └── middleware.ts            # Auth + role checks
├── components/
│   ├── ui/                       # shadcn/ui + custom
│   ├── marketing/
│   ├── client/
│   └── admin/
├── lib/
│   ├── trpc/
│   │   ├── server.ts            # Server router
│   │   ├── client.ts            # Client hook
│   │   └── routers/             # Procedure definitions
│   ├── auth.ts                  # NextAuth config
│   ├── db.ts                    # Prisma client
│   └── utils.ts
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
└── types/
    └── index.ts                 # Shared types
```

## Debugging

### Type errors
```bash
pnpm type-check 2>&1 | grep -A 2 "error"
# Find line number → open file:line → fix
```

### Runtime errors
```bash
pnpm dev
# Watch console output (red errors)
# Check React DevTools (components tree)
# Check Network tab (API calls)
# Check Application tab (cookies/storage)
```

### Database issues
```bash
# Open Prisma Studio
cd apps/web && pnpm db:studio
# Browse tables, verify data, run queries
```

### tRPC issues
```bash
# Client call
await trpc.router.procedure.useQuery() / useMutation()

# Server check
# 1. Verify schema in routers/[name].ts
# 2. Verify procedure exists
# 3. Check auth (protectedProcedure checks session)
# 4. Check db call (correct table, fields match schema)
```

## CI/CD & Deployment

### Before Pushing
```bash
pnpm lint              # Code quality
pnpm type-check        # TypeScript
pnpm format            # Auto-format
git status             # No uncommitted changes
```

### Deploy Next.js to Vercel
- Automatic: push to main → Vercel deploys
- Check: vercel.com/dashboard

### Deploy Python to Railway
- Automatic: push to main → GitHub Actions → Railway deploys
- Check: railway.app/dashboard

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Type errors in mutations | Check Prisma schema, ensure Zod matches |
| 404 on route | Verify file in app/ directory, use exact path |
| Auth failing | Check NextAuth config, verify DATABASE_URL |
| tRPC returning undefined | Ensure procedure returns value, not void |
| Prisma can't connect | Check DATABASE_URL format, test with `psql` |
| Styles not applying | Check Tailwind config, verify classes in className |

## Do's and Don'ts

✅ DO
- Read error messages carefully
- Check git log before starting
- Test in browser after code change
- Commit small, focused changes
- Update MEMORY.md when done

❌ DON'T
- Force push to main
- Commit .env files
- Use `any` type (use proper types)
- Leave console.log in production code
- Break existing functionality for new features

## When Stuck

1. **Type error:** Read full error → find file:line → Read file
2. **Runtime error:** Check browser console → check server logs → git log (what changed?)
3. **Feature unclear:** Read plan file → check Prisma schema → check existing routers
4. **Performance issue:** Check React DevTools (re-renders) → check Network tab (bundle size)
5. **Unclear direction:** Check MEMORY.md (Next Steps) → check plan (current Phase) → ask

## Questions?

Update MEMORY.md with blockers. Next session will read it first.
