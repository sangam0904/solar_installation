"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ALL_16_EMPLOYEES } from "@/context/AuthContext";
import { serviceTickets as initialTickets, ServiceTicket } from "@/data/mockData";

export interface CustomerReportItem {
  id: string;
  type: "report";
  customerName: string;
  phone: string;
  address: string;
  system: string;
  issueType: string;
  description: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed";
  warrantyStatus: "Under Warranty" | "Out of Warranty";
  assignedTechnician?: string;
  techId?: string;
  photoProofUrl?: string;
  photoProofName?: string;
  createdAt: string;
  isRead?: boolean;
}

export interface CustomerEnquiryItem {
  id: string;
  type: "enquiry";
  customerName: string;
  phone: string;
  address: string;
  system: string;
  subject: string;
  message: string;
  priority: "High" | "Medium" | "Normal";
  status: "New" | "In Review" | "Quote Dispatched" | "Resolved";
  attachedPhoto?: string;
  fileName?: string;
  createdAt: string;
  isRead?: boolean;
}

const defaultEnquiries: CustomerEnquiryItem[] = [
  {
    id: "ENQ-101",
    type: "enquiry",
    customerName: "Deepak Agarwal",
    phone: "+91 98290 12345",
    address: "Plot 42, Malviya Nagar, Jaipur",
    system: "5 kW On-Grid Rooftop",
    subject: "Add Battery Backup (Off-Grid / Hybrid Upgrade)",
    message: "Currently have 5 kW On-Grid system. Experiencing afternoon power fluctuations and looking to add a 10 kWh Lithium Battery Bank (LFP) with hybrid inverter.",
    priority: "High",
    status: "New",
    createdAt: "Today, 10:15 AM",
    isRead: false,
  },
  {
    id: "ENQ-092",
    type: "enquiry",
    customerName: "Mohan Lal Meena",
    phone: "+91 94140 55667",
    address: "15, Mansarovar Sector 7, Jaipur",
    system: "3 kW Residential Rooftop",
    subject: "PM Surya Ghar Subsidy DBT Verification",
    message: "Wanted to confirm if the second installment of PM Surya Ghar central subsidy (₹78,000) needs meter verification. Portal status says 'Discom Pending'.",
    priority: "Medium",
    status: "In Review",
    createdAt: "Today, 08:30 AM",
    isRead: false,
  },
  {
    id: "ENQ-105",
    type: "enquiry",
    customerName: "Sunita Choudhary",
    phone: "+91 97841 88990",
    address: "B-12, Vaishali Nagar, Jaipur",
    system: "3 kW On-Grid (Installed 2024)",
    subject: "Solar Capacity Expansion 3 kW → 6 kW",
    message: "We recently installed two 1.5-ton AC units. Need quotation for additional 6x 550W Mono PERC bifacial panels and upgrading structure capacity.",
    priority: "High",
    status: "New",
    createdAt: "Yesterday, 04:45 PM",
    isRead: false,
  },
  {
    id: "ENQ-106",
    type: "enquiry",
    customerName: "Arvind Swamy",
    phone: "+91 98292 33441",
    address: "67, C-Scheme, Ashok Nagar, Jaipur",
    system: "10 kW Commercial Solar",
    subject: "Solar Module Deep Cleaning & AMC Package",
    message: "Dust and pollution are decreasing generation by ~18%. Inquiring for automated sprinkler or bi-monthly technician deep cleaning AMC rate.",
    priority: "Normal",
    status: "Quote Dispatched",
    createdAt: "28 Oct 2026",
    isRead: true,
  },
];

export default function AdminNotificationFloatingWindow() {
  const router = useRouter();
  const { role } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "reports" | "enquiries">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string } | null>(null);
  const [quickAssignTktId, setQuickAssignTktId] = useState<string | null>(null);
  const [assignTechId, setAssignTechId] = useState<string>("TECH-001");
  const [toastMessage, setToastMessage] = useState<string>("");

  // Store read IDs
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sunpower_read_notif_ids");
        if (saved) return new Set(JSON.parse(saved));
      } catch {
        // Ignore
      }
    }
    return new Set(["ENQ-106", "TKT-004", "TKT-005"]);
  });

  // Load customer reports from service tickets
  const [reports, setReports] = useState<CustomerReportItem[]>([]);
  // Load customer enquiries
  const [enquiries, setEnquiries] = useState<CustomerEnquiryItem[]>([]);

  const loadData = () => {
    if (typeof window === "undefined") return;

    // 1. Load tickets
    try {
      const savedTickets = localStorage.getItem("sunpower_service_tickets");
      const list: ServiceTicket[] = savedTickets ? JSON.parse(savedTickets) : initialTickets;
      const formattedReports: CustomerReportItem[] = list.map((t) => ({
        id: t.id,
        type: "report",
        customerName: t.customerName || "Customer",
        phone: t.phone || "+91 98765 00000",
        address: t.address || "Jaipur",
        system: t.productName || "Solar PV System",
        issueType: t.issueType || "Breakdown",
        description: t.description || "Reported issue with solar system",
        priority: t.priority || "High",
        status: t.status || "Open",
        warrantyStatus: t.warrantyStatus || "Under Warranty",
        assignedTechnician: t.assignedTechnician,
        techId: t.techId,
        photoProofUrl: t.photoProofUrl,
        photoProofName: t.photoProofName,
        createdAt: t.createdAt || "Recent",
      }));
      setReports(formattedReports);
    } catch {
      // Ignore
    }

    // 2. Load enquiries
    try {
      const savedEnqs = localStorage.getItem("sunpower_customer_enquiries");
      if (savedEnqs) {
        const parsed: CustomerEnquiryItem[] = JSON.parse(savedEnqs);
        // Combine unique with defaults
        const ids = new Set(parsed.map((p) => p.id));
        const merged = [...parsed, ...defaultEnquiries.filter((d) => !ids.has(d.id))];
        setEnquiries(merged);
      } else {
        setEnquiries(defaultEnquiries);
        localStorage.setItem("sunpower_customer_enquiries", JSON.stringify(defaultEnquiries));
      }
    } catch {
      setEnquiries(defaultEnquiries);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("sunpower_customer_update", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("sunpower_customer_update", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Toggle mark as read
  const toggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("sunpower_read_notif_ids", JSON.stringify(Array.from(next)));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    const allIds = [...reports.map((r) => r.id), ...enquiries.map((e) => e.id)];
    const next = new Set(allIds);
    setReadIds(next);
    try {
      localStorage.setItem("sunpower_read_notif_ids", JSON.stringify(Array.from(next)));
    } catch {
      // Ignore
    }
    showToast("All notifications marked as read");
  };

  // Quick assign technician to a report ticket
  const handleAssignTechnician = (ticketId: string) => {
    const tech = ALL_16_EMPLOYEES[assignTechId];
    if (!tech) return;

    try {
      const savedTickets: ServiceTicket[] = JSON.parse(
        localStorage.getItem("sunpower_service_tickets") || JSON.stringify(initialTickets)
      );

      const updated = savedTickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: "Assigned" as const,
            assignedTechnician: tech.name,
            techId: assignTechId,
          };
        }
        return t;
      });

      localStorage.setItem("sunpower_service_tickets", JSON.stringify(updated));

      // Notification for technician
      const notifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const techNotif = {
        id: `notif-tech-${Date.now()}`,
        recipientId: assignTechId,
        recipientRole: "technician" as const,
        text: `⚡ Urgent Dispatch: Assigned to ${ticketId} for customer site inspection`,
        time: "Just now",
        type: "task" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([techNotif, ...notifs]));

      window.dispatchEvent(new Event("sunpower_customer_update"));
      setQuickAssignTktId(null);
      showToast(`Assigned ${tech.name} to ${ticketId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark report resolved
  const handleResolveReport = (ticketId: string) => {
    try {
      const savedTickets: ServiceTicket[] = JSON.parse(
        localStorage.getItem("sunpower_service_tickets") || JSON.stringify(initialTickets)
      );

      const updated = savedTickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: "Resolved" as const,
            resolvedAt: "2026-10-31",
          };
        }
        return t;
      });

      localStorage.setItem("sunpower_service_tickets", JSON.stringify(updated));
      window.dispatchEvent(new Event("sunpower_customer_update"));
      showToast(`Ticket ${ticketId} marked as Resolved`);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark enquiry resolved
  const handleUpdateEnquiryStatus = (enquiryId: string, status: CustomerEnquiryItem["status"]) => {
    try {
      const updated = enquiries.map((enq) => (enq.id === enquiryId ? { ...enq, status } : enq));
      setEnquiries(updated);
      localStorage.setItem("sunpower_customer_enquiries", JSON.stringify(updated));
      showToast(`Enquiry ${enquiryId} updated to ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate new customer breakdown report
  const handleSimulateReport = () => {
    const randomId = `TKT-${Math.floor(100 + Math.random() * 900)}`;
    const newReport: ServiceTicket = {
      id: randomId,
      customerId: "CUST-LIVE",
      customerName: "Vikram Rathore (Live Test)",
      phone: "+91 98299 99888",
      address: "Lane 4, Civil Lines, Jaipur",
      serialNumber: "INV-5K-OG-7721",
      productName: "Solar Inverter 5kW Grid-Tie",
      issueType: "Inverter Error",
      description: "Grid synchronization tripped with error code E-04 during peak midday sun. Customer requesting urgent technician inspection.",
      priority: "Critical",
      status: "Open",
      warrantyStatus: "Under Warranty",
      assignedTechnician: "",
      estimatedCost: 0,
      actualCost: 0,
      createdAt: "Just now",
      resolvedAt: "",
    };

    try {
      const savedTickets: ServiceTicket[] = JSON.parse(
        localStorage.getItem("sunpower_service_tickets") || JSON.stringify(initialTickets)
      );
      localStorage.setItem("sunpower_service_tickets", JSON.stringify([newReport, ...savedTickets]));

      const notifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const adminNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "admin" as const,
        text: `🚨 New Breakdown Report from Vikram Rathore: Inverter Error (${randomId})`,
        time: "Just now",
        type: "alert" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([adminNotif, ...notifs]));

      window.dispatchEvent(new Event("sunpower_customer_update"));
      setIsOpen(true);
      setActiveTab("reports");
      showToast(`🚨 Simulated customer breakdown report received (${randomId})`);
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate new customer enquiry
  const handleSimulateEnquiry = () => {
    const randomId = `ENQ-${Math.floor(200 + Math.random() * 800)}`;
    const newEnq: CustomerEnquiryItem = {
      id: randomId,
      type: "enquiry",
      customerName: "Priyanka Khandelwal (Live)",
      phone: "+91 97845 11223",
      address: "18, Raja Park, Jaipur",
      system: "6 kW Bifacial Rooftop",
      subject: "Add 15 kWh High-Voltage Battery Storage",
      message: "Looking for quote to add 3x 5.12kWh modular lithium batteries to achieve zero grid dependency during power cuts.",
      priority: "High",
      status: "New",
      createdAt: "Just now",
      isRead: false,
    };

    try {
      const updated = [newEnq, ...enquiries];
      setEnquiries(updated);
      localStorage.setItem("sunpower_customer_enquiries", JSON.stringify(updated));

      const notifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const adminNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "admin" as const,
        text: `💬 New Customer Upgrade Enquiry from Priyanka Khandelwal (${randomId})`,
        time: "Just now",
        type: "lead" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([adminNotif, ...notifs]));

      window.dispatchEvent(new Event("sunpower_customer_update"));
      setIsOpen(true);
      setActiveTab("enquiries");
      showToast(`💬 Simulated customer upgrade enquiry received (${randomId})`);
    } catch (err) {
      console.error(err);
    }
  };

  // Compute feed items
  const combinedItems = useMemo(() => {
    const list: Array<CustomerReportItem | CustomerEnquiryItem> = [];
    if (activeTab === "all" || activeTab === "reports") {
      list.push(...reports);
    }
    if (activeTab === "all" || activeTab === "enquiries") {
      list.push(...enquiries);
    }

    return list.filter((item) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const titleOrSub = item.type === "report" ? `${item.issueType} ${item.description}` : `${item.subject} ${item.message}`;
        const match =
          item.customerName.toLowerCase().includes(q) ||
          item.phone.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          titleOrSub.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Pending only filter
      if (filterPendingOnly) {
        if (item.type === "report" && (item.status === "Resolved" || item.status === "Closed")) {
          return false;
        }
        if (item.type === "enquiry" && item.status === "Resolved") {
          return false;
        }
      }

      return true;
    });
  }, [reports, enquiries, activeTab, searchQuery, filterPendingOnly]);

  // Unread counts
  const unreadReportsCount = useMemo(() => {
    return reports.filter((r) => !readIds.has(r.id) && r.status !== "Resolved" && r.status !== "Closed").length;
  }, [reports, readIds]);

  const unreadEnquiriesCount = useMemo(() => {
    return enquiries.filter((e) => !readIds.has(e.id) && e.status !== "Resolved").length;
  }, [enquiries, readIds]);

  const totalUnreadCount = unreadReportsCount + unreadEnquiriesCount;

  // Open / pending reports count
  const openReportsCount = useMemo(() => {
    return reports.filter((r) => r.status === "Open" || r.status === "Assigned" || r.status === "In Progress").length;
  }, [reports]);

  // Open / new enquiries count
  const openEnquiriesCount = useMemo(() => {
    return enquiries.filter((e) => e.status === "New" || e.status === "In Review").length;
  }, [enquiries]);

  // Only render for admin role
  if (role !== "admin") {
    return null;
  }

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-5 z-[70] bg-[#333333] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-bounce">
          <span className="text-[#F4B860]">⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-[#FAF4F7] border-b border-[#E4E7EB] flex items-center justify-between">
              <span className="text-xs font-bold text-[#734960] truncate">{selectedPhoto.title}</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-center max-h-[70vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Widget Container at Bottom Right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end print:hidden select-none">
        {/* Open Floating Window */}
        {isOpen ? (
          <div className="w-[430px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-100px)] flex flex-col bg-white rounded-2xl shadow-2xl border border-[#D8DCE3] overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95">
            {/* Sleek Gradient Header */}
            <div className="bg-gradient-to-r from-[#734960] via-[#5A354A] to-[#432435] text-white px-4 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white/15 text-sm backdrop-blur-xs">
                  <span>🔔</span>
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4B860] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F4B860]"></span>
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-extrabold tracking-wide text-white">Customer Desk Notifications</h2>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-200/90 font-medium">
                    {openReportsCount} Breakdown Reports • {openEnquiriesCount} Upgrades
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="px-2 py-1 text-[10px] font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  Read All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize window"
                  className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition text-sm font-bold"
                >
                  —
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close window"
                  className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-[#FAF4F7] border-b border-[#E4E7EB] px-3 pt-2 pb-1.5 flex items-center gap-1.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === "all"
                    ? "bg-[#734960] text-white shadow-xs"
                    : "text-[#666666] hover:text-[#734960] hover:bg-white/60"
                }`}
              >
                <span>All Feeds</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === "all" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {reports.length + enquiries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === "reports"
                    ? "bg-[#DC2626] text-white shadow-xs"
                    : "text-[#666666] hover:text-red-700 hover:bg-red-50"
                }`}
              >
                <span>🚨 Reports</span>
                {unreadReportsCount > 0 ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-white text-red-600 animate-pulse">
                    {unreadReportsCount}
                  </span>
                ) : (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === "reports" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {reports.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("enquiries")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === "enquiries"
                    ? "bg-[#DA9B40] text-white shadow-xs"
                    : "text-[#666666] hover:text-[#DA9B40] hover:bg-amber-50"
                }`}
              >
                <span>💬 Enquiries</span>
                {unreadEnquiriesCount > 0 ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-white text-[#DA9B40] animate-pulse">
                    {unreadEnquiriesCount}
                  </span>
                ) : (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === "enquiries" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {enquiries.length}
                  </span>
                )}
              </button>
            </div>

            {/* Search & Status Quick Filter */}
            <div className="p-2.5 bg-white border-b border-[#E4E7EB] flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer, phone, ticket ID..."
                  className="w-full pl-7 pr-3 py-1 bg-[#F5F7FA] border border-[#E4E7EB] rounded-lg text-xs text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#734960] focus:border-[#734960]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={() => setFilterPendingOnly(!filterPendingOnly)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition whitespace-nowrap flex items-center gap-1 ${
                  filterPendingOnly
                    ? "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]"
                    : "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB] hover:bg-gray-100"
                }`}
              >
                <span>{filterPendingOnly ? "✓ Action Pending" : "All Status"}</span>
              </button>
            </div>

            {/* Notification Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#F5F7FA]/70">
              {combinedItems.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <span className="text-3xl">📭</span>
                  <p className="mt-2 text-xs font-bold text-[#666666]">No customer notifications match</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Try clearing your search query or filter</p>
                </div>
              ) : (
                combinedItems.map((item) => {
                  const isRead = readIds.has(item.id);
                  const isReport = item.type === "report";

                  return (
                    <div
                      key={item.id}
                      onClick={() => !isRead && toggleRead(item.id)}
                      className={`relative p-3 rounded-xl border transition-all text-left bg-white ${
                        !isRead
                          ? isReport
                            ? "border-red-300 ring-1 ring-red-200/60 shadow-xs"
                            : "border-amber-300 ring-1 ring-amber-200/60 shadow-xs"
                          : "border-[#E4E7EB] hover:border-gray-300 shadow-xs"
                      }`}
                    >
                      {/* Top Meta Header */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isReport ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                              <span>🚨</span> Report: {item.issueType}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <span>💬</span> Customer Enquiry
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-[#8E687F] font-bold">{item.id}</span>

                          {!isRead && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#734960] text-white">
                              NEW
                            </span>
                          )}
                        </div>

                        {/* Relative Timestamp & Read Toggle */}
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <span>{item.createdAt}</span>
                          <button
                            onClick={(e) => toggleRead(item.id, e)}
                            title={isRead ? "Mark as unread" : "Mark as read"}
                            className="p-1 hover:text-[#734960] rounded"
                          >
                            {isRead ? "○" : "●"}
                          </button>
                        </div>
                      </div>

                      {/* Customer Name & Plant Info */}
                      <div className="flex items-baseline justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-[#333333] flex items-center gap-1.5">
                          <span>{item.customerName}</span>
                          <span className="text-[11px] font-normal text-gray-500">• {item.system}</span>
                        </h4>
                      </div>

                      {/* Main Subject / Issue */}
                      <div className="text-[11px] text-[#444444] font-medium leading-relaxed mb-2">
                        {isReport ? (
                          <p>{item.description}</p>
                        ) : (
                          <div>
                            <p className="font-bold text-[#734960] mb-0.5">{item.subject}</p>
                            <p className="text-gray-600">{item.message}</p>
                          </div>
                        )}
                      </div>

                      {/* Customer Photo Proof / Attachment Preview if any */}
                      {((isReport && item.photoProofUrl) || (!isReport && item.attachedPhoto)) && (
                        <div className="mb-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhoto({
                                url: isReport ? item.photoProofUrl! : item.attachedPhoto!,
                                title: `${item.customerName} - Photo Attachment`,
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[10px] font-semibold text-[#734960] transition"
                          >
                            <span>📸</span>
                            <span>View Uploaded Customer Proof</span>
                          </button>
                        </div>
                      )}

                      {/* Location & Current Status Badge */}
                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1.5 border-t border-gray-100">
                        <span className="truncate max-w-[200px]" title={item.address}>
                          📍 {item.address}
                        </span>

                        <div>
                          {isReport ? (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                item.status === "Open"
                                  ? "bg-red-50 text-red-600 border border-red-200"
                                  : item.status === "Assigned"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : item.status === "Resolved"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {item.assignedTechnician ? `Tech: ${item.assignedTechnician}` : item.status}
                            </span>
                          ) : (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                item.status === "New"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : item.status === "Resolved"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-purple-50 text-purple-700 border border-purple-200"
                              }`}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Interactive Actions */}
                      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-1 flex-wrap">
                        {/* Direct Communication */}
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${item.phone.replace(/\s+/g, "")}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[#333333] rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                            title="Call customer"
                          >
                            <span>📞</span> Call
                          </a>
                          <a
                            href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                            title="Chat on WhatsApp"
                          >
                            <span>💬</span> WhatsApp
                          </a>
                        </div>

                        {/* Task-specific workflow actions */}
                        <div className="flex items-center gap-1">
                          {isReport ? (
                            <>
                              {item.status !== "Resolved" && item.status !== "Closed" ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuickAssignTktId(quickAssignTktId === item.id ? null : item.id);
                                    }}
                                    className="px-2 py-1 bg-[#FAF4F7] hover:bg-[#F4ECF0] text-[#734960] border border-[#8E687F]/30 rounded-lg text-[10px] font-bold transition"
                                  >
                                    Assign Tech ▾
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResolveReport(item.id);
                                    }}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition"
                                  >
                                    Resolve
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-600">✓ Resolved</span>
                              )}
                            </>
                          ) : (
                            <>
                              <Link
                                href="/quotations"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2 py-1 bg-[#734960] hover:bg-[#5A354A] text-white rounded-lg text-[10px] font-bold transition"
                              >
                                Build BOM Quote
                              </Link>
                              {item.status !== "Resolved" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateEnquiryStatus(item.id, "Resolved");
                                  }}
                                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold transition"
                                >
                                  Done
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quick Assign Dropdown Drawer */}
                      {isReport && quickAssignTktId === item.id && (
                        <div
                          className="mt-2.5 p-2 bg-[#F5F7FA] rounded-xl border border-[#E4E7EB] text-xs space-y-2 animate-in fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-[#734960]">Select Field Engineer:</span>
                            <button
                              onClick={() => setQuickAssignTktId(null)}
                              className="text-gray-400 hover:text-gray-600 text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                          <select
                            value={assignTechId}
                            onChange={(e) => setAssignTechId(e.target.value)}
                            className="w-full text-xs p-1.5 bg-white border border-[#E4E7EB] rounded-lg font-medium text-[#333333]"
                          >
                            {Object.entries(ALL_16_EMPLOYEES).map(([id, emp]) => (
                              <option key={id} value={id}>
                                {emp.name} ({id}) - {emp.specialization.split("&")[0]}
                              </option>
                            ))}
                          </select>
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setQuickAssignTktId(null)}
                              className="px-2 py-1 text-[10px] text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAssignTechnician(item.id)}
                              className="px-3 py-1 bg-[#734960] hover:bg-[#5A354A] text-white rounded-lg text-[10px] font-bold"
                            >
                              Confirm Dispatch
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions & Simulation Bar */}
            <div className="bg-white border-t border-[#E4E7EB] p-2.5 space-y-2">
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="text-gray-500 font-semibold">Test Live Notification:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSimulateReport}
                    className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold transition flex items-center gap-1"
                  >
                    <span>+</span> Breakdown Report
                  </button>
                  <button
                    onClick={handleSimulateEnquiry}
                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold transition flex items-center gap-1"
                  >
                    <span>+</span> Customer Enquiry
                  </button>
                </div>
              </div>

              {/* Portal Quick Links */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold">
                <Link
                  href="/service"
                  onClick={() => setIsOpen(false)}
                  className="text-[#734960] hover:underline flex items-center gap-1"
                >
                  <span>Open Full Service Desk</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/customer"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-[#734960] hover:underline flex items-center gap-1"
                >
                  <span>Customer Passbook</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Minimized Floating Trigger Button */
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 bg-gradient-to-r from-[#734960] to-[#5A354A] hover:from-[#5A354A] hover:to-[#432435] text-white rounded-full shadow-2xl border-2 border-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Open Customer Reports & Enquiries Window"
          >
            {/* Bell & Pulsing Radar */}
            <div className="relative flex items-center justify-center">
              <span className="text-base group-hover:rotate-12 transition-transform duration-200">🔔</span>
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4B860] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F4B860]"></span>
                </span>
              )}
            </div>

            {/* Label and Badge Pill */}
            <div className="flex items-center gap-2 text-left">
              <span className="text-xs font-bold tracking-tight">Customer Desk</span>

              {/* Breakdown reports count pill */}
              {openReportsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white shadow-xs flex items-center gap-0.5">
                  <span>🚨</span> {openReportsCount}
                </span>
              )}

              {/* Enquiries count pill */}
              {openEnquiriesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#F4B860] text-[#333333] shadow-xs flex items-center gap-0.5">
                  <span>💬</span> {openEnquiriesCount}
                </span>
              )}
            </div>

            {/* Expand arrow */}
            <span className="text-white/70 text-xs font-bold group-hover:translate-y-[-1px] transition-transform">
              ▲
            </span>
          </button>
        )}
      </div>
    </>
  );
}
