export const dynamic = "force-dynamic";
import { getInventory } from "../actions";
import Link from "next/link";

export default async function PublicInventory() {
  const cars = await getInventory();

  return (
    <div className="bg-white min-h-screen text-slate-900">
      <nav className="p-6 border-b flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-blue-700">WR AUTOSALES</h1>
        <div className="space-x-6 font-bold text-slate-600">
          <Link href="/">Home</Link>
          <Link href="/inventory" className="text-blue-600">Inventory</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {cars.map((car) => (
          <div key={car.id} className="border rounded-xl overflow-hidden shadow hover:shadow-xl transition group cursor-pointer">
            <div className="h-48 bg-slate-200 relative">
              {car.images && car.images[0] ? (
                <img src={car.images[0]} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">No Photo</div>
              )}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                {car.mileage.toLocaleString()} mi
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition">{car.year} {car.make} {car.model}</h3>
              <p className="text-sm text-slate-500 mb-4">{car.trim}</p>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{car.bodyType}</span>
                <span className="text-xl font-black text-green-700">${car.listPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))} 
      </div>
    </div>
  );
}