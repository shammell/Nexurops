# PhD-Level Diagnostic Report - Nexurops Platform

**Date:** 2026-09-22
**Status:** Type-check ✅ | Database ❌ | Auth ❌ | tRPC ⚠️

---

## Layer 1: CRITICAL BLOCKERS (Severity: P0)

### Database Connection
- **Issue:** DATABASE_URL = dummy localhost value
- **Impact:** All tRPC mutations fail silently (mock fallback hides errors)
- **Root Cause:** .env.local not configured with real Supabase/PostgreSQL
- **Fix:** Set DATABASE_URL to real connection string
- **Blocker for:** Everything (CRUD, queries, auth user creation)

### Migrations Not Applied
- **Issue:** Prisma schema exists but not deployed to database
- **Impact:** Table structure mismatch between code + database
- **Root Cause:** `pnpm db:push` never run
- **Fix:** Run `pnpm db:generate && pnpm db:push`
- **Blocker for:** Database queries (will fail with "relation not found")

### Auth User Creation
- **Issue:** NextAuth configured but user creation not wired to database
- **Impact:** Session exists but no User row in DB
- **Root Cause:** No `callback` in NextAuth config to create user on login
- **Fix:** Add `session` callback to create/upsert user record
- **Blocker for:** All protected routes (session.user exists but DB queries fail)

---

## Layer 2: Type System Issues (Severity: P1)

### tRPC Type Inference Broken
- **File:** `apps/web/src/app/(admin)/clients/components/ClientsTable.tsx:75`
- **Issue:** Using `(trpc as any)` - type safety lost
- **Root Cause:** createTRPCNext not inferring nested routers (`clients.list`, etc)
- **Impact:** Client-side tRPC calls have no type validation
- **Fix:** Export AppRouter type + re-export from client.ts + use proper typing
- **Priority:** High (silent errors possible)

### Session User Type
- **Files:** Multiple routers (projects.ts:101, invoices.ts:87, clients.ts:etc)
- **Issue:** `(ctx.session.user as any).id` - casting away type safety
- **Root Cause:** Session type not properly typed from NextAuth
- **Fix:** Extend NextAuth types or use strict session type
- **Priority:** Medium (potential runtime errors)

---

## Layer 3: Incomplete Routers (Severity: P2)

### Projects Router Missing Delete
- **File:** `apps/web/src/lib/trpc/routers/projects.ts`
- **Missing:** `delete` mutation
- **Impact:** Can't delete projects from UI
- **Fix:** Add delete procedure (same pattern as clients.delete)

### No Teams Router
- **File:** Missing entirely
- **Expected:** `apps/web/src/lib/trpc/routers/teams.ts`
- **Procedures Needed:** list, create, update, delete, addMember, removeMember
- **Impact:** Team management page has no backend
- **Fix:** Create router + add to appRouter

### No Payments Router
- **File:** Missing entirely
- **Expected:** `apps/web/src/lib/trpc/routers/payments.ts`
- **Procedures Needed:** list, getBalance, webhook (Stripe)
- **Impact:** Payments dashboard has no data
- **Fix:** Create router + integrate Stripe

---

## Layer 4: UI/Component Issues (Severity: P2)

### Missing shadcn Components
- **Missing:** Dialog, Input, Label, AlertDialog, Table, Button, Badge
- **Currently:** Hand-built HTML modals
- **Impact:** Styling inconsistent, accessibility issues
- **Fix:** Run `npx shadcn-ui@latest add [component]` for each
- **Priority:** Low (functional but unmaintainable)

### No Edit Modal Wired
- **File:** `apps/web/src/app/(admin)/clients/components/ClientsTable.tsx:160`
- **Issue:** Edit button exists but modal not implemented
- **Impact:** Can't edit clients from UI
- **Fix:** Create EditClientModal.tsx + wire to clients.update mutation

---

## Layer 5: Missing Features (Severity: P3)

### No Delete Mutation for Projects
- See Layer 3

### No Delete Mutation for Invoices
- **File:** `apps/web/src/lib/trpc/routers/invoices.ts`
- **Issue:** No delete procedure
- **Fix:** Add `delete` mutation

### LinkedIn Bot Router Incomplete
- **File:** `apps/web/src/lib/trpc/routers/linkedin.ts`
- **Status:** Skeleton only (no actual procedures)
- **Blocker:** Phase 5 (FastAPI integration)

---

## Dependency Graph: What Blocks What

```
DATABASE_URL 
  ├─ Migrations (db:push)
  │   ├─ tRPC mutations (create, update, delete)
  │   ├─ Auth user creation
  │   └─ All queries
  ├─ Auth system
  │   ├─ Session token
  │   └─ Protected routes
  └─ tRPC queries
      ├─ Clients list/get
      ├─ Projects list/get
      └─ Invoices list/get

tRPC Type System
  ├─ Client-side validation
  ├─ IDE autocomplete
  └─ Early error detection

Teams Router
  └─ Team management page

Projects Delete
  └─ Project deletion feature

Payments Router
  └─ Payments dashboard
```

---

## Fix Priority Order (Highest → Lowest)

### Phase 1: Unblock Database (1 hour)
1. **Set DATABASE_URL** → Real Supabase/PostgreSQL
2. **Run migrations** → `pnpm db:push`
3. **Wire auth user creation** → NextAuth callback
4. **Test CRUD end-to-end** → Create/read/update/delete client

### Phase 2: Type Safety (1.5 hours)
1. **Fix tRPC type inference** → Export AppRouter type properly
2. **Type session.user** → Extend NextAuth types
3. **Remove all `as any` casts** → Use proper types

### Phase 3: Complete Routers (2 hours)
1. **Add projects.delete** → Deletion mutation
2. **Create teams router** → Full CRUD
3. **Create payments router** → List + Stripe integration
4. **Add invoices.delete** → Deletion mutation

### Phase 4: UI Components (1.5 hours)
1. **Install shadcn components** → Dialog, Input, Table, etc
2. **Wire edit modal** → EditClientModal.tsx
3. **Test all modals** → Create/edit/delete flow

### Phase 5: Features (Phase 4+ work)
1. **Projects kanban** → Drag-drop board
2. **Team management** → Full UI
3. **Payments dashboard** → Revenue chart
4. **LinkedIn bot controls** → Manual generation

---

## Test Checklist (Verify After Each Phase)

- [ ] Type-check passes: `pnpm type-check`
- [ ] Dev server runs: `pnpm dev` (12s startup)
- [ ] Admin clients page loads: http://localhost:3000/admin/clients
- [ ] Create client works: Form → DB → Table updated
- [ ] Read clients works: DB → List query → 4+ rows display
- [ ] Update client works: Form → DB → Row updated
- [ ] Delete client works: Dialog → DB → Row removed
- [ ] Auth session created: Login → User row in DB
- [ ] No `any` types in production code
- [ ] All tRPC calls type-safe (no `as any`)

---

## Known Workarounds (Temporary)

- Mock data fallback in ClientsTable (hides real errors)
- `(trpc as any)` type casts (unsafe)
- NextAuth dummy credentials (needs real provider)
- No role-based access control (needs auth middleware)

---

## Time Estimates (After DB Online)

| Phase | Task | Time |
|-------|------|------|
| 1 | Database setup | 1h |
| 2 | Type safety | 1.5h |
| 3 | Complete routers | 2h |
| 4 | UI components | 1.5h |
| **Total to Phase 4 complete** | **6h** |
| 5 | Projects/team/payments | 4-6h |
| **MVP Ready** | **10-12h** |

---

## Action Items for Next Session

1. **Verify DATABASE_URL is set** (user provides it)
2. **Run migrations** → `pnpm db:generate && pnpm db:push`
3. **Check Phase 1 checklist** → CRUD working
4. **Continue Phase 2** → Fix type system
5. **Update MEMORY.md** → Mark completed

