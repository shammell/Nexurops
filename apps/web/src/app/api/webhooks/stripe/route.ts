import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { OrderStatus, ProjectStatus } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
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

        await db.order.updateMany({
          where: {
            stripeInvoiceId: paymentIntent.id,
          },
          data: { status: OrderStatus.CANCELLED },
        });

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
