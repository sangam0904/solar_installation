"use client";

import { useState, useMemo, useEffect } from "react";
import PageShell from "@/components/PageShell";
import { bomTemplates, BOMItem } from "@/data/mockData";

// ── Capacity / Grid options ──
const capacityOptions = ["1 kW", "2 kW", "3 kW", "4 kW", "5 kW"];
const gridOptions: { label: string; value: "On-Grid" | "Off-Grid" }[] = [
  { label: "On-Grid", value: "On-Grid" },
  { label: "Off-Grid", value: "Off-Grid" },
];

// ── Saved quotations mock data ──
interface SavedQuotation {
  id: string;
  customer: string;
  capacity: string;
  gridType: "On-Grid" | "Off-Grid";
  amount: number;
  date: string;
  status: "Sent" | "Accepted" | "Expired";
}

const savedQuotations: SavedQuotation[] = [
  { id: "QT-2026-001", customer: "Arjun Mehta", capacity: "4 kW", gridType: "On-Grid", amount: 250580, date: "2026-10-22", status: "Accepted" },
  { id: "QT-2026-002", customer: "Vikram Singh", capacity: "5 kW", gridType: "Off-Grid", amount: 395620, date: "2026-10-25", status: "Sent" },
  { id: "QT-2026-003", customer: "Priya Patel", capacity: "2 kW", gridType: "On-Grid", amount: 112340, date: "2026-10-18", status: "Expired" },
  { id: "QT-2026-004", customer: "Kavita Joshi", capacity: "3 kW", gridType: "Off-Grid", amount: 268750, date: "2026-10-20", status: "Accepted" },
  { id: "QT-2026-005", customer: "Deepak Agarwal", capacity: "5 kW", gridType: "On-Grid", amount: 322410, date: "2026-10-30", status: "Sent" },
];

// ── Helpers ──
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

function resolveTemplate(
  capacity: string,
  gridType: "On-Grid" | "Off-Grid"
): BOMItem[] | null {
  const exact = bomTemplates.find(
    (t) => t.capacity === capacity && t.gridType === gridType
  );
  if (exact) return exact.items;

  const fallbackMap: Record<string, string> = {
    "2 kW": "3 kW",
    "4 kW": "5 kW",
  };
  const fbCap = fallbackMap[capacity];
  if (fbCap) {
    const fb = bomTemplates.find(
      (t) => t.capacity === fbCap && t.gridType === gridType
    );
    if (fb) return fb.items;
  }
  return bomTemplates[0]?.items ?? null;
}

const statusColor: Record<SavedQuotation["status"], string> = {
  Sent: "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40",
  Accepted: "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40",
  Expired: "bg-[#FEF2F2] text-[#DC2626] border-red-200",
};

export default function QuotationsPage() {
  const [customerName, setCustomerName] = useState("Ramesh Sharma");
  const [selectedCapacity, setSelectedCapacity] = useState("3 kW");
  const [selectedGrid, setSelectedGrid] = useState<"On-Grid" | "Off-Grid">("On-Grid");
  const [quoteSent, setQuoteSent] = useState(false);

  const [today, setToday] = useState("31 Oct 2026");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  const bomItems = useMemo(
    () => resolveTemplate(selectedCapacity, selectedGrid),
    [selectedCapacity, selectedGrid]
  );

  const subtotal = useMemo(
    () =>
      bomItems
        ? bomItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
        : 0,
    [bomItems]
  );
  const gst = subtotal * 0.138;
  const grandTotal = subtotal + gst;

  return (
    <PageShell>
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <span>📋</span> Quotation & Automated BOM Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Instant Bill of Materials calculation for 1 kW to 5 kW On-Grid & Off-Grid systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-[#F5F7FA] text-[#734960] border border-[#734960]/30 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            🖨️ Print Quote
          </button>
          <button
            onClick={() => {
              setQuoteSent(true);
              setTimeout(() => setQuoteSent(false), 2500);
            }}
            className="px-4 py-2 bg-[#734960] hover:bg-[#5A354A] text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            ✉️ Send to Customer
          </button>
        </div>
      </div>

      {quoteSent && (
        <div className="p-3 bg-[#EBF5EC] border border-[#78B77B] text-[#5B965E] rounded-xl text-xs font-bold text-center animate-in fade-in">
          ✓ Quotation PDF generated and sent via WhatsApp & Email to {customerName}!
        </div>
      )}

      {/* ── Configuration Section ── */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#333333] uppercase tracking-wider">
          System Configuration & Spec Selection
        </h2>

        <div>
          <label className="text-[11px] font-bold text-[#666666] uppercase">Customer / Homeowner Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-[#E4E7EB] rounded-xl text-xs text-[#333333] font-semibold focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Capacity selection */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#666666] uppercase">Plant Capacity</span>
            <div className="grid grid-cols-5 gap-2">
              {capacityOptions.map((cap) => {
                const selected = selectedCapacity === cap;
                return (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setSelectedCapacity(cap)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center border ${
                      selected
                        ? "bg-[#734960] text-white border-[#734960] shadow-xs"
                        : "bg-[#F5F7FA] text-[#333333] border-[#E4E7EB] hover:bg-[#FAF4F7]"
                    }`}
                  >
                    {cap}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Type Selection */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#666666] uppercase">System Architecture</span>
            <div className="grid grid-cols-2 gap-2">
              {gridOptions.map((opt) => {
                const selected = selectedGrid === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedGrid(opt.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      selected
                        ? opt.value === "On-Grid"
                          ? "bg-[#78B77B] text-white border-[#78B77B] shadow-xs"
                          : "bg-[#F4B860] text-[#333333] border-[#F4B860] shadow-xs"
                        : "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB] hover:bg-gray-100"
                    }`}
                  >
                    <span>{opt.value === "On-Grid" ? "🔌" : "🔋"}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bill of Materials (BOM) Table ── */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E4E7EB] flex items-center justify-between bg-[#F5F7FA]">
          <div>
            <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              Itemized Bill of Materials (BOM)
            </h3>
            <p className="text-[10px] text-[#666666]">
              Auto-populated hardware kit for {selectedCapacity} {selectedGrid} System
            </p>
          </div>
          <span className="text-xs font-bold text-[#734960] bg-white px-3 py-1 rounded-full border border-[#E4E7EB]">
            {bomItems?.length ?? 0} Components
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-[#666666] font-semibold border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-2.5 w-10 text-center">#</th>
                <th className="px-4 py-2.5">Item Name</th>
                <th className="px-4 py-2.5">Specification</th>
                <th className="px-4 py-2.5 text-center">Qty</th>
                <th className="px-4 py-2.5 text-right">Unit Price (₹)</th>
                <th className="px-4 py-2.5 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EB]/60">
              {bomItems?.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-4 py-2.5 text-center text-[#666666] font-mono">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-bold text-[#333333]">{item.name}</td>
                  <td className="px-4 py-2.5 text-[#666666]">{item.specification}</td>
                  <td className="px-4 py-2.5 text-center font-semibold text-[#333333]">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-2.5 text-right text-[#666666]">{fmt(item.unitPrice)}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-[#333333]">
                    {fmt(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#FAF4F7] border-t border-[#E4E7EB] font-semibold">
              <tr>
                <td colSpan={5} className="px-4 py-2 text-right text-[#666666]">
                  Hardware Subtotal:
                </td>
                <td className="px-4 py-2 text-right font-bold text-[#333333]">₹{fmt(subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={5} className="px-4 py-2 text-right text-[#666666]">
                  GST (Blended 13.8%):
                </td>
                <td className="px-4 py-2 text-right text-[#666666]">₹{fmt(gst)}</td>
              </tr>
              <tr className="border-t border-[#734960]/20 text-sm">
                <td colSpan={5} className="px-4 py-3 text-right font-bold text-[#734960]">
                  Grand Total (Incl. Taxes & Delivery):
                </td>
                <td className="px-4 py-3 text-right font-extrabold text-[#734960]">
                  ₹{fmt(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Quotation Formal Preview ── */}
      <div className="bg-white rounded-2xl border-2 border-[#734960]/30 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#E4E7EB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-[#F4B860] rounded-lg flex items-center justify-center text-sm shadow-xs">
                ☀️
              </span>
              <h3 className="text-lg font-bold text-[#734960]">SunPower Solutions Pvt Ltd</h3>
            </div>
            <p className="text-xs text-[#666666] mt-1">
              Plot 42, Solar Park Road, Industrial Area Phase-1, Jaipur 302013
            </p>
            <p className="text-xs text-[#666666]">GSTIN: 08AAACS1234F1Z5 • Phone: +91 141 289900</p>
          </div>
          <div className="sm:text-right">
            <span className="px-2.5 py-1 bg-[#FAF4F7] text-[#734960] font-mono text-xs font-bold rounded-lg border border-[#8E687F]/30">
              QT-2026-088
            </span>
            <p className="text-xs text-[#666666] mt-1.5">Date: {today}</p>
            <p className="text-xs font-bold text-[#DA9B40]">Validity: 15 Days</p>
          </div>
        </div>

        <div className="bg-[#F5F7FA] p-3 rounded-xl text-xs flex flex-col sm:flex-row justify-between gap-2 border border-[#E4E7EB]">
          <div>
            <span className="text-[#666666]">Prepared For:</span>
            <p className="font-bold text-[#333333] text-sm">{customerName}</p>
          </div>
          <div>
            <span className="text-[#666666]">System Size:</span>
            <p className="font-bold text-[#333333]">{selectedCapacity} {selectedGrid}</p>
          </div>
          <div>
            <span className="text-[#666666]">Estimated PM Surya Ghar Subsidy:</span>
            <p className="font-bold text-[#78B77B]">
              {selectedCapacity === "1 kW" ? "₹30,000" : selectedCapacity === "2 kW" ? "₹60,000" : "₹78,000"}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-[#666666]">Net Out-of-Pocket Cost:</span>
            <p className="font-extrabold text-[#734960] text-sm">
              ₹{fmt(Math.max(0, grandTotal - (selectedCapacity === "1 kW" ? 30000 : selectedCapacity === "2 kW" ? 60000 : 78000)))}
            </p>
          </div>
        </div>

        {/* Commercial Terms */}
        <div className="text-xs text-[#666666] space-y-1.5 border-t border-[#E4E7EB] pt-3">
          <p className="font-bold text-[#333333]">Commercial Terms & Warranty Commitments:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            <li>50% advance along with confirmed order, 50% upon physical installation & inverter handover.</li>
            <li>Solar Panels: 25-Year performance warranty. Inverter & Lithium Batteries: 5-Year comprehensive replacement warranty.</li>
            <li>Government subsidy support via National Solar Portal handled end-to-end by SunPower Solutions.</li>
          </ul>
        </div>
      </div>

      {/* ── Saved Quotations Table ── */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E4E7EB] bg-[#F5F7FA]">
          <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Recent Client Quotations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-[#666666] font-semibold border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-2.5">Quote ID</th>
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Capacity</th>
                <th className="px-4 py-2.5">Grid Type</th>
                <th className="px-4 py-2.5 text-right">Amount (₹)</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EB]/60">
              {savedQuotations.map((q) => (
                <tr key={q.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#734960]">{q.id}</td>
                  <td className="px-4 py-3 font-semibold text-[#333333]">{q.customer}</td>
                  <td className="px-4 py-3 text-[#333333]">{q.capacity}</td>
                  <td className="px-4 py-3 text-[#666666]">{q.gridType}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#333333]">₹{fmt(q.amount)}</td>
                  <td className="px-4 py-3 text-[#666666] font-mono text-[11px]">{q.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor[q.status]}`}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
