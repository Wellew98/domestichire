import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPayment } from "@/lib/payments";
import { updatePaymentStatus, getPaymentByRef } from "@/lib/db";
import { sendPaymentConfirmation, sendAdminNotification } from "@/lib/notifications";
import { getEmployerById } from "@/lib/db";
import { getWorkerById } from "@/lib/db";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  // Verify with Paystack
  const result = await verifyPayment(reference);

  if (result.status && result.data?.status === "success") {
    // Update payment status in DB
    await updatePaymentStatus(reference, "completed");

    // Get payment details for notifications
    const payment = await getPaymentByRef(reference);
    if (payment) {
      const employer = await getEmployerById(payment.employer_id);
      const worker = await getWorkerById(payment.worker_id);

      if (employer && worker) {
        // Fire notifications (don't await — non-blocking)
        sendPaymentConfirmation(
          employer.email,
          employer.name,
          worker.name,
          payment.amount
        );
        sendAdminNotification(
          employer.name,
          worker.name,
          payment.amount,
          reference
        );
      }
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/workers/${payment?.worker_id}?paid=true`
    );
  }

  return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
}

// Paystack webhook
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";

  // Verify webhook signature
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
  if (PAYSTACK_SECRET) {
    const expectedSig = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(body)
      .digest("hex");
    if (signature !== expectedSig) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    updatePaymentStatus(reference, "completed");

    const payment = getPaymentByRef(reference);
    if (payment) {
      const employer = getEmployerById(payment.employer_id);
      const worker = getWorkerById(payment.worker_id);
      if (employer && worker) {
        sendPaymentConfirmation(employer.email, employer.name, worker.name, payment.amount);
        sendAdminNotification(employer.name, worker.name, payment.amount, reference);
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
