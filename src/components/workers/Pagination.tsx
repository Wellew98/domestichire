"use client";

import { useRouter } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, basePath, params }: Props) {
  const router = useRouter();

  function goToPage(page: number) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) searchParams.set(k, v); });
    searchParams.set("page", String(page));
    router.push(`${basePath}?${searchParams.toString()}`);
  }

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        ← Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`px-3 py-2 rounded-lg text-sm font-medium ${
            p === currentPage
              ? "bg-blue-700 text-white"
              : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next →
      </button>
    </div>
  );
}
