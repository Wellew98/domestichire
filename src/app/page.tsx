import Link from "next/link";
import JsonLd, { organizationSchema, localBusinessSchema } from "@/components/JsonLd";

const CATEGORIES = [
  { key: "maid", label: "Maids", icon: "🧹", desc: "Household cleaning & chores" },
  { key: "nanny", label: "Nannies", icon: "👶", desc: "Childcare & babysitting" },
  { key: "driver", label: "Drivers", icon: "🚗", desc: "Personal & family driving" },
  { key: "gardener", label: "Gardeners", icon: "🌿", desc: "Landscaping & garden care" },
  { key: "cook", label: "Cooks", icon: "🍳", desc: "Daily meal preparation" },
  { key: "chef", label: "Chefs", icon: "👨‍🍳", desc: "Professional fine cooking" },
  { key: "cleaner", label: "Cleaners", icon: "✨", desc: "Deep cleaning services" },
  { key: "nurse_aide", label: "Nurse Aides", icon: "💊", desc: "Elderly & home care" },
];

const COVERAGE_CITIES = [
  { name: "Harare", slug: "harare" },
  { name: "Bulawayo", slug: "bulawayo" },
  { name: "Mutare", slug: "mutare" },
  { name: "Gweru", slug: "gweru" },
  { name: "Chitungwiza", slug: "chitungwiza" },
];

const WHATSAPP = "+263770000000"; // TODO: Phase 0 canon

export default function HomePage() {
  const waHire = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi! I'm looking to hire a domestic worker.")}`;
  const waGeneral = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi DomesticHire! I have a question.")}`;

  return (
    <>
      <JsonLd data={{ ...organizationSchema(), ...localBusinessSchema() }} id="org-schema" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Find Trusted Domestic Workers in Zimbabwe
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Browse verified profiles of maids, nannies, drivers, gardeners, cooks, and nurse aides.
            Pay a one-time placement fee and get direct contact access. Simple & transparent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/workers"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-amber-600 transition-colors text-lg"
            >
              🔍 Browse Workers
            </Link>
            <a
              href={waHire}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-600 transition-colors text-lg"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">✅</span>
              <span>Verified Workers</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🔒</span>
              <span>Secure Paystack Payments</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">💰</span>
              <span>One-Time Fee Only</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">📞</span>
              <span>Direct Contact Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Browse", desc: "Explore worker profiles by category or city" },
              { step: "2", title: "Select", desc: "Pick your preferred helper" },
              { step: "3", title: "Pay", desc: "Pay a one-time placement fee securely" },
              { step: "4", title: "Connect", desc: "Get phone, WhatsApp, and email" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Worker Categories
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            From maids and nannies to drivers and nurse aides — find skilled domestic workers for every household need.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/workers?category=${cat.key}`}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Cities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Find Domestic Workers Near You
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {COVERAGE_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/hire/${city.slug}`}
                className="bg-blue-50 border border-blue-200 rounded-xl py-4 px-3 text-center hover:bg-blue-100 hover:border-blue-300 transition-all"
              >
                <span className="font-semibold text-blue-800">{city.name}</span>
                <p className="text-xs text-blue-500 mt-1">View workers →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-700">200+</div>
              <div className="text-gray-500 mt-1">Registered Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700">8</div>
              <div className="text-gray-500 mt-1">Worker Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700">5</div>
              <div className="text-gray-500 mt-1">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* NAP + Map */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit or Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📍</span>
                  <div>
                    <p className="font-semibold">DomesticHire</p>
                    <p>Harare, Zimbabwe</p>
                    {/* TODO: Phase 0 — add street address if physical office exists */}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📱</span>
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      +263 77 000 0000
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📧</span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>info@domestichire.co.zw</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🕐</span>
                  <div>
                    <p className="font-semibold">Business Hours</p>
                    <p className="text-sm text-gray-500">Mon–Fri: 8am–5pm &nbsp;|&nbsp; Sat: 8am–12pm</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-80">
              {/* Harare, Zimbabwe embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121820.61021331747!2d30.962000!3d-17.825167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4e706b1710b%3A0xa1d7484a3e6e76b9!2sHarare%2C%20Zimbabwe!5e0!3m2!1sen!2sza!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DomesticHire — Harare, Zimbabwe"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Help?</h2>
          <p className="text-blue-100 mb-8">
            Browse our directory of trusted domestic workers and find the perfect match for your household.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 bg-amber-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-amber-600 transition-colors text-lg"
            >
              Start Browsing →
            </Link>
            <a
              href={waHire}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-600 transition-colors text-lg"
            >
              💬 WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
