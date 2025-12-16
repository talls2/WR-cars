"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, X } from "lucide-react";

// Initialize Supabase Client (Expose these in .env later for security, fine for MVP demo)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ImageUpload({ vehicleId, currentImages, onUploadComplete }: any) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${vehicleId}/${Math.random()}.${fileExt}`;
    
    // 1. Upload to Supabase Bucket
    const { error } = await supabase.storage
      .from('vehicle-photos')
      .upload(fileName, file);

    if (error) {
      alert("Error uploading image");
      setUploading(false);
      return;
    }

    // 2. Get Public URL
    const { data } = supabase.storage
      .from('vehicle-photos')
      .getPublicUrl(fileName);

    // 3. Callback to update parent
    onUploadComplete(data.publicUrl);
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {currentImages.map((url: string, idx: number) => (
          <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
             <img src={url} alt="Car" className="object-cover w-full h-full" />
          </div>
        ))}
        
        <label className="w-24 h-24 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 rounded cursor-pointer hover:bg-slate-50 hover:border-blue-400">
          <Upload size={20} />
          <span className="text-xs mt-1">{uploading ? "..." : "Add"}</span>
          <input type="file" onChange={handleUpload} className="hidden" accept="image/*" disabled={uploading} />
        </label>
      </div>
    </div>
  );
}