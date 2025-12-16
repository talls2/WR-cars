import { prisma } from "@/lib/prisma";
import PrintButton from "@/app/components/PrintButton"; // Import the new button

export default async function StickerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const car = await prisma.vehicle.findUnique({
    where: { id: id },
  });

  if (!car) return <div className="p-10 text-xl font-bold text-red-600">Vehicle not found.</div>;

  return (
    <div className="min-h-screen bg-white text-black p-10 font-serif print:p-0">
      <div className="border-4 border-slate-900 p-8 h-full max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between border-b-4 border-slate-900 pb-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold uppercase tracking-widest">WR Autosales</h1>
            <p className="text-sm mt-1">123 Dealer Lane, Auto City, CA</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">{car.year} {car.make} {car.model}</h2>
            <p className="font-mono text-sm">{car.vin}</p>
          </div>
        </header>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold border-b-2 border-slate-300 mb-4">Vehicle Details</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                <span className="text-slate-600">Trim</span> 
                <span className="font-bold">{car.trim || "Base"}</span>
              </li>
              <li className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                <span className="text-slate-600">Color</span> 
                <span className="font-bold">{car.color}</span>
              </li>
              <li className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                <span className="text-slate-600">Mileage</span> 
                <span className="font-bold">{car.mileage.toLocaleString()}</span>
              </li>
              <li className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                <span className="text-slate-600">Stock #</span> 
                <span className="font-bold">{car.stockNumber}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-100 p-6 flex flex-col items-center justify-center text-center border-2 border-slate-900 rounded-lg">
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Total Price</h3>
            <div className="text-5xl font-extrabold text-slate-900 my-4">
              ${Number(car.listPrice).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">*Plus tax, title & license</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t-2 border-slate-200 pt-8 relative">
           <h3 className="font-bold text-lg mb-4 uppercase">Standard Features</h3>
           <p className="text-sm text-slate-600 max-w-2xl mx-auto">
             Power Steering, Power Windows, ABS Brakes, Cruise Control, Air Conditioning, 
             Bluetooth Wireless, Backup Camera.
           </p>
        </div>
      </div>
      
      {/* The Interactive Button Component */}
      <div className="mt-8 text-center print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}