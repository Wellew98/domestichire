export const metadata = {
  title: "About Us | DomesticHire",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About DomesticHire</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          DomesticHire is a recruitment platform connecting Zimbabwean families with trusted,
          verified domestic workers. We bridge the gap between employers seeking help and
          skilled workers looking for opportunities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Our Mission</h3>
            <p className="text-blue-800">
              To make hiring domestic help simple, transparent, and trustworthy for every
              Zimbabwean household.
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2">Our Promise</h3>
            <p className="text-amber-800">
              Every worker is vetted. You only pay once when you find the right match.
              No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
