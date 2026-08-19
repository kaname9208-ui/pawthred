import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/data/orders";
import type Stripe from "stripe";

export const runtime = "nodejs";

function stripeAddressToOrderAddress(address: any) {
  if (!address) return undefined;
  return {
    line1: address.line1 || undefined,
    line2: address.line2 || undefined,
    city: address.city || undefined,
    state: address.state || undefined,
    postalCode: address.postal_code || undefined,
    country: address.country || undefined,
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 }
    );
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(secret);

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.warn("Stripe webhook completed without orderId metadata:", session.id);
      return NextResponse.json({ received: true });
    }

    await markOrderPaid(orderId, {
      sessionId: session.id,
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
      email: session.customer_details?.email || session.customer_email || undefined,
      customerName: session.customer_details?.name || undefined,
      phone: session.customer_details?.phone || undefined,
      shippingAddress: stripeAddressToOrderAddress(session.customer_details?.address),
      paidAt: new Date().toISOString(),
      status: "paid",
    });
  }

  return NextResponse.json({ received: true });
}
