"use client";

import { WrenchIcon, AlertCircleIcon, SearchIcon, PlusIcon } from "@/components/Icons";

import { useState, useEffect } from "react";
import PageShell from "@/components/PageShell";
import { serviceTickets, ServiceTicket, warranties, Warranty } from "@/data/mockData";
import { useSolarData } from "@/hooks/useSolarData";
import { ALL_16_EMPLOYEES } from "@/context/AuthContext";

export default function ServiceDeskPage() {
  // Load tickets from localStorage or fallback to initialTickets
  const [tickets, setTickets] = useState<ServiceTicket[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sunpower_service_tickets");
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore
      }
    }
    return serviceTickets;
  });

  const [filterStatus, setFilterStatus] = useState("All");
  const { data: dbTickets } = useSolarData<ServiceTicket>("service_tickets");
  useEffect(() => {
    if (dbTickets.length > 0) {
      setTickets(dbTickets);
    }
  }, [dbTickets]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);

  // Quick Assign Modal state
  const [assignModalTicket, setAssignModalTicket] = useState<ServiceTicket | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string>("TECH-001");
  const [assignInstructions, setAssignInstructions] = useState<string>("Investigate breakdown complaint and restore system power.");
  const [dispatchAlert, setDispatchAlert] = useState<string>("");

  // Sync tickets with localStorage
  const saveTickets = (updated: ServiceTicket[]) => {
    setTickets(updated);
    try {
      localStorage.setItem("sunpower_service_tickets", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Re-read tickets when window focuses or on storage changes (to pick up customer complaints filed live)
  useEffect(() => {
    const loadSharedTickets = () => {
      try {
        const saved = localStorage.getItem("sunpower_service_tickets");
        if (saved) {
          setTickets(JSON.parse(saved));
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener("focus", loadSharedTickets);
    window.addEventListener("storage", loadSharedTickets);
    return () => {
      window.removeEventListener("focus", loadSharedTickets);
      window.removeEventListener("storage", loadSharedTickets);
    };
  }, []);

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
      assignedTechnician: ALL_16_EMPLOYEES[selectedTechId]?.name || "Rohit Meena",
      techId: selectedTechId,
      estimatedCost: cost,
      actualCost: 0,
      createdAt: "2026-10-31",
      resolvedAt: "",
    };

    const updated = [newTkt, ...tickets];
    saveTickets(updated);

    // Also dispatch task to technician's queue and send notification
    dispatchTaskToTechnician(newTkt, selectedTechId, "Emergency breakdown ticket dispatched from admin desk.");

    setShowNewModal(false);
    setCustPhone("");
    setCustName("");
    setSerialNo("");
    setDescription("");
  };

  // Helper to dispatch a ticket to an employee's queue and push a notification
  const dispatchTaskToTechnician = (ticket: ServiceTicket, techId: string, instructions: string) => {
    const techInfo = ALL_16_EMPLOYEES[techId];
    if (!techInfo) return;

    // 1. Dispatch into sunpower_tech_assigned_tasks
    try {
      const savedTechs = JSON.parse(localStorage.getItem("sunpower_tech_assigned_tasks") || "[]");
      const assignedTask = {
        orderId: ticket.id,
        customerName: ticket.customerName,
        customerPhone: ticket.phone,
        address: ticket.address || "Jaipur, Rajasthan",
        capacity: ticket.productName,
        type: "Service" as const,
        timeSlot: "Immediate Breakdown Service",
        status: "Pending" as const,
        customerDetails: {
          systemDetails: ticket.productName,
          reportedIssue: ticket.description,
          roofType: "Customer Site Terrace",
          customerNotes: `Complaint filed via portal. Serial: ${ticket.serialNumber}. Warranty: ${ticket.warrantyStatus}`,
          customerPhotos: ticket.photoProofName ? [ticket.photoProofName] : ["📸 Inverter / Breakdown Inspection"],
        },
        adminInstructions: instructions,
      };

      let techFound = false;
      const updatedTechs = savedTechs.map((t: any) => {
        if (t.id === techId) {
          techFound = true;
          return {
            ...t,
            status: "On Job",
            assignedTasks: [assignedTask, ...(t.assignedTasks || [])],
          };
        }
        return t;
      });

      if (!techFound) {
        updatedTechs.push({
          id: techId,
          name: techInfo.name,
          phone: techInfo.phone,
          specialization: techInfo.specialization,
          status: "On Job",
          rating: 4.8,
          completedJobs: 45,
          assignedTasks: [assignedTask],
        });
      }

      localStorage.setItem("sunpower_tech_assigned_tasks", JSON.stringify(updatedTechs));
    } catch {
      // Ignore
    }

    // 2. Push real-time notification to the assigned technician
    try {
      const savedNotifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const techNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "technician" as const,
        recipientId: techId,
        text: `🚨 Breakdown Ticket ${ticket.id} assigned to you: ${ticket.customerName} (${ticket.issueType})`,
        time: "Just now",
        type: "task" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([techNotif, ...savedNotifs]));
    } catch {
      // Ignore
    }

    // Dispatch storage event so header reflects count
    window.dispatchEvent(new Event("storage"));
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalTicket) return;

    const techInfo = ALL_16_EMPLOYEES[selectedTechId];
    const updatedTickets = tickets.map((t) => {
      if (t.id === assignModalTicket.id) {
        return {
          ...t,
          status: "Assigned" as const,
          assignedTechnician: techInfo.name,
          techId: selectedTechId,
        };
      }
      return t;
    });

    saveTickets(updatedTickets);
    dispatchTaskToTechnician(assignModalTicket, selectedTechId, assignInstructions);

    if (selectedTicket && selectedTicket.id === assignModalTicket.id) {
      setSelectedTicket({
        ...selectedTicket,
        status: "Assigned",
        assignedTechnician: techInfo.name,
        techId: selectedTechId,
      });
    }

    setDispatchAlert(`✓ Ticket ${assignModalTicket.id} assigned to ${techInfo.name} (${selectedTechId}). Notification dispatched!`);

    setTimeout(() => {
      setDispatchAlert("");
      setAssignModalTicket(null);
    }, 2200);
  };

  const handleResolveTicket = (ticketId: string) => {
    const updated = tickets.map((t) =>
      t.id === ticketId
        ? { ...t, status: "Resolved" as const, resolvedAt: "2026-10-31" }
        : t
    );
    saveTickets(updated);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => prev ? { ...prev, status: "Resolved" } : null);
    }
  };

  const getPriorityBadge = (p: ServiceTicket["priority"]) => {
    switch (p) {
      case "Critical":
        return "bg-red-50 text-red-700 border-red-300";
      case "High":
        return "bg-[#F7EEF2] text-[#4A355E] border-[#6D5284]/30";
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
        return "bg-[#F7EEF2] text-[#4A355E] border-[#6D5284]/30";
      case "Resolved":
        return "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40";
      case "Closed":
        return "bg-[#F7EEF2] text-[#666666] border-[#EBCED6]";
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <WrenchIcon className="w-6 h-6 text-[#4A355E]" /> Service Desk &amp; Breakdown Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Customer complaints, zero-power alarms, and task dispatch across all 16 field employees
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A355E] hover:bg-[#372447] text-white font-semibold rounded-xl text-xs shadow-xs transition"
        >
          <span>+</span> Log Breakdown Ticket
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-red-400 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Open Complaints</p>
              <p className="text-2xl font-extrabold text-[#DC2626] mt-1">{stats.open}</p>
            </div>
            <div className="w-11 h-11 bg-[#FEF2F2] text-[#DC2626] rounded-xl flex items-center justify-center text-xl font-bold">
              🚨
            </div>
          </div>
          <p className="text-[11px] text-[#DC2626] font-medium mt-3">Customer complaints awaiting dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#F4B860] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Assigned to Crew</p>
              <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">{stats.assigned}</p>
            </div>
            <div className="w-11 h-11 bg-[#FEF6EB] text-[#DA9B40] rounded-xl flex items-center justify-center text-xl font-bold">
              👷
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-3">Dispatched across 16 employees</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#6D5284] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">In Diagnosis</p>
              <p className="text-2xl font-extrabold text-[#6D5284] mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-11 h-11 bg-[#F7EEF2] text-[#6D5284] rounded-xl flex items-center justify-center text-xl font-bold">
              ⚙️
            </div>
          </div>
          <p className="text-[11px] text-[#4A355E] font-semibold mt-3">On-site testing &amp; swap</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#78B77B] shadow-xs">
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

      {/* 16 Employees Dispatch Info Banner */}
      <div className="bg-white border border-[#EBCED6] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A355E] bg-[#F7EEF2] px-2.5 py-0.5 rounded-full border border-[#6D5284]/30">
              16 Field Employees Active
            </span>
            <span className="text-[10px] font-bold uppercase text-[#5B965E] bg-[#EBF5EC] px-2.5 py-0.5 rounded-full border border-[#78B77B]/40">
              Live Customer Complaint Bridge
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#333333]">
            ⚡ Instant Customer Complaint to Employee Dispatch
          </h3>
          <p className="text-xs text-[#666666] max-w-2xl">
            Complaints filed by customers (with uploaded photos and error descriptions) appear directly in this table. Admin can assign any complaint to one of the <strong>16 qualified employees</strong>. The assigned technician receives an instant notification and task dispatch.
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
                ? "bg-[#4A355E] text-white border-[#4A355E] shadow-xs"
                : "bg-white text-[#666666] border-[#EBCED6] hover:bg-[#F7EEF2]"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-[#EBCED6] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#EBCED6] bg-[#F7EEF2] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Breakdown &amp; Service Complaints ({filteredTickets.length})
          </h2>
          <span className="text-[11px] text-[#666666]">
            Assign any complaint to 1 of 16 crew members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7EEF2] text-[#666666] font-semibold border-b border-[#EBCED6]">
              <tr>
                <th className="px-4 py-2.5">Ticket ID</th>
                <th className="px-4 py-2.5">Customer &amp; Phone</th>
                <th className="px-4 py-2.5">Equipment / Serial</th>
                <th className="px-4 py-2.5">Issue Details &amp; Proof</th>
                <th className="px-4 py-2.5 text-center">Priority</th>
                <th className="px-4 py-2.5 text-center">Warranty</th>
                <th className="px-4 py-2.5 text-center">Assigned Tech</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBCED6]/60">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-[#F7EEF2] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#4A355E]">
                    <div>{t.id}</div>
                    <div className="text-[10px] text-gray-400 font-normal">{t.createdAt}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#333333]">{t.customerName}</div>
                    <div className="text-[11px] text-[#666666]">{t.phone}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[140px]">{t.address}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#333333]">{t.productName}</div>
                    <div className="text-[11px] font-mono text-[#6D5284]">{t.serialNumber}</div>
                    <span className="text-[10px] text-gray-400">Type: {t.issueType}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="text-xs text-[#333333] line-clamp-2">{t.description}</p>
                    {t.photoProofUrl && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4A355E] bg-[#F7EEF2] px-2 py-0.5 rounded-md border border-[#6D5284]/30">
                          📸 Customer Photo Proof Attached
                        </span>
                      </div>
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
                  <td className="px-4 py-3 text-center">
                    {t.assignedTechnician ? (
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F7EEF2] text-[#4A355E] border border-[#6D5284]/30">
                          👷 {t.assignedTechnician}
                        </span>
                        {t.techId && <div className="text-[9px] font-mono text-[#6D5284]">{t.techId}</div>}
                      </div>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="px-2.5 py-1 bg-[#F7EEF2] hover:bg-[#EBCED6] text-[#333333] text-[11px] font-semibold rounded-lg border border-[#EBCED6]"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          setAssignModalTicket(t);
                          if (t.techId) setSelectedTechId(t.techId);
                        }}
                        className="px-2.5 py-1 bg-[#4A355E] hover:bg-[#372447] text-white text-[11px] font-bold rounded-lg shadow-2xs transition"
                        title="Assign to one of 16 employees"
                      >
                        {t.assignedTechnician ? "Reassign" : "Assign"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ────────────────── MODAL: ASSIGN TICKET TO 1 OF 16 EMPLOYEES ────────────────── */}
      {assignModalTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EBCED6] shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EBCED6] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#333333] flex items-center gap-2">
                  <span>👷</span> Assign Task to Technician
                </h3>
                <p className="text-xs text-[#666666]">
                  Ticket {assignModalTicket.id} • {assignModalTicket.customerName}
                </p>
              </div>
              <button
                onClick={() => setAssignModalTicket(null)}
                className="text-gray-400 hover:text-[#333333] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div className="bg-[#F7EEF2] p-3 rounded-xl border border-[#EBCED6] space-y-1">
                <p><strong>Customer:</strong> {assignModalTicket.customerName} ({assignModalTicket.phone})</p>
                <p><strong>Fault / Issue:</strong> {assignModalTicket.description}</p>
                <p><strong>Equipment:</strong> {assignModalTicket.productName} ({assignModalTicket.serialNumber})</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase block">
                  Select Employee (16 Field Engineers Available)
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl font-bold text-[#4A355E] bg-white focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                >
                  {Object.entries(ALL_16_EMPLOYEES).map(([id, emp]) => (
                    <option key={id} value={id}>
                      {id}: {emp.name} — {emp.specialization}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#666666] mt-1">
                  Selected employee will receive an instant notification in their app header and task queue.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase block">
                  Admin Instructions to Field Technician
                </label>
                <textarea
                  rows={2}
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                />
              </div>

              {dispatchAlert && (
                <div className="p-2.5 bg-[#EBF5EC] text-[#5B965E] font-bold rounded-xl border border-[#78B77B] text-center animate-in fade-in">
                  {dispatchAlert}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBCED6]">
                <button
                  type="button"
                  onClick={() => setAssignModalTicket(null)}
                  className="px-4 py-2 bg-[#F7EEF2] hover:bg-[#EBCED6] text-[#333333] font-semibold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4A355E] hover:bg-[#372447] text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  Dispatch to Employee &amp; Send Alert ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW TICKET MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EBCED6] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBCED6]">
              <h3 className="text-base font-bold text-[#333333]">Log Breakdown / Service Complaint</h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-[#333333] text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase flex justify-between">
                  <span>Customer Phone or Serial (Lookup)</span>
                  <span className="text-[#4A355E]">Auto-detects warranty</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 66554 43322 or INV-3K-OG-5501"
                  value={custPhone}
                  onChange={(e) => handlePhoneLookup(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none font-semibold"
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
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Equipment Serial</label>
                  <input
                    type="text"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-mono"
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
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
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
                    className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-bold text-[#4A355E]"
                  >
                    <option value="Critical">Critical (Immediate)</option>
                    <option value="High">High (24 Hours)</option>
                    <option value="Medium">Medium (48 Hours)</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Assign Technician (16 Available)</label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs font-bold text-[#4A355E] bg-white"
                >
                  {Object.entries(ALL_16_EMPLOYEES).map(([id, emp]) => (
                    <option key={id} value={id}>
                      {id}: {emp.name} ({emp.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Complaint Notes</label>
                <textarea
                  rows={2}
                  placeholder="Describe error code or customer symptoms..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#EBCED6] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-1.5 border border-[#EBCED6] text-[#666666] rounded-xl text-xs font-semibold hover:bg-[#F7EEF2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-bold shadow-xs"
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EBCED6] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBCED6]">
              <div>
                <h3 className="text-base font-bold text-[#333333]">{selectedTicket.id} - Ticket Details</h3>
                <p className="text-xs text-[#666666]">{selectedTicket.customerName} • {selectedTicket.phone}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-[#333333] text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F7EEF2] p-3 rounded-2xl space-y-1.5 border border-[#EBCED6]">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Asset:</span>
                  <span className="font-bold text-[#333333]">{selectedTicket.productName} ({selectedTicket.serialNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Issue Type:</span>
                  <span className="font-bold text-[#DA9B40]">{selectedTicket.issueType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Assigned Employee:</span>
                  <span className="font-semibold text-[#6D5284]">
                    {selectedTicket.assignedTechnician ? `👷 ${selectedTicket.assignedTechnician} (${selectedTicket.techId || "Assigned"})` : "Unassigned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Warranty Status:</span>
                  <span className="font-bold text-[#5B965E]">{selectedTicket.warrantyStatus}</span>
                </div>
                <div className="flex justify-between border-t border-[#EBCED6] pt-1.5">
                  <span className="text-[#666666]">Billed to Customer:</span>
                  <span className="font-extrabold text-sm text-[#4A355E]">
                    {selectedTicket.warrantyStatus === "Under Warranty" ? "₹0 (Warranty Claim)" : `₹${selectedTicket.estimatedCost}`}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#666666] uppercase mb-1">Issue Description:</h4>
                <p className="text-xs text-[#333333] bg-[#F7EEF2] p-2.5 rounded-xl border border-[#EBCED6]">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Customer Photo Proof if uploaded */}
              {selectedTicket.photoProofUrl && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-[#4A355E] uppercase">
                    Customer Uploaded Photo Proof
                  </h4>
                  <div className="p-3 bg-[#F7EEF2] border border-[#6D5284]/30 rounded-2xl space-y-2">
                    <img
                      src={selectedTicket.photoProofUrl}
                      alt="Customer Proof"
                      className="max-h-48 w-full object-contain bg-white rounded-xl border border-[#EBCED6]"
                    />
                    <p className="text-[11px] text-[#666666] font-medium text-center">
                      📎 {selectedTicket.photoProofName || "Customer Photo Proof"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[#EBCED6]">
              <div className="flex items-center gap-2">
                {selectedTicket.status !== "Resolved" && selectedTicket.status !== "Closed" ? (
                  <>
                    <button
                      onClick={() => handleResolveTicket(selectedTicket.id)}
                      className="px-3.5 py-1.5 bg-[#78B77B] hover:bg-[#5B965E] text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      ✓ Mark Resolved
                    </button>
                    <button
                      onClick={() => {
                        setAssignModalTicket(selectedTicket);
                        if (selectedTicket.techId) setSelectedTechId(selectedTicket.techId);
                      }}
                      className="px-3.5 py-1.5 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      👷 {selectedTicket.assignedTechnician ? "Reassign Tech" : "Assign to Employee"}
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-[#5B965E] font-bold">✓ Ticket Closed</span>
                )}
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-1.5 bg-[#F7EEF2] hover:bg-[#EBCED6] text-[#333333] rounded-xl text-xs font-semibold border border-[#EBCED6]"
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
