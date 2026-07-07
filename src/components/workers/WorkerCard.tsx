import Link from "next/link";
import type { PublicWorker } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  maid: "Maid",
  nanny: "Nanny",
  driver: "Driver",
  gardener: "Gardener",
  cleaner: "Cleaner",
  cook: "Cook",
  chef: "Chef",
  nurse_aide: "Nurse Aide",
  laundry: "Laundry Helper",
};

export default function WorkerCard({ worker }: { worker: PublicWorker }) {
  return (
    <Link
      href={`/workers/${worker.id}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Photo */}
      <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
        {worker.photo_url ? (
          <img
            src={worker.photo_url}
            alt={worker.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-5xl text-blue-300">
            {worker.name.charAt(0)}
          </div>
        )}
        {/* Availability badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
            worker.available
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {worker.available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            {worker.name}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
            {CATEGORY_LABELS[worker.category] || worker.category}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-gray-500">
            💼 {worker.experience_years}y exp
          </span>
          <span className="text-xs text-gray-500">
            💰 ${worker.expected_salary}/mo
          </span>
          <span className="text-xs text-gray-500">
            🏠 {worker.live_in ? "Live-in" : "Live-out"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>📍 {worker.location}</span>
        </div>

        {worker.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {worker.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
            {worker.skills.length > 3 && (
              <span className="text-[10px] text-gray-400">
                +{worker.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
