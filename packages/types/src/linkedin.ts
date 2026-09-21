/**
 * LinkedIn integration types
 */

export interface LinkedInPost {
  id: string;
  url: string;
  text: string;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkedInMetrics {
  totalPosts: number;
  totalImpressions: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagementRate: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface GeneratePostInput {
  topic?: string;
  tone?: "professional" | "casual" | "thought-leadership";
  length?: "short" | "medium" | "long";
  includeHashtags?: boolean;
}

export interface GeneratePostOutput {
  text: string;
  hashtags: string[];
  estimatedReach: number;
}

export interface PublishPostInput {
  text: string;
  scheduledAt?: Date;
}

export interface PublishPostOutput {
  postId: string;
  url: string;
  publishedAt: Date;
}

export interface GetAnalyticsInput {
  startDate: Date;
  endDate: Date;
  postId?: string;
}

export interface LinkedInWebhookPayload {
  event: "post.published" | "post.updated" | "post.deleted";
  postId: string;
  clientId: string;
  url: string;
  metrics?: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: Date;
}
