"use client";

import {
  SunIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
  ChartBarIcon,
  CameraIcon,
  MessageSquareIcon,
  ZapIcon,
  PackageIcon,
  HardHatIcon,
  PhoneIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  FileTextIcon,
  ClockIcon,
  MapPinIcon,
} from "@/components/Icons";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import CustomerWorkProgressBar from "@/components/CustomerWorkProgressBar";
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

interface EnquiryProgressStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  date: string;
  details: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface SubmittedEnquiry {
  id: string;
  subject: string;
  message: string;
  date: string;
  attachedPhoto?: string;
  fileName?: string;
  status: string;
  currentStep: number;
  consultantName: string;
  consultantPhone: string;
  estimatedResolution: string;
  steps: EnquiryProgressStep[];
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
  const { user, role } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
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
  ];

  // Pick active profile strictly based on auth user phone/account
  const current = customers.find((c) => c.phone === user?.phone) || customers[0];

  // Uploaded Photos State
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([
    { id: 1, title: "South Rooftop Pre-Survey", category: "Pre-Installation Roof", date: "15 Oct 2026", url: "Roof Layout Area" },
    { id: 2, title: "JVVNL Bidirectional Net Meter", category: "Electricity Meter", date: "22 Oct 2026", url: "Net Meter Reading" },
    { id: 3, title: "Chemical Earthing Dual Pit", category: "Earthing Pit", date: "20 Oct 2026", url: "Earthing Pit Verification" },
  ]);
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoCat, setNewPhotoCat] = useState("Pre-Installation Roof");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Complaints / Service Ticket State
  const [myTickets, setMyTickets] = useState<CustomerComplaintTicket[]>([
    {
      id: "TKT-001",
      issue: "Inverter red alarm light blinking (Code E-04)",
      date: "28 Oct 2026",
      status: "In Progress",
      cost: "Free (Warranty Covered)",
    },
  ]);
  const [complaintType, setComplaintType] = useState("Inverter Error (E-01/E-04)");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [complaintPhoto, setComplaintPhoto] = useState<string>("");
  const [complaintPhotoName, setComplaintPhotoName] = useState<string>("");
  const [complaintSuccess, setComplaintSuccess] = useState(false);
  const complaintFileRef = useRef<HTMLInputElement | null>(null);

  // Enquiry / Upgrade Requests History
  const [enquirySubject, setEnquirySubject] = useState("Add Battery Backup (Off-Grid Upgrade)");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryFile, setEnquiryFile] = useState<File | null>(null);
  const [enquiryFilePreview, setEnquiryFilePreview] = useState<string>("");
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [expandedEnquiryId, setExpandedEnquiryId] = useState<string>("ENQ-8821");
  const enquiryFileRef = useRef<HTMLInputElement | null>(null);

  const [enquiryHistory, setEnquiryHistory] = useState<SubmittedEnquiry[]>([
    {
      id: "ENQ-8821",
      subject: "Add 5.12 kWh Lithium Battery Backup",
      message: "Want to connect hybrid battery backup to existing 5 kW solar system so we have power during night outages.",
      date: "29 Oct 2026",
      status: "Engineering Feasibility Review",
      currentStep: 3,
      consultantName: "Rohit Meena (Lead Solar Engineer)",
      consultantPhone: "+91 98765 43210",
      estimatedResolution: "Quotation & BOM ready by 02 Nov 2026",
      steps: [
        {
          stepNumber: 1,
          title: "Enquiry Submitted",
          subtitle: "29 Oct, 10:30 AM",
          date: "29 Oct 2026",
          details: "Upgrade inquiry logged on SunPower portal and assigned to Engineering Desk",
          isCompleted: true,
          isCurrent: false,
        },
        {
          stepNumber: 2,
          title: "Inverter Check",
          subtitle: "30 Oct, 02:15 PM",
          date: "30 Oct 2026",
          details: "Verified INV-5K-OG-9921 hybrid inverter compatibility with Okaya 48V LiFePO4 battery",
          isCompleted: true,
          isCurrent: false,
        },
        {
          stepNumber: 3,
          title: "Technical Review",
          subtitle: "In Progress",
          date: "31 Oct, 11:00 AM",
          details: "Chief Technical Officer reviewing Single Line Diagram (SLD) & DC charge controller sizing",
          isCompleted: false,
          isCurrent: true,
        },
        {
          stepNumber: 4,
          title: "Proposal Ready",
          subtitle: "Expected 02 Nov",
          date: "02 Nov 2026",
          details: "Itemized BOM quotation with subsidy deduction sent to customer WhatsApp & portal",
          isCompleted: false,
          isCurrent: false,
        },
        {
          stepNumber: 5,
          title: "Site Installation",
          subtitle: "Scheduled 05 Nov",
          date: "05 Nov 2026",
          details: "Field technician dispatched to bolt battery bank & test bidirectional charge transfer",
          isCompleted: false,
          isCurrent: false,
        },
      ],
    },
    {
      id: "ENQ-8410",
      subject: "Government DBT Subsidy Status Tracking",
      message: "Please share update on National Portal PM Surya Ghar ₹78,000 direct benefit bank transfer token.",
      date: "22 Oct 2026",
      status: "PFMS Bank Credit Verification",
      currentStep: 4,
      consultantName: "Vikas Sharma (Subsidy Desk Head)",
      consultantPhone: "+91 98765 88888",
      estimatedResolution: "Direct Benefit Transfer (DBT) Token Generated",
      steps: [
        {
          stepNumber: 1,
          title: "Enquiry Placed",
          subtitle: "22 Oct, 09:00 AM",
          date: "22 Oct 2026",
          details: "National Solar Portal reference number verified",
          isCompleted: true,
          isCurrent: false,
        },
        {
          stepNumber: 2,
          title: "Net-Meter Verified",
          subtitle: "23 Oct, 02:00 PM",
          date: "23 Oct 2026",
          details: "Bi-directional net meter sync confirmed with JVVNL Discom",
          isCompleted: true,
          isCurrent: false,
        },
        {
          stepNumber: 3,
          title: "Subsidy Sanctioned",
          subtitle: "25 Oct, 11:15 AM",
          date: "25 Oct 2026",
          details: "MNRE DBT authorization approved for ₹78,000 credit",
          isCompleted: true,
          isCurrent: false,
        },
        {
          stepNumber: 4,
          title: "Bank Credit Processing",
          subtitle: "In Progress",
          date: "30 Oct, 04:30 PM",
          details: "PFMS token dispatched to registered bank account",
          isCompleted: false,
          isCurrent: true,
        },
        {
          stepNumber: 5,
          title: "Subsidy Credited",
          subtitle: "Expected 04 Nov 2026",
          date: "04 Nov 2026",
          details: "Funds reflection in registered customer bank account",
          isCompleted: false,
          isCurrent: false,
        },
      ],
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
    if (!filePreview && !selectedFile) return;

    const newPhoto: UploadedPhoto = {
      id: Date.now(),
      title: newPhotoTitle || "Customer Roof Photo",
      category: newPhotoCat,
      date: "Today",
      url: filePreview || "Selected Photo",
      isRealFile: true,
    };

    setUploadedPhotos([newPhoto, ...uploadedPhotos]);
    setUploadSuccess(true);
    setNewPhotoTitle("");
    setSelectedFile(null);
    setFilePreview("");
    if (photoInputRef.current) photoInputRef.current.value = "";

    setTimeout(() => {
      setUploadSuccess(false);
    }, 4000);
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

    const newTicket: CustomerComplaintTicket = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      issue: `${complaintType}: ${complaintDesc}`,
      date: "Today",
      status: "Open (Pending Admin Dispatch)",
      cost: "₹0 (5-Year Inverter Warranty)",
      photo: complaintPhoto,
      photoName: complaintPhotoName,
    };

    setMyTickets([newTicket, ...myTickets]);
    setComplaintSuccess(true);

    try {
      const savedNotifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const adminNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "admin" as const,
        text: `Customer Complaint Filed: ${complaintType} from ${current.name} (${newTicket.id})`,
        time: "Just now",
        type: "complaint" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([adminNotif, ...savedNotifs]));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore
    }

    setComplaintDesc("");
    setComplaintPhoto("");
    setComplaintPhotoName("");
    if (complaintFileRef.current) complaintFileRef.current.value = "";

    setTimeout(() => {
      setComplaintSuccess(false);
    }, 4000);
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

    const newId = `ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnquiry: SubmittedEnquiry = {
      id: newId,
      subject: enquirySubject,
      message: enquiryMessage,
      date: "Today, Just now",
      status: "Engineering Feasibility Check",
      currentStep: 2,
      consultantName: "Vikas Sharma (Solar Technical Lead)",
      consultantPhone: "+91 98765 88888",
      estimatedResolution: "Feasibility review within 24 hours",
      attachedPhoto: enquiryFilePreview,
      fileName: enquiryFile?.name,
      steps: [
        {
          stepNumber: 1,
          title: "Enquiry Submitted",
          subtitle: "Just now",
          date: "Today",
          details: `Enquiry logged for ${enquirySubject} with customer requirements`,
          isCompleted: true,
          isCurrent: false,
        },
        {
          stepNumber: 2,
          title: "Technical Review",
          subtitle: "In Progress",
          date: "Today",
          details: "Site configuration under review by senior solar system engineer",
          isCompleted: false,
          isCurrent: true,
        },
        {
          stepNumber: 3,
          title: "Custom BOM Ready",
          subtitle: "Next 24h",
          date: "Tomorrow",
          details: "Discounted pricing, BOM bill of materials & PM Surya Ghar subsidy applied",
          isCompleted: false,
          isCurrent: false,
        },
        {
          stepNumber: 4,
          title: "Handover Signoff",
          subtitle: "Next Step",
          date: "Upcoming",
          details: "Final upgrade confirmation and site dispatch scheduled",
          isCompleted: false,
          isCurrent: false,
        },
      ],
    };

    setEnquiryHistory([newEnquiry, ...enquiryHistory]);
    setExpandedEnquiryId(newId);
    setEnquirySuccess(true);

    try {
      const savedNotifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const adminNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "admin" as const,
        text: `New Upgrade Enquiry: ${enquirySubject} from ${current.name} (${newId})`,
        time: "Just now",
        type: "enquiry" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([adminNotif, ...savedNotifs]));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore
    }

    setEnquiryMessage("");
    setEnquiryFile(null);
    setEnquiryFilePreview("");
    if (enquiryFileRef.current) enquiryFileRef.current.value = "";

    setTimeout(() => {
      setEnquirySuccess(false);
    }, 4000);
  };

  // Solar Panel Order / Expansion Form State (Solar Yield & Passbook Section)
  const [panelOrderName, setPanelOrderName] = useState(current.name);
  const [panelOrderPhone, setPanelOrderPhone] = useState(current.phone);
  const [panelOrderAddress, setPanelOrderAddress] = useState(current.address);
  const [panelQuantity, setPanelQuantity] = useState<number>(4);
  const [panelModel, setPanelModel] = useState("540W Mono PERC Half-Cut");
  const [panelOrderNotes, setPanelOrderNotes] = useState("");
  const [panelOrderSuccess, setPanelOrderSuccess] = useState(false);
  const [panelOrderHistory, setPanelOrderHistory] = useState<
    Array<{
      id: string;
      name: string;
      phone: string;
      address: string;
      quantity: number;
      model: string;
      notes: string;
      date: string;
      status: string;
    }>
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sunpower_panel_orders");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: "ORD-PANEL-104",
        name: current.name,
        phone: current.phone,
        address: current.address,
        quantity: 4,
        model: "540W Mono PERC Half-Cut",
        notes: "Want additional panels for 2nd floor terrace extension",
        date: "25 Oct 2026",
        status: "Site Feasibility Approved",
      },
    ];
  });

  useEffect(() => {
    setPanelOrderName(current.name);
    setPanelOrderPhone(current.phone);
    setPanelOrderAddress(current.address);
  }, [current.name, current.phone, current.address]);

  const handlePanelOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panelOrderName || !panelOrderPhone || !panelOrderAddress || !panelQuantity) return;

    const newOrder = {
      id: `ORD-PANEL-${Math.floor(100 + Math.random() * 900)}`,
      name: panelOrderName,
      phone: panelOrderPhone,
      address: panelOrderAddress,
      quantity: Number(panelQuantity),
      model: panelModel,
      notes: panelOrderNotes,
      date: "Today, Just now",
      status: "Submitted (Under Engineering Review)",
    };

    const updated = [newOrder, ...panelOrderHistory];
    setPanelOrderHistory(updated);
    try {
      localStorage.setItem("sunpower_panel_orders", JSON.stringify(updated));
    } catch {}

    try {
      const savedNotifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const adminNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "admin" as const,
        text: `New Panel Order: ${panelQuantity}x ${panelModel} panels requested by ${panelOrderName} (${newOrder.id})`,
        time: "Just now",
        type: "order" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([adminNotif, ...savedNotifs]));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    setPanelOrderSuccess(true);
    setPanelOrderNotes("");

    setTimeout(() => {
      setPanelOrderSuccess(false);
    }, 5000);
  };

  const progressSteps = [
    { num: 1, title: "Inquiry & Roof Pre-Qualification", desc: "Form filled & subsidy verified" },
    { num: 2, title: "Site Survey & Shading Check", desc: "Technician measured tilt & orientation" },
    { num: 3, title: "Hardware Dispatch & Serial Tagging", desc: "Inverter & panels scanned at warehouse" },
    { num: 4, title: "Mounting, Wiring & Earthing", desc: "Rooftop hardware installed" },
    { num: 5, title: "Commissioning & Grid Net-Meter", desc: "Live yield test & Discom meter sync" },
    { num: 6, title: "PM Surya Ghar Subsidy Disbursed", desc: "₹78,000 credited to bank account" },
  ];

  const portalSections = [
    { id: "passbook", label: "Solar Yield & Passbook", badge: "Live Yield" },
    { id: "progress", label: "Installation Progress Report", badge: `Step ${current.progressStep}/6` },
    { id: "photos", label: `Upload Roof Photos (${uploadedPhotos.length})`, badge: `${uploadedPhotos.length} Photos` },
    { id: "complaint", label: "File Service Complaint", badge: myTickets.length > 0 ? `${myTickets.length} Active` : "Free Warranty" },
    { id: "enquiry", label: `Ask for Enquiry / Upgrade (${enquiryHistory.length})`, badge: `${enquiryHistory.length} Inquiries` },
    { id: "warranty", label: "Digital Warranty Cards", badge: "2 Active" },
  ];

  function renderPortalSectionIcon(id: string, className = "w-5 h-5") {
    switch (id) {
      case "passbook":
        return <SunIcon className={className} />;
      case "progress":
        return <ChartBarIcon className={className} />;
      case "photos":
        return <CameraIcon className={className} />;
      case "complaint":
        return <AlertCircleIcon className={className} />;
      case "enquiry":
        return <MessageSquareIcon className={className} />;
      case "warranty":
        return <ShieldCheckIcon className={className} />;
      default:
        return <SunIcon className={className} />;
    }
  }

  const currentSection = portalSections.find((s) => s.id === activeTab) || portalSections[0];

  if (mounted && role !== "customer") {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-[#DEDCDC] p-8 text-center shadow-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F7F8F9] text-[#191D23] flex items-center justify-center text-3xl shadow-xs border border-[#DEDCDC]">
            <ShieldCheckIcon className="w-8 h-8 text-[#57707A]" />
          </div>
          <h2 className="text-xl font-bold text-[#191D23]">Customer Portal Access Restricted</h2>
          <p className="text-xs sm:text-sm text-[#57707A] leading-relaxed">
            Customer solar passbooks, generation history, and digital warranty records can only be accessed by logging in directly with a Customer account.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#191D23] hover:bg-[#57707A] text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Log in as Customer &rarr;
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#F7F8F9] hover:bg-[#DEDCDC] text-[#191D23] border border-[#DEDCDC] rounded-xl text-xs font-semibold transition"
            >
              Return to Admin Dashboard
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Customer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#191D23] to-[#57707A] flex items-center justify-center text-white shadow-xs">
              <SunIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#191D23]">
              Customer Solar Passbook
            </h1>
            <span className="text-[10px] font-bold bg-[#F7F8F9] text-[#57707A] px-2.5 py-0.5 rounded-full border border-[#DEDCDC] uppercase tracking-wide">
              Homeowner Self-Service Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#57707A] mt-1">
            Welcome, <strong className="text-[#191D23]">{current.name}</strong> • {current.address}
          </p>
        </div>

        {/* Secured Plant Verification Badge */}
        <div className="flex items-center gap-2.5 bg-[#191D23] px-3.5 py-2 rounded-xl border border-[#57707A] shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-bold text-white !text-white" style={{ color: "#ffffff" }}>
            {current.system}
          </span>
          <span className="text-[10px] text-[#DEDCDC] border-l border-[#57707A] pl-2 font-mono">
            Plant ID: {current.inverterSerial}
          </span>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#191D23] via-[#57707A] to-[#7B919C] rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#191D23] text-white border border-white/20">
            Plant ID: {current.inverterSerial}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-white !text-white tracking-tight" style={{ color: "#ffffff" }}>
            {current.system}
          </h2>
          <p className="text-xs text-white/85">{current.address} • Commissioned: {current.installedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchTab("complaint")}
            className="px-3.5 py-2 bg-white hover:bg-gray-100 text-[#191D23] text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            Report Breakdown
          </button>
          <button
            onClick={() => switchTab("progress")}
            className="px-3.5 py-2 bg-[#191D23] hover:bg-[#57707A] text-white text-xs font-bold rounded-xl transition border border-white/20 cursor-pointer shadow-xs"
          >
            Track Status
          </button>
        </div>
      </div>

      {/* ───────────────── CUSTOMER PORTAL SECTION DROPDOWN BOX ───────────────── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DEDCDC] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F7F8F9] border border-[#DEDCDC] flex items-center justify-center text-[#57707A] flex-shrink-0 shadow-2xs">
              {renderPortalSectionIcon(currentSection.id, "w-5 h-5 text-[#57707A]")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#57707A] uppercase tracking-wider">
                  Customer Portal Section
                </span>
                {currentSection.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F8F9] text-[#191D23] border border-[#DEDCDC]">
                    {currentSection.badge}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#191D23] mt-0.5">
                {currentSection.label}
              </h2>
            </div>
          </div>

          {/* Interactive Dropdown Box */}
          <div className="w-full sm:w-80">
            <label htmlFor="customer-portal-dropdown-box" className="block text-[10px] font-bold text-[#7B919C] uppercase mb-1 tracking-wide">
              Select Portal View
            </label>
            <div className="relative">
              <select
                id="customer-portal-dropdown-box"
                value={activeTab}
                onChange={(e) => switchTab(e.target.value as any)}
                className="w-full appearance-none bg-[#F7F8F9] hover:bg-gray-100 text-[#191D23] font-bold text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-xl border border-[#DEDCDC] focus:border-[#57707A] focus:ring-2 focus:ring-[#57707A]/20 focus:outline-none cursor-pointer transition shadow-2xs"
              >
                <option value="passbook">Solar Yield &amp; Passbook</option>
                <option value="progress">Installation Progress Report</option>
                <option value="photos">Upload Roof Photos ({uploadedPhotos.length})</option>
                <option value="complaint">File Service Complaint</option>
                <option value="enquiry">Ask for Enquiry / Upgrade ({enquiryHistory.length})</option>
                <option value="warranty">Digital Warranty Cards</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#57707A]">
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
            <div className="bg-white p-5 rounded-2xl border border-[#DEDCDC] border-l-4 border-l-[#57707A] shadow-xs">
              <span className="text-[10px] font-bold text-[#7B919C] uppercase tracking-wide">Today&apos;s Generation</span>
              <p className="text-2xl font-extrabold text-[#191D23] mt-1">{current.todayGen}</p>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <SunIcon className="w-3.5 h-3.5 text-emerald-600" /> 5.4 Peak Sun Hours
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DEDCDC] border-l-4 border-l-[#7B919C] shadow-xs">
              <span className="text-[10px] font-bold text-[#7B919C] uppercase tracking-wide">This Month</span>
              <p className="text-2xl font-extrabold text-[#57707A] mt-1">{current.monthlyGen}</p>
              <span className="text-[11px] text-[#7B919C] block mt-1">Replaced 94% of grid bill</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DEDCDC] border-l-4 border-l-emerald-600 shadow-xs">
              <span className="text-[10px] font-bold text-[#7B919C] uppercase tracking-wide">Cumulative Bill Savings</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{current.lifetimeSavings}</p>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">₹7.20 / unit grid tariff saved</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DEDCDC] border-l-4 border-l-[#191D23] shadow-xs">
              <span className="text-[10px] font-bold text-[#7B919C] uppercase tracking-wide">Govt DBT Subsidy</span>
              <p className="text-lg font-extrabold text-[#191D23] mt-1">{current.subsidyStatus}</p>
              <span className="text-[11px] text-[#7B919C] block mt-1">PM-Surya Ghar Scheme</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => switchTab("progress")}
              className="bg-white p-5 rounded-2xl border border-[#DEDCDC] shadow-xs hover:border-[#57707A] cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#F7F8F9] flex items-center justify-center text-[#57707A]">
                  <ChartBarIcon className="w-5 h-5 text-[#57707A]" />
                </div>
                <span className="text-xs font-bold text-[#57707A] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Timeline &rarr;
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191D23]">Installation Progress Report</h4>
              <p className="text-xs text-[#57707A] leading-relaxed">
                Track all 6 milestone stages from survey to grid commissioning &amp; subsidy transfer.
              </p>
            </div>

            <div
              onClick={() => switchTab("photos")}
              className="bg-white p-5 rounded-2xl border border-[#DEDCDC] shadow-xs hover:border-[#57707A] cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#F7F8F9] flex items-center justify-center text-[#57707A]">
                  <CameraIcon className="w-5 h-5 text-[#57707A]" />
                </div>
                <span className="text-xs font-bold text-[#57707A] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Upload Photos &rarr;
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191D23]">Rooftop Photo Proof</h4>
              <p className="text-xs text-[#57707A] leading-relaxed">
                Upload pictures of your roof, utility meter, or physical conditions for team review.
              </p>
            </div>

            <div
              onClick={() => switchTab("complaint")}
              className="bg-white p-5 rounded-2xl border border-[#DEDCDC] shadow-xs hover:border-red-600 cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <AlertCircleIcon className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  File Ticket &rarr;
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191D23]">Breakdown &amp; Service Call</h4>
              <p className="text-xs text-[#57707A] leading-relaxed">
                Inverter fault code or zero power? Log instant breakdown with ₹0 auto warranty guarantee.
              </p>
            </div>
          </div>

          {/* Plant Hardware Specs Card */}
          <div className="bg-white rounded-2xl border border-[#DEDCDC] p-5 shadow-xs">
            <h4 className="text-xs font-bold text-[#191D23] uppercase tracking-wider mb-3">
              Installed Equipment &amp; Serial Tagging
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-[#F7F8F9] rounded-xl border border-[#DEDCDC] space-y-1">
                <span className="text-[10px] font-bold text-[#57707A] uppercase tracking-wide">Smart Grid Inverter</span>
                <p className="font-mono font-bold text-[#191D23]">{current.inverterSerial}</p>
                <p className="text-emerald-600 font-medium">{current.inverterWarranty}</p>
              </div>
              <div className="p-3.5 bg-[#F7F8F9] rounded-xl border border-[#DEDCDC] space-y-1">
                <span className="text-[10px] font-bold text-[#57707A] uppercase tracking-wide">Solar PV Modules</span>
                <p className="font-mono font-bold text-[#191D23]">{current.panelSerial}</p>
                <p className="text-emerald-600 font-medium">{current.panelWarranty}</p>
              </div>
            </div>
          </div>

          {/* ── SOLAR PANEL EXPANSION & ORDER FORM (YIELD & PASSBOOK SECTION BOTTOM) ── */}
          <div className="bg-white rounded-2xl border border-[#DEDCDC] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DEDCDC] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F8F9] border border-[#DEDCDC] flex items-center justify-center text-[#57707A]">
                    <SunIcon className="w-4 h-4 text-[#57707A]" />
                  </div>
                  <h4 className="text-base font-bold text-[#191D23]">
                    Order Additional Solar Panels / Capacity Expansion
                  </h4>
                </div>
                <p className="text-xs text-[#57707A] mt-1">
                  Want to expand your plant capacity? Fill in your details below to order extra solar panels with zero hassle.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F7F8F9] text-[#191D23] border border-[#DEDCDC] uppercase tracking-wide self-start sm:self-auto">
                Direct Homeowner Booking
              </span>
            </div>

            <form onSubmit={handlePanelOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={panelOrderName}
                    onChange={(e) => setPanelOrderName(e.target.value)}
                    placeholder="e.g. Rajesh Gupta"
                    className="w-full mt-1 px-3 py-2 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-[#F7F8F9] text-[#191D23] focus:bg-white focus:border-[#57707A] focus:ring-2 focus:ring-[#57707A]/20 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={panelOrderPhone}
                    onChange={(e) => setPanelOrderPhone(e.target.value)}
                    placeholder="e.g. +91 99887 76655"
                    className="w-full mt-1 px-3 py-2 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-[#F7F8F9] text-[#191D23] focus:bg-white focus:border-[#57707A] focus:ring-2 focus:ring-[#57707A]/20 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase tracking-wide">
                    Quantity of Solar Panels *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={panelQuantity}
                      onChange={(e) => setPanelQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      placeholder="e.g. 4"
                      className="w-full px-3 py-2 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-[#F7F8F9] text-[#191D23] focus:bg-white focus:border-[#57707A] focus:ring-2 focus:ring-[#57707A]/20 focus:outline-none transition pr-16"
                      required
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-[#7B919C] pointer-events-none">
                      Panels
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase tracking-wide flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#57707A]" />
                    <span>Installation / Site Address *</span>
                  </label>
                  <input
                    type="text"
                    value={panelOrderAddress}
                    onChange={(e) => setPanelOrderAddress(e.target.value)}
                    placeholder="e.g. 12, Vaishali Nagar, Jaipur"
                    className="w-full mt-1 px-3 py-2 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-[#F7F8F9] text-[#191D23] focus:bg-white focus:border-[#57707A] focus:ring-2 focus:ring-[#57707A]/20 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase tracking-wide">
                    Panel Technology / Wattage
                  </label>
                  <select
                    value={panelModel}
                    onChange={(e) => setPanelModel(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-[#F7F8F9] text-[#191D23] focus:bg-white focus:border-[#57707A] focus:ring-2 focus:ring-[#57707A]/20 focus:outline-none transition"
                  >
                    <option value="540W Mono PERC Half-Cut">540W Mono PERC Half-Cut (High Efficiency)</option>
                    <option value="550W Bi-Facial Dual Glass">550W Bi-Facial Dual Glass (+25% Rear Yield)</option>
                    <option value="400W All-Black Architectural">400W All-Black Architectural Sleek Panels</option>
                    <option value="580W TOPCon N-Type Next-Gen">580W TOPCon N-Type Next-Gen High Output</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7B919C] uppercase tracking-wide">
                  Additional Rooftop / Site Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={panelOrderNotes}
                  onChange={(e) => setPanelOrderNotes(e.target.value)}
                  placeholder="e.g. Please check inverter capacity compatibility and roof shading..."
                  className="w-full mt-1 px-3 py-2 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-[#F7F8F9] text-[#191D23] focus:bg-white focus:border-[#57707A] focus:ring-2 focus:ring-[#57707A]/20 focus:outline-none transition"
                />
              </div>

              {panelOrderSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 text-center animate-in fade-in flex items-center justify-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-700" />
                  <span>Request for {panelQuantity} solar panels submitted! SunPower team will review your roof layout and contact you at {panelOrderPhone}.</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#DEDCDC]">
                <div className="text-[11px] text-[#7B919C]">
                  Estimated added generation: <strong className="text-[#191D23]">~{(panelQuantity * 2.2).toFixed(1)} kWh / day</strong>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#191D23] hover:bg-[#57707A] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PackageIcon className="w-3.5 h-3.5" />
                  <span>Submit Solar Panel Request</span>
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Recent Orders List if any */}
            {panelOrderHistory.length > 0 && (
              <div className="pt-3 border-t border-[#DEDCDC] space-y-2">
                <span className="text-[10px] font-bold text-[#7B919C] uppercase tracking-wider block">
                  My Panel Requests History ({panelOrderHistory.length})
                </span>
                <div className="space-y-1.5">
                  {panelOrderHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#F7F8F9] rounded-xl border border-[#DEDCDC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-[#57707A] bg-white px-2 py-0.5 rounded border border-[#DEDCDC]">
                          {item.id}
                        </span>
                        <div>
                          <p className="font-bold text-[#191D23]">
                            {item.quantity}x {item.model}
                          </p>
                          <p className="text-[11px] text-[#7B919C]">
                            Deliver to: {item.address} • Contact: {item.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-[#7B919C]">{item.date}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 2: INSTALLATION PROGRESS REPORT ───────────────── */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <CustomerWorkProgressBar customer={current} />

          <div className="bg-white rounded-2xl border border-[#DEDCDC] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#DEDCDC] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#57707A] uppercase tracking-wider">Live Status Report</span>
                <h3 className="text-base font-bold text-[#191D23]">Rooftop Plant Implementation Tracker</h3>
                <p className="text-xs text-[#57707A]">Order: {current.inverterSerial} • Current Stage: Step {current.progressStep} of 6</p>
              </div>
              <span className="px-3 py-1 bg-[#F7F8F9] text-[#191D23] font-bold text-xs rounded-full border border-[#DEDCDC]">
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
                          ? "bg-[#57707A] text-white border-[#57707A]"
                          : isCurrent
                          ? "bg-[#191D23] text-white border-[#191D23] animate-pulse"
                          : "bg-[#F7F8F9] text-gray-400 border-[#DEDCDC]"
                      }`}
                    >
                      {isCompleted ? <CheckIcon className="w-4 h-4 text-white stroke-[3]" /> : step.num}
                    </div>

                    <div className="flex-1 bg-[#F7F8F9] p-3.5 rounded-xl border border-[#DEDCDC]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#191D23]">{step.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-800"
                              : isCurrent
                              ? "bg-white text-[#191D23] border border-[#DEDCDC]"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {isCompleted ? "Completed" : isCurrent ? "Active In Progress" : "Pending Next"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#57707A] mt-1">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 3: UPLOAD ROOF PHOTOS ───────────────── */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#DEDCDC] p-6 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#57707A] uppercase tracking-wider">Site Transparency</span>
              <h3 className="text-base font-bold text-[#191D23]">Upload Rooftop &amp; Meter Photos</h3>
              <p className="text-xs text-[#57707A]">
                Upload high-resolution images of your rooftop space, utility electric meter, or inverter installation.
              </p>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase">Photo Caption / Note</label>
                  <input
                    type="text"
                    placeholder="e.g. South Rooftop Clear View (Morning)"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#DEDCDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#57707A]/30 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase">Category</label>
                  <select
                    value={newPhotoCat}
                    onChange={(e) => setNewPhotoCat(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-white"
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
                  className="border-2 border-dashed border-[#C5BAC4] hover:border-[#57707A] rounded-xl p-6 text-center bg-[#F7F8F9] hover:bg-gray-100 cursor-pointer transition group"
                >
                  <CameraIcon className="w-8 h-8 text-[#57707A] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#191D23] block">
                    Click to select photo or take picture with camera
                  </span>
                  <p className="text-[10px] text-[#7B919C] mt-0.5">
                    Supports JPG, PNG, WEBP, HEIC (Max 15MB)
                  </p>
                </div>
              ) : (
                <div className="bg-[#F7F8F9] border border-[#DEDCDC] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-[#DEDCDC] flex-shrink-0 bg-white">
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 inline-flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3 text-emerald-700" /> Ready for Upload
                    </span>
                    <h5 className="text-xs font-bold text-[#191D23] mt-1 truncate max-w-xs">
                      {selectedFile?.name || "Selected Image"}
                    </h5>
                    <p className="text-[10px] text-[#7B919C]">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Image preview"}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-[11px] font-bold text-[#57707A] hover:underline cursor-pointer"
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
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 text-center animate-in fade-in flex items-center justify-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-700" /> Photo uploaded successfully and synchronized with SunPower engineering team!
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#191D23] hover:bg-[#57707A] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Upload &amp; Tag Photo
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-[#DEDCDC] p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#191D23] uppercase tracking-wider">
              My Uploaded Photos ({uploadedPhotos.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {uploadedPhotos.map((photo) => (
                <div key={photo.id} className="p-3 bg-[#F7F8F9] rounded-xl border border-[#DEDCDC] space-y-2">
                  <div className="h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-[#DEDCDC]">
                    {photo.isRealFile || photo.url.startsWith("data:") ? (
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(photo.url, "_blank")}
                      />
                    ) : (
                      <CameraIcon className="w-8 h-8 text-[#57707A]" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#57707A] uppercase">{photo.category}</span>
                    <h5 className="text-xs font-bold text-[#191D23] mt-0.5 truncate">{photo.title}</h5>
                    <p className="text-[10px] text-[#7B919C]">Uploaded on {photo.date}</p>
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
          <div className="bg-white rounded-2xl border border-[#DEDCDC] p-6 shadow-xs space-y-4">
            <div className="border-b border-[#DEDCDC] pb-3">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Helpdesk Dispatch</span>
              <h3 className="text-base font-bold text-[#191D23] mt-0.5">Report Plant Issue / Breakdown to Admin</h3>
              <p className="text-xs text-[#57707A]">
                Your complaint and uploaded photos will be dispatched directly to the Admin Service Desk.
              </p>
            </div>

            <div className="bg-[#F7F8F9] border border-[#DEDCDC] rounded-xl p-3 text-xs text-[#191D23] font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#57707A]" />
                <span><strong>Under Active 5-Year Warranty:</strong> Diagnostic visit and replacement parts are <strong>₹0 (100% Free)</strong>.</span>
              </span>
              <span className="font-extrabold text-[10px] bg-white text-[#191D23] px-2 py-0.5 rounded border border-[#DEDCDC]">
                FREE REPAIR
              </span>
            </div>

            <form onSubmit={handleFileComplaint} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#7B919C] uppercase">Issue Symptom / Fault Code</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="Inverter Error (E-01/E-04)">Inverter Error Code (E-01 / E-04)</option>
                  <option value="Zero Power Generation">Zero Power Generation on Grid</option>
                  <option value="Battery Not Holding Charge">Battery Not Holding Charge (Off-Grid)</option>
                  <option value="Solar Yield Below Expected">Yield Lower than Expected</option>
                  <option value="Storm / Hail Physical Damage">Storm / Physical Hail Damage</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7B919C] uppercase">Complaint Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe when the issue started and any error lights visible..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#DEDCDC] rounded-xl text-xs focus:ring-2 focus:ring-[#57707A]/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7B919C] uppercase block">
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
                    className="mt-1 w-full border border-dashed border-[#C5BAC4] hover:border-[#191D23] rounded-xl py-3 px-4 text-xs font-semibold text-[#57707A] hover:text-[#191D23] bg-[#F7F8F9] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CameraIcon className="w-4 h-4 text-[#57707A]" /> Attach Inverter Error Photo / Damage Proof
                  </button>
                ) : (
                  <div className="mt-1 p-2 bg-[#F7F8F9] border border-[#DEDCDC] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={complaintPhoto} alt="Proof" className="w-10 h-10 object-cover rounded-lg border border-[#DEDCDC]" />
                      <span className="font-semibold text-[#191D23] truncate max-w-xs">{complaintPhotoName}</span>
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
                      &times; Remove
                    </button>
                  </div>
                )}
              </div>

              {complaintSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 text-center animate-in fade-in flex items-center justify-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-700" /> Breakdown complaint &amp; uploaded photo proof filed to Admin! Status: Open on Operations Desk.
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#191D23] hover:bg-[#57707A] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Submit Breakdown Ticket to Admin (Free)
                </button>
              </div>
            </form>
          </div>

          {/* Ticket History */}
          <div className="bg-white rounded-2xl border border-[#DEDCDC] p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#191D23] uppercase tracking-wider">
              My Service Ticket History ({myTickets.length})
            </h4>

            <div className="space-y-2">
              {myTickets.map((tkt) => (
                <div key={tkt.id} className="p-3.5 bg-[#F7F8F9] rounded-xl border border-[#DEDCDC] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#57707A]">{tkt.id}</span>
                      <span className="font-bold text-[#191D23]">{tkt.issue}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-white text-[#191D23] font-bold text-[10px] rounded-full border border-[#DEDCDC]">
                      {tkt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7B919C]">Filed: {tkt.date} • {tkt.cost}</p>
                  {tkt.photo && (
                    <div className="flex items-center gap-2 pt-1">
                      <img src={tkt.photo} alt="Attached Proof" className="w-8 h-8 rounded object-cover border border-[#DEDCDC]" />
                      <span className="text-[10px] text-[#57707A] font-semibold">{tkt.photoName || "Photo Proof Filed to Admin"}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 5: ASK FOR ENQUIRY & FLIPKART-STYLE LIVE PROGRESS TRACKER ───────────────── */}
      {activeTab === "enquiry" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* New Enquiry Form Card */}
          <div className="bg-white rounded-2xl border border-[#DEDCDC] p-6 shadow-xs space-y-4">
            <div className="border-b border-[#DEDCDC] pb-3">
              <span className="text-[10px] font-bold text-[#57707A] uppercase tracking-wider">
                Client Inquiries &amp; System Upgrades
              </span>
              <h3 className="text-base font-bold text-[#191D23] mt-0.5">
                Submit New Solar Enquiry / Upgrade Request
              </h3>
              <p className="text-xs text-[#57707A]">
                Submit questions regarding battery expansion, additional panels, subsidy disbursement, or upload roof photos for an upgrade proposal.
              </p>
            </div>

            <form onSubmit={handleSendEnquiry} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase">Enquiry Subject</label>
                  <select
                    value={enquirySubject}
                    onChange={(e) => setEnquirySubject(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-white"
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
                  <label className="text-[11px] font-bold text-[#7B919C] uppercase">Homeowner / Account</label>
                  <input
                    type="text"
                    disabled
                    value={`${current.name} • ${current.system}`}
                    className="w-full mt-1 px-3 py-2 border border-[#DEDCDC] rounded-xl text-xs font-semibold bg-[#F7F8F9] text-[#57707A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7B919C] uppercase">Your Message / Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Tell us what you need (e.g. want 5kWh lithium battery storage for nighttime backup)..."
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-[#DEDCDC] rounded-xl text-xs focus:ring-2 focus:ring-[#57707A]/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7B919C] uppercase block">
                  Upload Photo or File with Enquiry (e.g. Electricity Bill, Rooftop, Meter)
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
                    className="mt-1 w-full border border-dashed border-[#C5BAC4] hover:border-[#191D23] rounded-xl py-2.5 px-4 text-xs font-semibold text-[#57707A] bg-[#F7F8F9] hover:bg-gray-100 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileTextIcon className="w-4 h-4 text-[#57707A]" /> Click to upload file / photo for this inquiry
                  </button>
                ) : (
                  <div className="mt-1 p-2.5 bg-[#F7F8F9] border border-[#DEDCDC] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {enquiryFilePreview.startsWith("data:image") ? (
                        <img src={enquiryFilePreview} alt="Attached" className="w-12 h-12 object-cover rounded-lg border border-[#DEDCDC]" />
                      ) : (
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-[#DEDCDC]">
                          <FileTextIcon className="w-6 h-6 text-[#57707A]" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-[#191D23] truncate max-w-xs">{enquiryFile?.name || "Attached File"}</p>
                        <p className="text-[10px] text-[#7B919C]">
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
                      &times; Remove
                    </button>
                  </div>
                )}
              </div>

              {enquirySuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 text-center animate-in fade-in flex items-center justify-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-700" /> Enquiry submitted! Live Flipkart-style progress tracker generated below.
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#191D23] hover:bg-[#57707A] text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Submit Enquiry &amp; Track</span>
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* ───────────────── FLIPKART-LIKE PROGRESS TRACKER SECTION ───────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-[#191D23] uppercase tracking-wider flex items-center gap-2">
                  <PackageIcon className="w-4 h-4 text-[#57707A]" /> Track My Enquiries &amp; Work Progress
                </h4>
                <p className="text-xs text-[#57707A]">
                  Real-time stepped milestone timeline showing exactly how far your solar upgrade has progressed
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#F7F8F9] text-[#191D23] rounded-full border border-[#DEDCDC]">
                {enquiryHistory.length} Active Tracks
              </span>
            </div>

            {enquiryHistory.map((enq) => {
              const isExpanded = expandedEnquiryId === enq.id;
              const currentStepObj = enq.steps.find((s) => s.isCurrent) || enq.steps[enq.steps.length - 1];

              return (
                <div
                  key={enq.id}
                  className="bg-white rounded-2xl border border-[#DEDCDC] shadow-xs overflow-hidden transition-all"
                >
                  {/* Top Header Card */}
                  <div className="p-4 sm:p-5 border-b border-[#DEDCDC] bg-[#F7F8F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-white text-[#191D23] px-2.5 py-0.5 rounded-md border border-[#DEDCDC] shadow-2xs">
                          {enq.id}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#191D23]">
                          {enq.subject}
                        </h4>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#57707A] border border-[#C5BAC4] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#57707A] mt-1.5 line-clamp-2">
                        &ldquo;{enq.message}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:text-right flex-shrink-0">
                      <button
                        onClick={() => setExpandedEnquiryId(isExpanded ? "" : enq.id)}
                        className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#191D23] text-xs font-bold rounded-xl border border-[#DEDCDC] transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{isExpanded ? "Hide Details" : "Track Details"}</span>
                        <span className="text-[10px]">{isExpanded ? "▲" : "▼"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Flipkart-Style Progress Notice Banner */}
                  <div className="bg-[#F7F8F9] border-b border-[#DEDCDC] px-4 py-2.5 text-xs text-[#191D23] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PackageIcon className="w-4 h-4 text-[#57707A]" />
                      <span>
                        <strong>Current Status:</strong> {currentStepObj?.details}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#57707A] bg-white px-2.5 py-0.5 rounded-full border border-[#DEDCDC] flex-shrink-0 flex items-center gap-1">
                      <ClockIcon className="w-3 h-3 text-[#57707A]" /> {enq.estimatedResolution}
                    </span>
                  </div>

                  {/* ── THE FLIPKART STEPPED PROGRESS LINE ── */}
                  <div className="p-4 sm:p-6 bg-white overflow-x-auto">
                    <div className="min-w-[620px] py-4">
                      {/* Step Icons & Connecting Line Bar */}
                      <div className="relative flex items-center justify-between">
                        {/* Continuous Background Track Line */}
                        <div className="absolute top-4 left-4 right-4 h-1 bg-[#DEDCDC] -translate-y-1/2 z-0" />

                        {/* Completed Active Track Line (calculated by currentStep progress) */}
                        <div
                          className="absolute top-4 left-4 h-1 bg-gradient-to-r from-[#191D23] via-[#57707A] to-[#7B919C] -translate-y-1/2 z-0 transition-all duration-700"
                          style={{
                            width: `${Math.min(100, Math.max(0, ((enq.currentStep - 1) / (enq.steps.length - 1)) * 100))}%`,
                          }}
                        />

                        {/* Step Nodes */}
                        {enq.steps.map((st) => {
                          return (
                            <div key={st.stepNumber} className="relative z-10 flex flex-col items-center">
                              {/* Step Node Circle */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                  st.isCompleted
                                    ? "bg-[#57707A] text-white ring-4 ring-[#DEDCDC]"
                                    : st.isCurrent
                                    ? "bg-[#191D23] text-white ring-4 ring-[#C5BAC4] animate-pulse"
                                    : "bg-white border-2 border-[#DEDCDC] text-[#989DAA]"
                                }`}
                              >
                                {st.isCompleted ? <CheckIcon className="w-3.5 h-3.5 stroke-[3]" /> : st.isCurrent ? <ZapIcon className="w-3.5 h-3.5" /> : st.stepNumber}
                              </div>

                              {/* Step Details Beneath Node */}
                              <div className="text-center mt-2.5 max-w-[110px]">
                                <p
                                  className={`text-[11px] font-extrabold leading-tight ${
                                    st.isCompleted
                                      ? "text-[#191D23]"
                                      : st.isCurrent
                                      ? "text-[#57707A]"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {st.title}
                                </p>
                                <p className="text-[10px] text-[#7B919C] font-medium mt-0.5">
                                  {st.subtitle}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Activity Log & Consultant Contact Details */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-[#F7F8F9] border-t border-[#DEDCDC] space-y-4 animate-in fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#DEDCDC]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#191D23] text-[#C5BAC4] flex items-center justify-center font-bold text-sm">
                            <HardHatIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#7B919C] uppercase tracking-wide">
                              Dedicated Solar Consultant
                            </span>
                            <h5 className="text-xs font-bold text-[#191D23]">{enq.consultantName}</h5>
                            <p className="text-[11px] text-[#57707A] font-semibold">{enq.consultantPhone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${enq.consultantPhone}`}
                            className="px-3 py-1.5 bg-[#191D23] hover:bg-[#57707A] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <PhoneIcon className="w-3.5 h-3.5" /> Call Engineer
                          </a>
                          <button
                            onClick={() => switchTab("complaint")}
                            className="px-3 py-1.5 bg-white hover:bg-[#F7F8F9] text-[#191D23] border border-[#DEDCDC] text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            <MessageSquareIcon className="w-3.5 h-3.5 text-[#57707A] inline mr-1" /> Send Message
                          </button>
                        </div>
                      </div>

                      {/* Timeline Detail Log */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-[#191D23] uppercase tracking-wider">
                          Full Activity Milestone Log
                        </h5>
                        <div className="space-y-2">
                          {enq.steps.map((st) => (
                            <div
                              key={st.stepNumber}
                              className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                                st.isCompleted
                                  ? "bg-white border-[#DEDCDC]"
                                  : st.isCurrent
                                  ? "bg-white border-[#57707A] font-medium"
                                  : "bg-[#F7F8F9] border-[#DEDCDC]/60 opacity-60"
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                                  st.isCompleted
                                    ? "bg-[#57707A] text-white"
                                    : st.isCurrent
                                    ? "bg-[#191D23] text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}>
                                  {st.isCompleted ? <CheckIcon className="w-3 h-3 stroke-[3]" /> : st.stepNumber}
                                </span>
                                <div>
                                  <p className="font-bold text-[#191D23]">{st.title}</p>
                                  <p className="text-[11px] text-[#57707A] mt-0.5">{st.details}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-semibold text-[#7B919C] flex-shrink-0">
                                {st.date}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Attached File/Photo Preview if any */}
                      {enq.attachedPhoto && (
                        <div className="p-3 bg-white rounded-xl border border-[#DEDCDC] flex items-center gap-3">
                          <img
                            src={enq.attachedPhoto}
                            alt="Attachment"
                            className="w-12 h-12 object-cover rounded-lg border border-[#DEDCDC]"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-[#57707A] uppercase">
                              Attached Document / Roof Image
                            </span>
                            <p className="text-xs font-bold text-[#191D23]">{enq.fileName || "Uploaded Site File"}</p>
                            <a
                              href={enq.attachedPhoto}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#57707A] font-bold hover:underline"
                            >
                              View Full Size &rarr;
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────── SECTION 6: DIGITAL WARRANTY CARDS ───────────────── */}
      {activeTab === "warranty" && (
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#191D23] uppercase tracking-wider">
              Active Digital Equipment Warranty Certificates
            </h3>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-700" /> 100% Guaranteed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#DEDCDC] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#191D23] bg-[#F7F8F9] px-2 py-0.5 rounded-full border border-[#DEDCDC]">
                    5-Year Inverter Warranty
                  </span>
                  <h4 className="text-sm font-bold text-[#191D23] mt-1">Smart Solar Grid Inverter</h4>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F7F8F9] flex items-center justify-center text-[#57707A]">
                  <ZapIcon className="w-5 h-5 text-[#57707A]" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#57707A]">
                <div className="flex justify-between">
                  <span>Serial Number:</span>
                  <span className="font-mono font-bold text-[#191D23]">{current.inverterSerial}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600">{current.inverterWarranty}</span>
                </div>
                <div className="flex justify-between border-t border-[#DEDCDC] pt-1.5">
                  <span>Customer Replacement Cost:</span>
                  <span className="font-extrabold text-emerald-600">₹0 (Free Coverage)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DEDCDC] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#57707A] bg-[#F7F8F9] px-2 py-0.5 rounded-full border border-[#DEDCDC]">
                    25-Year Panel Performance
                  </span>
                  <h4 className="text-sm font-bold text-[#191D23] mt-1">Mono PERC Half-Cut Panels</h4>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F7F8F9] flex items-center justify-center text-[#57707A]">
                  <SunIcon className="w-5 h-5 text-[#57707A]" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#57707A]">
                <div className="flex justify-between">
                  <span>Batch Serials:</span>
                  <span className="font-mono font-bold text-[#191D23]">{current.panelSerial}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600">{current.panelWarranty}</span>
                </div>
                <div className="flex justify-between border-t border-[#DEDCDC] pt-1.5">
                  <span>Linear Output Degradation:</span>
                  <span className="font-extrabold text-[#191D23]">&lt; 0.5% / Year</span>
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#7B919C]">Loading Customer Portal...</div>}>
      <CustomerContent />
    </Suspense>
  );
}
