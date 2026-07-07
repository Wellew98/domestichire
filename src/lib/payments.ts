// Payment service — Paystack integration
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE = "https://api.paystack.co";

export interface InitializePaymentParams {
  email: string;
  amount: number; // in base currency unit (e.g. USD dollars, NOT cents)
  reference: string;
  metadata?: Record<string, any>;
  callback_url?: string;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  } | null;
}

export async function initializePayment(
  params: InitializePaymentParams
): Promise<PaystackResponse> {
  // If no Paystack key is set, return a simulated success for development
  if (!PAYSTACK_SECRET) {
    return {
      status: true,
      message: "Payment simulated (no PAYSTACK_SECRET_KEY)",
      data: {
        authorization_url: `/api/payments/verify?reference=${params.reference}`,
        access_code: "SIMULATED",
        reference: params.reference,
      },
    };
  }

  const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100), // Paystack uses kobo/cents
      reference: params.reference,
      metadata: params.metadata,
      callback_url: params.callback_url,
    }),
  });

  return response.json();
}

export async function verifyPayment(reference: string): Promise<{
  status: boolean;
  data: { status: string; amount: number; reference: string } | null;
}> {
  if (!PAYSTACK_SECRET) {
    return {
      status: true,
      data: { status: "success", amount: 0, reference },
    };
  }

  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    }
  );

  return response.json();
}
