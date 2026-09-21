import { router } from '../trpc'
import { projectRouter } from './project'
import { invoiceRouter } from './invoice'
import { linkedinRouter } from './linkedin'
import { dashboardRouter } from './dashboard'

export const appRouter = router({
  dashboard: dashboardRouter,
  project: projectRouter,
  invoice: invoiceRouter,
  linkedin: linkedinRouter,
})

export type AppRouter = typeof appRouter
