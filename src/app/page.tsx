import Link from "next/link";

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

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Find Trusted Domestic Workers in Bulawayo
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Browse verified profiles from Bulawayo's suburbs. Select your preferred worker, pay a one-time $20 placement fee, and get direct contact access. Simple & transparent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workers" className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-amber-600 transition-colors text-lg">
              🔍 Browse Workers
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-lg border border-white/20">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Browse", desc: "Explore profiles from Bulawayo suburbs" },
              { step: "2", title: "Select", desc: "Pick your preferred helper" },
              { step: "3", title: "Pay", desc: "Pay a one-time $20 placement fee" },
              { step: "4", title: "Connect", desc: "Get direct contact details" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Worker Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.key} href={`/workers?category=${cat.key}`} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{cat.label}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div><div className="text-4xl font-bold text-blue-700">200+</div><div className="text-gray-500 mt-1">Registered Workers</div></div>
            <div><div className="text-4xl font-bold text-blue-700">$20</div><div className="text-gray-500 mt-1">Flat Placement Fee</div></div>
            <div><div className="text-4xl font-bold text-blue-700">20</div><div className="text-gray-500 mt-1">Bulawayo Suburbs</div></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Help in Bulawayo?</h2>
          <p className="text-blue-100 mb-8">
            Browse profiles from Bulawayo's best suburbs. $20 one-time fee. No surprises.
          </p>
          <Link href="/workers" className="inline-flex items-center gap-2 bg-amber-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-amber-600 transition-colors text-lg">
            Start Browsing →
          </Link>
        </div>
      </section>
    </>
  );
}
