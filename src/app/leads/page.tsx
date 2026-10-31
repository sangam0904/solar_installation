"use client";

import { UsersIcon, PlusIcon, SearchIcon } from "@/components/Icons";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { leads as initialLeads, Lead } from "@/data/mockData";

const stages = [
  "New Lead",
  "Contacted",
  "Survey Scheduled",
  "Survey Done",
  "Quote Sent",
  "Converted",
  "Lost",
] as const;

const stageColors: Record<string, { bg: string; text: string; border: string; headerBg: string }> = {
  "New Lead":         { bg: "bg-[#F7EEF2]", text: "text-[#4A355E]", border: "border-[#4A355E]", headerBg: "bg-[#4A355E]" },
  "Contacted":        { bg: "bg-[#F7EEF2]", text: "text-[#6D5284]", border: "border-[#6D5284]", headerBg: "bg-[#6D5284]" },
  "Survey Scheduled": { bg: "bg-[#FEF6EB]", text: "text-[#DA9B40]", border: "border-[#F4B860]", headerBg: "bg-[#F4B860]" },
  "Survey Done":      { bg: "bg-[#FEF6EB]", text: "text-[#DA9B40]", border: "border-[#DA9B40]", headerBg: "bg-[#DA9B40]" },
  "Quote Sent":       { bg: "bg-[#F7EEF2]", text: "text-[#4A355E]", border: "border-[#6D5284]", headerBg: "bg-[#6D5284]" },
  "Converted":        { bg: "bg-[#EBF5EC]", text: "text-[#5B965E]", border: "border-[#78B77B]", headerBg: "bg-[#78B77B]" },
  "Lost":             { bg: "bg-red-50",   text: "text-red-700",   border: "border-red-400",   headerBg: "bg-red-400" },
};

const sourceColors: Record<string, string> = {
  Website:  "bg-[#F7EEF2] text-[#4A355E]",
  WhatsApp: "bg-[#EBF5EC] text-[#5B965E]",
  Phone:    "bg-[#FEF6EB] text-[#DA9B40]",
  Referral: "bg-[#F7EEF2] text-[#6D5284]",
  "Walk-in": "bg-[#FEF6EB] text-[#DA9B40]",
};

export default function LeadsPage() {
  const [leadList, setLeadList] = useState<Lead[]>(initialLeads);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Jaipur",
    monthlyBill: "",
    roofArea: "",
    roofType: "RCC Flat",
    gridType: "On-Grid" as "On-Grid" | "Off-Grid",
    capacity: "3 kW",
    source: "Website" as Lead["source"],
    assignedTo: "Amit Kumar",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `LD-${String(leadList.length + 1).padStart(3, "0")}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      monthlyBill: Number(formData.monthlyBill) || 0,
      roofArea: Number(formData.roofArea) || 0,
      roofType: formData.roofType,
      gridType: formData.gridType,
      capacity: formData.capacity,
      stage: "New Lead",
      source: formData.source,
      assignedTo: formData.assignedTo,
      notes: formData.notes,
      createdAt: "2026-10-31",
      subsidyEligible: true,
    };
    setLeadList([newLead, ...leadList]);
    setShowModal(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "Jaipur",
      monthlyBill: "",
      roofArea: "",
      roofType: "RCC Flat",
      gridType: "On-Grid",
      capacity: "3 kW",
      source: "Website",
      assignedTo: "Amit Kumar",
      notes: "",
    });
  };

  return (
    <PageShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-[#4A355E]" /> Leads & Customer Inquiry Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Omnichannel lead capture, roof pre-qualification, and survey dispatching
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="bg-white border border-[#EBCED6] rounded-xl p-1 flex items-center shadow-xs">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                view === "kanban"
                  ? "bg-[#4A355E] text-white shadow-xs"
                  : "text-[#666666] hover:text-[#333333]"
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                view === "table"
                  ? "bg-[#4A355E] text-white shadow-xs"
                  : "text-[#666666] hover:text-[#333333]"
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5"
          >
            <span>+</span> Add New Lead
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
          {stages.map((stage) => {
            const columnLeads = leadList.filter((l) => l.stage === stage);
            const style = stageColors[stage];
            return (
              <div
                key={stage}
                className="w-72 flex-shrink-0 bg-white rounded-2xl border border-[#EBCED6] shadow-xs flex flex-col max-h-[calc(100vh-220px)]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[#EBCED6] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.headerBg}`} />
                    <span className="font-bold text-xs text-[#333333]">{stage}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F7EEF2] text-[#666666] border border-[#EBCED6]">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`p-3.5 bg-white rounded-xl border border-[#EBCED6] border-l-4 ${style.border} shadow-xs space-y-2 hover:border-[#6D5284] transition-all`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-[#333333] leading-tight">
                            {lead.name}
                          </h4>
                          <p className="text-[11px] text-[#666666] mt-0.5">{lead.phone}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sourceColors[lead.source] || "bg-gray-100 text-gray-700"}`}>
                          {lead.source}
                        </span>
                      </div>

                      <div className="bg-[#F7EEF2] p-2 rounded-lg text-[11px] space-y-1">
                        <div className="flex justify-between text-[#666666]">
                          <span>System:</span>
                          <span className="font-bold text-[#333333]">
                            {lead.capacity} ({lead.gridType})
                          </span>
                        </div>
                        <div className="flex justify-between text-[#666666]">
                          <span>Monthly Bill:</span>
                          <span className="font-semibold text-[#4A355E]">
                            ₹{lead.monthlyBill.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#666666]">
                          <span>Roof Space:</span>
                          <span className="font-medium text-[#333333]">{lead.roofArea} sq ft</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#666666] pt-1">
                        <span>📍 {lead.city}</span>
                        <span className="font-semibold text-[#6D5284]">👤 {lead.assignedTo}</span>
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-[#EBCED6] rounded-xl">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#EBCED6] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7EEF2] text-[#666666] font-semibold border-b border-[#EBCED6]">
                <tr>
                  <th className="px-4 py-3">Lead ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">System</th>
                  <th className="px-4 py-3 text-right">Bill (₹)</th>
                  <th className="px-4 py-3 text-center">Stage</th>
                  <th className="px-4 py-3 text-center">Source</th>
                  <th className="px-4 py-3">Assigned Rep</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBCED6]/60">
                {leadList.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F7EEF2] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#4A355E]">{l.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#333333]">{l.name}</div>
                      <div className="text-[11px] text-[#666666]">{l.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-[#333333]">{l.city}</td>
                    <td className="px-4 py-3 font-medium text-[#333333]">
                      {l.capacity} {l.gridType}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#333333]">
                      ₹{l.monthlyBill.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${stageColors[l.stage]?.bg} ${stageColors[l.stage]?.text} ${stageColors[l.stage]?.border}`}>
                        {l.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${sourceColors[l.source] || "bg-gray-100 text-gray-700"}`}>
                        {l.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#666666]">{l.assignedTo}</td>
                    <td className="px-4 py-3 text-[#666666] font-mono text-[11px]">{l.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EBCED6] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBCED6]">
              <div>
                <h3 className="text-base font-bold text-[#333333]">Capture Rooftop Solar Lead</h3>
                <p className="text-xs text-[#666666]">Phone / WhatsApp inquiry pre-qualification</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-[#333333] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Customer Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Mobile Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Average Monthly Bill (₹)</label>
                  <input
                    type="number"
                    name="monthlyBill"
                    placeholder="e.g. 4500"
                    value={formData.monthlyBill}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Roof Area (sq ft)</label>
                  <input
                    type="number"
                    name="roofArea"
                    placeholder="e.g. 350"
                    value={formData.roofArea}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Recommended Capacity</label>
                  <select
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  >
                    <option value="1 kW">1 kW</option>
                    <option value="2 kW">2 kW</option>
                    <option value="3 kW">3 kW</option>
                    <option value="4 kW">4 kW</option>
                    <option value="5 kW">5 kW</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Grid Connection Type</label>
                  <select
                    name="gridType"
                    value={formData.gridType}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  >
                    <option value="On-Grid">On-Grid (Connected to Grid)</option>
                    <option value="Off-Grid">Off-Grid (With Battery Backup)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Lead Source</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  >
                    <option value="Website">Website Form</option>
                    <option value="WhatsApp">WhatsApp Inquiry</option>
                    <option value="Phone">Inbound Phone Call</option>
                    <option value="Referral">Customer Referral</option>
                    <option value="Walk-in">Walk-in</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Assign Sales Rep</label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  >
                    <option value="Amit Kumar">Amit Kumar</option>
                    <option value="Sonia Verma">Sonia Verma</option>
                    <option value="Rohit Meena">Rohit Meena</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Address & City</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street address, colony..."
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#EBCED6] text-[#666666] rounded-xl text-xs font-semibold hover:bg-[#F7EEF2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Save Lead to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
