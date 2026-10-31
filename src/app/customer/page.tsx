"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { serviceTickets as defaultInitialTickets } from "@/data/mockData";

interface UploadedPhoto {
  id: number;
  title: string;
  category: string;
  date: string;
  url: string;
  isRealFile?: boolean;
}

interface SubmittedEnquiry {
  id: string;
  subject: string;
  message: string;
  date: string;
  attachedPhoto?: string;
  fileName?: string;
  status: string;
}

interface CustomerComplaintTicket {
  id: string;
  issue: string;
  date: string;
  status: string;
  cost: string;
  photo?: string;
  photoName?: string;
}

function CustomerContent() {
  const { user, loginAsCustomer } = useAuth();
  const searchParams = useSearchParams();

  // Tab state: 'passbook' | 'progress' | 'photos' | 'complaint' | 'enquiry' | 'warranty'
  const initialTab = (searchParams.get("tab") as "passbook" | "progress" | "photos" | "complaint" | "enquiry" | "warranty") || "passbook";
  const [activeTab, setActiveTab] = useState<"passbook" | "progress" | "photos" | "complaint" | "enquiry" | "warranty">(initialTab);

  const switchTab = (tab: "passbook" | "progress" | "photos" | "complaint" | "enquiry" | "warranty") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.pushState({}, "", url.toString());
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab") as "passbook" | "progress" | "photos" | "complaint" | "enquiry" | "warranty" | null;
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Customer profiles
  const customers = [
    {
      key: "rajesh",
      name: "Rajesh Gupta",
      phone: "+91 99887 76655",
      address: "12, Vaishali Nagar, Jaipur",
      system: "5 kW On-Grid System",
      installedDate: "22 Oct 2026",
      todayGen: "21.4 kWh",
      monthlyGen: "580 kWh",
      lifetimeSavings: "₹18,400",
      subsidyStatus: "Processing (₹78,000)",
      inverterSerial: "INV-5K-OG-9921",
      panelSerial: "SP-MONO-2026-4201 (10 Panels)",
      inverterWarranty: "Active until 22 Oct 2031 (5 Yrs)",
      panelWarranty: "Active until 22 Oct 2051 (25 Yrs)",
      progressStep: 5,
    },
    {
      key: "mohan",
      name: "Mohan Lal",
      phone: "+91 77665 54433",
      address: "67, Mansarovar, Jaipur",
      system: "3 kW On-Grid System",
      installedDate: "12 Oct 2026",
      todayGen: "13.8 kWh",
      monthlyGen: "390 kWh",
      lifetimeSavings: "₹12,100",
      subsidyStatus: "Credited (₹78,000)",
      inverterSerial: "INV-3K-OG-8832",
      panelSerial: "SP-MONO-2026-3101 (6 Panels)",
      inverterWarranty: "Active until 12 Oct 2031 (5 Yrs)",
      panelWarranty: "Active until 12 Oct 2051 (25 Yrs)",
      progressStep: 6,
    },
    {
      key: "kavita",
      name: "Kavita Joshi",
      phone: "+91 43210 98765",
      address: "10, Defence Colony, Jaipur",
      system: "3 kW Off-Grid System",
      installedDate: "Scheduled 04 Nov 2026",
      todayGen: "0.0 kWh (Pre-Install)",
      monthlyGen: "0 kWh",
      lifetimeSavings: "₹0",
      subsidyStatus: "Applied (National Portal)",
      inverterSerial: "INV-3K-HB-7755",
      panelSerial: "Allocated in Warehouse",
      inverterWarranty: "5-Year Guarantee",
      panelWarranty: "25-Year Guarantee",
      progressStep: 3,
    },
  ];

  // Pick customer based on logged in user or default to Rajesh
  const activeCustomerKey = user?.name ? (customers.find(c => user.name.includes(c.name.split(" ")[0]))?.key || "rajesh") : "rajesh";
  const [selectedCustKey, setSelectedCustKey] = useState(activeCustomerKey);

  const current = customers.find((c) => c.key === selectedCustKey) || customers[0];

  // Photo upload states
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([
    { id: 1, title: "South Roof Shadow Analysis", category: "Pre-Installation Roof", date: "2026-10-21", url: "☀️", isRealFile: false },
    { id: 2, title: "Main Three-Phase Electricity Meter", category: "Utility Meter", date: "2026-10-21", url: "🔌", isRealFile: false },
  ]);
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoCat, setNewPhotoCat] = useState("Pre-Installation Roof");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Complaint states
  const [complaintType, setComplaintType] = useState("Inverter Error (E-01/E-04)");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [complaintPhoto, setComplaintPhoto] = useState<string>("");
  const [complaintPhotoName, setComplaintPhotoName] = useState<string>("");
  const [complaintSuccess, setComplaintSuccess] = useState(false);
  const complaintFileRef = useRef<HTMLInputElement | null>(null);

  const [myTickets, setMyTickets] = useState<CustomerComplaintTicket[]>([
    {
      id: "TKT-088",
      issue: "Inverter E-04 Communication Error",
      date: "2026-10-28",
      status: "Assigned to Rohit Meena",
      cost: "₹0 (Free Warranty Claim)",
    },
  ]);

  // Enquiry states
  const [enquirySubject, setEnquirySubject] = useState("Add Battery Backup (Off-Grid Upgrade)");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryFile, setEnquiryFile] = useState<File | null>(null);
  const [enquiryFilePreview, setEnquiryFilePreview] = useState<string>("");
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const enquiryFileRef = useRef<HTMLInputElement | null>(null);
  const [enquiryHistory, setEnquiryHistory] = useState<SubmittedEnquiry[]>([
    {
      id: "ENQ-101",
      subject: "Subsidy Follow-up Question",
      message: "Wanted to confirm if the second installment of PM Surya Ghar subsidy needs meter verification.",
      date: "2026-10-25",
      status: "In Review by Solar Consultant",
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (!newPhotoTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setNewPhotoTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle) return;

    const item: UploadedPhoto = {
      id: Date.now(),
      title: newPhotoTitle,
      category: newPhotoCat,
      date: "2026-10-31",
      url: filePreview || "📸",
      isRealFile: Boolean(filePreview),
    };

    setUploadedPhotos([item, ...uploadedPhotos]);
    setNewPhotoTitle("");
    setSelectedFile(null);
    setFilePreview("");
    if (photoInputRef.current) photoInputRef.current.value = "";

    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  const handleComplaintFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setComplaintPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setComplaintPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc) return;

    const newTktId = `TKT-${Math.floor(100 + Math.random() * 900)}`;

    const formalTicket = {
      id: newTktId,
      customerId: current.key ? `CUST-${current.key.toUpperCase()}` : "CUST-001",
      customerName: current.name,
      phone: current.phone,
      address: current.address,
      serialNumber: current.inverterSerial,
      productName: current.system,
      issueType: complaintType.includes("Inverter") ? "Inverter Error" : complaintType.includes("Power") ? "Zero Power" : complaintType.includes("Battery") ? "Battery Issue" : "Low Output",
      description: complaintDesc,
      priority: "High" as const,
      status: "Open" as const,
      warrantyStatus: "Under Warranty" as const,
      assignedTechnician: "",
      estimatedCost: 0,
      actualCost: 0,
      createdAt: "2026-10-31",
      resolvedAt: "",
      photoProofUrl: complaintPhoto,
      photoProofName: complaintPhotoName,
    };

    try {
      const savedTickets = JSON.parse(localStorage.getItem("sunpower_service_tickets") || "[]");
      const fullList = savedTickets.length > 0 ? savedTickets : defaultInitialTickets;
      localStorage.setItem("sunpower_service_tickets", JSON.stringify([formalTicket, ...fullList]));
    } catch {
      // Ignore
    }

    try {
      const notifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const adminNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "admin" as const,
        text: `🚨 New Breakdown Complaint filed by ${current.name}: ${complaintType} (${newTktId})`,
        time: "Just now",
        type: "alert" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([adminNotif, ...notifs]));
    } catch {
      // Ignore
    }

    const newLocalTkt: CustomerComplaintTicket = {
      id: newTktId,
      issue: complaintType,
      date: "2026-10-31",
      status: "Open (Filed to Admin Service Desk)",
      cost: "₹0 (Free Warranty Claim)",
      photo: complaintPhoto,
      photoName: complaintPhotoName,
    };

    setMyTickets([newLocalTkt, ...myTickets]);
    setComplaintSuccess(true);
    setComplaintDesc("");
    setComplaintPhoto("");
    setComplaintPhotoName("");
    if (complaintFileRef.current) complaintFileRef.current.value = "";
    setTimeout(() => setComplaintSuccess(false), 3500);
  };

  const handleEnquiryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEnquiryFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEnquiryFilePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryMessage) return;

    const newEnq: SubmittedEnquiry = {
      id: `ENQ-${Math.floor(200 + Math.random() * 800)}`,
      subject: enquirySubject,
      message: enquiryMessage,
      date: "2026-10-31",
      attachedPhoto: enquiryFilePreview,
      fileName: enquiryFile?.name,
      status: "Assigned to Technical Consultant",
    };

    setEnquiryHistory([newEnq, ...enquiryHistory]);
    setEnquirySuccess(true);
    setEnquiryMessage("");
    setEnquiryFile(null);
    setEnquiryFilePreview("");
    if (enquiryFileRef.current) enquiryFileRef.current.value = "";
    setTimeout(() => setEnquirySuccess(false), 3000);
  };

  // Milestone steps definition
  const progressSteps = [
    { num: 1, title: "Inquiry & Roof Pre-Qualification", desc: "Form filled & subsidy verified" },
    { num: 2, title: "Site Survey & Shading Check", desc: "Technician measured tilt & orientation" },
    { num: 3, title: "Hardware Dispatch & Serial Tagging", desc: "Inverter & panels scanned at warehouse" },
    { num: 4, title: "Mounting, Wiring & Earthing", desc: "Rooftop hardware installed" },
    { num: 5, title: "Commissioning & Grid Net-Meter", desc: "Live yield test & Discom meter sync" },
    { num: 6, title: "PM Surya Ghar Subsidy Disbursed", desc: "₹78,000 credited to bank account" },
  ];

  const portalSections = [
    { id: "passbook", label: "Solar Yield & Passbook", icon: "☀️", badge: "Live Yield" },
    { id: "progress", label: "Installation Progress Report", icon: "📊", badge: `Step ${current.progressStep}/6` },
    { id: "photos", label: `Upload Roof Photos (${uploadedPhotos.length})`, icon: "📸", badge: `${uploadedPhotos.length} Photos` },
    { id: "complaint", label: "File Service Complaint", icon: "🚨", badge: myTickets.length > 0 ? `${myTickets.length} Active` : "Free Warranty" },
    { id: "enquiry", label: `Ask for Enquiry / Upgrade (${enquiryHistory.length})`, icon: "💬", badge: `${enquiryHistory.length} Inquiries` },
    { id: "warranty", label: "Digital Warranty Cards", icon: "🛡️", badge: "2 Active" },
  ];

  const currentSection = portalSections.find((s) => s.id === activeTab) || portalSections[0];

  return (
    <PageShell>
      {/* Customer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">☀️</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#333333]">
              Customer Solar Passbook
            </h1>
            <span className="text-[10px] font-bold bg-[#EBF5EC] text-[#5B965E] px-2.5 py-0.5 rounded-full border border-[#78B77B]/40">
              Homeowner Self-Service Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Welcome, <strong>{current.name}</strong> • {current.address}
          </p>
        </div>

        {/* Demo Switcher */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#E4E7EB] card-floating">
          <span className="text-[11px] font-bold text-[#666666] uppercase">Account:</span>
          <select
            value={selectedCustKey}
            onChange={(e) => {
              setSelectedCustKey(e.target.value);
              loginAsCustomer(e.target.value);
            }}
            className="text-xs font-bold text-[#734960] bg-transparent focus:outline-none cursor-pointer"
          >
            {customers.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name} ({c.system})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="bg-[#8E687F] rounded-2xl p-5 sm:p-6 text-white card-floating flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#734960] text-white border border-white/20">
            Plant ID: {current.inverterSerial}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold">{current.system}</h2>
          <p className="text-xs text-white/80">{current.address} • Commissioned: {current.installedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchTab("complaint")}
            className="px-3.5 py-2 bg-white hover:bg-[#FAF4F7] text-[#734960] text-xs font-bold rounded-xl card-floating transition cursor-pointer"
          >
            🚨 Report Breakdown
          </button>
          <button
            onClick={() => switchTab("progress")}
            className="px-3.5 py-2 bg-[#734960] hover:bg-[#5A354A] text-white text-xs font-bold rounded-xl card-floating transition border border-white/20 cursor-pointer"
          >
            📊 Track Status
          </button>
        </div>
      </div>

      {/* ───────────────── CUSTOMER PORTAL SECTION DROPDOWN BOX ───────────────── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E4E7EB] card-floating">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FAF4F7] border border-[#8E687F]/30 flex items-center justify-center text-2xl flex-shrink-0 card-floating">
              {currentSection.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#8E687F] uppercase tracking-wider">
                  Customer Portal Section
                </span>
                {currentSection.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF6EB] text-[#DA9B40] border border-[#F4B860]/40">
                    {currentSection.badge}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#333333] mt-0.5">
                {currentSection.label}
              </h2>
            </div>
          </div>

          {/* Interactive Dropdown Box */}
          <div className="w-full sm:w-80">
            <label htmlFor="customer-portal-dropdown-box" className="block text-[10px] font-bold text-[#666666] uppercase mb-1">
              Select Portal View (Dropdown Box)
            </label>
            <div className="relative">
              <select
                id="customer-portal-dropdown-box"
                value={activeTab}
                onChange={(e) => switchTab(e.target.value as any)}
                className="w-full appearance-none bg-[#F5F7FA] hover:bg-[#FAF4F7] text-[#333333] font-bold text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-xl border border-[#D8DCE3] focus:border-[#734960] focus:ring-2 focus:ring-[#734960]/20 focus:outline-none cursor-pointer transition card-floating"
              >
                <option value="passbook">☀️ Solar Yield &amp; Passbook</option>
                <option value="progress">📊 Installation Progress Report</option>
                <option value="photos">📸 Upload Roof Photos ({uploadedPhotos.length})</option>
                <option value="complaint">🚨 File Service Complaint</option>
                <option value="enquiry">💬 Ask for Enquiry / Upgrade ({enquiryHistory.length})</option>
                <option value="warranty">🛡️ Digital Warranty Cards</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#734960]">
                <span className="text-xs font-bold">▼</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── SECTION 1: PASSBOOK OVERVIEW ───────────────── */}
      {activeTab === "passbook" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#F4B860] card-floating">
              <span className="text-[10px] font-bold text-[#666666] uppercase">Today&apos;s Generation</span>
              <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">{current.todayGen}</p>
              <span className="text-[11px] text-[#5B965E] font-bold">☀️ 5.4 Peak Sun Hours</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#8E687F] card-floating">
              <span className="text-[10px] font-bold text-[#666666] uppercase">This Month</span>
              <p className="text-2xl font-extrabold text-[#734960] mt-1">{current.monthlyGen}</p>
              <span className="text-[11px] text-[#666666]">Replaced 94% of grid bill</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#78B77B] card-floating">
              <span className="text-[10px] font-bold text-[#666666] uppercase">Cumulative Bill Savings</span>
              <p className="text-2xl font-extrabold text-[#78B77B] mt-1">{current.lifetimeSavings}</p>
              <span className="text-[11px] text-[#5B965E] font-bold">₹7.20 / unit grid tariff saved</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#734960] card-floating">
              <span className="text-[10px] font-bold text-[#666666] uppercase">Govt DBT Subsidy</span>
              <p className="text-lg font-extrabold text-[#734960] mt-1">{current.subsidyStatus}</p>
              <span className="text-[11px] text-[#666666]">PM-Surya Ghar Scheme</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => switchTab("progress")}
              className="bg-white p-5 rounded-2xl border border-[#E4E7EB] card-floating hover:border-[#78B77B] cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">📊</span>
                <span className="text-xs font-bold text-[#78B77B]">View Timeline ➔</span>
              </div>
              <h4 className="text-sm font-bold text-[#333333]">Installation Progress Report</h4>
              <p className="text-xs text-[#666666]">
                Track all 6 milestone stages from survey to grid commissioning &amp; subsidy transfer.
              </p>
            </div>

            <div
              onClick={() => switchTab("photos")}
              className="bg-white p-5 rounded-2xl border border-[#E4E7EB] card-floating hover:border-[#F4B860] cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">📸</span>
                <span className="text-xs font-bold text-[#DA9B40]">Upload Photos ➔</span>
              </div>
              <h4 className="text-sm font-bold text-[#333333]">Rooftop Photo Proof</h4>
              <p className="text-xs text-[#666666]">
                Upload pictures of your roof, utility meter, or physical conditions for team review.
              </p>
            </div>

            <div
              onClick={() => switchTab("complaint")}
              className="bg-white p-5 rounded-2xl border border-[#E4E7EB] card-floating hover:border-[#DC2626] cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🚨</span>
                <span className="text-xs font-bold text-[#DC2626]">File Ticket ➔</span>
              </div>
              <h4 className="text-sm font-bold text-[#333333]">Breakdown &amp; Service Call</h4>
              <p className="text-xs text-[#666666]">
                Inverter fault code or zero power? Log instant breakdown with ₹0 auto warranty guarantee.
              </p>
            </div>
          </div>

          {/* Plant Hardware Specs Card */}
          <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 card-floating">
            <h4 className="text-xs font-bold text-[#333333] uppercase tracking-wider mb-3">
              Installed Equipment &amp; Serial Tagging
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#F5F7FA] rounded-xl border border-[#E4E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#734960] uppercase">Smart Grid Inverter</span>
                <p className="font-mono font-bold text-[#333333]">{current.inverterSerial}</p>
                <p className="text-[#5B965E] font-medium">{current.inverterWarranty}</p>
              </div>
              <div className="p-3 bg-[#F5F7FA] rounded-xl border border-[#E4E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#78B77B] uppercase">Solar PV Modules</span>
                <p className="font-mono font-bold text-[#333333]">{current.panelSerial}</p>
                <p className="text-[#5B965E] font-medium">{current.panelWarranty}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 2: INSTALLATION PROGRESS REPORT ───────────────── */}
      {activeTab === "progress" && (
        <div className="bg-white rounded-2xl border border-[#E4E7EB] p-6 card-floating space-y-6">
          <div className="flex items-center justify-between border-b border-[#E4E7EB] pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#78B77B] uppercase tracking-wider">Live Status Report</span>
              <h3 className="text-base font-bold text-[#333333]">Rooftop Plant Implementation Tracker</h3>
              <p className="text-xs text-[#666666]">Order: {current.inverterSerial} • Current Stage: Step {current.progressStep} of 6</p>
            </div>
            <span className="px-3 py-1 bg-[#EBF5EC] text-[#5B965E] font-bold text-xs rounded-full border border-[#78B77B]/40">
              {current.progressStep === 6 ? "100% Complete" : "85% Commissioned"}
            </span>
          </div>

          <div className="space-y-4">
            {progressSteps.map((step) => {
              const isCompleted = step.num < current.progressStep;
              const isCurrent = step.num === current.progressStep;
              return (
                <div key={step.num} className="flex items-start gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition ${
                      isCompleted
                        ? "bg-[#78B77B] text-white border-[#78B77B]"
                        : isCurrent
                        ? "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860] animate-pulse"
                        : "bg-[#F5F7FA] text-gray-400 border-[#E4E7EB]"
                    }`}
                  >
                    {isCompleted ? "✓" : step.num}
                  </div>

                  <div className="flex-1 bg-[#F5F7FA] p-3.5 rounded-xl border border-[#E4E7EB] card-floating">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#333333]">{step.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? "bg-[#EBF5EC] text-[#5B965E]"
                            : isCurrent
                            ? "bg-[#FEF6EB] text-[#DA9B40]"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isCompleted ? "Completed ✓" : isCurrent ? "Active In Progress ⚡" : "Pending Next"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666] mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 3: UPLOAD ROOF PHOTOS ───────────────── */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E4E7EB] p-6 card-floating space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#DA9B40] uppercase tracking-wider">Site Transparency</span>
              <h3 className="text-base font-bold text-[#333333]">Upload Rooftop &amp; Meter Photos</h3>
              <p className="text-xs text-[#666666]">
                Upload high-resolution images of your rooftop space, utility electric meter, or inverter installation.
              </p>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Photo Caption / Note</label>
                  <input
                    type="text"
                    placeholder="e.g. South Rooftop Clear View (Morning)"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Category</label>
                  <select
                    value={newPhotoCat}
                    onChange={(e) => setNewPhotoCat(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold"
                  >
                    <option value="Pre-Installation Roof">Pre-Installation Roof Layout</option>
                    <option value="Electricity Meter">Utility Net-Meter</option>
                    <option value="Earthing Pit">Earthing Connection</option>
                    <option value="Fault Proof">Inverter Fault Proof</option>
                    <option value="Solar Structure">Rooftop Mounting Structure</option>
                  </select>
                </div>
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {!filePreview ? (
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="border-2 border-dashed border-[#8E687F]/40 hover:border-[#734960] rounded-xl p-6 text-center bg-[#F5F7FA] hover:bg-[#FAF4F7] cursor-pointer transition group card-floating"
                >
                  <span className="text-3xl block mb-1 group-hover:scale-110 transition-transform">📸</span>
                  <span className="text-xs font-bold text-[#734960] block">
                    Click to select photo or take picture with camera
                  </span>
                  <p className="text-[10px] text-[#666666] mt-0.5">
                    Supports JPG, PNG, WEBP, HEIC (Max 15MB)
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF4F7] border border-[#8E687F]/30 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 card-floating">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-[#E4E7EB] flex-shrink-0 bg-white">
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold bg-[#EBF5EC] text-[#5B965E] px-2 py-0.5 rounded-full border border-[#78B77B]/40">
                      ✓ Ready for Upload
                    </span>
                    <h5 className="text-xs font-bold text-[#333333] mt-1 truncate max-w-xs">
                      {selectedFile?.name || "Selected Image"}
                    </h5>
                    <p className="text-[10px] text-[#666666]">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Image preview"}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-[11px] font-bold text-[#734960] hover:underline cursor-pointer"
                      >
                        Change Photo ⇄
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreview("");
                          if (photoInputRef.current) photoInputRef.current.value = "";
                        }}
                        className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-2.5 bg-[#EBF5EC] text-[#5B965E] text-xs font-bold rounded-xl border border-[#78B77B] text-center animate-in fade-in">
                  ✓ Photo uploaded successfully and synchronized with SunPower engineering team!
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#734960] hover:bg-[#5A354A] text-white font-bold rounded-xl text-xs card-floating transition cursor-pointer"
                >
                  Upload &amp; Tag Photo
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 card-floating space-y-3">
            <h4 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              My Uploaded Photos ({uploadedPhotos.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {uploadedPhotos.map((photo) => (
                <div key={photo.id} className="p-3 bg-[#F5F7FA] rounded-xl border border-[#E4E7EB] card-floating space-y-2">
                  <div className="h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-[#E4E7EB]">
                    {photo.isRealFile || photo.url.startsWith("data:") ? (
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(photo.url, "_blank")}
                      />
                    ) : (
                      <span className="text-4xl">{photo.url}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#734960] uppercase">{photo.category}</span>
                    <h5 className="text-xs font-bold text-[#333333] mt-0.5 truncate">{photo.title}</h5>
                    <p className="text-[10px] text-[#666666]">Uploaded on {photo.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 4: FILE COMPLAINT ───────────────── */}
      {activeTab === "complaint" && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E4E7EB] p-6 card-floating space-y-4">
            <div className="border-b border-[#E4E7EB] pb-3">
              <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">Helpdesk Dispatch</span>
              <h3 className="text-base font-bold text-[#333333] mt-0.5">Report Plant Issue / Breakdown to Admin</h3>
              <p className="text-xs text-[#666666]">
                Your complaint and uploaded photos will be dispatched directly to the Admin Service Desk.
              </p>
            </div>

            <div className="bg-[#EBF5EC] border border-[#78B77B]/40 rounded-xl p-3 text-xs text-[#5B965E] font-semibold flex items-center justify-between card-floating">
              <span>🛡️ <strong>Under Active 5-Year Warranty:</strong> Diagnostic visit and replacement parts are <strong>₹0 (100% Free)</strong>.</span>
              <span className="font-extrabold text-[10px] bg-white px-2 py-0.5 rounded border border-[#78B77B]">
                FREE REPAIR
              </span>
            </div>

            <form onSubmit={handleFileComplaint} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Issue Symptom / Fault Code</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="Inverter Error (E-01/E-04)">Inverter Error Code (E-01 / E-04)</option>
                  <option value="Zero Power Generation">Zero Power Generation on Grid</option>
                  <option value="Battery Not Holding Charge">Battery Not Holding Charge (Off-Grid)</option>
                  <option value="Solar Yield Below Expected">Yield Lower than Expected</option>
                  <option value="Storm / Hail Physical Damage">Storm / Physical Hail Damage</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Complaint Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe when the issue started and any error lights visible..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase block">
                  Attach Breakdown Photo / Inverter Display / Damage Proof
                </label>
                <input
                  ref={complaintFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleComplaintFileChange}
                  className="hidden"
                />
                {!complaintPhoto ? (
                  <button
                    type="button"
                    onClick={() => complaintFileRef.current?.click()}
                    className="mt-1 w-full border border-dashed border-[#E4E7EB] hover:border-[#DC2626] rounded-xl py-3 px-4 text-xs font-semibold text-[#666666] hover:text-[#DC2626] bg-[#F5F7FA] transition flex items-center justify-center gap-2 cursor-pointer card-floating"
                  >
                    <span>📷</span> Attach Inverter Error Photo / Damage Proof
                  </button>
                ) : (
                  <div className="mt-1 p-2 bg-[#FAF4F7] border border-[#8E687F]/30 rounded-xl flex items-center justify-between text-xs card-floating">
                    <div className="flex items-center gap-2">
                      <img src={complaintPhoto} alt="Proof" className="w-10 h-10 object-cover rounded-lg border border-[#E4E7EB]" />
                      <span className="font-semibold text-[#333333] truncate max-w-xs">{complaintPhotoName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setComplaintPhoto("");
                        setComplaintPhotoName("");
                        if (complaintFileRef.current) complaintFileRef.current.value = "";
                      }}
                      className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              {complaintSuccess && (
                <div className="p-3 bg-[#EBF5EC] text-[#5B965E] text-xs font-bold rounded-xl border border-[#78B77B] text-center animate-in fade-in">
                  ✓ Breakdown complaint &amp; uploaded photo proof filed to Admin! Status: Open on Operations Desk.
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC2626] hover:bg-red-700 text-white font-bold rounded-xl text-xs card-floating transition cursor-pointer"
                >
                  Submit Breakdown Ticket to Admin (Free)
                </button>
              </div>
            </form>
          </div>

          {/* Ticket History */}
          <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 card-floating space-y-3">
            <h4 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              My Service Ticket History ({myTickets.length})
            </h4>

            <div className="space-y-2">
              {myTickets.map((tkt) => (
                <div key={tkt.id} className="p-3.5 bg-[#F5F7FA] rounded-xl border border-[#E4E7EB] card-floating text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#DA9B40]">{tkt.id}</span>
                      <span className="font-bold text-[#333333]">{tkt.issue}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#EBF5EC] text-[#5B965E] font-bold text-[10px] rounded-full border border-[#78B77B]/40">
                      {tkt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666]">Filed: {tkt.date} • {tkt.cost}</p>
                  {tkt.photo && (
                    <div className="flex items-center gap-2 pt-1">
                      <img src={tkt.photo} alt="Attached Proof" className="w-8 h-8 rounded object-cover border border-[#E4E7EB]" />
                      <span className="text-[10px] text-[#734960] font-semibold">{tkt.photoName || "Photo Proof Filed to Admin"}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 5: ASK FOR ENQUIRY ───────────────── */}
      {activeTab === "enquiry" && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E4E7EB] p-6 card-floating space-y-4">
            <div className="border-b border-[#E4E7EB] pb-3">
              <span className="text-[10px] font-bold text-[#734960] uppercase tracking-wider">Client Inquiries &amp; Upgrades</span>
              <h3 className="text-base font-bold text-[#333333] mt-0.5">Ask for System Upgrade, Subsidy, or Enquiry</h3>
              <p className="text-xs text-[#666666]">
                Submit questions regarding battery expansion, additional panels, subsidy disbursement, or upload roof photos for an upgrade proposal.
              </p>
            </div>

            <form onSubmit={handleSendEnquiry} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Enquiry Subject</label>
                <select
                  value={enquirySubject}
                  onChange={(e) => setEnquirySubject(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold"
                >
                  <option value="Add Battery Backup (Off-Grid Upgrade)">Add Battery Backup (Off-Grid Upgrade)</option>
                  <option value="Capacity Expansion (e.g. 3kW to 5kW)">Expand Capacity (Add more solar panels)</option>
                  <option value="Rooftop Panel Deep Cleaning Service">Book Panel Deep Cleaning Service</option>
                  <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract (AMC)</option>
                  <option value="Subsidy Follow-up Question">Government Subsidy Disbursement Question</option>
                  <option value="Net-Meter Tariff Query">Discom Net-Meter Billing Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Your Message / Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Let us know what you would like to know or upgrade..."
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase block">
                  Upload Photo or File with Enquiry (e.g. Bill, Rooftop, Meter)
                </label>
                <input
                  ref={enquiryFileRef}
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={handleEnquiryFileChange}
                  className="hidden"
                />

                {!enquiryFilePreview ? (
                  <button
                    type="button"
                    onClick={() => enquiryFileRef.current?.click()}
                    className="mt-1 w-full border border-dashed border-[#E4E7EB] hover:border-[#734960] rounded-xl py-3 px-4 text-xs font-semibold text-[#734960] bg-[#F5F7FA] hover:bg-[#FAF4F7] transition flex items-center justify-center gap-2 cursor-pointer card-floating"
                  >
                    <span>📎</span> Click to upload file / photo for this inquiry
                  </button>
                ) : (
                  <div className="mt-1 p-2.5 bg-[#FAF4F7] border border-[#8E687F]/30 rounded-xl flex items-center justify-between text-xs card-floating">
                    <div className="flex items-center gap-3">
                      {enquiryFilePreview.startsWith("data:image") ? (
                        <img src={enquiryFilePreview} alt="Attached" className="w-12 h-12 object-cover rounded-lg border border-[#E4E7EB]" />
                      ) : (
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl border border-[#E4E7EB]">📄</div>
                      )}
                      <div>
                        <p className="font-bold text-[#333333] truncate max-w-xs">{enquiryFile?.name || "Attached File"}</p>
                        <p className="text-[10px] text-[#666666]">
                          {enquiryFile ? `${(enquiryFile.size / 1024).toFixed(1)} KB` : "Attached file"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEnquiryFile(null);
                        setEnquiryFilePreview("");
                        if (enquiryFileRef.current) enquiryFileRef.current.value = "";
                      }}
                      className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              {enquirySuccess && (
                <div className="p-3 bg-[#EBF5EC] text-[#5B965E] text-xs font-bold rounded-xl border border-[#78B77B] text-center animate-in fade-in">
                  ✓ Enquiry &amp; attached files submitted successfully! Our solar engineering team will review it within 2 hours.
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#734960] hover:bg-[#5A354A] text-white font-bold rounded-xl text-xs card-floating transition cursor-pointer"
                >
                  Send Enquiry ➔
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 card-floating space-y-3">
            <h4 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              My Submitted Inquiries &amp; Quotes ({enquiryHistory.length})
            </h4>

            <div className="space-y-2.5">
              {enquiryHistory.map((enq) => (
                <div key={enq.id} className="p-3.5 bg-[#F5F7FA] rounded-xl border border-[#E4E7EB] card-floating text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#333333]">{enq.subject}</span>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#E4E7EB] text-[#734960]">
                      {enq.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666]">{enq.message}</p>
                  {enq.attachedPhoto && (
                    <div className="pt-1 flex items-center gap-2">
                      <img src={enq.attachedPhoto} alt="Attachment" className="w-8 h-8 rounded object-cover border border-[#E4E7EB]" />
                      <span className="text-[10px] text-[#734960] font-semibold">{enq.fileName || "Attached Photo"}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-[#E4E7EB]/60 text-[10px]">
                    <span className="text-[#666666]">Submitted: {enq.date}</span>
                    <span className="font-bold text-[#DA9B40]">{enq.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 6: DIGITAL WARRANTY CARDS ───────────────── */}
      {activeTab === "warranty" && (
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              Active Digital Equipment Warranty Certificates
            </h3>
            <span className="text-xs text-[#5B965E] font-bold">100% Guaranteed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] card-floating space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#734960] bg-[#FAF4F7] px-2 py-0.5 rounded-full border border-[#8E687F]/30">
                    5-Year Inverter Warranty
                  </span>
                  <h4 className="text-sm font-bold text-[#333333] mt-1">Smart Solar Grid Inverter</h4>
                </div>
                <span className="text-2xl">⚡</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#666666]">
                <div className="flex justify-between">
                  <span>Serial Number:</span>
                  <span className="font-mono font-bold text-[#333333]">{current.inverterSerial}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-[#5B965E]">{current.inverterWarranty}</span>
                </div>
                <div className="flex justify-between border-t border-[#E4E7EB] pt-1.5">
                  <span>Customer Replacement Cost:</span>
                  <span className="font-extrabold text-[#5B965E]">₹0 (Free Coverage)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] card-floating space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B965E] bg-[#EBF5EC] px-2 py-0.5 rounded-full border border-[#78B77B]/40">
                    25-Year Panel Performance
                  </span>
                  <h4 className="text-sm font-bold text-[#333333] mt-1">Mono PERC Half-Cut Panels</h4>
                </div>
                <span className="text-2xl">☀️</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#666666]">
                <div className="flex justify-between">
                  <span>Batch Serials:</span>
                  <span className="font-mono font-bold text-[#333333]">{current.panelSerial}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-[#5B965E]">{current.panelWarranty}</span>
                </div>
                <div className="flex justify-between border-t border-[#E4E7EB] pt-1.5">
                  <span>Linear Output Degradation:</span>
                  <span className="font-extrabold text-[#78B77B]">&lt; 0.5% / Year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default function CustomerPortalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#666666]">Loading Customer Portal...</div>}>
      <CustomerContent />
    </Suspense>
  );
}
