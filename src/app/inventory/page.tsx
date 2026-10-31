"use client";

import { WarehouseIcon, SearchIcon, PlusIcon, PackageIcon } from "@/components/Icons";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { InventoryItem } from "@/data/mockData";
import { useSolarData } from "@/hooks/useSolarData";

export default function InventoryPage() {
  const { data: items, setData: setItems, loading } = useSolarData<InventoryItem>("inventory");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchSerial, setSearchSerial] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New stock form
  const [formData, setFormData] = useState({
    name: "Solar Panel 540W",
    category: "Panel" as InventoryItem["category"],
    serialNumber: "",
    specification: "Mono PERC Half-Cut 540W",
    supplier: "Waaree Energies",
    purchasePrice: 11000,
    location: "Warehouse A - Rack 1",
  });

  const categories = ["All", "Panel", "Inverter", "Battery", "Structure", "Electrical", "Cable"];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      searchSerial === "" ||
      item.serialNumber.toLowerCase().includes(searchSerial.toLowerCase()) ||
      item.name.toLowerCase().includes(searchSerial.toLowerCase()) ||
      item.linkedCustomer.toLowerCase().includes(searchSerial.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Find exact match if user typed serial
  const searchedItem = searchSerial
    ? items.find(
        (i) => i.serialNumber.toLowerCase() === searchSerial.trim().toLowerCase()
      )
    : null;

  const stats = {
    inStock: items.filter((i) => i.status === "In Stock").length,
    reserved: items.filter((i) => i.status === "Reserved").length,
    dispatched: items.filter((i) => i.status === "Dispatched").length,
    installed: items.filter((i) => i.status === "Installed").length,
    defective: items.filter((i) => i.status === "Defective").length,
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serialNumber) {
      alert("Please enter or generate a serial number");
      return;
    }
    const newItem: InventoryItem = {
      id: `INV-${String(items.length + 1).padStart(3, "0")}`,
      name: formData.name,
      category: formData.category,
      serialNumber: formData.serialNumber,
      specification: formData.specification,
      status: "In Stock",
      linkedOrder: "",
      linkedCustomer: "",
      warrantyYears: formData.category === "Panel" ? 25 : 5,
      warrantyStart: "",
      warrantyEnd: "",
      purchasePrice: Number(formData.purchasePrice),
      supplier: formData.supplier,
      location: formData.location,
    };
    setItems([newItem, ...items]);
    setShowAddModal(false);
    setFormData({
      name: "Solar Panel 540W",
      category: "Panel",
      serialNumber: "",
      specification: "Mono PERC Half-Cut 540W",
      supplier: "Waaree Energies",
      purchasePrice: 11000,
      location: "Warehouse A - Rack 1",
    });
  };

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "In Stock":
        return "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40";
      case "Reserved":
        return "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40";
      case "Dispatched":
        return "bg-[#F7EEF2] text-[#6D5284] border-[#6D5284]/30";
      case "Installed":
        return "bg-[#F7EEF2] text-[#4A355E] border-[#4A355E]/30";
      case "Defective":
        return "bg-[#FEF2F2] text-[#DC2626] border-red-200";
      default:
        return "bg-[#F7EEF2] text-[#666666] border-[#EBCED6]";
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <WarehouseIcon className="w-6 h-6 text-[#4A355E]" /> Warehouse Inventory & Serial Registry
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
              🐘 PostgreSQL: {items.length} In Stock
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Real-time equipment tracking by unique serial numbers, bays, and customer allocations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchSerial("INV-5K-OG-9921")}
            className="px-3 py-1.5 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#4A355E]/30 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            🔍 Test Scan (Inverter)
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            + Add Stock Unit
          </button>
        </div>
      </div>

      {/* KPI Stock Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] border-t-4 border-t-[#78B77B] shadow-xs text-center">
          <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">In Stock</p>
          <p className="text-2xl font-extrabold text-[#78B77B] mt-1">{stats.inStock}</p>
          <span className="text-[10px] text-[#666666]">Ready to dispatch</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] border-t-4 border-t-[#F4B860] shadow-xs text-center">
          <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Reserved</p>
          <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">{stats.reserved}</p>
          <span className="text-[10px] text-[#666666]">Assigned to orders</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] border-t-4 border-t-[#6D5284] shadow-xs text-center">
          <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Dispatched</p>
          <p className="text-2xl font-extrabold text-[#6D5284] mt-1">{stats.dispatched}</p>
          <span className="text-[10px] text-[#666666]">On delivery truck</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] border-t-4 border-t-[#4A355E] shadow-xs text-center">
          <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Installed</p>
          <p className="text-2xl font-extrabold text-[#4A355E] mt-1">{stats.installed}</p>
          <span className="text-[10px] text-[#666666]">Live at client site</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] border-t-4 border-t-red-400 shadow-xs text-center">
          <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Defective</p>
          <p className="text-2xl font-extrabold text-[#DC2626] mt-1">{stats.defective}</p>
          <span className="text-[10px] text-[#DC2626] font-bold">RMA Bay</span>
        </div>
      </div>

      {/* Serial Number Lookup Box */}
      <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#333333] flex items-center gap-1.5">
              <span>⚡</span> Barcode &amp; Serial Number Quick Lookup
            </h3>
            <p className="text-[11px] text-[#666666]">
              Instant lookup for warranties, linked customers, and dispatch origins
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type Serial (e.g. INV-5K-OG-9921)..."
              value={searchSerial}
              onChange={(e) => setSearchSerial(e.target.value)}
              className="px-3.5 py-1.5 text-xs bg-[#F7EEF2] border border-[#EBCED6] rounded-xl focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none w-64 shadow-xs font-mono"
            />
            {searchSerial && (
              <button
                onClick={() => setSearchSerial("")}
                className="px-2.5 py-1.5 bg-[#F7EEF2] hover:bg-[#EBCED6] text-[#666666] text-xs font-bold rounded-xl border border-[#EBCED6]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* If searched item found, show special card */}
        {searchedItem && (
          <div className="bg-[#F7EEF2] p-4 rounded-xl border-2 border-[#4A355E] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#333333] text-sm">{searchedItem.name}</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#4A355E] text-white font-bold">
                  {searchedItem.category}
                </span>
                <span className={`px-2 py-0.5 text-[10px] rounded-full border ${getStatusBadge(searchedItem.status)}`}>
                  {searchedItem.status}
                </span>
              </div>
              <p className="text-xs font-mono text-[#666666]">Serial: {searchedItem.serialNumber}</p>
              <p className="text-xs text-[#333333]">
                Customer: <strong className="text-[#4A355E]">{searchedItem.linkedCustomer || "Not Assigned"}</strong> • Order: {searchedItem.linkedOrder || "N/A"}
              </p>
            </div>

            <div className="text-left md:text-right space-y-0.5 text-xs">
              <p className="text-[#666666]">Warranty Coverage: <strong>{searchedItem.warrantyYears} Years</strong></p>
              <p className="text-[#5B965E] font-semibold">
                {searchedItem.warrantyStart ? `Active (${searchedItem.warrantyStart} to ${searchedItem.warrantyEnd})` : "Unregistered"}
              </p>
              <p className="text-[#666666]">Location: {searchedItem.location}</p>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedCategory === cat
                ? "bg-[#4A355E] text-white border-[#4A355E] shadow-xs"
                : "bg-white text-[#666666] border-[#EBCED6] hover:bg-[#F7EEF2]"
            }`}
          >
            {cat === "All" ? "📦 All Items" : cat}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#EBCED6] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#EBCED6] bg-[#F7EEF2] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Equipment Stock Registry ({filteredItems.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7EEF2] text-[#666666] font-semibold border-b border-[#EBCED6]">
              <tr>
                <th className="px-4 py-2.5">Item ID</th>
                <th className="px-4 py-2.5">Equipment / Specification</th>
                <th className="px-4 py-2.5">Serial Number</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5">Storage Bay</th>
                <th className="px-4 py-2.5">Customer Allocation</th>
                <th className="px-4 py-2.5 text-right">Unit Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBCED6]/60">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7EEF2] transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-[#666666]">{item.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#333333]">{item.name}</div>
                    <div className="text-[11px] text-[#666666]">{item.specification}</div>
                    <div className="text-[10px] text-gray-400">Supplier: {item.supplier}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-1.5 bg-[#F7EEF2] border border-[#EBCED6] px-2 py-0.5 rounded-lg">
                      <span className="font-mono text-[11px] text-[#333333]">{item.serialNumber}</span>
                      <button
                        onClick={() => handleCopy(item.serialNumber, item.id)}
                        className="text-gray-400 hover:text-[#333333]"
                        title="Copy"
                      >
                        {copiedId === item.id ? "✓" : "📋"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#333333]">{item.location}</td>
                  <td className="px-4 py-3">
                    {item.linkedCustomer ? (
                      <div>
                        <span className="font-bold text-[#4A355E]">{item.linkedCustomer}</span>
                        <div className="text-[10px] text-[#666666] font-mono">{item.linkedOrder}</div>
                      </div>
                    ) : (
                      <span className="text-[#666666] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#333333]">
                    ₹{item.purchasePrice.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STOCK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EBCED6] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBCED6]">
              <h3 className="text-base font-bold text-[#333333]">Receive New Hardware Unit</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-[#333333] text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStock} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value as InventoryItem["category"];
                    setFormData({ ...formData, category: cat });
                  }}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                >
                  <option value="Panel">Panel</option>
                  <option value="Inverter">Inverter</option>
                  <option value="Battery">Battery</option>
                  <option value="Structure">Structure</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Cable">Cable</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase flex justify-between">
                  <span>Serial Number (Required)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const prefix = formData.category.toUpperCase().slice(0, 3);
                      setFormData({
                        ...formData,
                        serialNumber: `${prefix}-SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                      });
                    }}
                    className="text-[#4A355E] hover:underline text-[11px]"
                  >
                    ⚡ Auto-Generate
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-5K-OG-9988"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Storage Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 border border-[#EBCED6] text-[#666666] rounded-xl text-xs font-semibold hover:bg-[#F7EEF2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
