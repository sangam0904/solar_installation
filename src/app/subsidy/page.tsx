"use client";

import { LandmarkIcon, SearchIcon, IndianRupeeIcon } from "@/components/Icons";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Subsidy } from "@/data/mockData";
import { useSolarData } from "@/hooks/useSolarData";

export default function SubsidyPage() {
  const { data: subsidiesList, setData: setSubsidiesList, loading } = useSolarData<Subsidy>("subsidies");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedSubsidy, setSelectedSubsidy] = useState<Subsidy | null>(null);

  // New subsidy application form
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newOrderId, setNewOrderId] = useState("ORD-001");
  const [newCapacity, setNewCapacity] = useState("3 kW");
  const [newDiscom, setNewDiscom] = useState("JVVNL");

  const calculateSubsidy = (cap: string) => {
    if (cap === "1 kW") return 30000;
    if (cap === "2 kW") return 60000;
    return 78000;
  };

  const filtered = filterStatus === "All"
    ? subsidiesList
    : subsidiesList.filter((s) => s.disbursementStatus === filterStatus);

  const stats = {
    totalClaimed: subsidiesList.reduce((acc, curr) => acc + curr.subsidyAmount, 0),
    credited: subsidiesList
      .filter((s) => s.disbursementStatus === "Credited")
      .reduce((acc, curr) => acc + curr.subsidyAmount, 0),
    pending: subsidiesList
      .filter((s) => s.disbursementStatus !== "Credited")
      .reduce((acc, curr) => acc + curr.subsidyAmount, 0),
    totalCount: subsidiesList.length,
  };

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const app: Subsidy = {
      id: `SUB-${String(subsidiesList.length + 1).padStart(3, "0")}`,
      customerName: newCustName,
      orderId: newOrderId,
      capacity: newCapacity,
      subsidyAmount: calculateSubsidy(newCapacity),
      applicationNumber: `PM-SURYA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      discomName: newDiscom,
      aadhaarVerified: true,
      electricityBillVerified: true,
      discomApproval: "Pending",
      mnreApproval: "Pending",
      disbursementStatus: "Applied",
      appliedDate: "2026-10-31",
      approvalDate: "",
      creditDate: "",
    };
    setSubsidiesList([app, ...subsidiesList]);
    setShowApplyModal(false);
    setNewCustName("");
  };

  const handleUpdateStatus = (subId: string, newDisbStatus: Subsidy["disbursementStatus"]) => {
    setSubsidiesList((prev) =>
      prev.map((s) =>
        s.id === subId
          ? {
              ...s,
              disbursementStatus: newDisbStatus,
              discomApproval: newDisbStatus === "Credited" || newDisbStatus === "Processing" ? "Approved" : s.discomApproval,
              mnreApproval: newDisbStatus === "Credited" ? "Approved" : s.mnreApproval,
              creditDate: newDisbStatus === "Credited" ? "2026-10-31" : s.creditDate,
            }
          : s
      )
    );
    setSelectedSubsidy(null);
  };

  const getDisbBadge = (st: Subsidy["disbursementStatus"]) => {
    switch (st) {
      case "Credited":
        return "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40";
      case "Processing":
        return "bg-[#F7EEF2] text-[#4A355E] border-[#6D5284]/30";
      case "Applied":
        return "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40";
      case "Not Applied":
        return "bg-[#F7EEF2] text-[#666666] border-[#EBCED6]";
      case "Rejected":
        return "bg-[#FEF2F2] text-[#DC2626] border-red-200";
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <LandmarkIcon className="w-6 h-6 text-[#4A355E]" /> PM Surya Ghar Subsidy Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            National Solar Portal tracking, Discom technical feasibility, and DBT bank disbursements
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A355E] hover:bg-[#372447] text-white font-semibold rounded-xl text-xs shadow-xs transition"
        >
          <span>+</span> File Subsidy Application
        </button>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#78B77B] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Subsidies Credited</p>
              <p className="text-2xl font-extrabold text-[#78B77B] mt-1">
                ₹{(stats.credited / 100000).toFixed(1)} Lakhs
              </p>
            </div>
            <div className="w-11 h-11 bg-[#EBF5EC] text-[#78B77B] rounded-xl flex items-center justify-center text-xl font-bold">
              💰
            </div>
          </div>
          <p className="text-[11px] text-[#5B965E] font-medium mt-3">Transferred directly to customer bank</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#F4B860] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Disbursement Pipeline</p>
              <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">
                ₹{(stats.pending / 100000).toFixed(1)} Lakhs
              </p>
            </div>
            <div className="w-11 h-11 bg-[#FEF6EB] text-[#DA9B40] rounded-xl flex items-center justify-center text-xl font-bold">
              ⏳
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-3">Discom &amp; MNRE inspection pending</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#4A355E] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Total Value Claimed</p>
              <p className="text-2xl font-extrabold text-[#4A355E] mt-1">
                ₹{(stats.totalClaimed / 100000).toFixed(1)} Lakhs
              </p>
            </div>
            <div className="w-11 h-11 bg-[#F7EEF2] text-[#4A355E] rounded-xl flex items-center justify-center text-xl font-bold">
              📜
            </div>
          </div>
          <p className="text-[11px] text-[#4A355E] font-semibold mt-3">{stats.totalCount} active homeowner files</p>
        </div>
      </div>

      {/* Subsidy Slab Reference Pill Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EBCED6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#333333]">PM Surya Ghar Scheme DBT Rates:</span>
          <span className="bg-[#EBF5EC] text-[#5B965E] px-2 py-0.5 rounded-lg border border-[#78B77B]/40 font-bold">1 kW = ₹30,000</span>
          <span className="bg-[#F7EEF2] text-[#4A355E] px-2 py-0.5 rounded-lg border border-[#6D5284]/30 font-bold">2 kW = ₹60,000</span>
          <span className="bg-[#FEF6EB] text-[#DA9B40] px-2 py-0.5 rounded-lg border border-[#F4B860]/40 font-bold">3–5 kW = ₹78,000 (Max)</span>
        </div>
        <span className="text-[#666666]">Direct Benefit Transfer to Customer Account</span>
      </div>

      {/* Filter Status */}
      <div className="flex items-center gap-2">
        {["All", "Applied", "Processing", "Credited", "Not Applied"].map((st) => (
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBCED6] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#EBCED6] bg-[#F7EEF2] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Government Subsidy Applications ({filtered.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7EEF2] text-[#666666] font-semibold border-b border-[#EBCED6]">
              <tr>
                <th className="px-4 py-2.5">App ID</th>
                <th className="px-4 py-2.5">Customer &amp; Order</th>
                <th className="px-4 py-2.5">Application Number</th>
                <th className="px-4 py-2.5">Discom</th>
                <th className="px-4 py-2.5 text-center">Docs Verified</th>
                <th className="px-4 py-2.5 text-center">Discom Approval</th>
                <th className="px-4 py-2.5 text-right">Subsidy Amount</th>
                <th className="px-4 py-2.5 text-center">Bank Status</th>
                <th className="px-4 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBCED6]/60">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F7EEF2] transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-[#4A355E] font-bold">{s.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#333333]">{s.customerName}</div>
                    <div className="text-[11px] text-[#666666]">Size: {s.capacity} • {s.orderId}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#333333]">
                    {s.applicationNumber || <span className="text-[#DA9B40] italic">Pending Filing</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#333333]">{s.discomName}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${s.aadhaarVerified ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {s.aadhaarVerified ? "Aadhaar ✓" : "Aadhaar ✗"}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${s.electricityBillVerified ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {s.electricityBillVerified ? "Bill ✓" : "Bill ✗"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${s.discomApproval === "Approved" ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40" : "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40"}`}>
                      {s.discomApproval}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-extrabold text-[#78B77B]">
                    ₹{s.subsidyAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getDisbBadge(s.disbursementStatus)}`}>
                      {s.disbursementStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedSubsidy(s)}
                      className="px-2.5 py-1 bg-[#F7EEF2] hover:bg-[#EBCED6] text-[#333333] text-[11px] font-semibold rounded-lg border border-[#EBCED6]"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedSubsidy && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#EBCED6] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBCED6]">
              <h3 className="text-base font-bold text-[#333333]">Update Subsidy Milestone</h3>
              <button onClick={() => setSelectedSubsidy(null)} className="text-gray-400 hover:text-[#333333] text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="bg-[#F7EEF2] p-3 rounded-xl text-xs space-y-1 border border-[#EBCED6]">
              <div><strong>Customer:</strong> {selectedSubsidy.customerName}</div>
              <div><strong>Application No:</strong> {selectedSubsidy.applicationNumber}</div>
              <div><strong>Subsidy Entitlement:</strong> ₹{selectedSubsidy.subsidyAmount.toLocaleString("en-IN")}</div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#666666] uppercase">Select Milestone</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedSubsidy.id, "Applied")}
                  className="px-3 py-2 text-xs font-bold rounded-xl border bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40 hover:bg-[#F4B860]/20"
                >
                  Applied on Portal
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedSubsidy.id, "Processing")}
                  className="px-3 py-2 text-xs font-bold rounded-xl border bg-[#F7EEF2] text-[#4A355E] border-[#6D5284]/30 hover:bg-[#6D5284]/20"
                >
                  Discom Inspection
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedSubsidy.id, "Credited")}
                  className="col-span-2 px-3 py-2.5 text-xs font-bold rounded-xl border bg-[#78B77B] text-white hover:bg-[#5B965E] shadow-xs"
                >
                  ✓ Subsidy Credited to Customer Bank
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSubsidy(null)}
                className="px-4 py-1.5 bg-[#F7EEF2] hover:bg-[#EBCED6] text-[#333333] rounded-xl text-xs font-semibold border border-[#EBCED6]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW SUBSIDY APPLICATION MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EBCED6] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBCED6]">
              <h3 className="text-base font-bold text-[#333333]">National Portal Submission</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-[#333333] text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Customer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Plant Capacity</label>
                  <select
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-semibold"
                  >
                    <option value="1 kW">1 kW (₹30k subsidy)</option>
                    <option value="2 kW">2 kW (₹60k subsidy)</option>
                    <option value="3 kW">3 kW (₹78k subsidy)</option>
                    <option value="4 kW">4 kW (₹78k subsidy)</option>
                    <option value="5 kW">5 kW (₹78k subsidy)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Electricity Utility (Discom)</label>
                  <select
                    value={newDiscom}
                    onChange={(e) => setNewDiscom(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  >
                    <option value="JVVNL">JVVNL (Jaipur)</option>
                    <option value="AVVNL">AVVNL (Ajmer)</option>
                    <option value="JdVVNL">JdVVNL (Jodhpur)</option>
                    <option value="Tata Power">Tata Power</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#EBF5EC] border border-[#78B77B]/40 rounded-xl p-3 text-xs text-[#5B965E] font-medium">
                💰 Entitled Direct Benefit Transfer (DBT): <strong>₹{calculateSubsidy(newCapacity).toLocaleString("en-IN")}</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-3.5 py-1.5 border border-[#EBCED6] text-[#666666] rounded-xl text-xs font-semibold hover:bg-[#F7EEF2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
