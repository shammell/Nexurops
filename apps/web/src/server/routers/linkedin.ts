import { router, protectedProcedure } from '../../lib/trpc/server'
import type { LinkedInAnalytics } from '@/types'

export const linkedinRouter = router({
  getAnalytics: protectedProcedure.query(async ({ ctx }): Promise<LinkedInAnalytics> => {
    // TODO: Replace with actual LinkedIn API data
    return {
      totalImpressions: 127500,
      avgEngagementRate: 6.8,
      postsPublished: 47,
      recentPosts: [
        {
          id: '1',
          text: 'Building AI systems that scale: 5 lessons from production',
          publishedAt: new Date('2026-09-20'),
          impressions: 8400,
          likes: 214,
          comments: 38,
          shares: 21,
          engagementRate: 8.2,
        },
        {
          id: '2',
          text: 'Why RAG systems fail in production and how to fix them',
          publishedAt: new Date('2026-09-18'),
          impressions: 12100,
          likes: 387,
          comments: 52,
          shares: 34,
          engagementRate: 9.1,
        },
        {
          id: '3',
          text: 'From zero to $10K/month: my AI agency journey',
          publishedAt: new Date('2026-09-15'),
          impressions: 15600,
          likes: 562,
          comments: 89,
          shares: 47,
          engagementRate: 11.3,
        },
      ],
    }
  }),
})
