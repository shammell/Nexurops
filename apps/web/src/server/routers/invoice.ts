import { router, protectedProcedure } from '../../lib/trpc/server'
import { z } from 'zod'
import type { Invoice } from '@/types'

export const invoiceRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }): Promise<Invoice[]> => {
    // TODO: Replace with actual database query
    return [
      {
        id: '1',
        invoiceNumber: 'INV-001',
        amount: 2500,
        status: 'paid',
        dueDate: new Date('2026-09-15'),
        paidAt: new Date('2026-09-14'),
        projectId: '1',
        projectName: 'LinkedIn Content Automation',
        pdfUrl: '/invoices/INV-001.pdf',
      },
      {
        id: '2',
        invoiceNumber: 'INV-002',
        amount: 1500,
        status: 'pending',
        dueDate: new Date('2026-10-01'),
        projectId: '1',
        projectName: 'LinkedIn Content Automation',
        pdfUrl: '/invoices/INV-002.pdf',
      },
      {
        id: '3',
        invoiceNumber: 'INV-003',
        amount: 3200,
        status: 'overdue',
        dueDate: new Date('2026-09-20'),
        projectId: '2',
        projectName: 'AI Chatbot Integration',
        pdfUrl: '/invoices/INV-003.pdf',
      },
    ]
  }),

  createCheckoutSession: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .mutation(async ({ input }) => {
      // TODO: Integrate with Stripe
      return {
        checkoutUrl: `https://checkout.stripe.com/pay/${input.invoiceId}`,
      }
    }),
})
