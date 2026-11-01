import { NextResponse } from "next/server";
import { sendEmailViaResend, EmailAttachment } from "@/lib/resendEmail";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      to,
      customerName = "Valued Customer",
      quoteId = "QT-2026-088",
      capacity = "3 kW",
      gridType = "On-Grid",
      hardwareSubtotal = 0,
      gst = 0,
      grossTotal = 0,
      subsidy = 0,
      netPayable = 0,
      bomItems = [],
      customMessage = "",
      pdfBase64 = "",
    } = body;

    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid recipient email address is required." },
        { status: 400 }
      );
    }

    const cleanFilename = `Quotation_${quoteId}_${customerName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

    const attachments: EmailAttachment[] = [];
    if (pdfBase64 && typeof pdfBase64 === "string") {
      // Strip data URI prefix if present
      const base64Data = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;
      attachments.push({
        filename: cleanFilename,
        content: base64Data,
      });
    }

    // Build rich HTML email
    const bomRowsHtml = Array.isArray(bomItems) && bomItems.length > 0
      ? bomItems
          .map(
            (item: any, idx: number) => `
          <tr style="border-bottom: 1px solid #FAF4F7;">
            <td style="padding: 10px 12px; font-size: 13px; color: #666666; text-align: center;">${idx + 1}</td>
            <td style="padding: 10px 12px; font-size: 13px; font-weight: 600; color: #333333;">
              ${item.name || "Solar Component"}
              <div style="font-size: 11px; color: #888888; font-weight: normal;">${item.specification || ""}</div>
            </td>
            <td style="padding: 10px 12px; font-size: 13px; text-align: center; color: #333333;">${item.quantity || 1} ${item.unit || "Nos"}</td>
            <td style="padding: 10px 12px; font-size: 13px; text-align: right; font-weight: 600; color: #333333;">${formatCurrency((item.quantity || 1) * (item.unitPrice || 0))}</td>
          </tr>`
          )
          .join("")
      : `<tr><td colspan="4" style="padding: 12px; font-size: 13px; color: #888888; text-align: center;">Standard ${capacity} ${gridType} Turnkey Solar System Package</td></tr>`;

    const customMessageHtml = customMessage
      ? `
      <div style="margin-top: 20px; padding: 14px 18px; background-color: #FAF4F7; border-left: 4px solid #4A355E; border-radius: 8px;">
        <p style="margin: 0; font-size: 13px; color: #4A355E; font-style: italic;">
          "${customMessage.replace(/"/g, "&quot;")}"
        </p>
      </div>`
      : "";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Solar Quotation &amp; Bill</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF4F7; margin: 0; padding: 24px; color: #333333;">
  <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EBCED6; overflow: hidden; box-shadow: 0 4px 20px rgba(74, 53, 94, 0.08);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4A355E 0%, #372447 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
      <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: #DA9B40; border-radius: 12px; font-size: 24px; margin-bottom: 12px;">☀️</div>
      <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">SunPower Solutions</h1>
      <p style="margin: 0; font-size: 12px; color: #F7EEF2; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">
        MNRE Authorized Turnkey Solar EPC
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #FAF4F7; padding-bottom: 16px;">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: #666666; text-transform: uppercase;">Quotation Prepared For</span>
          <h2 style="margin: 4px 0 0 0; font-size: 18px; font-weight: 700; color: #333333;">${customerName}</h2>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; padding: 4px 10px; background-color: #F7EEF2; color: #4A355E; font-size: 11px; font-weight: 700; border-radius: 6px; font-family: monospace;">
            ${quoteId}
          </span>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #888888;">Validity: 15 Days</p>
        </div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #555555; margin-top: 18px;">
        Thank you for choosing <strong>SunPower Solutions</strong> for your clean energy transition. Below is the itemized quotation and formal invoice bill for your <strong>${capacity} ${gridType} Rooftop Solar Power Plant</strong>.
      </p>

      ${customMessageHtml}

      <!-- Highlights Card -->
      <div style="margin: 22px 0; background: linear-gradient(135deg, #F7EEF2 0%, #FAF4F7 100%); border-radius: 12px; padding: 18px; border: 1px solid #EBCED6;">
        <table style="width: 100%; font-size: 13px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 6px 0; color: #666666;">System Capacity:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #4A355E;">${capacity}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666;">Grid Architecture:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #333333;">${gridType}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666;">Turnkey Gross Amount:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #333333;">${formatCurrency(grossTotal)}</td>
          </tr>
          ${
            subsidy > 0
              ? `<tr>
            <td style="padding: 6px 0; color: #5B965E; font-weight: 600;">PM Surya Ghar DBT Subsidy:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #5B965E;">- ${formatCurrency(subsidy)}</td>
          </tr>`
              : ""
          }
          <tr style="border-top: 2px dashed #EBCED6;">
            <td style="padding: 12px 0 4px 0; font-size: 15px; font-weight: 800; color: #4A355E;">Net Customer Payable:</td>
            <td style="padding: 12px 0 4px 0; text-align: right; font-size: 18px; font-weight: 800; color: #4A355E;">${formatCurrency(netPayable)}</td>
          </tr>
        </table>
      </div>

      <!-- Itemized BOM summary -->
      <div style="margin-top: 24px;">
        <h3 style="margin: 0 0 10px 0; font-size: 12px; font-weight: 800; color: #333333; text-transform: uppercase; letter-spacing: 0.5px;">
          Hardware &amp; Installation Bill of Materials
        </h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #FAF4F7; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #F7EEF2; color: #4A355E; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 8px 12px; text-align: center; width: 30px;">#</th>
              <th style="padding: 8px 12px; text-align: left;">Component</th>
              <th style="padding: 8px 12px; text-align: center; width: 60px;">Qty</th>
              <th style="padding: 8px 12px; text-align: right; width: 100px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${bomRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Warranty & Guarantees -->
      <div style="margin-top: 24px; padding: 16px; background-color: #FAF4F7; border-radius: 10px; font-size: 12px; color: #555555; line-height: 1.6;">
        <strong style="color: #4A355E; display: block; margin-bottom: 6px;">🛡️ Guaranteed Protections:</strong>
        • 25-Year Linear Power Warranty on Solar PV Modules<br>
        • 5-Year Comprehensive Warranty on Inverter &amp; Switchgear<br>
        • 5-Year Structural Wind Resilience (up to 150 km/h)<br>
        • Full Net-Metering Liaison &amp; PM Surya Ghar Portal Support
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <p style="font-size: 12px; color: #888888; margin-bottom: 6px;">
          ${attachments.length > 0 ? "📎 The official signed PDF Quotation Bill is attached to this email." : ""}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #FAF4F7; padding: 20px 24px; border-top: 1px solid #EBCED6; text-align: center; font-size: 11px; color: #888888; line-height: 1.5;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #4A355E;">SunPower Solutions Pvt. Ltd.</p>
      <p style="margin: 0;">Plot 42, Solar Park Road, Industrial Area Phase-1, Jaipur, Rajasthan 302013</p>
      <p style="margin: 2px 0 0 0;">Phone: +91 141 289900 • Email: billing@sunpower.com • GSTIN: 08AAACS1234F1Z5</p>
    </div>
  </div>
</body>
</html>
`;

    const subject = `☀️ Solar Quotation ${quoteId} for ${customerName} (${capacity} ${gridType})`;

    const emailResult = await sendEmailViaResend({
      to,
      subject,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || "Failed to dispatch email",
          freeTierNotice: emailResult.freeTierNotice,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: emailResult.id,
      recipient: to,
      quoteId,
      customerName,
      hasAttachment: attachments.length > 0,
      deliveredAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Send Quotation Email Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
