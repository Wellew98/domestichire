import { notFound, redirect } from "next/navigation";
import { getWorkerById, getPaymentByEmployerAndWorker, insertPayment, getEmployerByEmail } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { initializePayment } from "@/lib/payments";
import Link from "next/link";

interface Props { params: Promise<{ id: string }>; }

export default async function PayWorkerPage({ params }: Props) {
  const { id } = await params;
  const workerId = parseInt(id);
  if (isNaN(workerId)) notFound();

  const worker = await getWorkerById(workerId);
  if (!worker) notFound();

  // Require auth
  let user;
  try { user = await requireAuth(); } catch {
    redirect(`/auth/login?redirect=/workers/${workerId}/pay`);
  }

  // Check if already paid
  if (await getPaymentByEmployerAndWorker(user.id, workerId)) {
    redirect(`/workers/${workerId}`);
  }

  // Get employer email for Paystack
  const employer = getEmployerByEmail(user.email);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Payment</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
            {worker.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{worker.name}</p>
            <p className="text-sm text-gray-500 capitalize">{worker.category.replace("_", " ")}</p>
          </div>
        </div>
        <div className="flex justify-between py-4 border-b border-gray-100">
          <span className="text-gray-600">Placement Fee</span>
          <span className="font-semibold text-gray-900">${worker.expected_salary}</span>
        </div>
        <div className="flex justify-between py-4">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-semibold text-blue-700 text-lg">${worker.expected_salary}</span>
        </div>
      </div>

      {/* Pay Button */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            💳 You&apos;ll be redirected to <strong>Paystack</strong> to complete your payment securely.
            After payment, you&apos;ll immediately gain access to {worker.name}&apos;s contact details.
          </p>
        </div>

        <form action={initPaystackPayment.bind(null, workerId, user.id, worker.expected_salary, employer?.email || user.email)}>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-semibold py-4 rounded-xl hover:bg-blue-800 transition-colors text-lg"
          >
            💳 Pay ${worker.expected_salary} via Paystack
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-3">
          Secured by Paystack. Your payment information is encrypted.
        </p>
      </div>

      <p className="text-center text-sm text-gray-400 mt-6">
        <Link href={`/workers/${workerId}`} className="hover:underline">← Back to profile</Link>
      </p>
    </div>
  );
}

async function initPaystackPayment(
  workerId: number, employerId: number, amount: number, email: string,
  _formData: FormData
) {
  "use server";

  const paymentRef = `DH-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Save pending payment to DB
  await insertPayment({
    employer_id: employerId,
    worker_id: workerId,
    amount,
    currency: "USD",
    status: "pending",
    payment_ref: paymentRef,
    paystack_ref: null,
  });

  // Initialize Paystack payment
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const result = await initializePayment({
    email,
    amount,
    reference: paymentRef,
    metadata: { worker_id: workerId, employer_id: employerId },
    callback_url: `${appUrl}/api/payments/verify?reference=${paymentRef}`,
  });

  if (result.status && result.data?.authorization_url) {
    redirect(result.data.authorization_url);
  }

  // Fallback: redirect to direct verify for simulated payments
  redirect(`/api/payments/verify?reference=${paymentRef}`);
}
