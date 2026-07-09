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
  filters: { category: string; location: string; minExperience: string; maxSalary: string; liveIn: string };
}

export default function FilterBar({ filters }: FilterBarProps) {
  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/workers?${params.toString()}`);
  };

  const inputClass = "w-full border-2 border-gray-400 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-8 shadow-sm">
      <h3 className="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">🔍 Filter Workers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select value={filters.category} onChange={(e) => updateFilter("category", e.target.value)} className={inputClass}>
          {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
        </select>
        <input type="text" value={filters.location} onChange={(e) => updateFilter("location", e.target.value)} placeholder="📍 Location..." className={inputClass} />
        <select value={filters.minExperience} onChange={(e) => updateFilter("minExperience", e.target.value)} className={inputClass}>
          <option value="">Min Experience</option>
          <option value="1">1+ year</option>
          <option value="3">3+ years</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
        </select>
        <select value={filters.maxSalary} onChange={(e) => updateFilter("maxSalary", e.target.value)} className={inputClass}>
          <option value="">Max Salary</option>
          <option value="200">Up to $200</option>
          <option value="300">Up to $300</option>
          <option value="400">Up to $400</option>
          <option value="500">Up to $500</option>
        </select>
        <select value={filters.liveIn} onChange={(e) => updateFilter("liveIn", e.target.value)} className={inputClass}>
          <option value="">Any Arrangement</option>
          <option value="1">Live-in</option>
          <option value="0">Live-out</option>
        </select>
      </div>
    </div>
  );
}
