import Link from "next/link";
import type { PublicWorker } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  maid: "Maid", nanny: "Nanny", driver: "Driver", gardener: "Gardener",
  cleaner: "Cleaner", cook: "Cook", chef: "Chef", nurse_aide: "Nurse Aide", laundry: "Laundry Helper",
};

export default function WorkerCard({ worker }: { worker: PublicWorker }) {
  return (
    <Link href={`/workers/${worker.id}`} className="block bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all group">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        {worker.photo_url ? (
          <img src={worker.photo_url} alt={worker.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl font-bold text-blue-400">{worker.name.charAt(0)}</div>
        )}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${worker.available ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {worker.available ? "Available" : "Unavailable"}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{worker.name}</h3>
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-semibold">{CATEGORY_LABELS[worker.category] || worker.category}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-sm text-gray-700 font-medium">💼 {worker.experience_years}y exp</span>
          <span className="text-sm text-gray-700 font-medium">💰 ${worker.expected_salary} placement fee</span>
          <span className="text-sm text-gray-700 font-medium">🏠 {worker.live_in ? "Live-in" : "Live-out"}</span>
        </div>
        <div className="text-sm font-medium text-gray-600">📍 {worker.location}, Bulawayo</div>
        {worker.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {worker.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded">{skill}</span>
            ))}
            {worker.skills.length > 3 && <span className="text-xs text-gray-500 font-medium">+{worker.skills.length - 3}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
