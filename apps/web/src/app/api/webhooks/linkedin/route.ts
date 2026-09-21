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
        // Validate clientId
        const client = await db.client.findUnique({
          where: { id: payload.clientId },
        });

        if (!client) {
          console.error(`Client not found: ${payload.clientId}`);
          return NextResponse.json(
            { error: "Client not found" },
            { status: 404 }
          );
        }

        // Create or update LinkedIn post record
        const post = await db.linkedInPost.upsert({
          where: { url: payload.url },
          create: {
            clientId: payload.clientId,
            url: payload.url,
            text: "", // Will be populated by the bot
            status: "PUBLISHED",
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

        console.log(`LinkedIn post ${post.id} upserted for client ${payload.clientId}`);
        break;
      }

      case "post.updated": {
        // Update LinkedIn post metrics
        if (!payload.metrics) {
          console.warn(`No metrics provided for post update: ${payload.url}`);
          break;
        }

        try {
          const post = await db.linkedInPost.update({
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

          console.log(`LinkedIn post ${post.id} metrics updated`);
        } catch (error) {
          console.error(`Failed to update post ${payload.url}:`, error);
          return NextResponse.json(
            { error: "Post not found" },
            { status: 404 }
          );
        }

        break;
      }

      case "post.deleted": {
        // Mark post as deleted or remove it
        try {
          await db.linkedInPost.delete({
            where: { url: payload.url },
          });

          console.log(`LinkedIn post deleted: ${payload.url}`);
        } catch (error) {
          console.warn(`Post not found for deletion: ${payload.url}`);
        }

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
