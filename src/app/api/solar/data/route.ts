import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Helper to convert snake_case DB columns to camelCase for TypeScript frontend
function toCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamel);
  }
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    const newObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const camelKey = key.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
      let val = obj[key];

      // Convert PostgreSQL NUMERIC string representations to numbers where appropriate
      if (
        typeof val === "string" &&
        !isNaN(Number(val)) &&
        [
          "monthly_bill",
          "roof_area",
          "total_amount",
          "advance_paid",
          "balance_due",
          "purchase_price",
          "unit_cost",
          "estimated_cost",
          "actual_cost",
          "subsidy_amount",
          "rating",
          "customer_price",
          "total_cost",
        ].includes(key)
      ) {
        val = Number(val);
      }

      // Parse JSONB if it arrives as string
      if (typeof val === "string" && (key === "items" || key === "todays_jobs" || key === "certifications")) {
        try {
          val = JSON.parse(val);
        } catch {}
      }

      newObj[camelKey] = toCamel(val);
    }
    return newObj;
  }
  return obj;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource") || "all";

  try {
    if (resource === "leads") {
      const res = await query("SELECT * FROM leads ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "orders") {
      const res = await query("SELECT * FROM orders ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "inventory") {
      const res = await query("SELECT * FROM inventory ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "warranties") {
      const res = await query("SELECT * FROM warranties ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "tickets" || resource === "service_tickets") {
      const res = await query("SELECT * FROM service_tickets ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "subsidies") {
      const res = await query("SELECT * FROM subsidies ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "technicians") {
      const res = await query("SELECT * FROM technicians ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "bom_templates") {
      const res = await query("SELECT * FROM bom_templates ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "user_logs") {
      const res = await query("SELECT * FROM user_logs ORDER BY timestamp DESC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    if (resource === "customer_enquiries") {
      const res = await query("SELECT * FROM customer_enquiries ORDER BY id ASC;");
      return NextResponse.json({ source: "postgresql", count: res.rowCount, data: toCamel(res.rows) });
    }

    // Overview of all key tables
    const [leadsRes, ordersRes, invRes, warRes, tktRes, subRes, techRes] = await Promise.all([
      query("SELECT * FROM leads ORDER BY id ASC;"),
      query("SELECT * FROM orders ORDER BY id ASC;"),
      query("SELECT * FROM inventory ORDER BY id ASC;"),
      query("SELECT * FROM warranties ORDER BY id ASC;"),
      query("SELECT * FROM service_tickets ORDER BY id ASC;"),
      query("SELECT * FROM subsidies ORDER BY id ASC;"),
      query("SELECT * FROM technicians ORDER BY id ASC;"),
    ]);

    return NextResponse.json({
      source: "postgresql",
      database: "solar_db",
      leads: toCamel(leadsRes.rows),
      orders: toCamel(ordersRes.rows),
      inventory: toCamel(invRes.rows),
      warranties: toCamel(warRes.rows),
      tickets: toCamel(tktRes.rows),
      subsidies: toCamel(subRes.rows),
      technicians: toCamel(techRes.rows),
    });
  } catch (err: any) {
    console.error("[PostgreSQL Query API Error]:", err.message);
    return NextResponse.json(
      {
        source: "error",
        error: err.message,
        data: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resource, data } = body;

    if (resource === "leads" && data) {
      const id = data.id || `LD-${Date.now().toString().slice(-4)}`;
      const res = await query(
        `INSERT INTO leads (
          id, name, phone, email, address, city, monthly_bill, roof_area,
          roof_type, grid_type, capacity, stage, source, assigned_to, notes, created_at, subsidy_eligible
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING *;`,
        [
          id,
          data.name || "Anonymous",
          data.phone || "",
          data.email || "",
          data.address || "",
          data.city || "Jaipur",
          data.monthlyBill || 0,
          data.roofArea || 0,
          data.roofType || "RCC Flat",
          data.gridType || "On-Grid",
          data.capacity || "3 kW",
          data.stage || "New Lead",
          data.source || "Website",
          data.assignedTo || "Amit Kumar",
          data.notes || "",
          data.createdAt || new Date().toISOString().split("T")[0],
          data.subsidyEligible ?? true,
        ]
      );
      return NextResponse.json({ success: true, lead: toCamel(res.rows[0]) });
    }

    if (resource === "orders" && data) {
      const id = data.id || `ORD-${Date.now().toString().slice(-4)}`;
      const res = await query(
        `INSERT INTO orders (
          id, lead_id, customer_name, phone, address, capacity, grid_type,
          total_amount, advance_paid, balance_due, status, payment_status,
          dispatch_date, install_date, assigned_technician, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING *;`,
        [
          id,
          data.leadId || "",
          data.customerName || "",
          data.phone || "",
          data.address || "",
          data.capacity || "3 kW",
          data.gridType || "On-Grid",
          data.totalAmount || 0,
          data.advancePaid || 0,
          data.balanceDue || 0,
          data.status || "Confirmed",
          data.paymentStatus || "Advance Paid",
          data.dispatchDate || "",
          data.installDate || "",
          data.assignedTechnician || "Rohit Meena",
          data.createdAt || new Date().toISOString().split("T")[0],
        ]
      );
      return NextResponse.json({ success: true, order: toCamel(res.rows[0]) });
    }

    return NextResponse.json({ error: "Unsupported resource or missing data" }, { status: 400 });
  } catch (err: any) {
    console.error("[PostgreSQL Insert API Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
