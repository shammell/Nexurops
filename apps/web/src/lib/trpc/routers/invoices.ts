import { router, protectedProcedure, adminProcedure } from "../server";
import { ownedByClientUser } from "../access";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { InvoiceStatus } from "@prisma/client";

const createInvoiceSchema = z.object({
  clientId: z.string(),
  amount: z.number().positive(),
  dueDate: z.date(),
});

export const invoicesRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        clientId: z.string().optional(),
        status: z.nativeEnum(InvoiceStatus).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, clientId, status } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...ownedByClientUser(ctx),
        ...(clientId && { clientId }),
        ...(status && { status }),
      };

      const [invoices, total] = await Promise.all([
        ctx.db.invoice.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            client: true,
          },
        }),
        ctx.db.invoice.count({ where }),
      ]);

      return {
        items: invoices,
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
      const invoice = await ctx.db.invoice.findFirst({
        where: { id: input.id, ...ownedByClientUser(ctx) },
        include: {
          client: true,
        },
      });

      if (!invoice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found",
        });
      }

      return invoice;
    }),

  create: adminProcedure
    .input(createInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify client exists
      const client = await ctx.db.client.findUnique({
        where: { id: input.clientId },
      });

      if (!client) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      }

      // Generate invoice number
      const count = await ctx.db.invoice.count();
      const invoiceNumber = `INV-${String(count + 1).padStart(6, "0")}`;

      const invoice = await ctx.db.invoice.create({
        data: {
          clientId: input.clientId,
          invoiceNumber,
          amount: input.amount,
          tax: 0,
          totalAmount: input.amount,
          currency: 'USD',
          dueDate: input.dueDate,
        },
      });

      return invoice;
    }),

  // Manual mark-as-paid for staff (e.g. bank transfer). Client self-service payment must go
  // through Stripe + webhook verification, never a client-callable mutation.
  pay: adminProcedure
    .input(
      z.object({
        id: z.string(),
        paymentIntentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findUnique({
        where: { id: input.id },
      });

      if (!invoice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found",
        });
      }

      if (invoice.status === InvoiceStatus.PAID) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invoice already paid",
        });
      }

      const updatedInvoice = await ctx.db.invoice.update({
        where: { id: input.id },
        data: {
          status: InvoiceStatus.PAID,
          paidAt: new Date(),
        },
      });

      return updatedInvoice;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findUnique({
        where: { id: input.id },
      });

      if (!invoice) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      }

      await ctx.db.invoice.delete({
        where: { id: input.id },
      });

      return { id: input.id };
    }),
});
