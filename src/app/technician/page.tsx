"use client";

import {
  HardHatIcon,
  WrenchIcon,
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  EyeIcon,
  StarIcon,
  CameraIcon,
  FileTextIcon,
  ZapIcon,
  AlertCircleIcon,
  PlusIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@/components/Icons";

import { useState, useRef, useEffect, Suspense } from "react";
import PageShell from "@/components/PageShell";
import { technicians as initialTechs } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

export interface CustomerSubmission {
  systemDetails?: string;
  reportedIssue?: string;
  roofType?: string;
  customerNotes?: string;
  customerPhotos?: string[];
}

export interface AssignedTask {
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  capacity: string;
  type: "Installation" | "Survey" | "Service";
  timeSlot: string;
  status: "Pending" | "In Progress" | "Completed";
  customerDetails: CustomerSubmission;
  adminInstructions: string;
  completionProofPhoto?: string;
  workNotes?: string;
  completedAt?: string;
}

export interface TechnicianWithTasks {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  status: "Available" | "On Job" | "On Leave";
  rating: number;
  completedJobs: number;
  assignedTasks: AssignedTask[];
}

// Initial demo assigned tasks with realistic customer submissions
const defaultTechTasks: Record<string, AssignedTask[]> = {
  "TECH-001": [
    {
      orderId: "TKT-001",
      customerName: "Sanjay Tiwari",
      customerPhone: "+91 66554 43322",
      address: "88, Tonk Road, Jaipur",
      capacity: "3 kW On-Grid System",
      type: "Service",
      timeSlot: "02:00 PM - 04:00 PM",
      status: "In Progress",
      customerDetails: {
        systemDetails: "Growatt 3 kW Inverter + 6x 540W Mono PERC Panels",
        reportedIssue: "Inverter red alarm light blinking. System output dropped to 0 kWh since morning. Display showing E-04 communication failure.",
        roofType: "RCC Flat Rooftop (2nd Floor)",
        customerNotes: "Main electric panel is in the garage. Gate code: 4421. Customer available on phone.",
        customerPhotos: ["Inverter Error E-04", "Main Breaker Panel"],
      },
      adminInstructions: "Carry replacement RS485 communication cable and 1000V DC multimeter. Inspect DC surge protector and check inverter grounding resistance.",
    },
    {
      orderId: "ORD-003",
      customerName: "Rajesh Gupta",
      customerPhone: "+91 99887 76655",
      address: "12, Vaishali Nagar, Jaipur",
      capacity: "5 kW On-Grid System",
      type: "Service",
      timeSlot: "10:00 AM - 12:00 PM",
      status: "Completed",
      customerDetails: {
        systemDetails: "5 kW On-Grid Bi-Facial Plant with JVVNL Net-Meter",
        reportedIssue: "Routine post-installation commissioning check and net-meter synchronization verification.",
        roofType: "RCC Flat Rooftop, South Facing",
        customerNotes: "Customer requested physical copy of 5-year inverter warranty handbook.",
        customerPhotos: ["Rooftop Array", "Discom Net-Meter"],
      },
      adminInstructions: "Verify grid sync on Discom meter. Take photo of active yield reading (>2,800W) and get customer sign-off.",
      completionProofPhoto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%235B965E'/><text x='50' y='55' font-size='12' fill='white' text-anchor='middle'>Verified Yield</text></svg>",
      workNotes: "Voltage verified at 238V. Net-meter export functioning properly. Customer signed handover.",
      completedAt: "Today, 11:30 AM",
    },
  ],
  "TECH-002": [
    {
      orderId: "ORD-002",
      customerName: "Arjun Mehta",
      customerPhone: "+91 54321 09876",
      address: "55, Lake View Colony, Jaipur",
      capacity: "4 kW On-Grid System",
      type: "Installation",
      timeSlot: "09:00 AM - 05:00 PM",
      status: "Pending",
      customerDetails: {
        systemDetails: "4 kW On-Grid System with 8 Tier-1 Mono PERC Panels",
        reportedIssue: "New Installation. Hardware delivered from central warehouse yesterday.",
        roofType: "Flat Terrace (450 sq. ft.), Zero Shading between 9am-5pm",
        customerNotes: "Customer requested routing DC cables through internal duct rather than facade.",
        customerPhotos: ["Roof Terrace Layout", "Meter Location"],
      },
      adminInstructions: "Anchor structure with M10 hot-dip galvanized fasteners. Maintain 26° tilt angle. Earthing pit chemical compound must be packed properly.",
    },
  ],
  "TECH-003": [
    {
      orderId: "TKT-002",
      customerName: "Pooja Sharma",
      customerPhone: "+91 55443 32211",
      address: "5, Bani Park, Jaipur",
      capacity: "3 kW Off-Grid System",
      type: "Service",
      timeSlot: "11:00 AM - 01:00 PM",
      status: "In Progress",
      customerDetails: {
        systemDetails: "3.5 kVA Hybrid Inverter + 5.12 kWh LiFePO4 Lithium Battery",
        reportedIssue: "Battery backup time decreased to 1 hour during evening load cut. Battery state of charge (SoC) indicator jumping erratically.",
        roofType: "Single Storey Bungalow",
        customerNotes: "Elderly residents at home. Please knock gently.",
        customerPhotos: ["Battery BMS Screen"],
      },
      adminInstructions: "Perform cell balancing check on Okaya 48V 100Ah battery pack. Check BMS error log using Bluetooth scanner.",
    },
  ],
  "TECH-004": [],
};

function TechnicianFieldContent() {
  const { user, role } = useAuth();

  // Load technician list and their assigned tasks from localStorage
  
  // Load technician list from PostgreSQL
  const [techList, setTechList] = useState<TechnicianWithTasks[]>([]);

  useEffect(() => {
    fetch('/api/solar/data?resource=technicians')
      .then((r) => r.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const list = json.data.map((t: any) => {
            const todaysJobs = typeof t.todaysJobs === 'string' ? JSON.parse(t.todaysJobs) : (t.todaysJobs || []);
            const assignedTasks = (defaultTechTasks[t.id] && defaultTechTasks[t.id].length > 0)
              ? defaultTechTasks[t.id]
              : todaysJobs.map((j: any, jIdx: number) => ({
                  orderId: j.orderId || ('ORD-00' + (jIdx + 1)),
                  customerName: j.customerName || 'Customer',
                  customerPhone: '+91 98765 00000',
                  address: j.address || 'Jaipur, Rajasthan',
                  capacity: j.capacity || '5 kW',
                  type: j.type || 'Service',
                  timeSlot: j.timeSlot || '10:00 AM - 01:00 PM',
                  status: j.status || 'Pending',
                  customerDetails: {
                    systemDetails: (j.capacity || '5 kW') + ' Rooftop Solar System',
                    reportedIssue: 'Scheduled maintenance and string voltage inspection.',
                    roofType: 'RCC Flat Rooftop',
                    customerNotes: 'Customer on site.',
                    customerPhotos: ['Inverter Unit', 'AC DB Box'],
                  },
                  adminInstructions: 'Inspect string fuses, test inverter grounding resistance, and log meter output.',
                }));

            return {
              id: t.id,
              name: t.name,
              phone: t.phone,
              specialization: t.specialization,
              status: t.status || 'On Job',
              rating: Number(t.rating) || 4.8,
              completedJobs: Number(t.completedJobs) || 50,
              assignedTasks,
            };
          });

          setTechList(list);
        }
      })
      .catch((err) => console.warn('Failed to fetch technicians from DB:', err));
  }, []);


  // Re-sync with localStorage when window focuses or storage event fires
  useEffect(() => {
    const refreshTechs = () => {
      try {
        const saved = localStorage.getItem("sunpower_tech_assigned_tasks");
        if (saved) {
          const defaultList = initialTechs.map((t) => ({
            ...t,
            assignedTasks: defaultTechTasks[t.id] || [],
          }));
          const parsed: TechnicianWithTasks[] = JSON.parse(saved);
          const existingIds = new Set(parsed.map((p) => p.id));
          const missing = defaultList.filter((d) => !existingIds.has(d.id));
          setTechList([...parsed, ...missing]);
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener("focus", refreshTechs);
    window.addEventListener("storage", refreshTechs);
    return () => {
      window.removeEventListener("focus", refreshTechs);
      window.removeEventListener("storage", refreshTechs);
    };
  }, []);

  const saveTechList = (updated: TechnicianWithTasks[]) => {
    setTechList(updated);
    try {
      localStorage.setItem("sunpower_tech_assigned_tasks", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Active technician (from auth user, or default to TECH-001)
  const myTechId = user?.techId || "TECH-001";
  const fallbackTech: TechnicianWithTasks = {
    id: "TECH-001",
    name: "Rohit Meena",
    phone: "+91 98765 11111",
    specialization: "Lead Installation & Commissioning Engineer",
    status: "On Job",
    rating: 4.9,
    completedJobs: 178,
    assignedTasks: defaultTechTasks["TECH-001"] || [],
  };
  const myTech = techList.find((t) => t.id === myTechId) || techList[0] || fallbackTech;

  // For Admin preview toggle
  const [adminPreviewTechId, setAdminPreviewTechId] = useState<string>("TECH-001");
  const [adminViewMode, setAdminViewMode] = useState<"dispatch-center" | "crew-view">("dispatch-center");

  // Selected task detail view modal for Technician
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<AssignedTask | null>(null);

  // Task work completion photo & notes state
  const [uploadProofPhoto, setUploadProofPhoto] = useState<string>("");
  const [uploadProofName, setUploadProofName] = useState<string>("");
  const [workNotesInput, setWorkNotesInput] = useState<string>("");
  const proofFileInputRef = useRef<HTMLInputElement | null>(null);

  // Admin Assign Task Modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignToTechId, setAssignToTechId] = useState<string>("TECH-001");
  const [newTaskType, setNewTaskType] = useState<"Installation" | "Survey" | "Service">("Installation");
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCapacity, setNewCapacity] = useState("3 kW On-Grid");
  const [newTimeSlot, setNewTimeSlot] = useState("10:00 AM - 02:00 PM");
  const [newOrderId, setNewOrderId] = useState(`ORD-${Math.floor(100 + Math.random() * 900)}`);
  const [newCustIssue, setNewCustIssue] = useState("");
  const [newCustRoof, setNewCustRoof] = useState("RCC Flat Roof (2nd Floor)");
  const [newCustNotes, setNewCustNotes] = useState("");
  const [newAdminInstructions, setNewAdminInstructions] = useState("");
  const [assignSuccessAlert, setAssignSuccessAlert] = useState("");

  const handleOpenAssignModal = (techId?: string) => {
    if (techId) setAssignToTechId(techId);
    setNewOrderId(`ORD-${Math.floor(100 + Math.random() * 900)}`);
    setIsAssignModalOpen(true);
  };

  const handleAdminAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newAddress) return;

    const task: AssignedTask = {
      orderId: newOrderId,
      customerName: newCustName,
      customerPhone: newCustPhone || "+91 98765 00000",
      address: newAddress,
      capacity: newCapacity,
      type: newTaskType,
      timeSlot: newTimeSlot,
      status: "Pending",
      customerDetails: {
        systemDetails: newCapacity,
        reportedIssue: newCustIssue || "Standard customer request scheduled by operations desk.",
        roofType: newCustRoof,
        customerNotes: newCustNotes || "Customer available at site address.",
        customerPhotos: ["Roof Layout Submitted by Customer"],
      },
      adminInstructions: newAdminInstructions || "Complete job according to MNRE safety standards. Upload photo of final work.",
    };

    const updated = techList.map((t) => {
      if (t.id === assignToTechId) {
        return {
          ...t,
          status: "On Job" as const,
          assignedTasks: [task, ...t.assignedTasks],
        };
      }
      return t;
    });

    saveTechList(updated);

    // Push notification to the specific assigned technician
    try {
      const savedNotifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const techNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "technician" as const,
        recipientId: assignToTechId,
        text: `New Site Job Assigned: ${newTaskType} for ${newCustName} (${task.orderId})`,
        time: "Just now",
        type: "task" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([techNotif, ...savedNotifs]));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore
    }

    setAssignSuccessAlert(`Task ${task.orderId} successfully assigned to ${techList.find((t) => t.id === assignToTechId)?.name}! Notification sent.`);

    // Reset
    setNewCustName("");
    setNewCustPhone("");
    setNewAddress("");
    setNewCustIssue("");
    setNewCustNotes("");
    setNewAdminInstructions("");

    setTimeout(() => {
      setAssignSuccessAlert("");
      setIsAssignModalOpen(false);
    }, 2000);
  };

  const handleUpdateTaskStatus = (orderId: string, newStatus: "Pending" | "In Progress" | "Completed") => {
    const activeTech = role === "admin" ? techList.find((t) => t.id === adminPreviewTechId) || myTech : myTech;

    const updated = techList.map((t) => {
      if (t.id === activeTech.id) {
        return {
          ...t,
          assignedTasks: t.assignedTasks.map((task) => {
            if (task.orderId === orderId) {
              return {
                ...task,
                status: newStatus,
                completionProofPhoto: uploadProofPhoto || task.completionProofPhoto,
                workNotes: workNotesInput || task.workNotes,
                completedAt: newStatus === "Completed" ? "Just now" : task.completedAt,
              };
            }
            return task;
          }),
        };
      }
      return t;
    });

    saveTechList(updated);
    if (selectedTaskForDetails && selectedTaskForDetails.orderId === orderId) {
      setSelectedTaskForDetails({
        ...selectedTaskForDetails,
        status: newStatus,
        completionProofPhoto: uploadProofPhoto || selectedTaskForDetails.completionProofPhoto,
        workNotes: workNotesInput || selectedTaskForDetails.workNotes,
        completedAt: newStatus === "Completed" ? "Just now" : selectedTaskForDetails.completedAt,
      });
    }

    setUploadProofPhoto("");
    setUploadProofName("");
    setWorkNotesInput("");
  };

  const handleProofPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProofName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadProofPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Determine which technician tasks to render
  const currentViewTech = role === "admin" && adminViewMode === "crew-view"
    ? techList.find((t) => t.id === adminPreviewTechId) || myTech
    : myTech;

  return (
    <PageShell>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ────────────────── 1. ADMIN DISPATCH VIEW ────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {role === "admin" && adminViewMode === "dispatch-center" && (
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F7CEBE] pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4C1D3D] to-[#852E4E] flex items-center justify-center text-[#FFBB94] shadow-xs">
                  <HardHatIcon className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#2E1423]">
                  Technician Task Assignment &amp; Crew Dispatch
                </h1>
                <span className="text-[10px] font-bold bg-[#FFF5EF] text-[#852E4E] px-2.5 py-0.5 rounded-full border border-[#FB9590]/40 uppercase tracking-wide">
                  Admin Dispatch
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#7A4C60] mt-1">
                Assign tasks to field technicians. Technicians only see customer details &amp; tasks you assign them.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdminViewMode("crew-view")}
                className="px-3.5 py-2 bg-[#FFF5EF] hover:bg-[#FFE8DD] text-[#4C1D3D] text-xs font-bold rounded-xl border border-[#FB9590]/40 transition flex items-center gap-1.5 shadow-2xs"
              >
                <EyeIcon className="w-3.5 h-3.5 text-[#852E4E]" /> Preview Technician View
              </button>

              <button
                onClick={() => handleOpenAssignModal()}
                className="px-4 py-2 bg-gradient-to-r from-[#4C1D3D] to-[#852E4E] hover:from-[#38132B] hover:to-[#6E243F] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <PlusIcon className="w-3.5 h-3.5" /> Assign Task to Technician
              </button>
            </div>
          </div>

          {/* Technicians Workload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techList.map((tech) => (
              <div
                key={tech.id}
                className="bg-white rounded-2xl border border-[#F7CEBE] p-5 shadow-xs space-y-4 hover:border-[#DC586D]/60 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5EF] to-[#FFE8DD] text-[#4C1D3D] flex items-center justify-center border border-[#FB9590]/40 flex-shrink-0">
                      <HardHatIcon className="w-6 h-6 text-[#4C1D3D]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#2E1423]">{tech.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            tech.status === "Available"
                              ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40"
                              : "bg-[#FFF0EB] text-[#DC586D] border-[#DC586D]/40"
                          }`}
                        >
                          {tech.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A4C60]">{tech.specialization}</p>
                      <p className="text-[11px] text-[#7A4C60] mt-0.5 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          <PhoneIcon className="w-3 h-3 text-[#852E4E]" /> {tech.phone}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-[#DC586D] font-bold">
                          <StarIcon className="w-3 h-3 fill-[#DC586D] text-[#DC586D]" /> {tech.rating}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAssignModal(tech.id)}
                    className="px-3 py-1.5 bg-[#4C1D3D] hover:bg-[#852E4E] text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    + Assign Task
                  </button>
                </div>

                {/* Assigned Tasks for this tech */}
                <div className="space-y-2 pt-2 border-t border-[#F7CEBE]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#7A4C60] uppercase tracking-wider">
                      Assigned Tasks ({tech.assignedTasks.length})
                    </span>
                    <button
                      onClick={() => {
                        setAdminPreviewTechId(tech.id);
                        setAdminViewMode("crew-view");
                      }}
                      className="text-[#DC586D] hover:text-[#A33757] hover:underline font-bold text-[11px] inline-flex items-center gap-0.5"
                    >
                      View Mobile Screen <ChevronRightIcon className="w-3 h-3 inline" />
                    </button>
                  </div>

                  {tech.assignedTasks.length > 0 ? (
                    <div className="space-y-2">
                      {tech.assignedTasks.map((task) => (
                        <div
                          key={task.orderId}
                          className="bg-[#FFF7F4] p-3 rounded-xl border border-[#F7CEBE] text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                  task.type === "Installation"
                                    ? "bg-[#FFF0EB] text-[#4C1D3D] border-[#FB9590]/50"
                                    : task.type === "Survey"
                                    ? "bg-[#FFF5EF] text-[#852E4E] border-[#FFBB94]"
                                    : "bg-[#FFE8DD] text-[#A33757] border-[#DC586D]/40"
                                }`}
                              >
                                {task.type}
                              </span>
                              <span className="font-bold text-[#2E1423]">{task.customerName}</span>
                              <span className="font-mono text-[10px] text-[#852E4E]">({task.orderId})</span>
                            </div>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                task.status === "Completed"
                                  ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40"
                                  : task.status === "In Progress"
                                  ? "bg-[#FFF0EB] text-[#DC586D] border-[#DC586D]/40"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#7A4C60] flex items-center gap-1.5">
                            <MapPinIcon className="w-3 h-3 text-[#852E4E] flex-shrink-0" /> {task.address} • <ClockIcon className="w-3 h-3 text-[#852E4E] flex-shrink-0" /> {task.timeSlot}
                          </p>
                          <p className="text-[10px] text-[#2E1423] bg-white p-2 rounded-lg border border-[#F7CEBE]">
                            <strong>Customer Issue:</strong> {task.customerDetails.reportedIssue}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="text-[#852E4E] font-semibold">Admin Note: {task.adminInstructions}</span>
                            <button
                              onClick={() => {
                                const updatedTasks = tech.assignedTasks.filter((t) => t.orderId !== task.orderId);
                                const updated = techList.map((t) =>
                                  t.id === tech.id
                                    ? {
                                        ...t,
                                        status: updatedTasks.length === 0 ? ("Available" as const) : t.status,
                                        assignedTasks: updatedTasks,
                                      }
                                    : t
                                );
                                saveTechList(updated);
                              }}
                              className="text-red-600 hover:underline font-bold"
                            >
                              Unassign
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FFF7F4] rounded-xl text-center text-[11px] text-[#7A4C60]">
                      No tasks assigned yet. Click &quot;+ Assign Task&quot; above to dispatch.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── MODAL: ASSIGN TASK TO TECHNICIAN ── */}
          {isAssignModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
              <div className="bg-white rounded-2xl border border-[#F7CEBE] shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-[#F7CEBE] pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#2E1423] flex items-center gap-2">
                      <HardHatIcon className="w-5 h-5 text-[#4C1D3D]" /> Assign Task to Technician
                    </h3>
                    <p className="text-xs text-[#7A4C60] mt-0.5">
                      The assigned technician will only be able to view this task and customer submission details.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAssignModalOpen(false)}
                    className="text-[#7A4C60] hover:text-[#2E1423] text-xl font-bold leading-none p-1"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleAdminAssignSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-[#7A4C60] uppercase tracking-wide">Assign To Field Technician</label>
                    <select
                      value={assignToTechId}
                      onChange={(e) => setAssignToTechId(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl font-bold text-[#4C1D3D] bg-white focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                    >
                      {techList.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.specialization} - {t.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#7A4C60] uppercase tracking-wide">Task Type</label>
                      <select
                        value={newTaskType}
                        onChange={(e) => setNewTaskType(e.target.value as "Installation" | "Survey" | "Service")}
                        className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl font-semibold bg-white focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                      >
                        <option value="Installation">Rooftop Installation</option>
                        <option value="Survey">Site Survey &amp; Shadow Analysis</option>
                        <option value="Service">Repair Breakdown / Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#7A4C60] uppercase tracking-wide">System Capacity</label>
                      <input
                        type="text"
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(e.target.value)}
                        placeholder="e.g. 3 kW On-Grid System"
                        className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl font-semibold focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#7A4C60] uppercase tracking-wide">Customer Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Narendra Verma"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl font-semibold focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#7A4C60] uppercase tracking-wide">Customer Phone</label>
                      <input
                        type="text"
                        placeholder="+91 98765 00000"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl font-semibold focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7A4C60] uppercase tracking-wide">Customer Site Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 19, C-Scheme, Jaipur"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl font-semibold focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#7A4C60] uppercase tracking-wide">Scheduled Time Slot</label>
                      <input
                        type="text"
                        value={newTimeSlot}
                        onChange={(e) => setNewTimeSlot(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl font-semibold focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#7A4C60] uppercase tracking-wide">Order / Ticket ID</label>
                      <input
                        type="text"
                        value={newOrderId}
                        onChange={(e) => setNewOrderId(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl font-mono font-semibold focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                      />
                    </div>
                  </div>

                  {/* Customer Submitted Details */}
                  <div className="bg-[#FFF7F4] p-3.5 rounded-xl border border-[#F7CEBE] space-y-2">
                    <span className="text-[10px] font-bold text-[#4C1D3D] uppercase tracking-wide block">
                      Customer Submitted Details (Visible to Technician)
                    </span>
                    <div>
                      <label className="text-[10px] text-[#7A4C60] block">Customer Problem / Inquiry Description</label>
                      <textarea
                        rows={2}
                        placeholder="What issue did the customer report..."
                        value={newCustIssue}
                        onChange={(e) => setNewCustIssue(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-[#F7CEBE] rounded-lg text-xs focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#7A4C60] block">Roof / Site Details</label>
                        <input
                          type="text"
                          value={newCustRoof}
                          onChange={(e) => setNewCustRoof(e.target.value)}
                          placeholder="e.g. RCC Flat 2nd floor"
                          className="w-full mt-1 px-2.5 py-1 bg-white border border-[#F7CEBE] rounded-lg text-xs focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#7A4C60] block">Special Customer Notes</label>
                        <input
                          type="text"
                          value={newCustNotes}
                          onChange={(e) => setNewCustNotes(e.target.value)}
                          placeholder="e.g. Call 15 mins prior"
                          className="w-full mt-1 px-2.5 py-1 bg-white border border-[#F7CEBE] rounded-lg text-xs focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Instructions to Technician */}
                  <div>
                    <label className="text-[11px] font-bold text-[#852E4E] uppercase tracking-wide">
                      Admin Instructions to Field Technician
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Bring 6mm² DC wire, replace Inverter communication cable, verify net-meter..."
                      value={newAdminInstructions}
                      onChange={(e) => setNewAdminInstructions(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 border border-[#F7CEBE] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D]"
                    />
                  </div>

                  {assignSuccessAlert && (
                    <div className="p-2.5 bg-[#EBF5EC] text-[#5B965E] font-bold rounded-xl border border-[#78B77B] text-center animate-in fade-in flex items-center justify-center gap-1.5">
                      <CheckCircleIcon className="w-4 h-4 text-[#5B965E]" /> {assignSuccessAlert}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F7CEBE]">
                    <button
                      type="button"
                      onClick={() => setIsAssignModalOpen(false)}
                      className="px-4 py-2 bg-[#FFF5EF] hover:bg-[#FFE8DD] text-[#2E1423] font-semibold rounded-xl text-xs transition border border-[#F7CEBE]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-[#4C1D3D] to-[#852E4E] hover:from-[#38132B] hover:to-[#6E243F] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <span>Dispatch Task Now</span>
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ───────────── 2. TECHNICIAN PORTAL (RESTRICTED) ───────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {(role === "technician" || (role === "admin" && adminViewMode === "crew-view")) && (
        <div className="space-y-6">
          {/* Admin Back Toggle (only when Admin is previewing) */}
          {role === "admin" && (
            <div className="bg-[#FFF5EF] border border-[#FB9590]/40 p-3 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-[#4C1D3D] flex items-center gap-1.5">
                <EyeIcon className="w-4 h-4 text-[#852E4E] inline" /> Previewing Technician Portal as: <strong className="text-[#DC586D]">{currentViewTech.name}</strong>
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={adminPreviewTechId}
                  onChange={(e) => setAdminPreviewTechId(e.target.value)}
                  className="px-2 py-1 bg-white border border-[#F7CEBE] rounded-lg font-bold text-xs text-[#2E1423] focus:ring-2 focus:ring-[#DC586D]/30"
                >
                  {techList.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setAdminViewMode("dispatch-center")}
                  className="px-3 py-1 bg-[#4C1D3D] hover:bg-[#852E4E] text-white rounded-lg font-bold transition flex items-center gap-1"
                >
                  Back to Dispatch &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Clean Technician Header: Sunset Gradient Banner */}
          <div className="bg-gradient-to-r from-[#4C1D3D] via-[#852E4E] to-[#DC586D] rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-[#FFBB94] border border-white/20 flex-shrink-0 shadow-xs">
                <HardHatIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white !text-white tracking-tight" style={{ color: "#ffffff" }}>My Assigned Field Tasks</h2>
                  <span className="text-[10px] font-bold bg-[#FFBB94] text-[#4C1D3D] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                    Logged in as {currentViewTech?.name || "Technician"}
                  </span>
                </div>
                <p className="text-xs text-[#FFBB94]/90 mt-0.5">
                  Tasks dispatched and assigned to you by Admin. Review customer submissions and execute site jobs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/20 text-center min-w-[90px]">
                <span className="text-[10px] text-[#FFBB94] block uppercase font-bold tracking-wider">Assigned Queue</span>
                <span className="text-sm font-extrabold text-white">{currentViewTech.assignedTasks.length} Tasks</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/20 text-center min-w-[90px]">
                <span className="text-[10px] text-[#FFBB94] block uppercase font-bold tracking-wider">Active Jobs</span>
                <span className="text-sm font-extrabold text-[#FFBB94]">
                  {currentViewTech.assignedTasks.filter((t) => t.status !== "Completed").length} Active
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Tasks List */}
          {currentViewTech.assignedTasks.length > 0 ? (
            <div className="space-y-4">
              {currentViewTech.assignedTasks.map((task) => (
                <div
                  key={task.orderId}
                  className="bg-white rounded-2xl border border-[#F7CEBE] p-5 sm:p-6 shadow-xs space-y-4 hover:border-[#DC586D]/50 transition-all"
                >
                  {/* Task Top Badges & ID */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F7CEBE] pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          task.type === "Installation"
                            ? "bg-[#FFF0EB] text-[#4C1D3D] border-[#FB9590]/50"
                            : task.type === "Survey"
                            ? "bg-[#FFF5EF] text-[#852E4E] border-[#FFBB94]"
                            : "bg-[#FFE8DD] text-[#A33757] border-[#DC586D]/40"
                        }`}
                      >
                        {task.type}
                      </span>
                      <span className="font-mono text-xs font-bold bg-[#FFF5EF] px-2.5 py-1 rounded-lg text-[#4C1D3D] border border-[#F7CEBE]">
                        {task.orderId}
                      </span>
                      <span className="text-xs text-[#7A4C60] font-semibold inline-flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5 text-[#852E4E]" /> {task.timeSlot}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                          task.status === "Completed"
                            ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40"
                            : task.status === "In Progress"
                            ? "bg-[#FFF0EB] text-[#DC586D] border-[#DC586D]/40"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {task.status === "Completed" ? (
                          <>
                            <CheckCircleIcon className="w-3.5 h-3.5 text-[#5B965E]" /> Completed
                          </>
                        ) : task.status === "In Progress" ? (
                          <>
                            <ZapIcon className="w-3.5 h-3.5 text-[#DC586D]" /> In Progress
                          </>
                        ) : (
                          <>
                            <ClockIcon className="w-3.5 h-3.5 text-gray-500" /> Pending Start
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information & Quick Action Buttons */}
                  <div className="bg-[#FFF7F4] p-4 rounded-xl border border-[#F7CEBE] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#852E4E] uppercase tracking-wider block">
                        Customer Information
                      </span>
                      <h3 className="text-sm font-bold text-[#2E1423]">{task.customerName}</h3>
                      <p className="text-xs text-[#7A4C60] flex items-center gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-[#852E4E] flex-shrink-0" /> {task.address}
                      </p>
                      <p className="text-xs text-[#DC586D] font-semibold flex items-center gap-1.5">
                        <ZapIcon className="w-3.5 h-3.5 text-[#DC586D] flex-shrink-0" /> System: {task.capacity}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${task.customerPhone}`}
                        className="px-3.5 py-2 bg-white hover:bg-[#FFF5EF] text-[#852E4E] text-xs font-bold rounded-xl border border-[#DC586D]/30 shadow-xs transition inline-flex items-center gap-1.5"
                      >
                        <PhoneIcon className="w-3.5 h-3.5 text-[#DC586D]" /> Call Customer ({task.customerPhone})
                      </a>

                      <button
                        onClick={() => alert(`Opening GPS navigation route to: ${task.address}`)}
                        className="px-3.5 py-2 bg-white hover:bg-[#FFF5EF] text-[#2E1423] text-xs font-bold rounded-xl border border-[#F7CEBE] shadow-xs transition inline-flex items-center gap-1.5"
                      >
                        <MapPinIcon className="w-3.5 h-3.5 text-[#852E4E]" /> Navigate
                      </button>

                      <button
                        onClick={() => setSelectedTaskForDetails(task)}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#4C1D3D] to-[#852E4E] hover:from-[#38132B] hover:to-[#6E243F] text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
                      >
                        <WrenchIcon className="w-3.5 h-3.5 text-[#FFBB94]" /> View Details &amp; Execute
                      </button>
                    </div>
                  </div>

                  {/* Customer Submitted Details Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-[#F7CEBE] space-y-1">
                      <span className="text-[10px] font-bold text-[#4C1D3D] uppercase block">
                        Customer Reported Issue / Requirements
                      </span>
                      <p className="text-xs text-[#2E1423] font-medium leading-relaxed">
                        {task.customerDetails.reportedIssue || "Standard service request."}
                      </p>
                      {task.customerDetails.customerNotes && (
                        <p className="text-[11px] text-[#7A4C60] pt-1 border-t border-[#F7CEBE]/60">
                          <strong>Note:</strong> {task.customerDetails.customerNotes}
                        </p>
                      )}
                    </div>

                    <div className="bg-[#FFF0EB] p-3.5 rounded-xl border border-[#FB9590]/40 space-y-1">
                      <span className="text-[10px] font-bold text-[#DC586D] uppercase block">
                        Admin Dispatch Instructions
                      </span>
                      <p className="text-xs text-[#2E1423] font-medium leading-relaxed">
                        {task.adminInstructions}
                      </p>
                      <p className="text-[11px] text-[#A33757] font-semibold pt-1">
                        Roof: {task.customerDetails.roofType || "Standard terrace"}
                      </p>
                    </div>
                  </div>

                  {/* Customer Uploaded Photos Thumbnails */}
                  {task.customerDetails.customerPhotos && task.customerDetails.customerPhotos.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-[#7A4C60] uppercase block mb-1.5">
                        Photos Submitted by Customer ({task.customerDetails.customerPhotos.length})
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {task.customerDetails.customerPhotos.map((photo, i) => (
                          <div
                            key={i}
                            className="bg-[#FFF5EF] px-3 py-2 rounded-lg border border-[#F7CEBE] text-xs font-semibold text-[#2E1423] flex items-center gap-1.5 shadow-2xs"
                          >
                            <CameraIcon className="w-3.5 h-3.5 text-[#852E4E]" />
                            <span>{photo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Task Work Status Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F7CEBE]">
                    <div className="text-xs text-[#7A4C60]">
                      {task.status === "Completed" ? (
                        <span className="text-[#5B965E] font-bold flex items-center gap-1.5">
                          <CheckCircleIcon className="w-4 h-4 text-[#5B965E]" /> Completed ({task.completedAt || "Signed off"})
                        </span>
                      ) : (
                        <span>Update work progress as you execute this assignment</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {task.status === "Pending" && (
                        <button
                          onClick={() => handleUpdateTaskStatus(task.orderId, "In Progress")}
                          className="px-4 py-2 bg-gradient-to-r from-[#DC586D] to-[#A33757] hover:from-[#A33757] hover:to-[#852E4E] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                        >
                          <ZapIcon className="w-3.5 h-3.5 text-white" /> Start Job (Mark In Progress)
                        </button>
                      )}

                      {task.status === "In Progress" && (
                        <button
                          onClick={() => setSelectedTaskForDetails(task)}
                          className="px-4 py-2 bg-[#5B965E] hover:bg-[#48794B] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircleIcon className="w-3.5 h-3.5 text-white" /> Complete Job &amp; Upload Photo Proof
                        </button>
                      )}

                      {task.status === "Completed" && (
                        <button
                          onClick={() => handleUpdateTaskStatus(task.orderId, "In Progress")}
                          className="text-xs text-[#DC586D] hover:text-[#A33757] hover:underline font-semibold"
                        >
                          Reopen Job ↺
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#F7CEBE] p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF5EF] text-[#852E4E] flex items-center justify-center mx-auto border border-[#FB9590]/40 shadow-xs">
                <FileTextIcon className="w-8 h-8 text-[#852E4E]" />
              </div>
              <h3 className="text-sm font-bold text-[#2E1423]">No Tasks Currently Assigned</h3>
              <p className="text-xs text-[#7A4C60] max-w-sm mx-auto leading-relaxed">
                You do not have any tasks dispatched for today. When Admin assigns a new site job to you, it will appear here immediately.
              </p>
            </div>
          )}

          {/* ── MODAL: TASK DETAIL & COMPLETION PROOF ── */}
          {selectedTaskForDetails && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
              <div className="bg-white rounded-2xl border border-[#F7CEBE] shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-[#F7CEBE] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#4C1D3D] bg-[#FFF5EF] px-2.5 py-0.5 rounded border border-[#FB9590]/40">
                        {selectedTaskForDetails.orderId}
                      </span>
                      <h3 className="text-base font-bold text-[#2E1423]">
                        {selectedTaskForDetails.customerName}
                      </h3>
                    </div>
                    <p className="text-xs text-[#7A4C60] mt-0.5 flex items-center gap-1.5">
                      <MapPinIcon className="w-3 h-3 text-[#852E4E] flex-shrink-0" /> {selectedTaskForDetails.address}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTaskForDetails(null)}
                    className="text-[#7A4C60] hover:text-[#2E1423] text-xl font-bold leading-none p-1"
                  >
                    &times;
                  </button>
                </div>

                {/* Customer Details Box */}
                <div className="bg-[#FFF7F4] p-4 rounded-xl border border-[#F7CEBE] space-y-2 text-xs text-[#2E1423]">
                  <h4 className="text-[11px] font-bold text-[#4C1D3D] uppercase tracking-wider">
                    Customer Submitted Details
                  </h4>
                  <div className="space-y-1.5">
                    <p><strong>System Capacity:</strong> {selectedTaskForDetails.capacity}</p>
                    <p><strong>Reported Issue:</strong> {selectedTaskForDetails.customerDetails.reportedIssue}</p>
                    <p><strong>Roof Specification:</strong> {selectedTaskForDetails.customerDetails.roofType}</p>
                    {selectedTaskForDetails.customerDetails.customerNotes && (
                      <p><strong>Customer Note:</strong> {selectedTaskForDetails.customerDetails.customerNotes}</p>
                    )}
                  </div>
                </div>

                {/* Admin Instructions Box */}
                <div className="bg-[#FFF0EB] p-4 rounded-xl border border-[#FB9590]/40 text-xs space-y-1">
                  <h4 className="text-[11px] font-bold text-[#DC586D] uppercase tracking-wider">
                    Admin Instructions for This Task
                  </h4>
                  <p className="text-[#2E1423] font-medium leading-relaxed">{selectedTaskForDetails.adminInstructions}</p>
                </div>

                {/* Upload Work / Completion Photo Proof */}
                <div className="space-y-2 text-xs">
                  <label className="text-[11px] font-bold text-[#7A4C60] uppercase block tracking-wide">
                    Upload On-Site Work / Completion Photo Proof
                  </label>
                  <input
                    ref={proofFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProofPhotoSelect}
                    className="hidden"
                  />

                  {!uploadProofPhoto && !selectedTaskForDetails.completionProofPhoto ? (
                    <button
                      type="button"
                      onClick={() => proofFileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-[#FB9590]/60 hover:border-[#DC586D] rounded-xl p-4 text-center bg-[#FFF7F4] hover:bg-[#FFF0EB] transition flex flex-col items-center justify-center gap-1.5 text-[#4C1D3D] font-bold"
                    >
                      <CameraIcon className="w-7 h-7 text-[#DC586D]" />
                      <span>Snap or Upload Photo of Completed Work</span>
                      <span className="text-[10px] text-[#7A4C60] font-normal">Takes high-res photo for Admin &amp; Customer records</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-[#FFF7F4] border border-[#FB9590]/40 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={uploadProofPhoto || selectedTaskForDetails.completionProofPhoto}
                          alt="Proof"
                          className="w-16 h-16 object-cover rounded-lg border border-[#F7CEBE] bg-white"
                        />
                        <div>
                          <p className="font-bold text-[#2E1423]">{uploadProofName || "Completion Proof Attached"}</p>
                          <span className="text-[10px] font-bold text-[#5B965E] flex items-center gap-1 mt-0.5">
                            <CheckCircleIcon className="w-3.5 h-3.5 text-[#5B965E]" /> Verified Photo Attached
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadProofPhoto("");
                          setUploadProofName("");
                          if (proofFileInputRef.current) proofFileInputRef.current.value = "";
                        }}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Technician Notes */}
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-bold text-[#7A4C60] uppercase block tracking-wide">
                    Technician Work Notes (What was done)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Inverter communication cable replaced. Measured AC voltage at 238V. Net-meter sync verified."
                    value={workNotesInput || selectedTaskForDetails.workNotes || ""}
                    onChange={(e) => setWorkNotesInput(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#F7CEBE] rounded-xl focus:ring-2 focus:ring-[#DC586D]/30 focus:border-[#DC586D] focus:outline-none text-[#2E1423]"
                  />
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F7CEBE]">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskForDetails(null)}
                    className="px-4 py-2 bg-[#FFF5EF] hover:bg-[#FFE8DD] text-[#2E1423] font-semibold rounded-xl text-xs transition border border-[#F7CEBE]"
                  >
                    Close
                  </button>

                  {selectedTaskForDetails.status !== "Completed" ? (
                    <button
                      type="button"
                      onClick={() => handleUpdateTaskStatus(selectedTaskForDetails.orderId, "Completed")}
                      className="px-5 py-2 bg-[#5B965E] hover:bg-[#48794B] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <CheckCircleIcon className="w-4 h-4 text-white" /> Mark Task Completed &amp; Submit Proof
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#5B965E] px-3 py-2 bg-[#EBF5EC] rounded-xl border border-[#78B77B]/40 flex items-center gap-1.5">
                      <CheckCircleIcon className="w-4 h-4 text-[#5B965E]" /> Job Already Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}

export default function TechnicianFieldPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#7A4C60]">Loading Field Portal...</div>}>
      <TechnicianFieldContent />
    </Suspense>
  );
}
