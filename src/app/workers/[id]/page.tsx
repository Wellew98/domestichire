import { notFound } from "next/navigation";
import Link from "next/link";
import { getWorkerById, getPaymentByEmployerAndWorker } from "@/lib/db";
import { getUser } from "@/lib/auth";

const CATEGORY_LABELS: Record<string, string> = {
  maid: "Maid", nanny: "Nanny", driver: "Driver", gardener: "Gardener",
  cleaner: "Cleaner", cook: "Cook", chef: "Chef", nurse_aide: "Nurse Aide", laundry: "Laundry Helper",
};

interface Props { params: Promise<{ id: string }> }

export default async function WorkerProfilePage({ params }: Props) {
  const { id } = await params;
  const workerId = parseInt(id);
  if (isNaN(workerId)) notFound();

  const worker = await getWorkerById(workerId);
  if (!worker) notFound();

  const categoryLabel = CATEGORY_LABELS[worker.category] || worker.category;
  const user = await getUser();
  let hasContactAccess = false;

  if (user && user.role === "employer") {
    const payment = await getPaymentByEmployerAndWorker(user.id, workerId);
    hasContactAccess = !!payment;
  }

  const skills: string[] = worker.skills || [];
  const languages: string[] = worker.languages || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/workers" className="text-sm text-blue-600 hover:underline">← Back to Workers</Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-32 h-32 bg-blue-200 rounded-xl flex items-center justify-center text-5xl text-blue-400 flex-shrink-0 overflow-hidden">
            {worker.photo_url ? (
              <img src={worker.photo_url} alt={worker.name} className="w-full h-full object-cover" />
            ) : (
              worker.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{worker.name}</h1>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{categoryLabel}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${worker.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{worker.available ? "Available" : "Unavailable"}</span>
            </div>
            <p className="text-gray-500 mb-4">📍 {worker.location}, Bulawayo</p>
            <p className="text-gray-700">{worker.description}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem label="Experience" value={`${worker.experience_years} years`} />
          <DetailItem label="Placement Fee" value={`$${worker.expected_salary}`} />
          <DetailItem label="Arrangement" value={worker.live_in ? "Live-in" : "Live-out"} />
          <DetailItem label="Location" value={worker.location} />
          <div><h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1.5">{skills.map((s: string) => (<span key={s} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">{s}</span>))}</div>
          </div>
          <div><h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Languages</h4>
            <div className="flex flex-wrap gap-1.5">{languages.map((l: string) => (<span key={l} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full">{l}</span>))}</div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-8">
          {hasContactAccess ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 mb-3">✅ You have access to contact details</h3>
              <div className="space-y-2 text-green-800">
                <p>📱 Phone: <strong>{worker.phone}</strong></p>
                <p>💬 WhatsApp: <strong>{worker.whatsapp}</strong></p>
                <p>📧 Email: <strong>{worker.email}</strong></p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gray-100 rounded-xl p-6 mb-4">
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-gray-600 font-medium mb-1">Contact details are locked</p>
                <p className="text-sm text-gray-400">Pay the one-time $20 placement fee to unlock {worker.name}'s phone number, WhatsApp, and email.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/workers/${worker.id}/pay`} className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors">💳 Pay $20 — Unlock Contacts</Link>
                {!user && (<Link href="/auth/login" className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">Sign in to pay</Link>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return <div><h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</h4><p className="text-gray-900 font-medium">{value}</p></div>;
}
