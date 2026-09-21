# Nexurops Web Application

Next.js 14 application with tRPC, NextAuth.js, and Prisma for type-safe API development.

## Architecture

- **Framework**: Next.js 14 (App Router)
- **API Layer**: tRPC v10 for end-to-end type safety
- **Authentication**: NextAuth.js with Prisma adapter
- **Database**: PostgreSQL with Prisma ORM
- **Payment**: Stripe integration
- **External Integration**: LinkedIn bot via webhooks

## Project Structure

```
src/
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── db.ts                      # Prisma client
│   └── trpc/
│       ├── server.ts              # tRPC router factory
│       ├── client.ts              # tRPC client for React
│       ├── context.ts             # tRPC context
│       └── routers/
│           ├── index.ts           # Root router
│           ├── auth.ts            # Auth procedures
│           ├── clients.ts         # Client CRUD
│           ├── projects.ts        # Project CRUD
│           ├── invoices.ts        # Invoice CRUD
│           └── linkedin.ts        # LinkedIn bot integration
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth endpoints
│   │   ├── trpc/[trpc]/          # tRPC endpoints
│   │   ├── webhooks/             # Webhook handlers
│   │   └── health/               # Health check
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
└── middleware.ts                 # Auth + rate limiting
```

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up database**:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

4. **Run development server**:
   ```bash
   pnpm dev
   ```

## API Routes

### tRPC Procedures

All procedures are accessible via `/api/trpc`:

**Auth Router** (`auth.*`):
- `getCurrentUser()` - Get current authenticated user
- `getSession()` - Get session (public)

**Clients Router** (`clients.*`):
- `list({ page, limit, status? })` - List clients with pagination
- `getById({ id })` - Get client by ID
- `create({ name, company, email, phone? })` - Create new client
- `update({ id, ...data })` - Update client
- `delete({ id })` - Delete client (admin only)

**Projects Router** (`projects.*`):
- `list({ page, limit, clientId?, status? })` - List projects
- `getById({ id })` - Get project by ID
- `create({ title, budget, clientId, ... })` - Create project
- `updateStatus({ id, status })` - Update project status
- `update({ id, ...data })` - Update project

**Invoices Router** (`invoices.*`):
- `list({ page, limit, clientId?, status? })` - List invoices
- `getById({ id })` - Get invoice by ID
- `create({ clientId, amount, dueDate })` - Create invoice
- `pay({ id, paymentIntentId? })` - Mark invoice as paid

**LinkedIn Router** (`linkedin.*`):
- `generatePost({ topic?, tone?, length? })` - Generate LinkedIn post (admin)
- `publishPost({ text, scheduledAt? })` - Publish post (admin)
- `getAnalytics({ startDate, endDate, postId? })` - Get analytics (admin)
- `listPosts({ page, limit })` - List published posts

### Webhook Endpoints

**Stripe** (`/api/webhooks/stripe`):
- Handles `payment_intent.succeeded` - Creates project on successful payment
- Handles `payment_intent.payment_failed` - Cancels order on failed payment

**LinkedIn** (`/api/webhooks/linkedin`):
- Handles `post.published` - Creates post record
- Handles `post.updated` - Updates post metrics
- Handles `post.deleted` - Removes post record

### Health Check

**Endpoint**: `/api/health`

Returns service health status:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": true,
    "cache": true,
    "external": true
  },
  "version": "1.0.0"
}
```

## Authentication

### Providers

1. **Google OAuth** - Social login via Google
2. **GitHub OAuth** - Social login via GitHub
3. **Credentials** - Email/password for admin users

### Protected Routes

- `/client/*` - Requires authentication, CLIENT role or higher
- `/admin/*` - Requires authentication, ADMIN role or higher

### Middleware

- **Authentication**: Redirects unauthenticated users to `/auth/signin`
- **Authorization**: Enforces role-based access control
- **Rate Limiting**: 1000 requests per hour per IP

## Type Safety

All API calls are fully type-safe from client to server:

```typescript
// Client-side usage
import { trpc } from "@/lib/trpc/client";

function ClientList() {
  const { data, isLoading } = trpc.clients.list.useQuery({
    page: 1,
    limit: 10,
  });
  
  // data is fully typed!
  return (
    <ul>
      {data?.items.map((client) => (
        <li key={client.id}>{client.name}</li>
      ))}
    </ul>
  );
}
```

## Error Handling

All errors follow a consistent format:

```typescript
{
  code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | ...,
  message: "Human-readable error message",
  details?: { ... },
  timestamp: Date
}
```

## Environment Variables

See `.env.example` for all required variables:
- Database connection
- NextAuth.js configuration
- OAuth provider credentials
- Stripe keys
- LinkedIn bot configuration

## Development

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

### Database Commands
```bash
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run migrations
pnpm db:push        # Push schema changes
pnpm db:studio      # Open Prisma Studio
pnpm db:seed        # Seed database
pnpm db:reset       # Reset database
```

## Security Features

- ✅ HTTP-only JWT sessions
- ✅ CSRF protection (NextAuth.js built-in)
- ✅ Rate limiting (1000 req/hour per IP)
- ✅ Role-based access control
- ✅ Webhook signature verification
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React automatic escaping)

## Production Checklist

- [ ] Set `NEXTAUTH_SECRET` to a secure random string
- [ ] Configure OAuth providers with production URLs
- [ ] Set up Stripe webhook endpoints
- [ ] Configure LinkedIn bot webhook secret
- [ ] Set up Redis for rate limiting (replace in-memory store)
- [ ] Enable SSL/TLS
- [ ] Set up monitoring and logging
- [ ] Configure CORS policies
- [ ] Set up database backups
- [ ] Configure CDN for static assets
