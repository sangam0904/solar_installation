import jsPDF from "jspdf";

export interface QuotationPdfItem {
  name: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface QuotationPdfData {
  quoteId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerCity?: string;
  capacity: string;
  gridType: "On-Grid" | "Off-Grid";
  date: string;
  validUntil?: string;
  bomItems: QuotationPdfItem[];
  subtotal: number;
  gst: number;
  grandTotal: number;
  subsidyAmount: number;
  netPayable: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export function buildQuotationPdfDoc(data: QuotationPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primary: [number, number, number] = [74, 53, 94];     // #4A355E
  const secondary: [number, number, number] = [218, 155, 64]; // #DA9B40
  const lightBg: [number, number, number] = [250, 244, 247];   // #FAF4F7
  const borderCol: [number, number, number] = [235, 206, 214]; // #EBCED6
  const textDark: [number, number, number] = [51, 51, 51];
  const textMuted: [number, number, number] = [102, 102, 102];
  const greenCol: [number, number, number] = [91, 150, 94];

  // ── 1. Top Header Banner ──
  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SunPower Solutions Pvt. Ltd.", 14, 13);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondary);
  doc.text("MNRE Channel Partner & Rooftop Solar Turnkey EPC", 14, 19);

  doc.setFontSize(7.5);
  doc.setTextColor(230, 230, 230);
  doc.text("GSTIN: 08AAACS1234F1Z5  |  CIN: U40106RJ2026PTC099881  |  Jaipur, Rajasthan", 14, 26);
  doc.text("Phone: +91 141 289900  |  billing@sunpower.com  |  www.sunpower.com", 210 - 14, 26, { align: "right" });

  // Quote Ref Badge in Banner
  doc.setFillColor(...secondary);
  doc.roundedRect(210 - 54, 8, 40, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(data.quoteId || "QT-2026-088", 210 - 34, 14.5, { align: "center" });

  // ── 2. Bill To & System Spec Box ──
  let y = 37;
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...borderCol);
  doc.roundedRect(14, y, 182, 27, 2, 2, "FD");

  // Client Details (Left)
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text("QUOTATION ISSUED TO (CLIENT DETAILS):", 18, y + 6);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text(data.customerName || "Valued Client", 18, y + 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textMuted);
  const city = data.customerCity ? `${data.customerCity}, Rajasthan` : "Jaipur, Rajasthan";
  const address = data.customerAddress ? `${data.customerAddress}, ${city}` : `${city} (JVVNL Discom Area)`;
  doc.text(`Site Location: ${address.substring(0, 55)}`, 18, y + 17);
  doc.text(`Phone: ${data.customerPhone || "+91 99887 76655"}  |  Email: ${data.customerEmail || "client@solar.com"}`, 18, y + 22);

  // System Spec (Right)
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text("PROPOSED SYSTEM ARCHITECTURE:", 120, y + 6);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text(`${data.capacity} ${data.gridType} Rooftop Plant`, 120, y + 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textMuted);
  doc.text(`Issue Date: ${data.date || "31 Oct 2026"}  |  Valid: ${data.validUntil || "15 Days"}`, 120, y + 17);
  doc.setTextColor(...greenCol);
  doc.setFont("helvetica", "bold");
  doc.text("PM Surya Ghar Central Subsidy Eligible", 120, y + 22);

  // ── 3. Itemized Bill of Materials (BOM) Table ──
  y = 69;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text("ITEMIZED HARDWARE & BOS COMPONENT BILL", 14, y);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textMuted);
  doc.text("All components MNRE & ALMM Compliant", 210 - 14, y, { align: "right" });

  y += 3;
  // Table Header
  doc.setFillColor(...primary);
  doc.rect(14, y, 182, 7, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("#", 17, y + 5);
  doc.text("Component Description", 24, y + 5);
  doc.text("Technical Specification", 85, y + 5);
  doc.text("Qty", 137, y + 5, { align: "center" });
  doc.text("Rate (Rs.)", 162, y + 5, { align: "right" });
  doc.text("Total (Rs.)", 192, y + 5, { align: "right" });

  y += 7;

  // Table Rows (render max 10 items cleanly on single page)
  const items = data.bomItems.slice(0, 10);
  items.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 250, isEven ? 255 : 244, isEven ? 255 : 247);
    doc.rect(14, y, 182, 6.5, "F");

    doc.setDrawColor(...borderCol);
    doc.line(14, y + 6.5, 196, y + 6.5);

    doc.setTextColor(...textMuted);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(String(idx + 1), 17, y + 4.5);

    doc.setTextColor(...textDark);
    doc.setFont("helvetica", "bold");
    doc.text(item.name.substring(0, 32), 24, y + 4.5);

    doc.setTextColor(...textMuted);
    doc.setFont("helvetica", "normal");
    doc.text(item.specification.substring(0, 30), 85, y + 4.5);

    doc.setTextColor(...textDark);
    doc.text(`${item.quantity} ${item.unit}`, 137, y + 4.5, { align: "center" });
    doc.text(fmt(item.unitPrice), 162, y + 4.5, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text(fmt(item.quantity * item.unitPrice), 192, y + 4.5, { align: "right" });

    y += 6.5;
  });

  // ── 4. Financial Calculation Summary ──
  y += 3;

  // Hardware Subtotal
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textMuted);
  doc.text("Hardware Subtotal:", 145, y + 4, { align: "right" });
  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${fmt(data.subtotal)}`, 192, y + 4, { align: "right" });

  // GST
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textMuted);
  doc.text("GST (Turnkey EPC Blended 13.8%):", 145, y + 4, { align: "right" });
  doc.setTextColor(...textDark);
  doc.text(`Rs. ${fmt(data.gst)}`, 192, y + 4, { align: "right" });

  // Gross Turnkey Cost
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text("Gross Turnkey EPC Cost:", 145, y + 4, { align: "right" });
  doc.text(`Rs. ${fmt(data.grandTotal)}`, 192, y + 4, { align: "right" });

  // Subsidy Deduction if applicable
  if (data.subsidyAmount > 0) {
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...greenCol);
    doc.text("Less: PM Surya Ghar DBT Central Subsidy:", 145, y + 4, { align: "right" });
    doc.text(`- Rs. ${fmt(data.subsidyAmount)}`, 192, y + 4, { align: "right" });
  }

  // Net Customer Payable (Highlight Box)
  y += 7;
  doc.setFillColor(...primary);
  doc.roundedRect(80, y, 116, 11, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("NET CUSTOMER OUT-OF-POCKET PAYABLE:", 84, y + 7);
  doc.setFontSize(11);
  doc.text(`Rs. ${fmt(data.netPayable)}`, 192, y + 7.5, { align: "right" });

  // ── 5. Warranties & Guarantees (Left Box) ──
  const bottomY = y + 16;
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...borderCol);
  doc.roundedRect(14, bottomY, 86, 32, 2, 2, "FD");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text("OFFICIAL WARRANTY & TERMS", 18, bottomY + 6);

  doc.setFontSize(6.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textDark);
  doc.text("- 25-Year Linear Power Warranty on Solar PV Modules", 18, bottomY + 11);
  doc.text("- 5-Year Comprehensive Warranty on Inverter & BOS", 18, bottomY + 16);
  doc.text("- 5-Year Structural Wind Resilience (up to 150 km/h)", 18, bottomY + 21);
  doc.text("- Net-Metering Liaison & PM Surya Ghar Subsidy Support", 18, bottomY + 26);

  // ── 6. Signatures (Right Box) ──
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderCol);
  doc.roundedRect(108, bottomY, 88, 32, 2, 2, "FD");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text("AUTHORIZATION & ACCEPTANCE", 112, bottomY + 6);

  doc.setFontSize(6.8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...primary);
  doc.text("[Digitally Verified - SunPower Solutions EPC]", 112, bottomY + 15);
  doc.setDrawColor(...textDark);
  doc.line(112, bottomY + 18, 150, bottomY + 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textMuted);
  doc.text("Authorized Signatory", 112, bottomY + 22);

  doc.line(156, bottomY + 18, 192, bottomY + 18);
  doc.text("Customer Signature", 156, bottomY + 22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text(data.customerName.substring(0, 18), 156, bottomY + 26);

  // ── 7. Footer ──
  doc.setFontSize(6.5);
  doc.setTextColor(...textMuted);
  doc.setFont("helvetica", "normal");
  doc.text(
    "SunPower Solutions Pvt. Ltd. • Plot 42, Solar Park Road, Jaipur 302013 • Reg: MNRE-RAJ-2026-9021 • Generated electronically",
    105,
    290,
    { align: "center" }
  );

  return doc;
}

export function downloadQuotationPdf(data: QuotationPdfData) {
  const doc = buildQuotationPdfDoc(data);
  const filename = `Quotation_${data.quoteId || "QT-2026-088"}_${(data.customerName || "Customer").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  doc.save(filename);
}

export function getQuotationPdfBase64(data: QuotationPdfData): string {
  const doc = buildQuotationPdfDoc(data);
  const dataUri = doc.output("datauristring");
  return dataUri.includes(",") ? dataUri.split(",")[1] : dataUri;
}
