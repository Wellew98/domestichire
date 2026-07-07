"use client";

import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "maid", label: "Maids" },
  { value: "nanny", label: "Nannies" },
  { value: "driver", label: "Drivers" },
  { value: "gardener", label: "Gardeners" },
  { value: "cleaner", label: "Cleaners" },
  { value: "cook", label: "Cooks" },
  { value: "chef", label: "Chefs" },
  { value: "nurse_aide", label: "Nurse Aides" },
  { value: "laundry", label: "Laundry Helpers" },
];

interface FilterBarProps {
  filters: {
    category: string;
    location: string;
    minExperience: string;
    maxSalary: string;
    liveIn: string;
  };
}

export default function FilterBar({ filters }: FilterBarProps) {
  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/workers?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Location */}
        <input
          type="text"
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          placeholder="📍 Location..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Min Experience */}
        <select
          value={filters.minExperience}
          onChange={(e) => updateFilter("minExperience", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Min Experience</option>
          <option value="1">1+ year</option>
          <option value="3">3+ years</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
        </select>

        {/* Max Salary */}
        <select
          value={filters.maxSalary}
          onChange={(e) => updateFilter("maxSalary", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Max Salary</option>
          <option value="200">Up to $200</option>
          <option value="300">Up to $300</option>
          <option value="400">Up to $400</option>
          <option value="500">Up to $500</option>
        </select>

        {/* Live-in/Live-out */}
        <select
          value={filters.liveIn}
          onChange={(e) => updateFilter("liveIn", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Arrangement</option>
          <option value="1">Live-in</option>
          <option value="0">Live-out</option>
        </select>
      </div>
    </div>
  );
}
