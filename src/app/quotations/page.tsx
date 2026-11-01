"use client";

import { FileTextIcon, PrinterIcon } from "@/components/Icons";
import { useState, useMemo, useEffect } from "react";
import PageShell from "@/components/PageShell";
import {
  downloadQuotationPdf,
  getQuotationPdfBase64,
  QuotationPdfItem,
} from "@/lib/generateQuotationPdf";

// ── Fallback BOM templates (synced with PostgreSQL seed) ──
const defaultBomTemplates: Array<{
  capacity: string;
  gridType: "On-Grid" | "Off-Grid";
  items: QuotationPdfItem[];
}> = [
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
    capacity: "2 kW",
    gridType: "On-Grid",
    items: [
      { name: "Solar Panel 540W", specification: "Mono PERC Half-Cut", quantity: 4, unit: "Nos", unitPrice: 14500 },
      { name: "On-Grid Inverter 2kW", specification: "Single Phase Dual MPPT", quantity: 1, unit: "Nos", unitPrice: 20000 },
      { name: "DC Distribution Box", specification: "IP65 with SPD & Fuse", quantity: 1, unit: "Nos", unitPrice: 3200 },
      { name: "AC Distribution Box", specification: "With MCB & Isolator", quantity: 1, unit: "Nos", unitPrice: 4000 },
      { name: "Mounting Structure", specification: "GI Hot-Dip Galvanized", quantity: 1, unit: "Set", unitPrice: 9500 },
      { name: "DC Cable 4mm²", specification: "Solar Grade UV Resistant", quantity: 40, unit: "Meters", unitPrice: 45 },
      { name: "AC Cable 6mm²", specification: "Copper Multistrand", quantity: 25, unit: "Meters", unitPrice: 65 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 2, unit: "Set", unitPrice: 2800 },
      { name: "MC4 Connectors", specification: "IP67 Male-Female Pair", quantity: 6, unit: "Pairs", unitPrice: 120 },
      { name: "Cable Accessories", specification: "UV Resistant Clamps", quantity: 1, unit: "Set", unitPrice: 1000 },
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
      { name: "DC Cable 4mm²", specification: "Solar Grade UV Resistant", quantity: 50, unit: "Meters", unitPrice: 45 },
      { name: "AC Cable 6mm²", specification: "Copper Multistrand", quantity: 30, unit: "Meters", unitPrice: 65 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 2, unit: "Set", unitPrice: 2800 },
      { name: "MC4 Connectors", specification: "IP67 Male-Female Pair", quantity: 8, unit: "Pairs", unitPrice: 120 },
      { name: "Cable Ties & Clamps", specification: "UV Resistant", quantity: 1, unit: "Set", unitPrice: 1200 },
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
      { name: "AC Distribution Box", specification: "With MCB & Changeover", quantity: 1, unit: "Nos", unitPrice: 5500 },
      { name: "Mounting Structure", specification: "GI Hot-Dip Galvanized", quantity: 1, unit: "Set", unitPrice: 14000 },
      { name: "DC Cable 6mm²", specification: "Solar Grade UV Resistant", quantity: 50, unit: "Meters", unitPrice: 65 },
      { name: "Battery Cable 16mm²", specification: "Copper Flexible", quantity: 10, unit: "Meters", unitPrice: 180 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 2, unit: "Set", unitPrice: 2800 },
    ],
  },
  {
    capacity: "4 kW",
    gridType: "On-Grid",
    items: [
      { name: "Solar Panel 540W", specification: "Mono PERC Half-Cut", quantity: 8, unit: "Nos", unitPrice: 14500 },
      { name: "On-Grid Inverter 4kW", specification: "Dual MPPT Wi-Fi", quantity: 1, unit: "Nos", unitPrice: 36000 },
      { name: "DC Distribution Box", specification: "IP65 with SPD & Fuse", quantity: 1, unit: "Nos", unitPrice: 4000 },
      { name: "AC Distribution Box", specification: "With MCB, RCCB & Meter", quantity: 1, unit: "Nos", unitPrice: 5000 },
      { name: "Mounting Structure", specification: "GI Hot-Dip Galvanized", quantity: 1, unit: "Set", unitPrice: 18000 },
      { name: "DC Cable 6mm²", specification: "Solar Grade UV Resistant", quantity: 65, unit: "Meters", unitPrice: 65 },
      { name: "AC Cable 10mm²", specification: "Copper Multistrand", quantity: 35, unit: "Meters", unitPrice: 85 },
      { name: "Earthing Kit", specification: "GI Pipe with Copper Wire", quantity: 2, unit: "Set", unitPrice: 2800 },
      { name: "MC4 Connectors", specification: "IP67 Male-Female Pair", quantity: 10, unit: "Pairs", unitPrice: 120 },
      { name: "Cable Clamps & Trays", specification: "UV Resistant", quantity: 1, unit: "Set", unitPrice: 1500 },
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

// ── Customer Interface ──
interface CustomerOption {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  capacity?: string;
  gridType?: "On-Grid" | "Off-Grid";
}

const initialSeedCustomers: CustomerOption[] = [
  { id: "cust-1", name: "Rajesh Gupta", email: "rajeshgupta@email.com", phone: "+91 98000 10000", city: "Jaipur", address: "7, Sector 1, Malviya Nagar", capacity: "2 kW", gridType: "Off-Grid" },
  { id: "cust-2", name: "Mohan Lal", email: "mohanlal@email.com", phone: "+91 98001 10007", city: "Jodhpur", address: "14, Sector 2, Shastri Nagar", capacity: "3 kW", gridType: "On-Grid" },
  { id: "cust-3", name: "Kavita Joshi", email: "kavita.j@email.com", phone: "+91 98222 33445", city: "Jaipur", address: "44, Vaishali Nagar", capacity: "3 kW", gridType: "Off-Grid" },
  { id: "cust-4", name: "Priya Patel", email: "priya.patel@email.com", phone: "+91 98111 22334", city: "Ahmedabad", address: "15, Sunshine Apartments, MG Road", capacity: "2 kW", gridType: "On-Grid" },
  { id: "cust-5", name: "Vikram Singh", email: "vikram.s@email.com", phone: "+91 76543 21098", city: "Udaipur", address: "8, Industrial Area Phase 2", capacity: "5 kW", gridType: "Off-Grid" },
  { id: "cust-6", name: "Anita Rawat", email: "anita.rawat@email.com", phone: "+91 98333 44556", city: "Kota", address: "12, Talwandi", capacity: "4 kW", gridType: "On-Grid" },
  { id: "cust-7", name: "Arjun Mehta", email: "arjun.m@email.com", phone: "+91 98444 55667", city: "Bikaner", address: "9, Karni Nagar", capacity: "4 kW", gridType: "On-Grid" },
  { id: "cust-8", name: "Ramesh Sharma", email: "ramesh.sharma@email.com", phone: "+91 99887 76655", city: "Jaipur", address: "Plot 102, Mansarovar", capacity: "3 kW", gridType: "On-Grid" },
];

const capacityOptions = ["1 kW", "2 kW", "3 kW", "4 kW", "5 kW"];
const gridOptions: { label: string; value: "On-Grid" | "Off-Grid" }[] = [
  { label: "On-Grid", value: "On-Grid" },
  { label: "Off-Grid", value: "Off-Grid" },
];

interface SavedQuotation {
  id: string;
  customer: string;
  email: string;
  capacity: string;
  gridType: "On-Grid" | "Off-Grid";
  amount: number;
  date: string;
  status: "Sent" | "Accepted" | "Expired";
}

const initialSavedQuotations: SavedQuotation[] = [
  { id: "QT-2026-088", customer: "Rajesh Gupta", email: "rajeshgupta@email.com", capacity: "2 kW", gridType: "Off-Grid", amount: 144500, date: "2026-11-01", status: "Sent" },
  { id: "QT-2026-001", customer: "Arjun Mehta", email: "arjun.m@email.com", capacity: "4 kW", gridType: "On-Grid", amount: 250580, date: "2026-10-22", status: "Accepted" },
  { id: "QT-2026-002", customer: "Vikram Singh", email: "vikram.s@email.com", capacity: "5 kW", gridType: "Off-Grid", amount: 395620, date: "2026-10-25", status: "Sent" },
  { id: "QT-2026-003", customer: "Priya Patel", email: "priya.patel@email.com", capacity: "2 kW", gridType: "On-Grid", amount: 112340, date: "2026-10-18", status: "Expired" },
  { id: "QT-2026-004", customer: "Kavita Joshi", email: "kavita.j@email.com", capacity: "3 kW", gridType: "Off-Grid", amount: 268750, date: "2026-10-20", status: "Accepted" },
  { id: "QT-2026-005", customer: "Deepak Agarwal", email: "deepak.ag@email.com", capacity: "5 kW", gridType: "On-Grid", amount: 322410, date: "2026-10-30", status: "Sent" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function QuotationsPage() {
  // ── Customer & Quotation States ──
  const [customerName, setCustomerName] = useState("Rajesh Gupta");
  const [customerEmail, setCustomerEmail] = useState("rajeshgupta@email.com");
  const [customerPhone, setCustomerPhone] = useState("+91 98000 10000");
  const [customerCity, setCustomerCity] = useState("Jaipur");
  const [customerAddress, setCustomerAddress] = useState("7, Sector 1, Malviya Nagar");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("cust-1");

  const [selectedCapacity, setSelectedCapacity] = useState("3 kW");
  const [selectedGrid, setSelectedGrid] = useState<"On-Grid" | "Off-Grid">("On-Grid");
  const [quoteId, setQuoteId] = useState("QT-2026-088");

  const [customers, setCustomers] = useState<CustomerOption[]>(initialSeedCustomers);
  const [bomTemplates, setBomTemplates] = useState(defaultBomTemplates);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuotation[]>(initialSavedQuotations);

  // ── Modal & Email States ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState(
    "Dear Customer, please find attached your official rooftop solar turnkey quotation and invoice bill. This proposal includes full equipment specifications, MNRE compliance, and central PM Surya Ghar DBT subsidy benefits."
  );
  const [emailStatus, setEmailStatus] = useState<{
    type: "success" | "error" | "info";
    text: string;
    details?: string;
  } | null>(null);
  const [pdfDownloadedNotice, setPdfDownloadedNotice] = useState(false);

  const [today, setToday] = useState("01 Nov 2026");

  // Load live DB leads, users, and BOM templates on mount
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );

    // 1. Fetch live leads from PostgreSQL
    fetch("/api/solar/data?resource=leads")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          const dbCustomers: CustomerOption[] = json.data.map((lead: any) => ({
            id: lead.id,
            name: lead.name,
            email: lead.email || `${lead.name.toLowerCase().replace(/[^a-z]/g, "")}@email.com`,
            phone: lead.phone || "+91 99887 76655",
            city: lead.city || "Jaipur",
            address: lead.address || "",
            capacity: lead.capacity,
            gridType: lead.gridType,
          }));

          // Read registered portal users from localStorage
          let portalUsers: CustomerOption[] = [];
          try {
            const rawUsers = localStorage.getItem("all_registered_users");
            if (rawUsers) {
              const parsed = JSON.parse(rawUsers);
              if (Array.isArray(parsed)) {
                portalUsers = parsed.map((u: any) => ({
                  id: `portal-${u.email}`,
                  name: u.name,
                  email: u.email,
                  phone: u.phone || "+91 98765 43210",
                  city: u.city || "Jaipur",
                  address: u.address || "Rooftop Site",
                }));
              }
            }
          } catch {}

          // Combine with seed
          const map = new Map<string, CustomerOption>();
          [...portalUsers, ...dbCustomers, ...initialSeedCustomers].forEach((c) => {
            if (c.email && !map.has(c.email.toLowerCase())) {
              map.set(c.email.toLowerCase(), c);
            }
          });
          setCustomers(Array.from(map.values()));
        }
      })
      .catch((err) => console.warn("Failed to load leads from DB:", err));

    // 2. Fetch BOM templates from PostgreSQL
    fetch("/api/solar/data?resource=bom_templates")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setBomTemplates((prev) => {
            const dbList = json.data.map((t: any) => ({
              capacity: t.capacity,
              gridType: t.gridType,
              items: t.items || [],
            }));
            return dbList.length > 0 ? dbList : prev;
          });
        }
      })
      .catch((err) => console.warn("Failed to load BOM templates from DB:", err));
  }, []);

  // Update default subject whenever customer or quoteId changes
  useEffect(() => {
    setEmailSubject(`☀️ Rooftop Solar Quotation & Bill ${quoteId} - ${customerName}`);
  }, [customerName, quoteId]);

  // Resolve BOM items
  const bomItems: QuotationPdfItem[] = useMemo(() => {
    const exact = bomTemplates.find(
      (t) => t.capacity === selectedCapacity && t.gridType === selectedGrid
    );
    if (exact && exact.items.length > 0) return exact.items;

    const fallbackMap: Record<string, string> = {
      "2 kW": "3 kW",
      "4 kW": "5 kW",
    };
    const fbCap = fallbackMap[selectedCapacity];
    if (fbCap) {
      const fb = bomTemplates.find(
        (t) => t.capacity === fbCap && t.gridType === selectedGrid
      );
      if (fb && fb.items.length > 0) return fb.items;
    }
    return bomTemplates[0]?.items ?? [];
  }, [selectedCapacity, selectedGrid, bomTemplates]);

  // Financial calculations
  const subtotal = useMemo(
    () =>
      bomItems.reduce((acc, item) => acc + (item.quantity || 1) * (item.unitPrice || 0), 0),
    [bomItems]
  );
  const gst = subtotal * 0.138;
  const grandTotal = subtotal + gst;

  // PM Surya Ghar subsidy
  const subsidyAmount = useMemo(() => {
    if (selectedGrid === "Off-Grid") return 0;
    if (selectedCapacity === "1 kW") return 30000;
    if (selectedCapacity === "2 kW") return 60000;
    return 78000; // 3 kW and above get max ₹78,000 under PM Surya Ghar
  }, [selectedCapacity, selectedGrid]);

  const netPayable = Math.max(0, grandTotal - subsidyAmount);

  // Helper for customer selection change
  const handleCustomerSelect = (id: string) => {
    setSelectedCustomerId(id);
    setEmailStatus(null);

    if (id === "custom") {
      setCustomerName("Custom Homeowner");
      setCustomerEmail("");
      setCustomerPhone("+91 ");
      setCustomerCity("Jaipur");
      setCustomerAddress("");
      return;
    }

    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerEmail(found.email);
      setCustomerPhone(found.phone);
      setCustomerCity(found.city);
      if (found.address) setCustomerAddress(found.address);
      if (found.capacity && capacityOptions.includes(found.capacity)) {
        setSelectedCapacity(found.capacity);
      }
      if (found.gridType) {
        setSelectedGrid(found.gridType);
      }
    }
  };

  // Convert & Download PDF handler
  const handleDownloadPdf = () => {
    const pdfData = {
      quoteId,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      capacity: selectedCapacity,
      gridType: selectedGrid,
      date: today,
      validUntil: "15 Days (Firm)",
      bomItems,
      subtotal,
      gst,
      grandTotal,
      subsidyAmount,
      netPayable,
    };

    downloadQuotationPdf(pdfData);
    setPdfDownloadedNotice(true);
    setTimeout(() => setPdfDownloadedNotice(false), 4000);
  };

  // Send Email with PDF attachment handler
  const handleSendEmail = async () => {
    if (!customerEmail || !customerEmail.includes("@")) {
      setEmailStatus({
        type: "error",
        text: "Please provide a valid recipient email address.",
      });
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      const pdfData = {
        quoteId,
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
        customerCity,
        capacity: selectedCapacity,
        gridType: selectedGrid,
        date: today,
        validUntil: "15 Days (Firm)",
        bomItems,
        subtotal,
        gst,
        grandTotal,
        subsidyAmount,
        netPayable,
      };

      // 1. Generate client-side vector PDF base64 string
      const pdfBase64 = getQuotationPdfBase64(pdfData);

      // 2. Dispatch via Next.js API route to Resend
      const res = await fetch("/api/quotations/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerEmail,
          customerName,
          quoteId,
          capacity: selectedCapacity,
          gridType: selectedGrid,
          hardwareSubtotal: subtotal,
          gst,
          grossTotal: grandTotal,
          subsidy: subsidyAmount,
          netPayable,
          bomItems,
          customMessage: emailMessage,
          pdfBase64,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEmailStatus({
          type: "success",
          text: `Quotation & official PDF bill dispatched to ${customerEmail}!`,
          details: data.messageId ? `Resend Message ID: ${data.messageId}` : undefined,
        });

        // Add to saved quotations list
        const newEntry: SavedQuotation = {
          id: quoteId,
          customer: customerName,
          email: customerEmail,
          capacity: selectedCapacity,
          gridType: selectedGrid,
          amount: grandTotal,
          date: new Date().toISOString().split("T")[0],
          status: "Sent",
        };
        setSavedQuotes((prev) => [newEntry, ...prev]);

        // Generate next quote ID
        const nextNum = parseInt(quoteId.replace(/\D/g, "")) + 1;
        setQuoteId(`QT-2026-0${nextNum}`);
      } else {
        setEmailStatus({
          type: "error",
          text: data.error || "Unable to send email.",
          details: data.freeTierNotice,
        });
      }
    } catch (err: any) {
      setEmailStatus({
        type: "error",
        text: "Network or server error while dispatching email.",
        details: err?.message,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const statusColor: Record<SavedQuotation["status"], string> = {
    Sent: "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40",
    Accepted: "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40",
    Expired: "bg-[#FEF2F2] text-[#DC2626] border-red-200",
  };

  return (
    <PageShell>
      {/* ── 1. Page Header (Hidden on Print) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <FileTextIcon className="w-6 h-6 text-[#4A355E]" /> Quotation &amp; Automated BOM Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Instant Bill of Materials calculation, client selection, PDF document export &amp; email delivery
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#4A355E]/30 rounded-xl text-xs font-bold card-floating transition flex items-center gap-2 cursor-pointer shadow-xs"
            title="Download vector PDF document"
          >
            <span>📥</span> Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#4A355E]/30 rounded-xl text-xs font-bold card-floating transition flex items-center gap-2 cursor-pointer shadow-xs"
            title="Print clean quotation bill"
          >
            <PrinterIcon className="w-4 h-4 text-[#4A355E]" /> Print Quote
          </button>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEmailStatus(null);
            }}
            className="px-4 py-2 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-bold card-floating transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>✉️</span> Send to Customer
          </button>
        </div>
      </div>

      {pdfDownloadedNotice && (
        <div className="p-3 bg-[#EBF5EC] border border-[#78B77B] text-[#5B965E] rounded-xl text-xs font-bold text-center animate-in fade-in print:hidden shadow-xs">
          ✓ Quotation PDF generated and downloaded successfully as Quotation_{quoteId}_{customerName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf!
        </div>
      )}

      {/* ── 2. Quick Customer & Configuration Section (Hidden on Print) ── */}
      <div className="bg-white rounded-2xl border border-[#EBCED6] p-5 card-floating space-y-4 print:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#333333] uppercase tracking-wider">
            Client Selection &amp; System Configuration
          </h2>
          <span className="text-[11px] font-semibold text-[#4A355E] bg-[#F7EEF2] px-3 py-1 rounded-full border border-[#EBCED6]">
            Ref: {quoteId}
          </span>
        </div>

        {/* Customer Quick Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#666666] uppercase flex items-center justify-between">
              <span>Select Customer (Active Leads / Registered Users)</span>
              <span className="text-[10px] text-[#4A355E] font-medium">{customers.length} available</span>
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
              className="w-full mt-1 px-3.5 py-2.5 bg-white border border-[#EBCED6] rounded-xl text-xs text-[#333333] font-bold focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  👤 {c.name} — {c.city} ({c.email})
                </option>
              ))}
              <option value="custom">✏️ + Custom Customer / Enter Manually</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#666666] uppercase">Customer Name &amp; Contact</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="px-3 py-2 border border-[#EBCED6] rounded-xl text-xs text-[#333333] font-semibold focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
              />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email Address"
                className="px-3 py-2 border border-[#EBCED6] rounded-xl text-xs text-[#333333] font-semibold focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Capacity selection */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#666666] uppercase">Plant Capacity</span>
            <div className="grid grid-cols-5 gap-2">
              {capacityOptions.map((cap) => {
                const selected = selectedCapacity === cap;
                return (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setSelectedCapacity(cap)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center border cursor-pointer ${
                      selected
                        ? "bg-[#4A355E] text-white border-[#4A355E] card-floating shadow-xs"
                        : "bg-[#F7EEF2] text-[#333333] border-[#EBCED6] hover:bg-[#FAF4F7]"
                    }`}
                  >
                    {cap}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Type Selection */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#666666] uppercase">System Architecture</span>
            <div className="grid grid-cols-2 gap-2">
              {gridOptions.map((opt) => {
                const selected = selectedGrid === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedGrid(opt.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                      selected
                        ? opt.value === "On-Grid"
                          ? "bg-[#78B77B] text-white border-[#78B77B] card-floating shadow-xs"
                          : "bg-[#F4B860] text-[#333333] border-[#F4B860] card-floating shadow-xs"
                        : "bg-[#F7EEF2] text-[#666666] border-[#EBCED6] hover:bg-gray-100"
                    }`}
                  >
                    <span>{opt.value === "On-Grid" ? "🔌" : "🔋"}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. FORMAL QUOTATION BILL DOCUMENT (Printed and Exported) ── */}
      <div
        id="printable-quotation-bill"
        className="printable-quote-bill bg-white rounded-2xl border-2 border-[#4A355E]/20 p-6 sm:p-8 card-floating space-y-6"
      >
        {/* Letterhead Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-[#4A355E]/40 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#DA9B40] rounded-xl flex items-center justify-center text-xl shadow-xs">
                ☀️
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#4A355E] tracking-tight">
                  SunPower Solutions Pvt. Ltd.
                </h2>
                <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                  MNRE Channel Partner &amp; Rooftop Solar Turnkey EPC
                </p>
              </div>
            </div>
            <p className="text-xs text-[#555555] mt-2">
              Plot 42, Solar Park Road, Industrial Area Phase-1, Jaipur 302013, Rajasthan
            </p>
            <p className="text-xs text-[#555555]">
              GSTIN: <strong>08AAACS1234F1Z5</strong> • CIN: U40106RJ2026PTC099881
            </p>
            <p className="text-xs text-[#555555]">
              Phone: +91 141 289900 • Email: billing@sunpower.com • Web: www.sunpower.com
            </p>
          </div>

          <div className="sm:text-right flex flex-col sm:items-end">
            <span className="px-3 py-1 bg-[#F7EEF2] text-[#4A355E] font-mono text-xs font-extrabold rounded-lg border border-[#6D5284]/30">
              QUOTE REF: {quoteId}
            </span>
            <p className="text-xs text-[#333333] font-bold mt-2">
              Issue Date: <span className="font-semibold text-[#666666]">{today}</span>
            </p>
            <p className="text-xs text-[#DA9B40] font-bold">
              Validity: 15 Days (Price Firm)
            </p>
            <p className="text-[11px] text-[#666666] mt-0.5">
              Sales Engineer: <strong>Rohit Meena</strong>
            </p>

            <div className="flex items-center gap-2 mt-3 print:hidden">
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-1 bg-[#DA9B40] hover:bg-[#c48733] text-white text-[11px] font-bold rounded-lg cursor-pointer shadow-xs flex items-center gap-1"
              >
                📥 Download PDF
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEmailStatus(null);
                }}
                className="px-3 py-1 bg-[#4A355E] hover:bg-[#372447] text-white text-[11px] font-bold rounded-lg cursor-pointer shadow-xs flex items-center gap-1"
              >
                ✉️ Send via Email
              </button>
            </div>
          </div>
        </div>

        {/* Bill To & Project Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F7EEF2] p-4 rounded-xl border border-[#EBCED6] text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#4A355E] tracking-wider block">
              QUOTATION TO (CLIENT DETAILS)
            </span>
            <p className="text-base font-extrabold text-[#333333] mt-0.5">{customerName}</p>
            <p className="text-[#666666] mt-0.5">
              Site Location: {customerAddress ? `${customerAddress}, ` : ""}{customerCity}, Rajasthan (JVVNL Discom Area)
            </p>
            <p className="text-[#666666]">
              Contact: {customerPhone} • Email: <strong>{customerEmail || "Not provided"}</strong>
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold uppercase text-[#78B77B] tracking-wider block">
              PROPOSED SYSTEM SPECIFICATIONS
            </span>
            <p className="text-base font-extrabold text-[#333333] mt-0.5">
              {selectedCapacity} {selectedGrid} Solar Power Plant
            </p>
            <p className="text-[#666666] mt-0.5">
              Est. Daily Generation: <strong>~{(parseInt(selectedCapacity) || 3) * 4.3} kWh / Day</strong>
            </p>
            <p className="text-[#5B965E] font-semibold">
              Eligible for PM Surya Ghar DBT Central Subsidy
            </p>
          </div>
        </div>

        {/* Itemized Bill of Materials (BOM) */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h4 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              Itemized Hardware &amp; BOS Component Bill
            </h4>
            <span className="text-[11px] text-[#666666]">
              All items meet MNRE &amp; ALMM compliance standards
            </span>
          </div>

          <table className="w-full text-left text-xs border border-[#EBCED6]">
            <thead className="bg-[#F7EEF2] text-[#333333] font-bold border-b border-[#EBCED6]">
              <tr>
                <th className="px-3 py-2.5 w-10 text-center">#</th>
                <th className="px-3 py-2.5">Component Description</th>
                <th className="px-3 py-2.5">Technical Specification</th>
                <th className="px-3 py-2.5 text-center">Qty</th>
                <th className="px-3 py-2.5 text-right">Unit Rate (₹)</th>
                <th className="px-3 py-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBCED6]">
              {bomItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAF4F7]">
                  <td className="px-3 py-2 text-center text-[#666666] font-mono">{idx + 1}</td>
                  <td className="px-3 py-2 font-bold text-[#333333]">{item.name}</td>
                  <td className="px-3 py-2 text-[#666666]">{item.specification}</td>
                  <td className="px-3 py-2 text-center font-semibold text-[#333333]">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-3 py-2 text-right text-[#666666]">{fmt(item.unitPrice)}</td>
                  <td className="px-3 py-2 text-right font-bold text-[#333333]">
                    ₹{fmt(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#F7EEF2] font-bold border-t-2 border-[#EBCED6]">
              <tr>
                <td colSpan={5} className="px-3 py-2 text-right text-[#666666]">
                  Hardware Subtotal:
                </td>
                <td className="px-3 py-2 text-right font-bold text-[#333333]">₹{fmt(subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={5} className="px-3 py-2 text-right text-[#666666]">
                  GST (Blended 13.8% for Solar Turnkey EPC):
                </td>
                <td className="px-3 py-2 text-right text-[#666666]">₹{fmt(gst)}</td>
              </tr>
              <tr className="border-t border-[#4A355E]/30 bg-[#F7EEF2]">
                <td colSpan={5} className="px-3 py-2.5 text-right font-bold text-[#4A355E]">
                  Gross Project Turnkey Cost (All Inclusive):
                </td>
                <td className="px-3 py-2.5 text-right font-extrabold text-[#4A355E]">
                  ₹{fmt(grandTotal)}
                </td>
              </tr>
              {subsidyAmount > 0 && (
                <tr className="bg-[#EBF5EC] text-[#5B965E]">
                  <td colSpan={5} className="px-3 py-2 text-right font-bold">
                    Less: PM Surya Ghar Central DBT Subsidy (Credited Directly to Customer Bank):
                  </td>
                  <td className="px-3 py-2 text-right font-extrabold text-[#5B965E]">
                    - ₹{fmt(subsidyAmount)}
                  </td>
                </tr>
              )}
              <tr className="bg-[#4A355E] text-white text-sm">
                <td colSpan={5} className="px-3 py-3 text-right font-extrabold uppercase tracking-wide">
                  Net Customer Out-of-Pocket Cost (Final Payable):
                </td>
                <td className="px-3 py-3 text-right font-black text-base">
                  ₹{fmt(netPayable)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Commercial Terms & Warranties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#EBCED6] pt-4 text-xs text-[#555555]">
          <div>
            <h5 className="font-bold text-[#333333] uppercase text-[11px] mb-1">
              Warranty Guarantees
            </h5>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li><strong>Solar PV Modules:</strong> 25-Year Linear Power Warranty (&lt;0.5% yearly degradation).</li>
              <li><strong>Inverter &amp; Protection:</strong> 5-Year Comprehensive Warranty with ₹0 replacement.</li>
              <li><strong>Galvanized Structure:</strong> 5-Year Rust &amp; Structural Wind Resilience (150 km/h).</li>
              <li><strong>Workmanship &amp; EPC:</strong> 5-Year Free Service &amp; Annual Preventive Maintenance.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#333333] uppercase text-[11px] mb-1">
              Commercial &amp; Payment Terms
            </h5>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li><strong>Payment Schedule:</strong> 50% advance on PO, 50% on hardware installation &amp; testing.</li>
              <li><strong>Net-Metering:</strong> JVVNL / Discom liaisoning &amp; bi-directional meter managed by us.</li>
              <li><strong>Govt. Subsidy:</strong> National Solar Portal documentation uploaded within 48h of grid sync.</li>
              <li><strong>Validity:</strong> Prices firm for 15 days from quote generation date.</li>
            </ul>
          </div>
        </div>

        {/* Signature & Acceptance Block */}
        <div className="grid grid-cols-2 gap-8 border-t-2 border-[#EBCED6] pt-6 mt-4 text-xs">
          <div>
            <p className="font-bold text-[#333333]">For SunPower Solutions Pvt. Ltd.</p>
            <div className="h-14 flex items-end">
              <span className="text-[10px] text-[#4A355E] font-mono font-bold italic">
                [Digitally Signed by Sales Director]
              </span>
            </div>
            <p className="border-t border-[#333333] pt-1 font-semibold text-[#555555]">
              Authorized Signatory &amp; Stamp
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <p className="font-bold text-[#333333]">Customer Acceptance</p>
            <div className="h-14 flex items-end">
              <span className="text-[10px] text-gray-400 italic">Signature &amp; Date</span>
            </div>
            <p className="border-t border-[#333333] pt-1 font-semibold text-[#555555] w-48 text-right">
              {customerName}
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. Saved Quotations Table (Hidden on Print) ── */}
      <div className="bg-white rounded-2xl border border-[#EBCED6] card-floating overflow-hidden print:hidden">
        <div className="px-5 py-3.5 border-b border-[#EBCED6] bg-[#F7EEF2] flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Recent Client Quotations &amp; Dispatches
          </h3>
          <span className="text-[11px] text-[#666666]">
            Total: {savedQuotes.length} quotes generated
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF4F7] text-[#666666] font-semibold border-b border-[#EBCED6]">
              <tr>
                <th className="px-4 py-2.5">Quote ID</th>
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Capacity</th>
                <th className="px-4 py-2.5">Grid Type</th>
                <th className="px-4 py-2.5 text-right">Amount (₹)</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBCED6]/60">
              {savedQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-[#FAF4F7] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#4A355E]">{q.id}</td>
                  <td className="px-4 py-3 font-semibold text-[#333333]">{q.customer}</td>
                  <td className="px-4 py-3 text-[#666666]">{q.email}</td>
                  <td className="px-4 py-3 text-[#333333]">{q.capacity}</td>
                  <td className="px-4 py-3 text-[#666666]">{q.gridType}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#333333]">₹{fmt(q.amount)}</td>
                  <td className="px-4 py-3 text-[#666666] font-mono text-[11px]">{q.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor[q.status]}`}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. INTERACTIVE MODAL: SEND TO CUSTOMER (Customer Selection, Invoice Bill Preview, PDF Download & Email) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#EBCED6] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#4A355E] to-[#372447] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#DA9B40] flex items-center justify-center text-sm font-bold shadow-xs">
                  ✉️
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">
                    Send Solar Quotation &amp; Invoice Bill
                  </h3>
                  <p className="text-[11px] text-[#F7EEF2]/80">
                    Select customer, verify invoice bill, convert to PDF and dispatch via email
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#333333]">
              {/* Status Message */}
              {emailStatus && (
                <div
                  className={`p-3.5 rounded-xl border font-medium ${
                    emailStatus.type === "success"
                      ? "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]"
                      : "bg-[#FEF2F2] text-[#DC2626] border-red-200"
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    <span>{emailStatus.type === "success" ? "✓" : "⚠️"}</span>
                    <span>{emailStatus.text}</span>
                  </p>
                  {emailStatus.details && (
                    <p className="text-[11px] mt-1 opacity-90 font-normal">
                      {emailStatus.details}
                    </p>
                  )}
                </div>
              )}

              {/* Step 1: Customer Selection */}
              <div className="bg-[#FAF4F7] p-4 rounded-2xl border border-[#EBCED6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase text-[#4A355E] tracking-wider">
                    Step 1: Select Customer
                  </span>
                  <span className="text-[10px] text-[#666666]">
                    Pre-fills customer invoice &amp; delivery email
                  </span>
                </div>

                <div>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBCED6] rounded-xl text-xs text-[#333333] font-bold focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none cursor-pointer"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        👤 {c.name} — {c.city} ({c.email})
                      </option>
                    ))}
                    <option value="custom">✏️ + Custom Customer / Enter Details</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-[#666666] uppercase">Customer Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full mt-0.5 px-3 py-1.5 bg-white border border-[#EBCED6] rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#4A355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#666666] uppercase">Recipient Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full mt-0.5 px-3 py-1.5 bg-white border border-[#EBCED6] rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#4A355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#666666] uppercase">Phone / Contact</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full mt-0.5 px-3 py-1.5 bg-white border border-[#EBCED6] rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#4A355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#666666] uppercase">City / State</label>
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full mt-0.5 px-3 py-1.5 bg-white border border-[#EBCED6] rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#4A355E]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Invoice Bill Summary & System Configuration */}
              <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase text-[#4A355E] tracking-wider">
                    Step 2: Customer Invoice Bill &amp; System Spec
                  </span>
                  <span className="font-mono text-[11px] text-[#4A355E] font-bold bg-[#F7EEF2] px-2 py-0.5 rounded-md">
                    {quoteId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FAF4F7] p-2.5 rounded-xl border border-[#EBCED6]">
                    <span className="text-[10px] font-bold text-[#666666] uppercase block">Plant Capacity</span>
                    <select
                      value={selectedCapacity}
                      onChange={(e) => setSelectedCapacity(e.target.value)}
                      className="w-full mt-1 bg-white border border-[#EBCED6] rounded-lg text-xs font-bold p-1"
                    >
                      {capacityOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-[#FAF4F7] p-2.5 rounded-xl border border-[#EBCED6]">
                    <span className="text-[10px] font-bold text-[#666666] uppercase block">Grid Architecture</span>
                    <select
                      value={selectedGrid}
                      onChange={(e) => setSelectedGrid(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-[#EBCED6] rounded-lg text-xs font-bold p-1"
                    >
                      <option value="On-Grid">🔌 On-Grid (Govt. Subsidy Eligible)</option>
                      <option value="Off-Grid">🔋 Off-Grid (Battery Storage)</option>
                    </select>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="bg-gradient-to-br from-[#FAF4F7] to-[#F7EEF2] rounded-xl p-3 border border-[#EBCED6] space-y-1.5">
                  <div className="flex justify-between text-[#666666]">
                    <span>Hardware &amp; BOS Subtotal:</span>
                    <span className="font-bold text-[#333333]">₹{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#666666]">
                    <span>Blended GST (13.8%):</span>
                    <span className="font-bold text-[#333333]">₹{fmt(gst)}</span>
                  </div>
                  <div className="flex justify-between text-[#4A355E] font-bold pt-1 border-t border-[#EBCED6]">
                    <span>Gross Turnkey EPC Cost:</span>
                    <span className="font-extrabold">₹{fmt(grandTotal)}</span>
                  </div>
                  {subsidyAmount > 0 && (
                    <div className="flex justify-between text-[#5B965E] font-bold">
                      <span>Less: PM Surya Ghar Central DBT Subsidy:</span>
                      <span>- ₹{fmt(subsidyAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-[#4A355E] text-white p-2.5 rounded-lg mt-2 font-bold">
                    <span className="text-[11px] uppercase tracking-wide">Net Customer Out-of-Pocket Payable:</span>
                    <span className="text-sm font-black text-[#DA9B40]">₹{fmt(netPayable)}</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Change / Convert to PDF */}
              <div className="bg-[#FAF4F7] p-4 rounded-2xl border border-[#EBCED6] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase text-[#4A355E] tracking-wider">
                    Step 3: Convert Bill to PDF Document
                  </span>
                  <span className="text-[10px] font-bold text-[#78B77B] bg-[#EBF5EC] px-2 py-0.5 rounded-md border border-[#78B77B]/30">
                    ✓ PDF Engine Ready
                  </span>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Generate a clean, high-resolution vector PDF invoice bill with SunPower letterhead, itemized components, GSTIN, and digital authorization.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border-2 border-[#4A355E] rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>📥</span> Convert &amp; Download PDF (Client-Side)
                  </button>
                  <span className="text-[10px] text-[#666666] italic">
                    Generates Quotation_{quoteId}_{customerName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf
                  </span>
                </div>
              </div>

              {/* Step 4: Dispatch via Email */}
              <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase text-[#4A355E] tracking-wider">
                    Step 4: Dispatch to Customer via Email
                  </span>
                  <span className="text-[10px] text-[#4A355E] font-semibold bg-[#F7EEF2] px-2 py-0.5 rounded-md">
                    Powered by Resend API
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Email Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full mt-0.5 px-3 py-1.5 border border-[#EBCED6] rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#4A355E]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Personal Note to Customer</label>
                  <textarea
                    rows={3}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    className="w-full mt-0.5 px-3 py-1.5 border border-[#EBCED6] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#4A355E]"
                    placeholder="Enter personal note..."
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#4A355E] bg-[#FAF4F7] p-2.5 rounded-xl border border-[#EBCED6]">
                  <span>📎</span>
                  <span className="font-semibold">
                    The official generated PDF bill will be automatically attached to this email.
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#F7EEF2] border-t border-[#EBCED6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-white text-[#666666] hover:text-[#333333] border border-[#EBCED6] rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Close
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-[#FAF4F7] text-[#4A355E] border border-[#4A355E]/40 rounded-xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>📥</span> Save PDF
                </button>
                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={handleSendEmail}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Dispatching Email...</span>
                    </>
                  ) : (
                    <>
                      <span>✉️</span>
                      <span>Send Quotation &amp; Bill via Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
