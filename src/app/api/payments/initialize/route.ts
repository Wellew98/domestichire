import { NextRequest, NextResponse } from "next/server";
import { initializePayment } from "@/lib/payments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, reference, workerId, employerId, callback_url } = body;

    if (!email || !amount || !reference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await initializePayment({
      email,
      amount,
      reference,
      metadata: { worker_id: workerId, employer_id: employerId },
      callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/workers/${workerId}?paid=true`,
    });

    if (result.status) {
      return NextResponse.json({ authorization_url: result.data?.authorization_url, reference });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment init error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
