"use client";

import { useState } from "react";

interface Props {
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

export default function PhotoUpload({ currentUrl, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        onUploaded(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
      <div className="flex items-center gap-3">
        {preview ? (
          <img src={preview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-xs">
            No photo
          </div>
        )}
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            disabled={uploading}
            className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
        </div>
      </div>
      <input type="hidden" name="photo_url" value={preview} />
    </div>
  );
}
