import { Suspense } from "react";
import { getAllWorkers, countWorkers } from "@/lib/db";
import WorkerCard from "@/components/workers/WorkerCard";
import FilterBar from "@/components/workers/FilterBar";
import Pagination from "@/components/workers/Pagination";

const PER_PAGE = 20;

export const metadata = {
  title: "Find Domestic Workers in Bulawayo | DomesticHire",
  description: "Browse verified domestic workers in Bulawayo suburbs. Filter by category, location, experience. Maids, nannies, drivers, gardeners, cooks, chefs, cleaners, nurse aides.",
};

interface SearchParams { category?: string; location?: string; minExperience?: string; maxSalary?: string; liveIn?: string; page?: string; }

export default async function WorkersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1") || 1;

  const dbFilters = {
    category: params.category || undefined,
    location: params.location || undefined,
    minExperience: params.minExperience ? parseInt(params.minExperience) : undefined,
    maxSalary: params.maxSalary ? parseInt(params.maxSalary) : undefined,
    liveIn: params.liveIn === "1" ? true : params.liveIn === "0" ? false : undefined,
    page, limit: PER_PAGE,
  };

  const [workers, total] = await Promise.all([
    getAllWorkers(dbFilters),
    countWorkers({...dbFilters, page: undefined, limit: undefined}),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const filters = { category: params.category || "", location: params.location || "", minExperience: params.minExperience || "", maxSalary: params.maxSalary || "", liveIn: params.liveIn || "" };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Workers in Bulawayo</h1>
        <p className="text-gray-700 text-lg mt-1 font-medium">{total} worker{total !== 1 ? "s" : ""} across Bulawayo suburbs</p>
      </div>
      <FilterBar filters={filters} />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workers.map((worker: any) => (<WorkerCard key={worker.id} worker={worker} />))}
        </div>
        {workers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No workers found</h3>
            <p className="text-gray-500">Try adjusting your filters or <a href="/workers" className="text-blue-600 hover:underline">clear all filters</a>.</p>
          </div>
        )}
        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} basePath="/workers" params={filters} />}
      </Suspense>
    </div>
  );
}
