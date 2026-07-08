"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-red-500 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again in a moment.
        </p>
        <button
          onClick={reset}
          className="bg-blue-700 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
