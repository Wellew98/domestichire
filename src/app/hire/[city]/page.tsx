import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllWorkers, countWorkers } from "@/lib/db";
import WorkerCard from "@/components/workers/WorkerCard";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://domestichire-psi.vercel.app";

const CITY_NAMES: Record<string, string> = {
  harare: "Harare",
  bulawayo: "Bulawayo",
  mutare: "Mutare",
  gweru: "Gweru",
  chitungwiza: "Chitungwiza",
  masvingo: "Masvingo",
  kwekwe: "Kwekwe",
  kadoma: "Kadoma",
};

const CATEGORY_LABELS: Record<string, string> = {
  maid: "Maids",
  nanny: "Nannies",
  driver: "Drivers",
  gardener: "Gardeners",
  cook: "Cooks",
  chef: "Chefs",
  cleaner: "Cleaners",
  nurse_aide: "Nurse Aides",
  laundry: "Laundry Helpers",
};

const WHATSAPP = "+263770000000"; // TODO: Phase 0

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = CITY_NAMES[city.toLowerCase()];
  if (!cityName) return { title: "City Not Found" };

  const title = `Domestic Workers in ${cityName}, Zimbabwe — Maids, Nannies & More`;
  const description = `Find trusted domestic workers in ${cityName}. Browse profiles of maids, nannies, drivers, gardeners, cooks, cleaners, and nurse aides. Pay once, get direct contact.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/hire/${city}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/hire/${city}`,
    },
  };
}

export default async function CityWorkersPage({ params }: Props) {
  const { city } = await params;
  const cityName = CITY_NAMES[city.toLowerCase()];
  if (!cityName) notFound();

  const [workers, total] = await Promise.all([
    getAllWorkers({ location: cityName, limit: 50 }),
    countWorkers({ location: cityName }),
  ]);

  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi! I'm looking for domestic workers in ${cityName}.`)}`;

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: `Domestic Workers in ${cityName}`, url: `${BASE_URL}/hire/${city}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} id="breadcrumb-schema" />

      {/* City Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Domestic Workers in {cityName}, Zimbabwe
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Browse {total > 0 ? `${total} ` : ""}verified profiles of maids, nannies, drivers, gardeners,
            cooks, cleaners, and nurse aides in {cityName}. Pay a one-time placement fee and get direct contact access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/workers"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors"
            >
              🔍 Browse All Workers
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Workers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {workers.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {total} Worker{total !== 1 ? "s" : ""} in {cityName}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workers.map((worker: any) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No workers yet in {cityName}</h2>
            <p className="text-gray-500 mb-6">
              We're expanding to {cityName} soon. Check back or browse workers in other cities.
            </p>
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors"
            >
              Browse All Workers
            </Link>
          </div>
        )}

        {/* Other Cities */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Also hiring in:</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CITY_NAMES)
              .filter(([slug]) => slug !== city.toLowerCase())
              .map(([slug, name]) => (
                <Link
                  key={slug}
                  href={`/hire/${slug}`}
                  className="bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {name} →
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Hiring Domestic Workers in {cityName} — FAQ
        </h2>
        <div className="space-y-6">
          <FaqItem
            q={`How do I hire a domestic worker in ${cityName}?`}
            a={`Browse worker profiles on this page, select the one that matches your needs, pay the one-time placement fee securely via Paystack, and get immediate access to their phone number, WhatsApp, and email.`}
          />
          <FaqItem
            q="How much does it cost?"
            a={`The placement fee equals one month of the worker's expected salary — displayed on each profile. It's a one-time fee. There are no recurring charges or hidden costs.`}
          />
          <FaqItem
            q="Are the workers verified?"
            a="Yes. Every worker profile on DomesticHire is reviewed before listing. We verify work history, references, and identity documents where applicable."
          />
          <FaqItem
            q={`What categories are available in ${cityName}?`}
            a={`We have maids, nannies, drivers, gardeners, cooks, chefs, cleaners, and nurse aides available across Zimbabwe, including ${cityName}. Use the filters on the main Workers page to narrow by category.`}
          />
          <FaqItem
            q="How do I pay?"
            a="We use Paystack — a secure payment platform. You can pay with mobile money (EcoCash, OneMoney), bank card, or bank transfer. Your payment is protected."
          />
        </div>
      </section>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
      <p className="text-gray-600 text-sm">{a}</p>
    </div>
  );
}
