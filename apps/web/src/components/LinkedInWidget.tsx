'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatNumber, formatDate } from '@/lib/utils'
import type { LinkedInAnalytics } from '@/types'
import { TrendingUp, Eye, Heart, MessageCircle, Share2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface LinkedInWidgetProps {
  analytics: LinkedInAnalytics
}

export function LinkedInWidget({ analytics }: LinkedInWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            LinkedIn Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-3xl font-bold">{formatNumber(analytics.totalImpressions)}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Total Impressions
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{analytics.avgEngagementRate}%</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Avg Engagement
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{analytics.postsPublished}</p>
              <p className="text-sm text-muted-foreground">Posts Published</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Recent Posts</h4>
            {analytics.recentPosts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-3 space-y-2 hover:bg-accent/50 transition-colors"
              >
                <p className="text-sm line-clamp-2">{post.text}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(post.publishedAt)}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(post.impressions)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      {post.shares}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-green-600">
                    {post.engagementRate}% engagement
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <Button className="w-full" variant="outline">
            View Full Analytics
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
