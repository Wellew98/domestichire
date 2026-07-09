export const metadata = {
  title: "Our Services | DomesticHire",
  description: "DomesticHire connects you with skilled domestic workers across Bulawayo suburbs.",
};

const SERVICES = [
  { icon: "🧹", title: "Maids", desc: "Household cleaning, laundry, ironing, and organization." },
  { icon: "👶", title: "Nannies", desc: "Professional childcare for children of all ages." },
  { icon: "🚗", title: "Drivers", desc: "Safe and experienced drivers for personal transport." },
  { icon: "🌿", title: "Gardeners", desc: "Landscaping, lawn care, and garden maintenance." },
  { icon: "🍳", title: "Cooks & Chefs", desc: "Daily cooking or special event catering." },
  { icon: "💊", title: "Nurse Aides", desc: "Elderly care, medication management, and home health support." },
];

export default function ServicesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
      <p className="text-lg text-gray-500 mb-10">
        We connect you with skilled domestic workers across all major categories in Bulawayo.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SERVICES.map((s) => (
          <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{s.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
