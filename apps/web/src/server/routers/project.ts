import { router, protectedProcedure } from '../../lib/trpc/server'
import { z } from 'zod'
import type { Project } from '@/types'

export const projectRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }): Promise<Project[]> => {
    // TODO: Replace with actual database query
    const userId = (ctx.session?.user as any)?.id || '';
    return [
      {
        id: '1',
        name: 'LinkedIn Content Automation',
        description: 'Build AI-powered LinkedIn content system',
        status: 'active',
        progress: 65,
        budgetUsed: 3500,
        budgetTotal: 5000,
        startDate: new Date('2026-09-01'),
        clientId: userId,
        teamMembers: [
          { id: '1', name: 'John Doe', avatar: '', role: 'Developer' },
          { id: '2', name: 'Jane Smith', avatar: '', role: 'Designer' },
        ],
        milestones: [],
      },
    ]
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }): Promise<Project | null> => {
      // TODO: Replace with actual database query
      return {
        id: input.id,
        name: 'LinkedIn Content Automation',
        description: 'Build AI-powered LinkedIn content system with automated posting',
        status: 'active',
        progress: 65,
        budgetUsed: 3500,
        budgetTotal: 5000,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-10-15'),
        clientId: '1',
        teamMembers: [
          { id: '1', name: 'John Doe', avatar: '', role: 'Senior Developer' },
          { id: '2', name: 'Jane Smith', avatar: '', role: 'UI/UX Designer' },
          { id: '3', name: 'Bob Wilson', avatar: '', role: 'Project Manager' },
        ],
        milestones: [
          {
            id: '1',
            title: 'Phase 1: Infrastructure',
            description: 'Database schema, authentication, core setup',
            status: 'completed',
            dueDate: new Date('2026-09-10'),
            completedAt: new Date('2026-09-09'),
          },
          {
            id: '2',
            title: 'Phase 2: Content Engine',
            description: 'AI integration, post generation, humanization',
            status: 'in-progress',
            dueDate: new Date('2026-09-25'),
          },
          {
            id: '3',
            title: 'Phase 3: Analytics & Learning',
            description: 'Performance tracking, insights, memory system',
            status: 'pending',
            dueDate: new Date('2026-10-10'),
          },
        ],
      }
    }),
})
