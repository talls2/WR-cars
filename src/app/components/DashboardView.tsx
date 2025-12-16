"use client";

import { useState } from "react";
import { Car, DollarSign, Activity, Users, Printer, Save, X, Calculator, FileText } from "lucide-react";
import AddVinForm from "./AddVinForm";
import { updateVehicle, addCustomer } from "../actions";

// Helper: Loan Payment Calculator
function calculatePayment(price: number, rate: number, term: number, down: number) {
  if (!price) return 0;
  const loanAmount = price - down;
  const monthlyRate = rate / 100 / 12;
  return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
}

export default function DashboardView({ inventory, customers }: { inventory: any[], customers: any[] }) {
  const [activeTab, setActiveTab] = useState("inventory");
  
  // --- STATE: INVENTORY EDITING ---
  const [editingCar, setEditingCar] = useState<any>(null);
  
  // --- STATE: CRM ---
  const [newCustomer, setNewCustomer] = useState({ firstName: "", lastName: "", phone: "", email: "" });

  // --- STATE: DEALS / CALCULATOR ---
  const [calcPrice, setCalcPrice] = useState(25000);
  const [calcDown, setCalcDown] = useState(2000);
  const [calcRate, setCalcRate] = useState(8.9);
  const [calcTerm, setCalcTerm] = useState(60);
  
  const estimatedPayment = calculatePayment(calcPrice, calcRate, calcTerm, calcDown);

  // --- ACTIONS ---
  const handleUpdateCar = async () => {
    if (!editingCar) return;
    await updateVehicle(editingCar.id, editingCar);
    setEditingCar(null);
  };

  const handleAddCustomer = async () => {
    await addCustomer(newCustomer);
    setNewCustomer({ firstName: "", lastName: "", phone: "", email: "" });
    alert("Customer added!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block flex-shrink-0">
        <h1 className="text-2xl font-bold mb-10 text-blue-400 tracking-tighter">WR AUTOSALES</h1>
        <nav className="space-y-2 text-sm font-medium">
          <SidebarBtn icon={<Car size={18} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <SidebarBtn icon={<Users size={18} />} label="CRM / Customers" active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} />
          <SidebarBtn icon={<DollarSign size={18} />} label="Deals & F&I" active={activeTab === 'deals'} onClick={() => setActiveTab('deals')} />
          <SidebarBtn icon={<Activity size={18} />} label="Integrations" active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        
        {/* --- TAB 1: INVENTORY --- */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <header className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-slate-900">Inventory Management</h2>
              <a href="/api/feeds/cargurus" target="_blank" className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50">
                Download Feed
              </a>
            </header>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <AddVinForm /> 
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Miles</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50">
                      <td className="p-4 font-medium">
                        <div className="text-slate-900">{car.year} {car.make} {car.model}</div>
                        <div className="text-xs text-slate-500 font-mono">{car.vin}</div>
                      </td>
                      <td className="p-4 font-bold text-green-700">${car.listPrice.toLocaleString()}</td>
                      <td className="p-4">{car.mileage.toLocaleString()}</td>
                      <td className="p-4"><Badge status={car.status} /></td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => setEditingCar(car)} className="text-blue-600 font-bold hover:underline">Edit</button>
                        <span className="text-slate-300">|</span>
                        <a href={`/sticker/${car.id}`} target="_blank" className="text-slate-600 hover:text-slate-900 flex items-center gap-1">
                          <Printer size={14} /> Sticker
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 2: CRM --- */}
        {activeTab === "crm" && (
          <div className="max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold">Customer Relationship Management</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold mb-4">Add New Lead</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input placeholder="First Name" className="border p-2 rounded" value={newCustomer.firstName} onChange={e => setNewCustomer({...newCustomer, firstName: e.target.value})} />
                <input placeholder="Last Name" className="border p-2 rounded" value={newCustomer.lastName} onChange={e => setNewCustomer({...newCustomer, lastName: e.target.value})} />
                <input placeholder="Phone" className="border p-2 rounded" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                <input placeholder="Email" className="border p-2 rounded" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
              </div>
              <button onClick={handleAddCustomer} className="bg-slate-900 text-white px-6 py-2 rounded font-bold hover:bg-slate-800">Save Customer</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b"><tr><th className="p-4">Name</th><th className="p-4">Phone</th><th className="p-4">Email</th></tr></thead>
                <tbody>
                  {customers?.map((c: any) => (
                    <tr key={c.id} className="border-b">
                      <td className="p-4 font-bold">{c.lastName}, {c.firstName}</td>
                      <td className="p-4">{c.phone}</td>
                      <td className="p-4 text-blue-600">{c.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 3: DEALS / CALCULATOR --- */}
        {activeTab === "deals" && (
           <div className="max-w-4xl">
             <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Desking & Finance</h2>
                <p className="text-slate-500">Structure deal payments and submit to RouteOne.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calculator Inputs */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6 text-slate-800">
                    <Calculator className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Loan Calculator</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle Price</label>
                      <input type="number" value={calcPrice} onChange={(e) => setCalcPrice(Number(e.target.value))} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Down Payment</label>
                      <input type="number" value={calcDown} onChange={(e) => setCalcDown(Number(e.target.value))} className="w-full border p-2 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">APR %</label>
                        <input type="number" value={calcRate} onChange={(e) => setCalcRate(Number(e.target.value))} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Term (Months)</label>
                        <input type="number" value={calcTerm} onChange={(e) => setCalcTerm(Number(e.target.value))} className="w-full border p-2 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Card */}
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <h4 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-1">Estimated Monthly Payment</h4>
                    <div className="text-5xl font-bold text-green-400">${estimatedPayment.toFixed(2)}</div>
                    <p className="text-slate-400 text-sm mt-2">Amount Financed: ${(calcPrice - calcDown).toLocaleString()}</p>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-8">
                    <FileText size={18} /> Send to RouteOne
                  </button>
                </div>
              </div>
          </div>
        )}

        {/* --- TAB 4: INTEGRATIONS --- */}
        {activeTab === "integrations" && (
           <div>
             <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">System Integrations</h2>
                <p className="text-slate-500">Manage API keys and active feeds.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-start gap-4">
                   <div className="bg-blue-100 p-3 rounded-lg"><Activity className="text-blue-600" /></div>
                   <div>
                      <h3 className="font-bold text-lg">RouteOne</h3>
                      <p className="text-sm text-slate-500">Credit Apps & Funding</p>
                   </div>
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mt-auto">● Active</span>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-start gap-4">
                   <div className="bg-orange-100 p-3 rounded-lg"><Car className="text-orange-600" /></div>
                   <div>
                      <h3 className="font-bold text-lg">CarGurus Feed</h3>
                      <p className="text-sm text-slate-500">Inventory Syndication</p>
                   </div>
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mt-auto">● Active (Hourly)</span>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-start gap-4">
                   <div className="bg-blue-100 p-3 rounded-lg"><FileText className="text-blue-600" /></div>
                   <div>
                      <h3 className="font-bold text-lg">Carfax</h3>
                      <p className="text-sm text-slate-500">Vehicle History Reports</p>
                   </div>
                   <button className="text-sm text-blue-600 underline font-medium mt-auto">Connect Account</button>
                </div>
              </div>
          </div>
        )}
        
        {/* --- MODAL: EDIT VEHICLE --- */}
        {editingCar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Edit Vehicle</h3>
                <button onClick={() => setEditingCar(null)}><X /></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Retail Price ($)</label>
                  <input type="number" className="w-full border p-3 rounded-lg text-lg font-mono" 
                    value={editingCar.listPrice} 
                    onChange={(e) => setEditingCar({...editingCar, listPrice: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700">Mileage</label>
                    <input type="number" className="w-full border p-2 rounded-lg" 
                      value={editingCar.mileage} 
                      onChange={(e) => setEditingCar({...editingCar, mileage: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Color</label>
                    <input type="text" className="w-full border p-2 rounded-lg" 
                      value={editingCar.color} 
                      onChange={(e) => setEditingCar({...editingCar, color: e.target.value})} 
                    />
                  </div>
                </div>
                 <div>
                    <label className="text-sm font-bold text-slate-700">Status</label>
                    <select className="w-full border p-2 rounded-lg" 
                      value={editingCar.status} 
                      onChange={(e) => setEditingCar({...editingCar, status: e.target.value})}
                    >
                      <option value="IN_STOCK">In Stock</option>
                      <option value="PENDING">Pending</option>
                      <option value="SOLD">Sold</option>
                    </select>
                  </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => setEditingCar(null)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded">Cancel</button>
                <button onClick={handleUpdateCar} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 flex items-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Sub-components
function SidebarBtn({icon, label, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-md transition ${active ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800'}`}>
      {icon} {label}
    </button>
  )
}

function Badge({status}: {status: string}) {
  const colors: any = { IN_STOCK: "bg-green-100 text-green-800", PENDING: "bg-yellow-100 text-yellow-800", SOLD: "bg-red-100 text-red-800" };
  return <span className={`${colors[status] || "bg-gray-100"} px-2 py-1 rounded-full text-xs font-bold`}>{status.replace('_', ' ')}</span>
}