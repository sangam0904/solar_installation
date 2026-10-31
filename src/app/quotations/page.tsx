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

  // PM Surya Ghar subsidy amounts based on plant capacity
  const subsidyAmount = useMemo(() => {
    if (selectedGrid === "Off-Grid") return 0;
    if (selectedCapacity === "1 kW") return 30000;
    if (selectedCapacity === "2 kW") return 60000;
    return 78000; // 3 kW and above get max ₹78,000 under PM Surya Ghar
  }, [selectedCapacity, selectedGrid]);

  const netPayable = Math.max(0, grandTotal - subsidyAmount);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <PageShell>
      {/* ── 1. Page Header (Hidden on Print) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <span>📋</span> Quotation &amp; Automated BOM Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Instant Bill of Materials calculation &amp; formal quote generation for 1 kW to 5 kW systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white hover:bg-[#FAF4F7] text-[#734960] border border-[#734960]/30 rounded-xl text-xs font-bold card-floating transition flex items-center gap-2 cursor-pointer"
            title="Print clean quotation bill or save as PDF"
          >
            <span>🖨️</span> Print Quote (Bill Only)
          </button>
          <button
            onClick={() => {
              setQuoteSent(true);
              setTimeout(() => setQuoteSent(false), 2500);
            }}
            className="px-4 py-2 bg-[#734960] hover:bg-[#5A354A] text-white rounded-xl text-xs font-bold card-floating transition flex items-center gap-2 cursor-pointer"
          >
            <span>✉️</span> Send to Customer
          </button>
        </div>
      </div>

      {quoteSent && (
        <div className="p-3 bg-[#EBF5EC] border border-[#78B77B] text-[#5B965E] rounded-xl text-xs font-bold text-center animate-in fade-in print:hidden">
          ✓ Quotation PDF generated and dispatched via WhatsApp &amp; Email to {customerName}!
        </div>
      )}

      {/* ── 2. Configuration Section (Hidden on Print) ── */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 card-floating space-y-4 print:hidden">
        <h2 className="text-sm font-bold text-[#333333] uppercase tracking-wider">
          System Configuration &amp; Spec Selection
        </h2>

        <div>
          <label className="text-[11px] font-bold text-[#666666] uppercase">Customer / Homeowner Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full mt-1 px-3.5 py-2 border border-[#E4E7EB] rounded-xl text-xs text-[#333333] font-semibold focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
            placeholder="Enter customer name..."
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
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center border cursor-pointer ${
                      selected
                        ? "bg-[#734960] text-white border-[#734960] card-floating"
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
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                      selected
                        ? opt.value === "On-Grid"
                          ? "bg-[#78B77B] text-white border-[#78B77B] card-floating"
                          : "bg-[#F4B860] text-[#333333] border-[#F4B860] card-floating"
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

      {/* ── 3. FORMAL QUOTATION BILL DOCUMENT (The ONLY part printed in PDF) ── */}
      <div
        id="printable-quotation-bill"
        className="printable-quote-bill bg-white rounded-2xl border-2 border-[#734960]/20 p-6 sm:p-8 card-floating space-y-6"
      >
        {/* Letterhead Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-[#734960]/40 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#F4B860] rounded-xl flex items-center justify-center text-xl shadow-xs">
                ☀️
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#734960] tracking-tight">
                  SunPower Solutions Pvt. Ltd.
                </h2>
                <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                  MNRE Channel Partner &amp; Rooftop Solar Turnkey EPC
                </p>
              </div>
            </div>
            <p className="text-xs text-[#555555] mt-2">
              Plot 42, Solar Park Road, Industrial Area Phase-1, Jaipur 302013, Rajasthan
            </p>
            <p className="text-xs text-[#555555]">
              GSTIN: <strong>08AAACS1234F1Z5</strong> • CIN: U40106RJ2026PTC099881
            </p>
            <p className="text-xs text-[#555555]">
              Phone: +91 141 289900 • Email: billing@sunpower.com • Web: www.sunpower.com
            </p>
          </div>

          <div className="sm:text-right flex flex-col sm:items-end">
            <span className="px-3 py-1 bg-[#FAF4F7] text-[#734960] font-mono text-xs font-extrabold rounded-lg border border-[#8E687F]/30">
              QUOTE REF: QT-2026-088
            </span>
            <p className="text-xs text-[#333333] font-bold mt-2">
              Issue Date: <span className="font-semibold text-[#666666]">{today}</span>
            </p>
            <p className="text-xs text-[#DA9B40] font-bold">
              Validity: 15 Days (Until 15 Nov 2026)
            </p>
            <p className="text-[11px] text-[#666666] mt-0.5">
              Sales Engineer: <strong>Rohit Meena</strong>
            </p>

            <button
              onClick={handlePrint}
              className="mt-3 px-3 py-1 bg-[#734960] hover:bg-[#5A354A] text-white text-[11px] font-bold rounded-lg print:hidden cursor-pointer"
            >
              🖨️ Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Bill To & Project Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5F7FA] p-4 rounded-xl border border-[#E4E7EB] text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#734960] tracking-wider block">
              QUOTATION TO (CLIENT DETAILS)
            </span>
            <p className="text-base font-extrabold text-[#333333] mt-0.5">{customerName}</p>
            <p className="text-[#666666] mt-0.5">Site Location: Jaipur, Rajasthan (JVVNL Discom Area)</p>
            <p className="text-[#666666]">Contact: +91 99887 76655 • Electricity K-No: 2108-9943-12</p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold uppercase text-[#78B77B] tracking-wider block">
              PROPOSED SYSTEM SPECIFICATIONS
            </span>
            <p className="text-base font-extrabold text-[#333333] mt-0.5">
              {selectedCapacity} {selectedGrid} Solar Power Plant
            </p>
            <p className="text-[#666666] mt-0.5">
              Est. Daily Generation: <strong>~{parseInt(selectedCapacity) * 4.3} kWh / Day</strong>
            </p>
            <p className="text-[#5B965E] font-semibold">
              Eligible for PM Surya Ghar DBT Central Subsidy
            </p>
          </div>
        </div>

        {/* Itemized Bill of Materials (BOM) */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h4 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              Itemized Hardware &amp; BOS Component Bill
            </h4>
            <span className="text-[11px] text-[#666666]">
              All items meet MNRE &amp; ALMM compliance standards
            </span>
          </div>

          <table className="w-full text-left text-xs border border-[#E4E7EB]">
            <thead className="bg-[#FAF4F7] text-[#333333] font-bold border-b border-[#E4E7EB]">
              <tr>
                <th className="px-3 py-2.5 w-10 text-center">#</th>
                <th className="px-3 py-2.5">Component Description</th>
                <th className="px-3 py-2.5">Technical Specification</th>
                <th className="px-3 py-2.5 text-center">Qty</th>
                <th className="px-3 py-2.5 text-right">Unit Rate (₹)</th>
                <th className="px-3 py-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EB]">
              {bomItems?.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F5F7FA]">
                  <td className="px-3 py-2 text-center text-[#666666] font-mono">{idx + 1}</td>
                  <td className="px-3 py-2 font-bold text-[#333333]">{item.name}</td>
                  <td className="px-3 py-2 text-[#666666]">{item.specification}</td>
                  <td className="px-3 py-2 text-center font-semibold text-[#333333]">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-3 py-2 text-right text-[#666666]">{fmt(item.unitPrice)}</td>
                  <td className="px-3 py-2 text-right font-bold text-[#333333]">
                    ₹{fmt(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#F5F7FA] font-bold border-t-2 border-[#E4E7EB]">
              <tr>
                <td colSpan={5} className="px-3 py-2 text-right text-[#666666]">
                  Hardware Subtotal:
                </td>
                <td className="px-3 py-2 text-right font-bold text-[#333333]">₹{fmt(subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={5} className="px-3 py-2 text-right text-[#666666]">
                  GST (Blended 13.8% for Solar Turnkey EPC):
                </td>
                <td className="px-3 py-2 text-right text-[#666666]">₹{fmt(gst)}</td>
              </tr>
              <tr className="border-t border-[#734960]/30 bg-[#FAF4F7]">
                <td colSpan={5} className="px-3 py-2.5 text-right font-bold text-[#734960]">
                  Gross Project Turnkey Cost (All Inclusive):
                </td>
                <td className="px-3 py-2.5 text-right font-extrabold text-[#734960]">
                  ₹{fmt(grandTotal)}
                </td>
              </tr>
              {subsidyAmount > 0 && (
                <tr className="bg-[#EBF5EC] text-[#5B965E]">
                  <td colSpan={5} className="px-3 py-2 text-right font-bold">
                    Less: PM Surya Ghar Central DBT Subsidy (Credited Directly to Customer Bank):
                  </td>
                  <td className="px-3 py-2 text-right font-extrabold text-[#5B965E]">
                    - ₹{fmt(subsidyAmount)}
                  </td>
                </tr>
              )}
              <tr className="bg-[#734960] text-white text-sm">
                <td colSpan={5} className="px-3 py-3 text-right font-extrabold uppercase tracking-wide">
                  Net Customer Out-of-Pocket Cost (Final Payable):
                </td>
                <td className="px-3 py-3 text-right font-black text-base">
                  ₹{fmt(netPayable)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Commercial Terms & Warranties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E4E7EB] pt-4 text-xs text-[#555555]">
          <div>
            <h5 className="font-bold text-[#333333] uppercase text-[11px] mb-1">
              Warranty Guarantees
            </h5>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li><strong>Solar PV Modules:</strong> 25-Year Linear Power Warranty (&lt;0.5% yearly degradation).</li>
              <li><strong>Inverter &amp; Protection:</strong> 5-Year Comprehensive Warranty with ₹0 replacement.</li>
              <li><strong>Galvanized Structure:</strong> 5-Year Rust &amp; Structural Wind Resilience (150 km/h).</li>
              <li><strong>Workmanship &amp; EPC:</strong> 5-Year Free Service &amp; Annual Preventive Maintenance.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#333333] uppercase text-[11px] mb-1">
              Commercial &amp; Payment Terms
            </h5>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li><strong>Payment Schedule:</strong> 50% advance on PO, 50% on hardware installation &amp; testing.</li>
              <li><strong>Net-Metering:</strong> JVVNL / Discom liaisoning &amp; bi-directional meter managed by us.</li>
              <li><strong>Govt. Subsidy:</strong> National Solar Portal documentation uploaded within 48h of grid sync.</li>
              <li><strong>Validity:</strong> Prices firm for 15 days from quote generation date.</li>
            </ul>
          </div>
        </div>

        {/* Signature & Acceptance Block */}
        <div className="grid grid-cols-2 gap-8 border-t-2 border-[#E4E7EB] pt-6 mt-4 text-xs">
          <div>
            <p className="font-bold text-[#333333]">For SunPower Solutions Pvt. Ltd.</p>
            <div className="h-14 flex items-end">
              <span className="text-[10px] text-[#734960] font-mono font-bold italic">
                [Digitally Signed by Sales Director]
              </span>
            </div>
            <p className="border-t border-[#333333] pt-1 font-semibold text-[#555555]">
              Authorized Signatory &amp; Stamp
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <p className="font-bold text-[#333333]">Customer Acceptance</p>
            <div className="h-14 flex items-end">
              <span className="text-[10px] text-gray-400 italic">Signature &amp; Date</span>
            </div>
            <p className="border-t border-[#333333] pt-1 font-semibold text-[#555555] w-48 text-right">
              {customerName}
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. Saved Quotations Table (Hidden on Print) ── */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] card-floating overflow-hidden print:hidden">
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
