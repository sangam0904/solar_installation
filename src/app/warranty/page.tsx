"use client";

import { ShieldCheckIcon, SearchIcon } from "@/components/Icons";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Warranty } from "@/data/mockData";
import { useSolarData } from "@/hooks/useSolarData";

export default function WarrantyPage() {
  const { data: warrantyList, setData: setWarrantyList, loading } = useSolarData<Warranty>("warranties");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimIssue, setClaimIssue] = useState("");
  const [claimSuccess, setClaimSuccess] = useState(false);

  const filteredWarranties = warrantyList.filter((w) => {
    const matchesFilter = filterStatus === "All" || w.status === filterStatus;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      w.serialNumber.toLowerCase().includes(query) ||
      w.customerName.toLowerCase().includes(query) ||
      w.phone.includes(query) ||
      w.orderId.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const searchedMatch = searchQuery.trim()
    ? warrantyList.find(
        (w) =>
          w.serialNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
          w.phone.replace(/\s+/g, "").includes(searchQuery.trim().replace(/\s+/g, ""))
      )
    : null;

  const stats = {
    active: warrantyList.filter((w) => w.status === "Active").length,
    expiring: warrantyList.filter((w) => w.status === "Expiring Soon").length,
    expired: warrantyList.filter((w) => w.status === "Expired").length,
    claims: warrantyList.reduce((acc, curr) => acc + curr.claimCount, 0),
  };

  const handleOpenClaim = (w: Warranty) => {
    setSelectedWarranty(w);
    setClaimIssue("");
    setClaimSuccess(false);
    setShowClaimModal(true);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarranty) return;

    setWarrantyList((prev) =>
      prev.map((w) =>
        w.id === selectedWarranty.id
          ? { ...w, claimCount: w.claimCount + 1 }
          : w
      )
    );
    setClaimSuccess(true);
    setTimeout(() => {
      setShowClaimModal(false);
      setSelectedWarranty(null);
    }, 1500);
  };

  const getStatusBadge = (status: Warranty["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40";
      case "Expiring Soon":
        return "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40";
      case "Expired":
        return "bg-[#FEF2F2] text-[#DC2626] border-red-200";
      case "Claimed":
        return "bg-[#F7EEF2] text-[#4A355E] border-[#6D5284]/30";
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
            <ShieldCheckIcon className="w-6 h-6 text-[#4A355E]" /> 20-Year Solar Warranty &amp; Asset Registry
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Automated warranty countdowns for panels, inverters, and battery storage systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchQuery("INV-5K-OG-9921")}
            className="px-3 py-1.5 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#4A355E]/30 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            🔍 Search Inverter
          </button>
          <button
            onClick={() => setSearchQuery("+91 99887 76655")}
            className="px-3 py-1.5 bg-white hover:bg-[#F7EEF2] text-[#6D5284] border border-[#6D5284]/30 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            📞 Search Phone
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#78B77B] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Active Warranties</p>
              <p className="text-2xl font-extrabold text-[#78B77B] mt-1">{stats.active}</p>
            </div>
            <div className="w-11 h-11 bg-[#EBF5EC] text-[#78B77B] rounded-xl flex items-center justify-center text-xl font-bold">
              🛡️
            </div>
          </div>
          <p className="text-[11px] text-[#5B965E] font-medium mt-3">Full replacement covered</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#F4B860] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Expiring Soon</p>
              <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">{stats.expiring}</p>
            </div>
            <div className="w-11 h-11 bg-[#FEF6EB] text-[#DA9B40] rounded-xl flex items-center justify-center text-xl font-bold">
              ⏳
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-3">&lt; 6 months validity</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-red-400 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Expired</p>
              <p className="text-2xl font-extrabold text-[#DC2626] mt-1">{stats.expired}</p>
            </div>
            <div className="w-11 h-11 bg-[#FEF2F2] text-[#DC2626] rounded-xl flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
          </div>
          <p className="text-[11px] text-[#DC2626] font-medium mt-3">Paid service / AMC eligible</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#4A355E] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Claims Settled</p>
              <p className="text-2xl font-extrabold text-[#4A355E] mt-1">{stats.claims}</p>
            </div>
            <div className="w-11 h-11 bg-[#F7EEF2] text-[#4A355E] rounded-xl flex items-center justify-center text-xl font-bold">
              📝
            </div>
          </div>
          <p className="text-[11px] text-[#4A355E] font-semibold mt-3">Free parts replaced</p>
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="bg-white border border-[#EBCED6] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5B965E] inline-block"></span> Customer Breakdown &amp; Warranty Checker
            </h3>
            <p className="text-[11px] text-[#666666]">
              Lookup customer phone or serial number to immediately confirm active coverage
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Enter phone (+91...) or Serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 px-3 py-1.5 text-xs bg-[#F7EEF2] border border-[#EBCED6] rounded-xl focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-2.5 py-1.5 bg-[#F7EEF2] hover:bg-[#EBCED6] text-[#666666] text-xs font-bold rounded-xl border border-[#EBCED6]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Searched Match Card */}
        {searchedMatch && (
          <div className="bg-[#F7EEF2] border-2 border-[#4A355E] rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#333333]">{searchedMatch.productName}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadge(searchedMatch.status)}`}>
                  {searchedMatch.status}
                </span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-white text-[#4A355E] font-bold border border-[#EBCED6]">
                  {searchedMatch.warrantyYears} Years Term
                </span>
              </div>
              <p className="text-xs font-mono text-[#666666]">
                Serial: <strong>{searchedMatch.serialNumber}</strong> • Order: {searchedMatch.orderId}
              </p>
              <p className="text-xs text-[#333333]">
                Customer: <strong>{searchedMatch.customerName}</strong> ({searchedMatch.phone})
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-left sm:text-right text-xs">
                <p className="text-[#666666]">Installed: {searchedMatch.installDate}</p>
                <p className="font-bold text-[#333333]">Expires: {searchedMatch.expiryDate}</p>
                <p className="text-[#5B965E] font-bold text-[11px]">
                  {searchedMatch.status === "Active" ? "✓ 100% Free Replacement Eligible" : "⚠️ Out of Warranty - Paid"}
                </p>
              </div>
              <button
                onClick={() => handleOpenClaim(searchedMatch)}
                className="px-3.5 py-1.5 bg-[#4A355E] hover:bg-[#372447] text-white text-xs font-bold rounded-xl shadow-xs transition whitespace-nowrap"
              >
                + File Claim
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        {["All", "Active", "Expiring Soon", "Expired"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              filterStatus === st
                ? "bg-[#4A355E] text-white border-[#4A355E] shadow-xs"
                : "bg-white text-[#666666] border-[#EBCED6] hover:bg-[#F7EEF2]"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Warranties Table */}
      <div className="bg-white rounded-2xl border border-[#EBCED6] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#EBCED6] bg-[#F7EEF2]">
          <h2 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Warranty Registry Database ({filteredWarranties.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7EEF2] text-[#666666] font-semibold border-b border-[#EBCED6]">
              <tr>
                <th className="px-4 py-2.5">Warranty ID</th>
                <th className="px-4 py-2.5">Serial &amp; Product</th>
                <th className="px-4 py-2.5">Customer &amp; Phone</th>
                <th className="px-4 py-2.5">Installed</th>
                <th className="px-4 py-2.5 text-center">Period</th>
                <th className="px-4 py-2.5">Expiry Date</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5 text-center">Claims</th>
                <th className="px-4 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBCED6]/60">
              {filteredWarranties.map((w) => (
                <tr key={w.id} className="hover:bg-[#F7EEF2] transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-[#4A355E] font-bold">{w.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#333333]">{w.productName}</div>
                    <div className="text-[11px] font-mono text-[#6D5284]">{w.serialNumber}</div>
                    <span className="text-[10px] text-gray-400">{w.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#333333]">{w.customerName}</div>
                    <div className="text-[11px] text-[#666666]">{w.phone}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{w.orderId}</div>
                  </td>
                  <td className="px-4 py-3 text-[#666666]">{w.installDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-[#333333]">{w.warrantyYears} yrs</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#333333]">{w.expiryDate}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(w.status)}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${w.claimCount > 0 ? "bg-[#FEF6EB] text-[#DA9B40]" : "bg-[#F7EEF2] text-[#666666]"}`}>
                      {w.claimCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleOpenClaim(w)}
                      className="px-2.5 py-1 bg-[#F7EEF2] hover:bg-[#6D5284] hover:text-white text-[#4A355E] border border-[#6D5284]/30 text-[11px] font-bold rounded-lg transition"
                    >
                      + Claim
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLAIM FILING MODAL */}
      {showClaimModal && selectedWarranty && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EBCED6] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBCED6]">
              <div>
                <h3 className="text-base font-bold text-[#333333]">File Warranty Replacement Claim</h3>
                <p className="text-xs text-[#666666]">Asset: {selectedWarranty.serialNumber}</p>
              </div>
              <button
                onClick={() => setShowClaimModal(false)}
                className="text-gray-400 hover:text-[#333333] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className={`p-3 rounded-xl text-xs font-semibold ${selectedWarranty.status === "Active" ? "bg-[#EBF5EC] text-[#5B965E] border border-[#78B77B]/40" : "bg-[#FEF2F2] text-[#DC2626] border border-red-200"}`}>
              {selectedWarranty.status === "Active" ? (
                <span>🎉 <strong>Under Warranty:</strong> Repair/replacement will cost ₹0. Parts & labor 100% covered.</span>
              ) : (
                <span>⚠️ <strong>Warranty Expired:</strong> Standard parts billing and visit fees apply.</span>
              )}
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-3">
              <div className="bg-[#F7EEF2] p-3 rounded-xl text-xs space-y-1 border border-[#EBCED6]">
                <div><strong>Customer:</strong> {selectedWarranty.customerName} ({selectedWarranty.phone})</div>
                <div><strong>Product:</strong> {selectedWarranty.productName}</div>
                <div><strong>Warranty Ends:</strong> {selectedWarranty.expiryDate}</div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Problem Description / Error Code</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inverter showing Error Code E-04 during morning generation..."
                  value={claimIssue}
                  onChange={(e) => setClaimIssue(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                  required
                />
              </div>

              {claimSuccess && (
                <div className="p-2.5 bg-[#EBF5EC] text-[#5B965E] text-xs font-bold rounded-xl border border-[#78B77B] text-center">
                  ✓ Claim Registered! Service ticket auto-generated.
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-3.5 py-1.5 border border-[#EBCED6] text-[#666666] rounded-xl text-xs font-semibold hover:bg-[#F7EEF2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Submit & Dispatch Tech
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
