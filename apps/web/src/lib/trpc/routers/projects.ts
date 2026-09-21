import { router, protectedProcedure } from "../server";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ProjectStatus } from "@prisma/client";

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  budget: z.number().positive().optional().nullable(),
  clientId: z.string(),
  orderId: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  deadline: z.date().optional().nullable(),
});

const updateProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).optional(),
  budget: z.number().positive().optional().nullable(),
  startDate: z.date().optional().nullable(),
  deadline: z.date().optional().nullable(),
});

export const projectsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        clientId: z.string().optional(),
        status: z.nativeEnum(ProjectStatus).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, clientId, status } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(clientId && { clientId }),
        ...(status && { status }),
      };

      const [projects, total] = await Promise.all([
        ctx.db.project.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            client: true,
          },
        }),
        ctx.db.project.count({ where }),
      ]);

      return {
        items: projects,
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
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          client: true,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify client exists and belongs to user
      const client = await ctx.db.client.findUnique({
        where: { id: input.clientId },
      });

      if (!client) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      }

      if (client.userId !== (ctx.session.user as any).id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const project = await ctx.db.project.create({
        data: {
          title: input.title,
          description: input.description,
          budget: input.budget,
          clientId: input.clientId,
          orderId: input.orderId,
          startDate: input.startDate,
          deadline: input.deadline,
        },
      });

      return project;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(ProjectStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      return project;
    }),

  update: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const project = await ctx.db.project.update({
        where: { id },
        data,
      });

      return project;
    }),
});
