import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LinkedInWebhookPayload } from "@nexurops/types";

const WEBHOOK_SECRET = process.env.LINKEDIN_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  // Verify webhook signature
  const signature = req.headers.get("x-linkedin-signature");
  
  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 401 }
    );
  }

  // TODO: Implement proper signature verification
  // For now, using simple token comparison
  if (signature !== WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  try {
    const payload: LinkedInWebhookPayload = await req.json();

    switch (payload.event) {
      case "post.published": {
        // Create or update LinkedIn post record
        await db.linkedInPost.upsert({
          where: { url: payload.url },
          create: {
            url: payload.url,
            text: "", // Will be populated by the bot
            impressions: payload.metrics?.impressions || 0,
            likes: payload.metrics?.likes || 0,
            comments: payload.metrics?.comments || 0,
            shares: payload.metrics?.shares || 0,
            engagementRate: 0,
            publishedAt: payload.timestamp,
          },
          update: {
            impressions: payload.metrics?.impressions || 0,
            likes: payload.metrics?.likes || 0,
            comments: payload.metrics?.comments || 0,
            shares: payload.metrics?.shares || 0,
            engagementRate:
              payload.metrics && payload.metrics.impressions > 0
                ? ((payload.metrics.likes +
                    payload.metrics.comments +
                    payload.metrics.shares) /
                    payload.metrics.impressions) *
                  100
                : 0,
          },
        });
        break;
      }

      case "post.updated": {
        // Update LinkedIn post metrics
        if (payload.metrics) {
          await db.linkedInPost.update({
            where: { url: payload.url },
            data: {
              impressions: payload.metrics.impressions,
              likes: payload.metrics.likes,
              comments: payload.metrics.comments,
              shares: payload.metrics.shares,
              engagementRate:
                payload.metrics.impressions > 0
                  ? ((payload.metrics.likes +
                      payload.metrics.comments +
                      payload.metrics.shares) /
                      payload.metrics.impressions) *
                    100
                  : 0,
            },
          });
        }
        break;
      }

      case "post.deleted": {
        // Mark post as deleted or remove it
        await db.linkedInPost.delete({
          where: { url: payload.url },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${payload.event}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error processing LinkedIn webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
