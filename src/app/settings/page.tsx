"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState("SunPower Solutions Pvt Ltd");
  const [gstin, setGstin] = useState("08AAACS1234F1Z5");
  const [discomReg, setDiscomReg] = useState("JVVNL-SOLAR-VENDOR-2024-88");
  const [panelRatePerWatt, setPanelRatePerWatt] = useState(26.5);
  const [gstRate, setGstRate] = useState(13.8);
  const [laborChargePerKw, setLaborChargePerKw] = useState(3500);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <span>⚙️</span> Company Settings &amp; Master Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Configure rates, tax structures, Discom registration IDs, and hardware defaults
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Company Profile */}
        <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider border-b border-[#E4E7EB] pb-2">
            🏢 Company Legal &amp; Discom Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-[#666666] uppercase">Company Legal Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#666666] uppercase">GSTIN Registration</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-[#666666] uppercase">Discom Approved Vendor ID</label>
              <input
                type="text"
                value={discomReg}
                onChange={(e) => setDiscomReg(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-mono"
              />
              <p className="text-[10px] text-[#666666] mt-1">
                Used for auto-populating National Solar Portal DBT submissions
              </p>
            </div>
          </div>
        </div>

        {/* Pricing & Estimation Defaults */}
        <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider border-b border-[#E4E7EB] pb-2">
            💰 Pricing Engine &amp; Tax Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-[#666666] uppercase">Solar Panel Rate (₹/Watt)</label>
              <input
                type="number"
                step="0.5"
                value={panelRatePerWatt}
                onChange={(e) => setPanelRatePerWatt(Number(e.target.value))}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold"
              />
              <p className="text-[10px] text-[#666666] mt-1">Mono PERC 540W Tier-1 Base</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#666666] uppercase">Blended GST Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold"
              />
              <p className="text-[10px] text-[#666666] mt-1">12% Goods + 18% Services blended</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#666666] uppercase">Labor Rate (₹/kW)</label>
              <input
                type="number"
                value={laborChargePerKw}
                onChange={(e) => setLaborChargePerKw(Number(e.target.value))}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold"
              />
              <p className="text-[10px] text-[#666666] mt-1">Crew mounting &amp; testing fee</p>
            </div>
          </div>
        </div>

        {/* Warranty Standard Terms */}
        <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider border-b border-[#E4E7EB] pb-2">
            🛡️ Standard Equipment Warranty Clauses
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3.5 bg-[#EBF5EC] rounded-xl border border-[#78B77B]/40">
              <p className="text-[11px] font-bold text-[#5B965E]">Solar Panels</p>
              <p className="text-lg font-extrabold text-[#78B77B] mt-0.5">25 Years</p>
              <span className="text-[10px] text-[#5B965E]">80% Performance Output</span>
            </div>
            <div className="p-3.5 bg-[#FAF4F7] rounded-xl border border-[#8E687F]/30">
              <p className="text-[11px] font-bold text-[#734960]">Grid Inverters</p>
              <p className="text-lg font-extrabold text-[#734960] mt-0.5">5 Years</p>
              <span className="text-[10px] text-[#734960]">Full Replacement</span>
            </div>
            <div className="p-3.5 bg-[#FEF6EB] rounded-xl border border-[#F4B860]/40">
              <p className="text-[11px] font-bold text-[#DA9B40]">Lithium Batteries</p>
              <p className="text-lg font-extrabold text-[#DA9B40] mt-0.5">5 Years</p>
              <span className="text-[10px] text-[#DA9B40]">6,000 Cycle Life</span>
            </div>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-[#EBF5EC] border border-[#78B77B] rounded-xl text-center text-xs text-[#5B965E] font-bold animate-in fade-in">
            ✓ Master settings updated and synced with quotation calculator!
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[#734960] hover:bg-[#5A354A] text-white font-bold rounded-xl text-xs shadow-xs transition"
          >
            Save Master Settings
          </button>
        </div>
      </form>
    </PageShell>
  );
}
