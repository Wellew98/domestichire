export const metadata = {
  title: "Contact Us | DomesticHire",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-lg text-gray-500 mb-10">
        Have questions? We'd love to hear from you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900">📱 WhatsApp</h3>
            <p className="text-gray-600">+263 77 000 0000</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">📧 Email</h3>
            <p className="text-gray-600">info@domestichire.co.zw</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">📍 Location</h3>
            <p className="text-gray-600">Harare, Zimbabwe</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">🕐 Business Hours</h3>
            <p className="text-gray-600">Mon–Fri: 8am–5pm<br />Sat: 8am–12pm</p>
          </div>
        </div>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
          <input type="email" placeholder="Your Email" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
          <textarea rows={4} placeholder="Your Message" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
          <button type="submit" className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
