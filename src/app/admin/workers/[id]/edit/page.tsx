"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhotoUpload from "@/components/admin/PhotoUpload";

const CATEGORIES = ["maid", "nanny", "driver", "gardener", "cleaner", "cook", "chef", "nurse_aide", "laundry"];

interface Props {
  worker: any;
}

export default function EditWorkerForm({ worker }: Props) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState(worker.photo_url || "");
  const [saving, setSaving] = useState(false);

  const workerSkills: string[] = worker.skills || [];
  const workerLanguages: string[] = worker.languages || [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const skills = (formData.get("skills") as string).split(",").map(s => s.trim()).filter(Boolean);
    const languages = (formData.get("languages") as string).split(",").map(s => s.trim()).filter(Boolean);

    const res = await fetch(`/api/admin/workers/${worker.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        category: formData.get("category"),
        experience_years: parseInt(formData.get("experience_years") as string) || 0,
        expected_salary: parseFloat(formData.get("expected_salary") as string) || 0,
        skills, languages,
        live_in: parseInt(formData.get("live_in") as string) || 0,
        available: parseInt(formData.get("available") as string) || 0,
        location: formData.get("location"),
        phone: formData.get("phone"),
        whatsapp: (formData.get("whatsapp") as string) || formData.get("phone"),
        email: (formData.get("email") as string) || "",
        photo_url: photoUrl,
        description: (formData.get("description") as string) || "",
      }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Failed to update worker");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Worker</h1>
      <p className="text-gray-500 mb-8">Update {worker.name}'s profile.</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <PhotoUpload currentUrl={worker.photo_url} onUploaded={setPhotoUrl} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" name="name" defaultValue={worker.name} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" defaultValue={worker.category} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {CATEGORIES.map(c => (<option key={c} value={c}>{c.replace("_"," ").replace(/\b\w/g,(l:string)=>l.toUpperCase())}</option>))}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location *</label><input type="text" name="location" defaultValue={worker.location} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label><input type="number" name="experience_years" defaultValue={worker.experience_years} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary ($)</label><input type="number" name="expected_salary" defaultValue={worker.expected_salary} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Arrangement</label>
            <select name="live_in" defaultValue={worker.live_in ? "1" : "0"} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option value="0">Live-out</option><option value="1">Live-in</option></select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
            <select name="available" defaultValue={worker.available ? "1" : "0"} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option value="1">Available</option><option value="0">Unavailable</option></select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="text" name="phone" defaultValue={worker.phone} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label><input type="text" name="whatsapp" defaultValue={worker.whatsapp} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" defaultValue={worker.email} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label><input type="text" name="skills" defaultValue={workerSkills.join(", ")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma-separated)</label><input type="text" name="languages" defaultValue={workerLanguages.join(", ")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" defaultValue={worker.description} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin" className="border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
