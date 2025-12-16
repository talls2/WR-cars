"use client";

import { useState } from "react";
import { addVehicleByVin } from "../actions";

export default function AddVinForm() {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (vin.length < 17) return alert("VIN is too short");
    setLoading(true);
    const res = await addVehicleByVin(vin);
    setLoading(false);
    if (res.success) {
      setVin(""); // Clear input
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <input
        type="text"
        placeholder="Enter VIN (e.g. 1HG...)"
        className="border border-slate-300 p-2.5 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-500 outline-none"
        value={vin}
        onChange={(e) => setVin(e.target.value.toUpperCase())}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
      >
        {loading ? "Decoding..." : "Decode & Add"}
      </button>
    </div>
  );
}