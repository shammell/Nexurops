import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { OrderStatus, ProjectStatus } from "@prisma/client";

// Created per request so a missing key can't crash the build or module load.
// Payments currently run through Wise/Payoneer invoices; Stripe is optional.
function getStripe(): { stripe: Stripe; webhookSecret: string } | null {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !webhookSecret) return null;
  return { stripe: new Stripe(key, { apiVersion: "2023-10-16" }), webhookSecret };
}

export async function POST(req: NextRequest) {
  const config = getStripe();
  if (!config) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }
  const { stripe, webhookSecret } = config;

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Find order by invoice ID
        const order = await db.order.findFirst({
          where: {
            stripeInvoiceId: paymentIntent.id,
          },
        });

        if (!order) {
          console.warn(`No order found for payment intent: ${paymentIntent.id}`);
          break;
        }

        // Update order status
        await db.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.COMPLETED },
        });

        // Create project for completed order
        await db.project.create({
          data: {
            title: `Project for Order ${order.id}`,
            status: ProjectStatus.BACKLOG,
            budget: order.totalAmount,
            clientId: order.clientId,
          },
        });

        console.log(`Order ${order.id} completed and project created`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const result = await db.order.updateMany({
          where: {
            stripeInvoiceId: paymentIntent.id,
          },
          data: { status: OrderStatus.CANCELLED },
        });

        if (result.count === 0) {
          console.warn(`No order found for failed payment: ${paymentIntent.id}`);
        } else {
          console.log(`Order cancelled for failed payment: ${paymentIntent.id}`);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
