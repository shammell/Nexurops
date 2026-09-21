import { router, protectedProcedure, adminProcedure } from "../server";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ClientStatus } from "@prisma/client";

const createClientSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
});

const updateClientSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  status: z.nativeEnum(ClientStatus).optional(),
});

export const clientsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z.nativeEnum(ClientStatus).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, status } = input;
      const skip = (page - 1) * limit;

      const where = {
        userId: (ctx.session.user as any).id,
        ...(status && { status }),
      };

      const [clients, total] = await Promise.all([
        ctx.db.client.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        ctx.db.client.count({ where }),
      ]);

      return {
        items: clients,
        metadata: {
          total,
          page,
          limit,
          hasMore: page * limit < total,
        },
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findUnique({
        where: { id: input.id },
      });

      if (!client) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      }

      if (client.userId !== (ctx.session.user as any).id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return client;
    }),

  create: protectedProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.create({
        data: {
          name: input.name,
          company: input.company,
          email: input.email,
          phone: input.phone,
          userId: (ctx.session.user as any).id,
        },
      });

      return client;
    }),

  update: protectedProcedure
    .input(updateClientSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existingClient = await ctx.db.client.findUnique({
        where: { id },
      });

      if (!existingClient) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      }

      if (existingClient.userId !== (ctx.session.user as any).id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const client = await ctx.db.client.update({
        where: { id },
        data,
      });

      return client;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.client.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
