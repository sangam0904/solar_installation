"use client";

import { SettingsIcon, ShieldCheckIcon, UserIcon } from "@/components/Icons";

import { useState, useRef } from "react";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user, role, updateProfilePhoto } = useAuth();
  const [saved, setSaved] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileMsg("Please select a valid image file (JPG, PNG, WebP).");
      setTimeout(() => setProfileMsg(""), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateProfilePhoto(dataUrl);
        setProfileMsg("✓ Profile photo updated successfully!");
        setTimeout(() => setProfileMsg(""), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    updateProfilePhoto("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setProfileMsg("Profile photo removed.");
    setTimeout(() => setProfileMsg(""), 2000);
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#4A355E]" /> Company Settings &amp; Profile Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Manage your personal profile, company legal credentials, pricing engine, and hardware parameters
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* ── USER PROFILE SECTION ── */}
        <div className="bg-white rounded-2xl border border-[#EBCED6] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBCED6] pb-3">
            <div>
              <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-[#4A355E]" /> User Profile &amp; Avatar
              </h3>
              <p className="text-[11px] text-[#666666]">
                Upload your personal profile photo to display across the header, sidebar, and field dispatch reports
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F7EEF2] text-[#4A355E] border border-[#6D5284]/30 uppercase">
              {role} Account
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar Preview */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#4A355E]/30 shadow-sm flex items-center justify-center bg-[#F7EEF2]">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl select-none">
                    {user?.avatar || (role === "technician" ? "👷" : role === "customer" ? "👤" : "👑")}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Profile Info & Actions */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div>
                <h4 className="text-sm font-bold text-[#333333]">{user?.name || "Active User"}</h4>
                <p className="text-xs text-[#666666]">{user?.email || "user@sunpower.com"}</p>
                {user?.phone && (
                  <p className="text-[11px] text-[#666666] mt-0.5">📞 {user.phone}</p>
                )}
              </div>

              {/* Photo Upload Controls */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-[#4A355E] hover:bg-[#372447] text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <span>📷</span> Upload New Photo
                </button>

                {user?.profilePhoto && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 bg-[#FEF2F2] hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-semibold rounded-xl transition"
                  >
                    Remove Photo
                  </button>
                )}

                <span className="text-[10px] text-[#666666] block sm:inline">
                  (Supports JPG, PNG, WebP up to 5MB)
                </span>
              </div>

              {profileMsg && (
                <p className="text-xs font-bold text-[#5B965E] animate-in fade-in">
                  {profileMsg}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── COMPANY SETTINGS FORM ── */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Company Legal Profile */}
          <div className="bg-white rounded-2xl border border-[#EBCED6] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider border-b border-[#EBCED6] pb-2">
              🏢 Company Legal &amp; Discom Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">GSTIN Registration</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-mono"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-[#666666] uppercase">Discom Approved Vendor ID</label>
                <input
                  type="text"
                  value={discomReg}
                  onChange={(e) => setDiscomReg(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-mono"
                />
                <p className="text-[10px] text-[#666666] mt-1">
                  Used for auto-populating National Solar Portal DBT submissions
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Estimation Defaults */}
          <div className="bg-white rounded-2xl border border-[#EBCED6] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider border-b border-[#EBCED6] pb-2">
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
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-semibold"
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
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-semibold"
                />
                <p className="text-[10px] text-[#666666] mt-1">12% Goods + 18% Services blended</p>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Labor Rate (₹/kW)</label>
                <input
                  type="number"
                  value={laborChargePerKw}
                  onChange={(e) => setLaborChargePerKw(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-semibold"
                />
                <p className="text-[10px] text-[#666666] mt-1">Crew mounting &amp; testing fee</p>
              </div>
            </div>
          </div>

          {/* Warranty Standard Terms */}
          <div className="bg-white rounded-2xl border border-[#EBCED6] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider border-b border-[#EBCED6] pb-2">
              🛡️ Standard Equipment Warranty Clauses
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3.5 bg-[#EBF5EC] rounded-xl border border-[#78B77B]/40">
                <p className="text-[11px] font-bold text-[#5B965E]">Solar Panels</p>
                <p className="text-lg font-extrabold text-[#78B77B] mt-0.5">25 Years</p>
                <span className="text-[10px] text-[#5B965E]">80% Performance Output</span>
              </div>
              <div className="p-3.5 bg-[#F7EEF2] rounded-xl border border-[#6D5284]/30">
                <p className="text-[11px] font-bold text-[#4A355E]">Grid Inverters</p>
                <p className="text-lg font-extrabold text-[#4A355E] mt-0.5">5 Years</p>
                <span className="text-[10px] text-[#4A355E]">Full Replacement</span>
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
              className="px-5 py-2 bg-[#4A355E] hover:bg-[#372447] text-white font-bold rounded-xl text-xs shadow-xs transition"
            >
              Save Master Settings
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
