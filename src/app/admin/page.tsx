import { getAllWorkers, getAllPayments, getAllEmployers } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard | DomesticHire" };

export default async function AdminPage() {
  const workers = (await getAllWorkers()) as any[];
  const payments = (await getAllPayments()) as any[];
  const employers = (await getAllEmployers()) as any[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage workers, payments, and employers.</p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Workers" value={workers.length} />
        <StatCard label="Available" value={workers.filter((w: any) => w.available).length} />
        <StatCard label="Total Payments" value={payments.length} />
        <StatCard label="Revenue" value={`$${payments.filter((p: any) => p.status === "completed").reduce((sum: number, p: any) => sum + p.amount, 0)}`} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-10">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Workers</h2>
          <Link href="/admin/workers/new" className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800">+ Add Worker</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Location</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Salary</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workers.map((w: any) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{w.name}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{w.category.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-gray-600">{w.location}</td>
                  <td className="px-4 py-3 text-gray-600">${w.expected_salary}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${w.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {w.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/workers/${w.id}/edit`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200"><h2 className="font-semibold text-gray-900">Recent Payments</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Employer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Worker</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No payments yet</td></tr>
              ) : payments.map((p: any) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-gray-900">{p.employer_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.worker_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">${p.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-green-100 text-green-700" : p.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</h4>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
