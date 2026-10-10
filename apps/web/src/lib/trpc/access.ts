import { UserRole } from "@nexurops/types";

type SessionCtx = { session: { user?: unknown } | null };

export type SessionUser = { id: string; role?: string };

/** Typed access to the NextAuth session user (id/role are added in lib/auth.ts callbacks). */
export function sessionUser(ctx: SessionCtx): SessionUser {
  const u = ctx.session?.user as Partial<SessionUser> | undefined;
  return { id: u?.id ?? "", role: u?.role };
}

export function isAdminRole(role: string | undefined): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
}

/**
 * Prisma `where` fragment for models that have a `client` relation (Project, Invoice).
 * Admins see everything; everyone else only rows whose client they own.
 * Using this in findFirst/findMany (rather than fetch-then-compare) means unauthorized
 * rows are indistinguishable from missing ones (NOT_FOUND, no existence leak).
 */
export function ownedByClientUser(ctx: SessionCtx): { client?: { userId: string } } {
  const { id, role } = sessionUser(ctx);
  return isAdminRole(role) ? {} : { client: { userId: id } };
}
