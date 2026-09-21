import { router, protectedProcedure, adminProcedure } from "../server";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const generatePostSchema = z.object({
  topic: z.string().optional(),
  tone: z.enum(["professional", "casual", "thought-leadership"]).optional(),
  length: z.enum(["short", "medium", "long"]).optional(),
  includeHashtags: z.boolean().optional(),
});

const publishPostSchema = z.object({
  clientId: z.string(),
  text: z.string().min(1),
  scheduledAt: z.date().optional(),
});

const getAnalyticsSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  postId: z.string().optional(),
});

export const linkedinRouter = router({
  generatePost: adminProcedure
    .input(generatePostSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Call LinkedIn bot API to generate post
      // For now, return mock data
      const response = await fetch(
        `${process.env.LINKEDIN_BOT_URL}/generate-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LINKEDIN_BOT_TOKEN}`,
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate post",
        });
      }

      const data = await response.json();
      return data;
    }),

  publishPost: adminProcedure
    .input(publishPostSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Call LinkedIn bot API to publish post
      const response = await fetch(
        `${process.env.LINKEDIN_BOT_URL}/publish-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LINKEDIN_BOT_TOKEN}`,
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to publish post",
        });
      }

      const data = await response.json();

      // Save post to database
      const post = await ctx.db.linkedInPost.create({
        data: {
          clientId: input.clientId,
          url: data.url,
          text: input.text,
          status: 'PUBLISHED',
          impressions: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          engagementRate: 0,
          publishedAt: data.publishedAt,
        },
      });

      return post;
    }),

  getAnalytics: adminProcedure
    .input(getAnalyticsSchema)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, postId } = input;

      if (postId) {
        // Get analytics for specific post
        const post = await ctx.db.linkedInPost.findUnique({
          where: { id: postId },
        });

        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        return post;
      }

      // Get aggregated analytics
      const posts = await ctx.db.linkedInPost.findMany({
        where: {
          publishedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const totalPosts = posts.length;
      const totalImpressions = posts.reduce(
        (sum, post) => sum + post.impressions,
        0
      );
      const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
      const totalComments = posts.reduce(
        (sum, post) => sum + post.comments,
        0
      );
      const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
      const averageEngagementRate =
        totalPosts > 0
          ? posts.reduce((sum, post) => sum + post.engagementRate, 0) /
            totalPosts
          : 0;

      return {
        totalPosts,
        totalImpressions,
        totalLikes,
        totalComments,
        totalShares,
        averageEngagementRate,
        period: {
          start: startDate,
          end: endDate,
        },
      };
    }),

  listPosts: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        ctx.db.linkedInPost.findMany({
          skip,
          take: limit,
          orderBy: { publishedAt: "desc" },
        }),
        ctx.db.linkedInPost.count(),
      ]);

      return {
        items: posts,
        metadata: {
          total,
          page,
          limit,
          hasMore: page * limit < total,
        },
      };
    }),
});
