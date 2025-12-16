"use client"; // <--- This line makes the button interactive

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition transform flex items-center gap-2 mx-auto"
      onClick={() => window.print()}
    >
      <Printer size={20} /> Print Window Sticker
    </button>
  );
}