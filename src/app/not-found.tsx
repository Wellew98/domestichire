import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-blue-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="bg-blue-700 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors">
            Go Home
          </Link>
          <Link href="/workers" className="border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            Browse Workers
          </Link>
        </div>
      </div>
    </div>
  );
}
