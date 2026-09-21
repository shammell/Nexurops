import { router, publicProcedure, protectedProcedure } from "../server";

export const authRouter = router({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),

  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
});
