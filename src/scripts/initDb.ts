import { Client } from "pg";
import fs from "fs";
import path from "path";
import {
  ALL_28_TECHNICIANS,
  MASSIVE_LEADS,
  MASSIVE_ORDERS,
  MASSIVE_SERVICE_TICKETS,
  MASSIVE_WARRANTIES,
  MASSIVE_SUBSIDIES,
  MASSIVE_INVENTORY,
  MASSIVE_ENQUIRIES,
  MASSIVE_USER_LOGS,
} from "./massiveData";
import { bomTemplates } from "./seedData";

export async function runDatabaseInit(connectionString?: string) {
  const dbUrl =
    connectionString ||
    process.env.DATABASE_URL ||
    "postgresql://postgres:2226@localhost:5432/solar_db";

  console.log("============================================================");
  console.log("🚀 STARTING SUNPOWER POSTGRESQL MASSIVE DATA SEEDING");
  console.log(`🎯 Target Connection: ${dbUrl.replace(/:[^:@]+@/, ":****@")}`);
  console.log("============================================================");

  // Parse connection info to connect to server admin db first
  const parsed = new URL(dbUrl);
  const targetDbName = parsed.pathname.replace(/^\//, "") || "solar_db";
  const serverAdminUrl = `${parsed.protocol}//${parsed.username}:${parsed.password}@${parsed.host}/postgres`;

  // 1. Ensure target database exists
  console.log(`\n[Step 1/4] Checking if database "${targetDbName}" exists on PostgreSQL server...`);
  const adminClient = new Client({ connectionString: serverAdminUrl });
  try {
    await adminClient.connect();
    const checkDb = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [targetDbName]
    );
    if (checkDb.rows.length === 0) {
      console.log(`✨ Database "${targetDbName}" does not exist. Creating now...`);
      await adminClient.query(`CREATE DATABASE "${targetDbName}";`);
      console.log(`✅ Database "${targetDbName}" created successfully.`);
    } else {
      console.log(`✅ Database "${targetDbName}" already exists.`);
    }
  } catch (err: any) {
    console.warn(`[Notice]: Admin connect note (${err.message}). Proceeding directly with target DB.`);
  } finally {
    try {
      await adminClient.end();
    } catch {}
  }

  // 2. Connect to the target solar_db database
  console.log(`\n[Step 2/4] Connecting to "${targetDbName}" to build tables & schema...`);
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  console.log(`✅ Connected to PostgreSQL ${dbUrl.split("@")[1]}`);

  // 3. Execute schema.sql
  console.log(`\n[Step 3/4] Running schema definitions (src/lib/schema.sql)...`);
  const schemaPath = path.join(process.cwd(), "src", "lib", "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  await client.query(schemaSql);
  console.log(`✅ 10 relational tables and search indexes successfully initialized!`);

  // Truncate existing data to cleanly reseed the massive dataset
  console.log(`Cleaning old data for a fresh hackathon showcase dataset...`);
  try {
    await client.query(`
      TRUNCATE TABLE leads, orders, inventory, warranties, service_tickets, subsidies, technicians, bom_templates, user_logs, customer_enquiries CASCADE;
    `);
  } catch (e: any) {
    console.warn("Truncate note:", e.message);
  }

  // 4. Seed all massive data
  console.log(`\n[Step 4/4] Migrating massive hackathon showcase data into PostgreSQL...`);

  // A. Technicians (28 Field Technicians with active jobs)
  for (const tech of ALL_28_TECHNICIANS) {
    const todaysJobs = [
      {
        orderId: `ORD-00${(parseInt(tech.id.replace(/\D/g, "")) % 8) + 1}`,
        customerName: "Rajesh Gupta",
        address: "12, Vaishali Nagar, Jaipur",
        capacity: "5 kW On-Grid System",
        type: "Service",
        timeSlot: "10:00 AM - 12:30 PM",
        status: "In Progress",
      },
      {
        orderId: `ORD-01${(parseInt(tech.id.replace(/\D/g, "")) % 6) + 1}`,
        customerName: "Mohan Lal",
        address: "67, Mansarovar, Jaipur",
        capacity: "3 kW On-Grid System",
        type: "Installation",
        timeSlot: "02:00 PM - 05:00 PM",
        status: "Pending",
      },
    ];

    await client.query(
      `INSERT INTO technicians (
        id, name, phone, specialization, status, rating, completed_jobs, todays_jobs,
        email, role, experience_years, completed_installs, active_jobs, certifications, location, vehicle_number
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (id) DO UPDATE SET rating = EXCLUDED.rating;`,
      [
        tech.id, tech.name, tech.phone, tech.specialization, tech.status, tech.rating,
        tech.completedJobs, JSON.stringify(todaysJobs), tech.email, tech.role,
        5, tech.completedJobs, 2, JSON.stringify(["MNRE Certified Grid Engineer", "Discom Level-2 Safety"]),
        tech.location, tech.vehicleNumber
      ]
    );
  }
  console.log(`  ✓ Inserted ${ALL_28_TECHNICIANS.length} Field Technicians (28 Crew Members)`);

  // B. Leads (45 Leads)
  for (const l of MASSIVE_LEADS) {
    await client.query(
      `INSERT INTO leads (
        id, name, phone, email, address, city, monthly_bill, roof_area, roof_type, grid_type,
        capacity, stage, source, assigned_to, notes, created_at, subsidy_eligible,
        sanctioned_load, system_type, status, priority, estimated_cost, next_follow_up
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
      ON CONFLICT (id) DO UPDATE SET stage = EXCLUDED.stage;`,
      [
        l.id, l.name, l.phone, l.email, l.address, l.city, l.monthlyBill, l.roofArea,
        l.roofType, l.gridType, l.capacity, l.stage, l.source, l.assignedTo, l.notes,
        l.createdAt, l.subsidyEligible, l.sanctionedLoad, l.systemType, l.status,
        l.priority, l.estimatedCost, l.nextFollowUp
      ]
    );
  }
  console.log(`  ✓ Inserted ${MASSIVE_LEADS.length} Leads`);

  // C. Orders (42 Orders)
  for (const o of MASSIVE_ORDERS) {
    await client.query(
      `INSERT INTO orders (
        id, lead_id, customer_name, phone, address, capacity, grid_type,
        total_amount, advance_paid, balance_due, status, payment_status,
        dispatch_date, install_date, assigned_technician, tech_id, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
      [
        o.id, o.leadId, o.customerName, o.phone, o.address, o.capacity, o.gridType,
        o.totalAmount, o.advancePaid, o.balanceDue, o.status, o.paymentStatus,
        o.dispatchDate, o.installDate, o.assignedTechnician, o.techId, o.createdAt
      ]
    );
  }
  console.log(`  ✓ Inserted ${MASSIVE_ORDERS.length} Orders`);

  // D. Service Tickets (30 Active & Pending Cases)
  for (const t of MASSIVE_SERVICE_TICKETS) {
    await client.query(
      `INSERT INTO service_tickets (
        id, customer_id, customer_name, phone, address, serial_number,
        product_name, issue_type, description, priority, status, warranty_status,
        assigned_technician, tech_id, estimated_cost, actual_cost, created_at, resolved_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
      [
        t.id, t.customerId, t.customerName, t.phone, t.address, t.serialNumber,
        t.productName, t.issueType, t.description, t.priority, t.status, t.warrantyStatus,
        t.assignedTechnician, t.techId, t.estimatedCost, t.actualCost, t.createdAt, t.resolvedAt
      ]
    );
  }
  console.log(`  ✓ Inserted ${MASSIVE_SERVICE_TICKETS.length} Service Tickets (Active & Pending Cases)`);

  // E. Warranties (42 Warranties)
  for (const w of MASSIVE_WARRANTIES) {
    await client.query(
      `INSERT INTO warranties (
        id, serial_number, product_name, category, customer_name, customer_id,
        phone, order_id, install_date, warranty_years, expiry_date, status, claim_count, address, invoice_number
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
      [
        w.id, w.serialNumber, w.productName, w.category, w.customerName, w.customerId,
        w.phone, w.orderId, w.installDate, w.warrantyYears, w.expiryDate, w.status, w.claimCount, w.address, w.invoiceNumber
      ]
    );
  }
  console.log(`  ✓ Inserted ${MASSIVE_WARRANTIES.length} Warranties`);

  // F. Subsidies (32 Subsidies)
  for (const s of MASSIVE_SUBSIDIES) {
    await client.query(
      `INSERT INTO subsidies (
        id, customer_name, order_id, capacity, subsidy_amount, application_number,
        discom_name, aadhaar_verified, electricity_bill_verified, discom_approval,
        mnre_approval, disbursement_status, applied_date, approval_date, credit_date
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (id) DO UPDATE SET disbursement_status = EXCLUDED.disbursement_status;`,
      [
        s.id, s.customerName, s.orderId, s.capacity, s.subsidyAmount, s.applicationNumber,
        s.discomName, s.aadhaarVerified, s.electricityBillVerified, s.discomApproval,
        s.mnreApproval, s.disbursementStatus, s.appliedDate, s.approvalDate, s.creditDate
      ]
    );
  }
  console.log(`  ✓ Inserted ${MASSIVE_SUBSIDIES.length} Subsidy Claims`);

  // G. Inventory (40 Items)
  for (const i of MASSIVE_INVENTORY) {
    await client.query(
      `INSERT INTO inventory (
        id, name, category, serial_number, specification, status,
        linked_order, linked_customer, warranty_years, warranty_start,
        warranty_end, purchase_price, supplier, location
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
      [
        i.id, i.name, i.category, i.serialNumber, i.specification, i.status,
        i.linkedOrder, i.linkedCustomer, i.warrantyYears, i.warrantyStart,
        i.warrantyEnd, i.purchasePrice, i.supplier, i.location
      ]
    );
  }
  console.log(`  ✓ Inserted ${MASSIVE_INVENTORY.length} Inventory Items`);

  // H. BOM Templates
  for (const b of bomTemplates) {
    const id = `${b.capacity.replace(/\s+/g, "").toLowerCase()}_${b.gridType.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
    const totalCost = b.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const customerPrice = Math.round(totalCost * 1.25);
    await client.query(
      `INSERT INTO bom_templates (id, capacity, grid_type, total_cost, customer_price, items)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET total_cost = EXCLUDED.total_cost;`,
      [id, b.capacity, b.gridType, totalCost, customerPrice, JSON.stringify(b.items)]
    );
  }
  console.log(`  ✓ Inserted ${bomTemplates.length} BOM Templates`);

  // I. User Access Logs (35 Logs)
  for (const log of MASSIVE_USER_LOGS) {
    await client.query(
      `INSERT INTO user_logs (id, name, email, role, login_method, timestamp, formatted_time, ip_address, device, location, status, is_new)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO NOTHING;`,
      [
        log.id, log.name, log.email, log.role, log.login_method,
        log.timestamp, log.formatted_time, log.ip_address, log.device, log.location, log.status, log.is_new
      ]
    );
  }
  console.log(`  ✓ Inserted ${MASSIVE_USER_LOGS.length} User Login Logs`);

  // J. Customer Enquiries (25 Enquiries)
  for (const enq of MASSIVE_ENQUIRIES) {
    await client.query(
      `INSERT INTO customer_enquiries (id, customer_name, phone, address, system_type, subject, message, priority, status, attached_photo, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO NOTHING;`,
      [
        enq.id, enq.customer_name, enq.phone, enq.address, enq.system_type,
        enq.subject, enq.message, enq.priority, enq.status, enq.attached_photo, enq.created_at
      ]
    );
  }
  console.log(`  ✓ Inserted ${MASSIVE_ENQUIRIES.length} Customer Enquiries`);

  // Summary counts verification
  const countQueries = [
    { table: "leads", label: "Leads (CRM Pipeline)" },
    { table: "orders", label: "Orders (Warehouse & Dispatch)" },
    { table: "inventory", label: "Inventory (Barcode Serials)" },
    { table: "warranties", label: "Warranties (20-Year Registry)" },
    { table: "service_tickets", label: "Service Tickets (Breakdowns & Active Cases)" },
    { table: "subsidies", label: "Subsidies (PM Surya Ghar)" },
    { table: "technicians", label: "Technicians (Field Operations 28 Crew)" },
    { table: "bom_templates", label: "BOM Templates" },
    { table: "user_logs", label: "User Access Audit Logs" },
    { table: "customer_enquiries", label: "Customer Enquiries & Floating Alerts" },
  ];

  console.log("\n============================================================");
  console.log("📊 POSTGRESQL DATABASE RECORD COUNTS SUMMARY");
  console.log("============================================================");

  const summary: Record<string, number> = {};
  for (const q of countQueries) {
    const res = await client.query(`SELECT count(*)::int as cnt FROM ${q.table};`);
    const count = res.rows[0].cnt;
    summary[q.table] = count;
    console.log(`  • ${q.label.padEnd(42)} : ${count} rows`);
  }

  await client.end();
  console.log("============================================================");
  console.log("🎉 MASSIVE POSTGRESQL DATASET READY FOR HACKATHON SHOWCASE!");
  console.log("============================================================\n");

  return { success: true, summary };
}
