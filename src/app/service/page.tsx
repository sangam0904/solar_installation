"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { serviceTickets as initialTickets, ServiceTicket, warranties } from "@/data/mockData";

export default function ServiceDeskPage() {
  const [tickets, setTickets] = useState<ServiceTicket[]>(initialTickets);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);

  // New ticket state
  const [custPhone, setCustPhone] = useState("");
  const [custName, setCustName] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [productName, setProductName] = useState("");
  const [issueType, setIssueType] = useState<ServiceTicket["issueType"]>("Inverter Error");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ServiceTicket["priority"]>("High");
  const [warrantyStatus, setWarrantyStatus] = useState<"Under Warranty" | "Out of Warranty">("Under Warranty");
  const [cost, setCost] = useState(0);

  // Auto lookup when phone or serial entered
  const handlePhoneLookup = (phone: string) => {
    setCustPhone(phone);
    const match = warranties.find(
      (w) => w.phone.replace(/\s+/g, "").includes(phone.trim().replace(/\s+/g, "")) || w.serialNumber === phone.trim()
    );
    if (match) {
      setCustName(match.customerName);
      setSerialNo(match.serialNumber);
      setProductName(match.productName);
      if (match.status === "Expired") {
        setWarrantyStatus("Out of Warranty");
        setCost(4500);
      } else {
        setWarrantyStatus("Under Warranty");
        setCost(0);
      }
    }
  };

  const filteredTickets = filterStatus === "All"
    ? tickets
    : tickets.filter((t) => t.status === filterStatus);

  const stats = {
    open: tickets.filter((t) => t.status === "Open").length,
    assigned: tickets.filter((t) => t.status === "Assigned").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length,
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !serialNo) {
      alert("Please provide customer and serial number info");
      return;
    }
    const newTkt: ServiceTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      customerId: "CUST-NEW",
      customerName: custName,
      phone: custPhone,
      address: "Jaipur, Rajasthan",
      serialNumber: serialNo,
      productName: productName || "Solar Inverter",
      issueType,
      description,
      priority,
      status: "Assigned",
      warrantyStatus,
      assignedTechnician: "Rohit Meena",
      estimatedCost: cost,
      actualCost: 0,
      createdAt: "2026-10-31",
      resolvedAt: "",
    };
    setTickets([newTkt, ...tickets]);
    setShowNewModal(false);
    setCustPhone("");
    setCustName("");
    setSerialNo("");
    setDescription("");
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: "Resolved", resolvedAt: "2026-10-31" }
          : t
      )
    );
    if (selectedTicket) {
      setSelectedTicket((prev) => prev ? { ...prev, status: "Resolved" } : null);
    }
  };

  const getPriorityBadge = (p: ServiceTicket["priority"]) => {
    switch (p) {
      case "Critical":
        return "bg-red-50 text-red-700 border-red-300";
      case "High":
        return "bg-[#FAF4F7] text-[#734960] border-[#8E687F]/30";
      case "Medium":
        return "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40";
      case "Low":
        return "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40";
    }
  };

  const getStatusBadge = (s: ServiceTicket["status"]) => {
    switch (s) {
      case "Open":
        return "bg-[#FEF2F2] text-[#DC2626] border-red-200";
      case "Assigned":
        return "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40";
      case "In Progress":
        return "bg-[#FAF4F7] text-[#734960] border-[#8E687F]/30";
      case "Resolved":
        return "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40";
      case "Closed":
        return "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB]";
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <span>🔧</span> Service Desk &amp; Breakdown Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Zero-power alarms, inverter fault codes, and automated warranty replacement billing
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#734960] hover:bg-[#5A354A] text-white font-semibold rounded-xl text-xs shadow-xs transition"
        >
          <span>+</span> Log Breakdown Ticket
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-red-400 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Open Complaints</p>
              <p className="text-2xl font-extrabold text-[#DC2626] mt-1">{stats.open}</p>
            </div>
            <div className="w-11 h-11 bg-[#FEF2F2] text-[#DC2626] rounded-xl flex items-center justify-center text-xl font-bold">
              🚨
            </div>
          </div>
          <p className="text-[11px] text-[#DC2626] font-medium mt-3">Requires tech dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#F4B860] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Assigned</p>
              <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">{stats.assigned}</p>
            </div>
            <div className="w-11 h-11 bg-[#FEF6EB] text-[#DA9B40] rounded-xl flex items-center justify-center text-xl font-bold">
              👷
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-3">Technician en-route</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#8E687F] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">In Diagnosis</p>
              <p className="text-2xl font-extrabold text-[#8E687F] mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-11 h-11 bg-[#FAF4F7] text-[#8E687F] rounded-xl flex items-center justify-center text-xl font-bold">
              ⚙️
            </div>
          </div>
          <p className="text-[11px] text-[#734960] font-semibold mt-3">Testing &amp; swap</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#78B77B] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-extrabold text-[#78B77B] mt-1">{stats.resolved}</p>
            </div>
            <div className="w-11 h-11 bg-[#EBF5EC] text-[#78B77B] rounded-xl flex items-center justify-center text-xl font-bold">
              ✅
            </div>
          </div>
          <p className="text-[11px] text-[#5B965E] font-semibold mt-3">Generation restored</p>
        </div>
      </div>

      {/* Rainy Season Breakdown Banner */}
      <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#734960] bg-[#FAF4F7] px-2.5 py-0.5 rounded-full border border-[#8E687F]/30">
            Monsoon &amp; Rainy Season Protocol
          </span>
          <h3 className="text-sm font-bold text-[#333333]">
            ⚡ 60-Second Auto-Warranty Billing Rule
          </h3>
          <p className="text-xs text-[#666666] max-w-2xl">
            When a customer calls with a breakdown, our system checks whether their registered serial is under the 5-year guarantee. If valid, parts and labor cost are automatically billed at <strong>₹0</strong>.
          </p>
        </div>
        <button
          onClick={() => {
            handlePhoneLookup("+91 66554 43322");
            setShowNewModal(true);
          }}
          className="px-3.5 py-2 bg-[#F4B860] hover:bg-[#DA9B40] text-[#333333] text-xs font-bold rounded-xl shadow-xs transition whitespace-nowrap"
        >
          Simulate Call: Sanjay Tiwari (E-04 Error)
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2">
        {["All", "Open", "Assigned", "In Progress", "Resolved", "Closed"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              filterStatus === st
                ? "bg-[#734960] text-white border-[#734960] shadow-xs"
                : "bg-white text-[#666666] border-[#E4E7EB] hover:bg-[#F5F7FA]"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E4E7EB] bg-[#F5F7FA] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Breakdown &amp; Service Tickets ({filteredTickets.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-[#666666] font-semibold border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-2.5">Ticket ID</th>
                <th className="px-4 py-2.5">Customer &amp; Phone</th>
                <th className="px-4 py-2.5">Equipment &amp; Serial</th>
                <th className="px-4 py-2.5">Issue Details</th>
                <th className="px-4 py-2.5 text-center">Priority</th>
                <th className="px-4 py-2.5 text-center">Warranty Flag</th>
                <th className="px-4 py-2.5 text-right">Customer Cost</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EB]/60">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#734960]">{t.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#333333]">{t.customerName}</div>
                    <div className="text-[11px] text-[#666666]">{t.phone}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[140px]">{t.address}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#333333]">{t.productName}</div>
                    <div className="text-[11px] font-mono text-[#8E687F]">{t.serialNumber}</div>
                    <span className="text-[10px] text-gray-400">Type: {t.issueType}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-xs text-[#333333] line-clamp-2">{t.description}</p>
                    {t.assignedTechnician && (
                      <span className="text-[10px] text-[#8E687F] font-semibold">
                        👷 {t.assignedTechnician}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${t.warrantyStatus === "Under Warranty" ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40" : "bg-[#FEF2F2] text-[#DC2626] border-red-200"}`}>
                      {t.warrantyStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {t.warrantyStatus === "Under Warranty" ? (
                      <span className="text-xs font-extrabold text-[#5B965E] bg-[#EBF5EC] px-2 py-0.5 rounded">
                        ₹0 (Free)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#DC2626]">
                        ₹{t.estimatedCost.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="px-2.5 py-1 bg-[#F5F7FA] hover:bg-[#E4E7EB] text-[#333333] text-[11px] font-semibold rounded-lg border border-[#E4E7EB]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW TICKET MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EB]">
              <h3 className="text-base font-bold text-[#333333]">Log Breakdown / Service Complaint</h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-[#333333] text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase flex justify-between">
                  <span>Customer Phone or Serial (Lookup)</span>
                  <span className="text-[#734960]">Auto-detects warranty</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 66554 43322 or INV-3K-OG-5501"
                  value={custPhone}
                  onChange={(e) => handlePhoneLookup(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#734960]/30 focus:outline-none font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Customer Name</label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Equipment Serial</label>
                  <input
                    type="text"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-mono"
                    required
                  />
                </div>
              </div>

              {/* Automatic Warranty Alert */}
              <div className={`p-2.5 rounded-xl border text-xs font-semibold ${warrantyStatus === "Under Warranty" ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40" : "bg-[#FEF2F2] text-[#DC2626] border-red-200"}`}>
                {warrantyStatus === "Under Warranty" ? (
                  <div className="flex items-center justify-between">
                    <span>🛡️ Active 5-Year Warranty. Customer cost: <strong>₹0</strong></span>
                    <span className="font-extrabold">FREE REPAIR</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>⚠️ Warranty Expired: Parts + visit fee applies.</span>
                    <span className="font-extrabold">₹{cost}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Fault Type</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as ServiceTicket["issueType"])}
                    className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs"
                  >
                    <option value="Inverter Error">Inverter Error (E-01/E-04)</option>
                    <option value="No Power">Zero Power Generation</option>
                    <option value="Battery Issue">Battery Fault</option>
                    <option value="Low Output">Low Solar Yield</option>
                    <option value="Physical Damage">Storm / Hail Damage</option>
                    <option value="Wiring Fault">Earthing / Tripping</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ServiceTicket["priority"])}
                    className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-bold text-[#734960]"
                  >
                    <option value="Critical">Critical (Immediate)</option>
                    <option value="High">High (24 Hours)</option>
                    <option value="Medium">Medium (48 Hours)</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Complaint Notes</label>
                <textarea
                  rows={2}
                  placeholder="Describe error code or customer symptoms..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-1.5 border border-[#E4E7EB] text-[#666666] rounded-xl text-xs font-semibold hover:bg-[#F5F7FA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#734960] hover:bg-[#5A354A] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Create Ticket &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAILS MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EB]">
              <div>
                <h3 className="text-base font-bold text-[#333333]">{selectedTicket.id} - Ticket Details</h3>
                <p className="text-xs text-[#666666]">{selectedTicket.customerName} • {selectedTicket.phone}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-[#333333] text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F5F7FA] p-3 rounded-2xl space-y-1.5 border border-[#E4E7EB]">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Asset:</span>
                  <span className="font-bold text-[#333333]">{selectedTicket.productName} ({selectedTicket.serialNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Issue Type:</span>
                  <span className="font-bold text-[#DA9B40]">{selectedTicket.issueType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Technician:</span>
                  <span className="font-semibold text-[#8E687F]">{selectedTicket.assignedTechnician || "Unassigned"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Warranty Status:</span>
                  <span className="font-bold text-[#5B965E]">{selectedTicket.warrantyStatus}</span>
                </div>
                <div className="flex justify-between border-t border-[#E4E7EB] pt-1.5">
                  <span className="text-[#666666]">Billed to Customer:</span>
                  <span className="font-extrabold text-sm text-[#734960]">
                    {selectedTicket.warrantyStatus === "Under Warranty" ? "₹0 (Warranty Claim)" : `₹${selectedTicket.estimatedCost}`}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#666666] uppercase mb-1">Issue Description:</h4>
                <p className="text-xs text-[#333333] bg-[#F5F7FA] p-2.5 rounded-xl border border-[#E4E7EB]">
                  {selectedTicket.description}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <div>
                {selectedTicket.status !== "Resolved" && selectedTicket.status !== "Closed" ? (
                  <button
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="px-3.5 py-1.5 bg-[#78B77B] hover:bg-[#5B965E] text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    ✓ Mark Resolved
                  </button>
                ) : (
                  <span className="text-xs text-[#5B965E] font-bold">✓ Ticket Closed</span>
                )}
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-1.5 bg-[#F5F7FA] hover:bg-[#E4E7EB] text-[#333333] rounded-xl text-xs font-semibold border border-[#E4E7EB]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
