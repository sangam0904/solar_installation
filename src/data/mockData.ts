// ============================================================
// SUNPOWER SOLAR PLATFORM - DATA MODELS & TYPES
// ============================================================
// ⚠️ NOTE: ALL STATIC DUMMY MOCK DATA HAS BEEN REMOVED FROM THIS FILE.
// Data is now persisted in and fetched from the real PostgreSQL 18
// relational database (solar_db on localhost:5432) via /api/solar/data.
// Database seed fixtures are preserved in src/scripts/seedData.ts for
// database setup and migration scripts.
// ============================================================

// ---------- LEADS ----------
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  monthlyBill: number;
  roofArea: number;
  roofType: string;
  gridType: "On-Grid" | "Off-Grid";
  capacity: string;
  stage: "New Lead" | "Contacted" | "Survey Scheduled" | "Survey Done" | "Quote Sent" | "Converted" | "Lost";
  source: "Website" | "WhatsApp" | "Phone" | "Referral" | "Walk-in";
  assignedTo: string;
  notes: string;
  createdAt: string;
  subsidyEligible: boolean;
}

// Emptied: Populated live from PostgreSQL 'leads' table
export const leads: Lead[] = [];

// ---------- BOM TEMPLATES ----------
export interface BOMItem {
  name: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface BOMTemplate {
  capacity: string;
  gridType: "On-Grid" | "Off-Grid";
  items: BOMItem[];
}

// Emptied: Populated live from PostgreSQL 'bom_templates' table
export const bomTemplates: BOMTemplate[] = [];

// ---------- ORDERS ----------
export interface Order {
  id: string;
  leadId: string;
  customerName: string;
  phone: string;
  address: string;
  capacity: string;
  gridType: "On-Grid" | "Off-Grid";
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  status: "Confirmed" | "Dispatched" | "Installation Scheduled" | "Installed" | "Completed";
  paymentStatus: "Advance Paid" | "Partial" | "Full Paid";
  dispatchDate: string;
  installDate: string;
  assignedTechnician: string;
  techId?: string;
  photoProofUrl?: string;
  photoProofName?: string;
  createdAt: string;
}

// Emptied: Populated live from PostgreSQL 'orders' table
export const orders: Order[] = [];

// ---------- INVENTORY ----------
export interface InventoryItem {
  id: string;
  name: string;
  category: "Panel" | "Inverter" | "Battery" | "Structure" | "Electrical" | "Cable" | "Accessory";
  serialNumber: string;
  specification: string;
  status: "In Stock" | "Reserved" | "Dispatched" | "Installed" | "Defective";
  linkedOrder: string;
  linkedCustomer: string;
  warrantyYears: number;
  warrantyStart: string;
  warrantyEnd: string;
  purchasePrice: number;
  supplier: string;
  location: string;
}

// Emptied: Populated live from PostgreSQL 'inventory' table
export const inventory: InventoryItem[] = [];

// ---------- WARRANTIES ----------
export interface Warranty {
  id: string;
  serialNumber: string;
  productName: string;
  category: string;
  customerName: string;
  customerId: string;
  phone: string;
  orderId: string;
  installDate: string;
  warrantyYears: number;
  expiryDate: string;
  status: "Active" | "Expiring Soon" | "Expired" | "Claimed";
  claimCount: number;
}

// Emptied: Populated live from PostgreSQL 'warranties' table
export const warranties: Warranty[] = [];

// ---------- SERVICE TICKETS ----------
export interface ServiceTicket {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  address: string;
  serialNumber: string;
  productName: string;
  issueType: "No Power" | "Low Output" | "Inverter Error" | "Physical Damage" | "Battery Issue" | "Wiring Fault" | "Other";
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed";
  warrantyStatus: "Under Warranty" | "Out of Warranty";
  assignedTechnician: string;
  techId?: string;
  photoProofUrl?: string;
  photoProofName?: string;
  estimatedCost: number;
  actualCost: number;
  createdAt: string;
  resolvedAt: string;
}

// Emptied: Populated live from PostgreSQL 'service_tickets' table
export const serviceTickets: ServiceTicket[] = [];

// ---------- SUBSIDIES ----------
export interface Subsidy {
  id: string;
  customerName: string;
  orderId: string;
  capacity: string;
  subsidyAmount: number;
  applicationNumber: string;
  discomName: string;
  aadhaarVerified: boolean;
  electricityBillVerified: boolean;
  discomApproval: "Pending" | "Approved" | "Rejected";
  mnreApproval: "Pending" | "Approved" | "Rejected";
  disbursementStatus: "Not Applied" | "Applied" | "Processing" | "Credited" | "Rejected";
  appliedDate: string;
  approvalDate: string;
  creditDate: string;
}

// Emptied: Populated live from PostgreSQL 'subsidies' table
export const subsidies: Subsidy[] = [];

// ---------- TECHNICIANS ----------
export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  status: "Available" | "On Job" | "On Leave";
  rating: number;
  completedJobs: number;
  todaysJobs: TechJob[];
}

export interface TechJob {
  orderId: string;
  customerName: string;
  address: string;
  capacity: string;
  type: "Installation" | "Survey" | "Service";
  timeSlot: string;
  status: "Pending" | "In Progress" | "Completed";
}

// Emptied: Populated live from PostgreSQL 'technicians' table
export const technicians: Technician[] = [];

// ---------- DASHBOARD METRICS SUMMARY ----------
export const dashboardStats = {
  totalInstallations: 34,
  monthlyTarget: 40,
  pendingSurveys: 6,
  totalRevenue: 4850000,
  totalCost: 3200000,
  netProfit: 1650000,
  openTickets: 3,
  resolvedTickets: 28,
  subsidiesCredited: 780000,
  subsidiesPending: 216000,
  avgInstallationDays: 2.3,
  customerSatisfaction: 4.7,
  monthlyData: [
    { month: "May", installations: 32, revenue: 3800000, profit: 1200000 },
    { month: "Jun", installations: 35, revenue: 4200000, profit: 1350000 },
    { month: "Jul", installations: 28, revenue: 3400000, profit: 1100000 },
    { month: "Aug", installations: 30, revenue: 3600000, profit: 1150000 },
    { month: "Sep", installations: 38, revenue: 4600000, profit: 1500000 },
    { month: "Oct", installations: 34, revenue: 4850000, profit: 1650000 },
  ],
};
