import { router, protectedProcedure } from '../trpc'
import type { DashboardStats } from '@/types'

export const dashboardRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }): Promise<DashboardStats> => {
    // TODO: Replace with actual database queries
    return {
      activeProjects: 5,
      unpaidInvoices: 2,
      postsPublished: 47,
      totalRevenue: 12500,
    }
  }),
})
