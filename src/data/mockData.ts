// ============================================================
// MOCK DATA FOR SOLAR INSTALLATION MANAGEMENT SYSTEM
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

export const leads: Lead[] = [
  {
    id: "LD-001",
    name: "Ramesh Sharma",
    phone: "+91 98765 43210",
    email: "ramesh.sharma@email.com",
    address: "42, Green Park Colony, Sector 12",
    city: "Jaipur",
    monthlyBill: 4500,
    roofArea: 350,
    roofType: "RCC Flat",
    gridType: "On-Grid",
    capacity: "3 kW",
    stage: "New Lead",
    source: "Website",
    assignedTo: "Amit Kumar",
    notes: "Interested in subsidy scheme",
    createdAt: "2026-10-28",
    subsidyEligible: true,
  },
  {
    id: "LD-002",
    name: "Priya Patel",
    phone: "+91 87654 32109",
    email: "priya.patel@email.com",
    address: "15, Sunshine Apartments, MG Road",
    city: "Ahmedabad",
    monthlyBill: 3200,
    roofArea: 280,
    roofType: "RCC Flat",
    gridType: "On-Grid",
    capacity: "2 kW",
    stage: "Contacted",
    source: "WhatsApp",
    assignedTo: "Sonia Verma",
    notes: "Wants quick installation",
    createdAt: "2026-10-27",
    subsidyEligible: true,
  },
  {
    id: "LD-003",
    name: "Vikram Singh",
    phone: "+91 76543 21098",
    email: "vikram.s@email.com",
    address: "8, Industrial Area Phase 2",
    city: "Udaipur",
    monthlyBill: 8500,
    roofArea: 600,
    roofType: "Metal Sheet",
    gridType: "Off-Grid",
    capacity: "5 kW",
    stage: "Survey Scheduled",
    source: "Referral",
    assignedTo: "Rohit Meena",
    notes: "Commercial property, needs battery backup",
    createdAt: "2026-10-25",
    subsidyEligible: false,
  },
  {
    id: "LD-004",
    name: "Sunita Devi",
    phone: "+91 65432 10987",
    email: "sunita.d@email.com",
    address: "22, Ram Nagar, Near Temple",
    city: "Jodhpur",
    monthlyBill: 2800,
    roofArea: 200,
    roofType: "RCC Flat",
    gridType: "On-Grid",
    capacity: "2 kW",
    stage: "Survey Done",
    source: "Phone",
    assignedTo: "Amit Kumar",
    notes: "Small house, budget conscious",
    createdAt: "2026-10-24",
    subsidyEligible: true,
  },
  {
    id: "LD-005",
    name: "Arjun Mehta",
    phone: "+91 54321 09876",
    email: "arjun.m@email.com",
    address: "55, Lake View Colony",
    city: "Jaipur",
    monthlyBill: 6200,
    roofArea: 450,
    roofType: "RCC Flat",
    gridType: "On-Grid",
    capacity: "4 kW",
    stage: "Quote Sent",
    source: "Website",
    assignedTo: "Sonia Verma",
    notes: "Wants premium panels",
    createdAt: "2026-10-22",
    subsidyEligible: true,
  },
  {
    id: "LD-006",
    name: "Kavita Joshi",
    phone: "+91 43210 98765",
    email: "kavita.j@email.com",
    address: "10, Defence Colony",
    city: "Jaipur",
    monthlyBill: 5500,
    roofArea: 400,
    roofType: "RCC Flat",
    gridType: "Off-Grid",
    capacity: "3 kW",
    stage: "Converted",
    source: "Walk-in",
    assignedTo: "Rohit Meena",
    notes: "Frequent power cuts in area",
    createdAt: "2026-10-20",
    subsidyEligible: true,
  },
  {
    id: "LD-007",
    name: "Deepak Agarwal",
    phone: "+91 32109 87654",
    email: "deepak.a@email.com",
    address: "78, Civil Lines",
    city: "Kota",
    monthlyBill: 7000,
    roofArea: 500,
    roofType: "RCC Flat",
    gridType: "On-Grid",
    capacity: "5 kW",
    stage: "New Lead",
    source: "Website",
    assignedTo: "Amit Kumar",
    notes: "Large house, multiple floors",
    createdAt: "2026-10-30",
    subsidyEligible: true,
  },
  {
    id: "LD-008",
    name: "Meena Kumari",
    phone: "+91 21098 76543",
    email: "meena.k@email.com",
    address: "3, Shanti Nagar",
    city: "Ajmer",
    monthlyBill: 1800,
    roofArea: 150,
    roofType: "Metal Sheet",
    gridType: "On-Grid",
    capacity: "1 kW",
    stage: "Lost",
    source: "Phone",
    assignedTo: "Sonia Verma",
    notes: "Budget too low, may revisit later",
    createdAt: "2026-10-18",
    subsidyEligible: true,
  },
];

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

export const bomTemplates: BOMTemplate[] = [
  {
    capacity: "1 kW",
    gridType: "On-Grid",
    items: [
      { name: "Solar Panel 540W", specification: "Mono PERC Half-Cut", quantity: 2, unit: "Nos", unitPrice: 14500 },
      { name: "On-Grid Inverter 1kW", specification: "Single Phase MPPT", quantity: 1, unit: "Nos", unitPrice: 12000 },
      { name: "DC Distribution Box", specification: "IP65 with SPD", quantity: 1, unit: "Nos", unitPrice: 2500 },
      { name: "AC Distribution Box", specification: "With MCB & Meter", quantity: 1, unit: "Nos", unitPrice: 3000 },
      { name: "Mounting Structure", specification: "GI Hot-Dip Galvanized", quantity: 1, unit: "Set", unitPrice: 5500 },
      { name: "DC Cable 4mm²", specification: "Solar Grade UV Resistant", quantity: 30, unit: "Meters", unitPrice: 45 },
      { name: "AC Cable 4mm²", specification: "Copper Multistrand", quantity: 20, unit: "Meters", unitPrice: 55 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 1, unit: "Set", unitPrice: 2800 },
      { name: "MC4 Connectors", specification: "IP67 Male-Female Pair", quantity: 4, unit: "Pairs", unitPrice: 120 },
      { name: "Cable Ties & Clamps", specification: "UV Resistant", quantity: 1, unit: "Set", unitPrice: 800 },
    ],
  },
  {
    capacity: "3 kW",
    gridType: "On-Grid",
    items: [
      { name: "Solar Panel 540W", specification: "Mono PERC Half-Cut", quantity: 6, unit: "Nos", unitPrice: 14500 },
      { name: "On-Grid Inverter 3kW", specification: "Single Phase Dual MPPT", quantity: 1, unit: "Nos", unitPrice: 28000 },
      { name: "DC Distribution Box", specification: "IP65 with SPD & Fuse", quantity: 1, unit: "Nos", unitPrice: 3500 },
      { name: "AC Distribution Box", specification: "With MCB, RCCB & Meter", quantity: 1, unit: "Nos", unitPrice: 4500 },
      { name: "Mounting Structure", specification: "GI Hot-Dip Galvanized", quantity: 1, unit: "Set", unitPrice: 14000 },
      { name: "DC Cable 6mm²", specification: "Solar Grade UV Resistant", quantity: 50, unit: "Meters", unitPrice: 65 },
      { name: "AC Cable 6mm²", specification: "Copper Multistrand", quantity: 30, unit: "Meters", unitPrice: 75 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 2, unit: "Set", unitPrice: 2800 },
      { name: "MC4 Connectors", specification: "IP67 Male-Female Pair", quantity: 8, unit: "Pairs", unitPrice: 120 },
      { name: "Cable Ties & Clamps", specification: "UV Resistant", quantity: 1, unit: "Set", unitPrice: 1200 },
    ],
  },
  {
    capacity: "5 kW",
    gridType: "On-Grid",
    items: [
      { name: "Solar Panel 540W", specification: "Mono PERC Half-Cut", quantity: 10, unit: "Nos", unitPrice: 14500 },
      { name: "On-Grid Inverter 5kW", specification: "Single Phase Dual MPPT", quantity: 1, unit: "Nos", unitPrice: 42000 },
      { name: "DC Distribution Box", specification: "IP65 with SPD & Fuse", quantity: 1, unit: "Nos", unitPrice: 4500 },
      { name: "AC Distribution Box", specification: "With MCB, RCCB & Meter", quantity: 1, unit: "Nos", unitPrice: 5500 },
      { name: "Mounting Structure", specification: "GI Hot-Dip Galvanized", quantity: 1, unit: "Set", unitPrice: 22000 },
      { name: "DC Cable 6mm²", specification: "Solar Grade UV Resistant", quantity: 80, unit: "Meters", unitPrice: 65 },
      { name: "AC Cable 10mm²", specification: "Copper Multistrand", quantity: 40, unit: "Meters", unitPrice: 95 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 2, unit: "Set", unitPrice: 2800 },
      { name: "MC4 Connectors", specification: "IP67 Male-Female Pair", quantity: 12, unit: "Pairs", unitPrice: 120 },
      { name: "Cable Ties & Clamps", specification: "UV Resistant", quantity: 2, unit: "Set", unitPrice: 1200 },
    ],
  },
  {
    capacity: "3 kW",
    gridType: "Off-Grid",
    items: [
      { name: "Solar Panel 540W", specification: "Mono PERC Half-Cut", quantity: 6, unit: "Nos", unitPrice: 14500 },
      { name: "Off-Grid Inverter 3.5kVA", specification: "Hybrid MPPT with Charger", quantity: 1, unit: "Nos", unitPrice: 35000 },
      { name: "Lithium Battery 5.12kWh", specification: "LiFePO4 48V 100Ah", quantity: 1, unit: "Nos", unitPrice: 65000 },
      { name: "Battery Rack", specification: "Wall Mount Metal", quantity: 1, unit: "Nos", unitPrice: 3500 },
      { name: "DC Distribution Box", specification: "IP65 with SPD & Fuse", quantity: 1, unit: "Nos", unitPrice: 4000 },
      { name: "AC Distribution Box", specification: "With MCB, RCCB & Changeover", quantity: 1, unit: "Nos", unitPrice: 5500 },
      { name: "Mounting Structure", specification: "GI Hot-Dip Galvanized", quantity: 1, unit: "Set", unitPrice: 14000 },
      { name: "DC Cable 6mm²", specification: "Solar Grade UV Resistant", quantity: 50, unit: "Meters", unitPrice: 65 },
      { name: "Battery Cable 16mm²", specification: "Copper Flexible", quantity: 10, unit: "Meters", unitPrice: 180 },
      { name: "AC Cable 6mm²", specification: "Copper Multistrand", quantity: 30, unit: "Meters", unitPrice: 75 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 2, unit: "Set", unitPrice: 2800 },
      { name: "MC4 Connectors", specification: "IP67 Male-Female Pair", quantity: 8, unit: "Pairs", unitPrice: 120 },
      { name: "Cable Ties & Clamps", specification: "UV Resistant", quantity: 1, unit: "Set", unitPrice: 1200 },
    ],
  },
  {
    capacity: "5 kW",
    gridType: "Off-Grid",
    items: [
      { name: "Solar Panel 540W", specification: "Mono PERC Half-Cut", quantity: 10, unit: "Nos", unitPrice: 14500 },
      { name: "Off-Grid Inverter 5.5kVA", specification: "Hybrid MPPT with Charger", quantity: 1, unit: "Nos", unitPrice: 52000 },
      { name: "Lithium Battery 10.24kWh", specification: "LiFePO4 48V 200Ah", quantity: 1, unit: "Nos", unitPrice: 120000 },
      { name: "Battery Rack", specification: "Floor Stand Metal", quantity: 1, unit: "Nos", unitPrice: 5000 },
      { name: "DC Distribution Box", specification: "IP65 with SPD & Fuse", quantity: 1, unit: "Nos", unitPrice: 4500 },
      { name: "AC Distribution Box", specification: "With MCB, RCCB & Changeover", quantity: 1, unit: "Nos", unitPrice: 6500 },
      { name: "Mounting Structure", specification: "GI Hot-Dip Galvanized", quantity: 1, unit: "Set", unitPrice: 22000 },
      { name: "DC Cable 6mm²", specification: "Solar Grade UV Resistant", quantity: 80, unit: "Meters", unitPrice: 65 },
      { name: "Battery Cable 25mm²", specification: "Copper Flexible", quantity: 10, unit: "Meters", unitPrice: 280 },
      { name: "AC Cable 10mm²", specification: "Copper Multistrand", quantity: 40, unit: "Meters", unitPrice: 95 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 2, unit: "Set", unitPrice: 2800 },
      { name: "MC4 Connectors", specification: "IP67 Male-Female Pair", quantity: 12, unit: "Pairs", unitPrice: 120 },
      { name: "Cable Ties & Clamps", specification: "UV Resistant", quantity: 2, unit: "Set", unitPrice: 1200 },
    ],
  },
];

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

export const orders: Order[] = [
  {
    id: "ORD-001",
    leadId: "LD-006",
    customerName: "Kavita Joshi",
    phone: "+91 43210 98765",
    address: "10, Defence Colony, Jaipur",
    capacity: "3 kW",
    gridType: "Off-Grid",
    totalAmount: 265000,
    advancePaid: 80000,
    balanceDue: 185000,
    status: "Confirmed",
    paymentStatus: "Advance Paid",
    dispatchDate: "2026-11-02",
    installDate: "2026-11-04",
    assignedTechnician: "Rohit Meena",
    createdAt: "2026-10-28",
  },
  {
    id: "ORD-002",
    leadId: "LD-005",
    customerName: "Arjun Mehta",
    phone: "+91 54321 09876",
    address: "55, Lake View Colony, Jaipur",
    capacity: "4 kW",
    gridType: "On-Grid",
    totalAmount: 220000,
    advancePaid: 220000,
    balanceDue: 0,
    status: "Dispatched",
    paymentStatus: "Full Paid",
    dispatchDate: "2026-10-30",
    installDate: "2026-11-01",
    assignedTechnician: "Amit Kumar",
    createdAt: "2026-10-25",
  },
  {
    id: "ORD-003",
    leadId: "LD-010",
    customerName: "Rajesh Gupta",
    phone: "+91 99887 76655",
    address: "12, Vaishali Nagar, Jaipur",
    capacity: "5 kW",
    gridType: "On-Grid",
    totalAmount: 310000,
    advancePaid: 310000,
    balanceDue: 0,
    status: "Installed",
    paymentStatus: "Full Paid",
    dispatchDate: "2026-10-20",
    installDate: "2026-10-22",
    assignedTechnician: "Rohit Meena",
    createdAt: "2026-10-15",
  },
  {
    id: "ORD-004",
    leadId: "LD-011",
    customerName: "Anita Rawat",
    phone: "+91 88776 65544",
    address: "34, Malviya Nagar, Jaipur",
    capacity: "2 kW",
    gridType: "On-Grid",
    totalAmount: 125000,
    advancePaid: 50000,
    balanceDue: 75000,
    status: "Installation Scheduled",
    paymentStatus: "Partial",
    dispatchDate: "2026-10-29",
    installDate: "2026-11-03",
    assignedTechnician: "Suresh Yadav",
    createdAt: "2026-10-22",
  },
  {
    id: "ORD-005",
    leadId: "LD-012",
    customerName: "Mohan Lal",
    phone: "+91 77665 54433",
    address: "67, Mansarovar, Jaipur",
    capacity: "3 kW",
    gridType: "On-Grid",
    totalAmount: 185000,
    advancePaid: 185000,
    balanceDue: 0,
    status: "Completed",
    paymentStatus: "Full Paid",
    dispatchDate: "2026-10-10",
    installDate: "2026-10-12",
    assignedTechnician: "Amit Kumar",
    createdAt: "2026-10-05",
  },
];

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

export const inventory: InventoryItem[] = [
  {
    id: "INV-001",
    name: "Solar Panel 540W",
    category: "Panel",
    serialNumber: "SP-MONO-2026-4401",
    specification: "Mono PERC Half-Cut 540W",
    status: "In Stock",
    linkedOrder: "",
    linkedCustomer: "",
    warrantyYears: 25,
    warrantyStart: "",
    warrantyEnd: "",
    purchasePrice: 11000,
    supplier: "Waaree Energies",
    location: "Warehouse A - Rack 1",
  },
  {
    id: "INV-002",
    name: "Solar Panel 540W",
    category: "Panel",
    serialNumber: "SP-MONO-2026-4402",
    specification: "Mono PERC Half-Cut 540W",
    status: "In Stock",
    linkedOrder: "",
    linkedCustomer: "",
    warrantyYears: 25,
    warrantyStart: "",
    warrantyEnd: "",
    purchasePrice: 11000,
    supplier: "Waaree Energies",
    location: "Warehouse A - Rack 1",
  },
  {
    id: "INV-003",
    name: "On-Grid Inverter 5kW",
    category: "Inverter",
    serialNumber: "INV-5K-OG-9921",
    specification: "Single Phase Dual MPPT 5kW",
    status: "Dispatched",
    linkedOrder: "ORD-003",
    linkedCustomer: "Rajesh Gupta",
    warrantyYears: 5,
    warrantyStart: "2026-10-22",
    warrantyEnd: "2031-10-22",
    purchasePrice: 32000,
    supplier: "Growatt",
    location: "Customer Site",
  },
  {
    id: "INV-004",
    name: "Off-Grid Inverter 3.5kVA",
    category: "Inverter",
    serialNumber: "INV-3K-HB-7755",
    specification: "Hybrid MPPT with Charger 3.5kVA",
    status: "Reserved",
    linkedOrder: "ORD-001",
    linkedCustomer: "Kavita Joshi",
    warrantyYears: 5,
    warrantyStart: "",
    warrantyEnd: "",
    purchasePrice: 26000,
    supplier: "Luminous",
    location: "Warehouse A - Rack 3",
  },
  {
    id: "INV-005",
    name: "Lithium Battery 5.12kWh",
    category: "Battery",
    serialNumber: "BAT-LFP-48V-3321",
    specification: "LiFePO4 48V 100Ah",
    status: "Reserved",
    linkedOrder: "ORD-001",
    linkedCustomer: "Kavita Joshi",
    warrantyYears: 5,
    warrantyStart: "",
    warrantyEnd: "",
    purchasePrice: 48000,
    supplier: "Okaya",
    location: "Warehouse B - Rack 1",
  },
  {
    id: "INV-006",
    name: "On-Grid Inverter 3kW",
    category: "Inverter",
    serialNumber: "INV-3K-OG-8832",
    specification: "Single Phase Dual MPPT 3kW",
    status: "Installed",
    linkedOrder: "ORD-005",
    linkedCustomer: "Mohan Lal",
    warrantyYears: 5,
    warrantyStart: "2026-10-12",
    warrantyEnd: "2031-10-12",
    purchasePrice: 21000,
    supplier: "Growatt",
    location: "Customer Site",
  },
  {
    id: "INV-007",
    name: "Mounting Structure Set",
    category: "Structure",
    serialNumber: "STR-GI-3KW-0055",
    specification: "GI Hot-Dip Galvanized 3kW Set",
    status: "In Stock",
    linkedOrder: "",
    linkedCustomer: "",
    warrantyYears: 10,
    warrantyStart: "",
    warrantyEnd: "",
    purchasePrice: 10000,
    supplier: "Tata Steel",
    location: "Warehouse A - Rack 5",
  },
  {
    id: "INV-008",
    name: "DC Cable 6mm²",
    category: "Cable",
    serialNumber: "CBL-DC6-ROLL-112",
    specification: "Solar Grade UV Resistant 100m Roll",
    status: "In Stock",
    linkedOrder: "",
    linkedCustomer: "",
    warrantyYears: 10,
    warrantyStart: "",
    warrantyEnd: "",
    purchasePrice: 5500,
    supplier: "Polycab",
    location: "Warehouse B - Rack 3",
  },
  {
    id: "INV-009",
    name: "Solar Panel 540W",
    category: "Panel",
    serialNumber: "SP-MONO-2026-4410",
    specification: "Mono PERC Half-Cut 540W",
    status: "Defective",
    linkedOrder: "",
    linkedCustomer: "",
    warrantyYears: 25,
    warrantyStart: "",
    warrantyEnd: "",
    purchasePrice: 11000,
    supplier: "Waaree Energies",
    location: "Warehouse A - Defective Bay",
  },
  {
    id: "INV-010",
    name: "Earthing Kit",
    category: "Electrical",
    serialNumber: "EK-GI-CU-0078",
    specification: "GI Pipe with Copper Wire",
    status: "In Stock",
    linkedOrder: "",
    linkedCustomer: "",
    warrantyYears: 5,
    warrantyStart: "",
    warrantyEnd: "",
    purchasePrice: 1800,
    supplier: "Local Vendor",
    location: "Warehouse B - Rack 2",
  },
];

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

export const warranties: Warranty[] = [
  {
    id: "WR-001",
    serialNumber: "INV-5K-OG-9921",
    productName: "On-Grid Inverter 5kW",
    category: "Inverter",
    customerName: "Rajesh Gupta",
    customerId: "CUST-003",
    phone: "+91 99887 76655",
    orderId: "ORD-003",
    installDate: "2026-10-22",
    warrantyYears: 5,
    expiryDate: "2031-10-22",
    status: "Active",
    claimCount: 0,
  },
  {
    id: "WR-002",
    serialNumber: "SP-MONO-2026-4201",
    productName: "Solar Panel 540W",
    category: "Panel",
    customerName: "Rajesh Gupta",
    customerId: "CUST-003",
    phone: "+91 99887 76655",
    orderId: "ORD-003",
    installDate: "2026-10-22",
    warrantyYears: 25,
    expiryDate: "2051-10-22",
    status: "Active",
    claimCount: 0,
  },
  {
    id: "WR-003",
    serialNumber: "INV-3K-OG-8832",
    productName: "On-Grid Inverter 3kW",
    category: "Inverter",
    customerName: "Mohan Lal",
    customerId: "CUST-005",
    phone: "+91 77665 54433",
    orderId: "ORD-005",
    installDate: "2026-10-12",
    warrantyYears: 5,
    expiryDate: "2031-10-12",
    status: "Active",
    claimCount: 0,
  },
  {
    id: "WR-004",
    serialNumber: "SP-MONO-2024-1105",
    productName: "Solar Panel 540W",
    category: "Panel",
    customerName: "Sanjay Tiwari",
    customerId: "CUST-010",
    phone: "+91 66554 43322",
    orderId: "ORD-OLD-012",
    installDate: "2024-06-15",
    warrantyYears: 25,
    expiryDate: "2049-06-15",
    status: "Active",
    claimCount: 1,
  },
  {
    id: "WR-005",
    serialNumber: "INV-3K-OG-5501",
    productName: "On-Grid Inverter 3kW",
    category: "Inverter",
    customerName: "Sanjay Tiwari",
    customerId: "CUST-010",
    phone: "+91 66554 43322",
    orderId: "ORD-OLD-012",
    installDate: "2024-06-15",
    warrantyYears: 5,
    expiryDate: "2029-06-15",
    status: "Active",
    claimCount: 1,
  },
  {
    id: "WR-006",
    serialNumber: "BAT-LFP-48V-1122",
    productName: "Lithium Battery 5.12kWh",
    category: "Battery",
    customerName: "Pooja Sharma",
    customerId: "CUST-008",
    phone: "+91 55443 32211",
    orderId: "ORD-OLD-008",
    installDate: "2023-03-20",
    warrantyYears: 5,
    expiryDate: "2028-03-20",
    status: "Expiring Soon",
    claimCount: 2,
  },
  {
    id: "WR-007",
    serialNumber: "INV-1K-OG-2201",
    productName: "On-Grid Inverter 1kW",
    category: "Inverter",
    customerName: "Ratan Devi",
    customerId: "CUST-015",
    phone: "+91 44332 21100",
    orderId: "ORD-OLD-015",
    installDate: "2021-08-10",
    warrantyYears: 2,
    expiryDate: "2023-08-10",
    status: "Expired",
    claimCount: 0,
  },
];

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

export const serviceTickets: ServiceTicket[] = [
  {
    id: "TKT-001",
    customerId: "CUST-010",
    customerName: "Sanjay Tiwari",
    phone: "+91 66554 43322",
    address: "88, Tonk Road, Jaipur",
    serialNumber: "INV-3K-OG-5501",
    productName: "On-Grid Inverter 3kW",
    issueType: "Inverter Error",
    description: "Inverter showing E-04 error code, system not generating power since morning.",
    priority: "High",
    status: "Assigned",
    warrantyStatus: "Under Warranty",
    assignedTechnician: "Rohit Meena",
    estimatedCost: 0,
    actualCost: 0,
    createdAt: "2026-10-30",
    resolvedAt: "",
  },
  {
    id: "TKT-002",
    customerId: "CUST-008",
    customerName: "Pooja Sharma",
    phone: "+91 55443 32211",
    address: "5, Bani Park, Jaipur",
    serialNumber: "BAT-LFP-48V-1122",
    productName: "Lithium Battery 5.12kWh",
    issueType: "Battery Issue",
    description: "Battery not holding charge, backup time reduced to 1 hour from 4 hours.",
    priority: "Medium",
    status: "In Progress",
    warrantyStatus: "Under Warranty",
    assignedTechnician: "Suresh Yadav",
    estimatedCost: 0,
    actualCost: 0,
    createdAt: "2026-10-28",
    resolvedAt: "",
  },
  {
    id: "TKT-003",
    customerId: "CUST-015",
    customerName: "Ratan Devi",
    phone: "+91 44332 21100",
    address: "22, Sodala, Jaipur",
    serialNumber: "INV-1K-OG-2201",
    productName: "On-Grid Inverter 1kW",
    issueType: "No Power",
    description: "Inverter completely dead, no LED lights. Warranty expired.",
    priority: "Medium",
    status: "Open",
    warrantyStatus: "Out of Warranty",
    assignedTechnician: "",
    estimatedCost: 8500,
    actualCost: 0,
    createdAt: "2026-10-31",
    resolvedAt: "",
  },
  {
    id: "TKT-004",
    customerId: "CUST-003",
    customerName: "Rajesh Gupta",
    phone: "+91 99887 76655",
    address: "12, Vaishali Nagar, Jaipur",
    serialNumber: "SP-MONO-2026-4205",
    productName: "Solar Panel 540W",
    issueType: "Physical Damage",
    description: "One panel cracked due to hailstorm. Needs replacement.",
    priority: "Low",
    status: "Resolved",
    warrantyStatus: "Under Warranty",
    assignedTechnician: "Amit Kumar",
    estimatedCost: 0,
    actualCost: 0,
    createdAt: "2026-10-20",
    resolvedAt: "2026-10-23",
  },
  {
    id: "TKT-005",
    customerId: "CUST-020",
    customerName: "Harish Chandra",
    phone: "+91 33221 10099",
    address: "45, Jagatpura, Jaipur",
    serialNumber: "INV-5K-OG-6677",
    productName: "On-Grid Inverter 5kW",
    issueType: "Low Output",
    description: "System generating only 60% of expected output. Panels seem dirty but even after cleaning, output is low.",
    priority: "High",
    status: "Closed",
    warrantyStatus: "Under Warranty",
    assignedTechnician: "Rohit Meena",
    estimatedCost: 0,
    actualCost: 0,
    createdAt: "2026-10-15",
    resolvedAt: "2026-10-18",
  },
];

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

export const subsidies: Subsidy[] = [
  {
    id: "SUB-001",
    customerName: "Rajesh Gupta",
    orderId: "ORD-003",
    capacity: "5 kW",
    subsidyAmount: 78000,
    applicationNumber: "PM-SURYA-2026-44521",
    discomName: "JVVNL",
    aadhaarVerified: true,
    electricityBillVerified: true,
    discomApproval: "Approved",
    mnreApproval: "Approved",
    disbursementStatus: "Processing",
    appliedDate: "2026-10-23",
    approvalDate: "2026-10-28",
    creditDate: "",
  },
  {
    id: "SUB-002",
    customerName: "Mohan Lal",
    orderId: "ORD-005",
    capacity: "3 kW",
    subsidyAmount: 78000,
    applicationNumber: "PM-SURYA-2026-43890",
    discomName: "JVVNL",
    aadhaarVerified: true,
    electricityBillVerified: true,
    discomApproval: "Approved",
    mnreApproval: "Approved",
    disbursementStatus: "Credited",
    appliedDate: "2026-10-13",
    approvalDate: "2026-10-18",
    creditDate: "2026-10-25",
  },
  {
    id: "SUB-003",
    customerName: "Arjun Mehta",
    orderId: "ORD-002",
    capacity: "4 kW",
    subsidyAmount: 78000,
    applicationNumber: "PM-SURYA-2026-44780",
    discomName: "JVVNL",
    aadhaarVerified: true,
    electricityBillVerified: false,
    discomApproval: "Pending",
    mnreApproval: "Pending",
    disbursementStatus: "Applied",
    appliedDate: "2026-10-29",
    approvalDate: "",
    creditDate: "",
  },
  {
    id: "SUB-004",
    customerName: "Anita Rawat",
    orderId: "ORD-004",
    capacity: "2 kW",
    subsidyAmount: 60000,
    applicationNumber: "",
    discomName: "JVVNL",
    aadhaarVerified: true,
    electricityBillVerified: true,
    discomApproval: "Pending",
    mnreApproval: "Pending",
    disbursementStatus: "Not Applied",
    appliedDate: "",
    approvalDate: "",
    creditDate: "",
  },
];

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

export const technicians: Technician[] = [
  {
    id: "TECH-001",
    name: "Rohit Meena",
    phone: "+91 98765 11111",
    specialization: "Lead Installation & Commissioning Engineer",
    status: "On Job",
    rating: 4.8,
    completedJobs: 156,
    todaysJobs: [
      {
        orderId: "ORD-003",
        customerName: "Rajesh Gupta",
        address: "12, Vaishali Nagar, Jaipur",
        capacity: "5 kW",
        type: "Service",
        timeSlot: "10:00 AM - 12:00 PM",
        status: "Completed",
      },
      {
        orderId: "TKT-001",
        customerName: "Sanjay Tiwari",
        address: "88, Tonk Road, Jaipur",
        capacity: "3 kW",
        type: "Service",
        timeSlot: "2:00 PM - 4:00 PM",
        status: "In Progress",
      },
    ],
  },
  {
    id: "TECH-002",
    name: "Amit Kumar",
    phone: "+91 98765 22222",
    specialization: "Rooftop Survey & Tilt Analysis Specialist",
    status: "Available",
    rating: 4.6,
    completedJobs: 132,
    todaysJobs: [
      {
        orderId: "ORD-002",
        customerName: "Arjun Mehta",
        address: "55, Lake View Colony, Jaipur",
        capacity: "4 kW",
        type: "Installation",
        timeSlot: "9:00 AM - 5:00 PM",
        status: "Pending",
      },
    ],
  },
  {
    id: "TECH-003",
    name: "Suresh Yadav",
    phone: "+91 98765 33333",
    specialization: "Off-Grid & Lithium Battery Specialist",
    status: "On Job",
    rating: 4.5,
    completedJobs: 98,
    todaysJobs: [
      {
        orderId: "TKT-002",
        customerName: "Pooja Sharma",
        address: "5, Bani Park, Jaipur",
        capacity: "3 kW",
        type: "Service",
        timeSlot: "11:00 AM - 1:00 PM",
        status: "In Progress",
      },
    ],
  },
  {
    id: "TECH-004",
    name: "Sonia Verma",
    phone: "+91 98765 44444",
    specialization: "Electrical Quality & Pre-Sales Inspector",
    status: "Available",
    rating: 4.9,
    completedJobs: 210,
    todaysJobs: [],
  },
  {
    id: "TECH-005",
    name: "Vikram Rathore",
    phone: "+91 98765 55555",
    specialization: "High-Voltage String Inverter Specialist",
    status: "Available",
    rating: 4.7,
    completedJobs: 89,
    todaysJobs: [],
  },
  {
    id: "TECH-006",
    name: "Manoj Sharma",
    phone: "+91 98765 66666",
    specialization: "Earthing Pit & Lightning Arrestor Tech",
    status: "Available",
    rating: 4.8,
    completedJobs: 142,
    todaysJobs: [],
  },
  {
    id: "TECH-007",
    name: "Deepak Saini",
    phone: "+91 98765 77777",
    specialization: "Galvanized Structure Mounting Lead",
    status: "On Job",
    rating: 4.6,
    completedJobs: 115,
    todaysJobs: [],
  },
  {
    id: "TECH-008",
    name: "Pooja Choudhary",
    phone: "+91 98765 88888",
    specialization: "Discom Net-Metering & Grid Sync Engineer",
    status: "Available",
    rating: 4.9,
    completedJobs: 167,
    todaysJobs: [],
  },
  {
    id: "TECH-009",
    name: "Rajesh Gurjar",
    phone: "+91 98765 99999",
    specialization: "Solar DC Cabling & Combiner Box Tech",
    status: "Available",
    rating: 4.5,
    completedJobs: 78,
    todaysJobs: [],
  },
  {
    id: "TECH-010",
    name: "Ankit Tiwari",
    phone: "+91 98765 10101",
    specialization: "Micro-Inverter & AC DB Wiring Tech",
    status: "Available",
    rating: 4.7,
    completedJobs: 92,
    todaysJobs: [],
  },
  {
    id: "TECH-011",
    name: "Sunita Meena",
    phone: "+91 98765 12121",
    specialization: "Safety Compliance & Quality Assurance",
    status: "Available",
    rating: 4.9,
    completedJobs: 180,
    todaysJobs: [],
  },
  {
    id: "TECH-012",
    name: "Rakesh Prajapat",
    phone: "+91 98765 13131",
    specialization: "Commercial & Industrial Plant Crew",
    status: "Available",
    rating: 4.6,
    completedJobs: 104,
    todaysJobs: [],
  },
  {
    id: "TECH-013",
    name: "Tarun Bhati",
    phone: "+91 98765 14141",
    specialization: "Preventive Maintenance & Deep Cleaning",
    status: "Available",
    rating: 4.7,
    completedJobs: 121,
    todaysJobs: [],
  },
  {
    id: "TECH-014",
    name: "Neha Khandelwal",
    phone: "+91 98765 15151",
    specialization: "Inverter Telemetry & Firmware Diagnostics",
    status: "Available",
    rating: 4.8,
    completedJobs: 95,
    todaysJobs: [],
  },
  {
    id: "TECH-015",
    name: "Harish Jangid",
    phone: "+91 98765 16161",
    specialization: "Emergency Breakdown Fast Response",
    status: "Available",
    rating: 4.8,
    completedJobs: 138,
    todaysJobs: [],
  },
  {
    id: "TECH-016",
    name: "Vikas Shekhawat",
    phone: "+91 98765 17171",
    specialization: "Final Grid Testing & Handover Lead",
    status: "Available",
    rating: 4.9,
    completedJobs: 164,
    todaysJobs: [],
  },
];

// ---------- DASHBOARD STATS ----------
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
    { month: "Jul", installations: 28, revenue: 3400000, profit: 1050000 },
    { month: "Aug", installations: 38, revenue: 4600000, profit: 1500000 },
    { month: "Sep", installations: 42, revenue: 5100000, profit: 1750000 },
    { month: "Oct", installations: 34, revenue: 4850000, profit: 1650000 },
  ],
};
