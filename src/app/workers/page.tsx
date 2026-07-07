import { Suspense } from "react";
import { getAllWorkers } from "@/lib/db";
import WorkerCard from "@/components/workers/WorkerCard";
import FilterBar from "@/components/workers/FilterBar";

export const metadata = {
  title: "Find Domestic Workers | DomesticHire",
  description: "Browse our directory of verified domestic workers in Zimbabwe.",
};

interface SearchParams {
  category?: string;
  location?: string;
  minExperience?: string;
  maxSalary?: string;
  liveIn?: string;
}

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters = {
    category: params.category || "",
    location: params.location || "",
    minExperience: params.minExperience || "",
    maxSalary: params.maxSalary || "",
    liveIn: params.liveIn || "",
  };

  const workers = getAllWorkers({
    category: filters.category || undefined,
    location: filters.location || undefined,
    minExperience: filters.minExperience ? parseInt(filters.minExperience) : undefined,
    maxSalary: filters.maxSalary ? parseInt(filters.maxSalary) : undefined,
    liveIn:
      filters.liveIn === "1" ? true : filters.liveIn === "0" ? false : undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Workers</h1>
        <p className="text-gray-500 mt-2">
          Browse verified profiles of domestic workers across Zimbabwe.
        </p>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} />

      {/* Results */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workers.map((worker: any) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No workers found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or{" "}
              <a href="/workers" className="text-blue-600 hover:underline">
                clear all filters
              </a>
              .
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
