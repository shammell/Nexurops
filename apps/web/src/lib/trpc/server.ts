import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";
import { UserRole } from "@nexurops/types";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause &&
          typeof error.cause === "object" &&
          "issues" in error.cause
            ? error.cause.issues
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

/**
 * Admin procedure - requires ADMIN or SUPER_ADMIN role
 */
export const adminProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;
  const userRole = (ctx.session.user as any).role;

  if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return opts.next({
    ctx,
  });
});

/**
 * Super admin procedure - requires SUPER_ADMIN role
 */
export const superAdminProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;
  const userRole = (ctx.session.user as any).role;

  if (userRole !== UserRole.SUPER_ADMIN) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return opts.next({
    ctx,
  });
});
