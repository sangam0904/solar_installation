-- ============================================================
-- SUNPOWER SOLAR MANAGEMENT PLATFORM - POSTGRESQL SCHEMA
-- ============================================================

-- 1. LEADS TABLE (CRM PIPELINE)
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100) DEFAULT 'Jaipur',
    monthly_bill NUMERIC(12,2) DEFAULT 0,
    roof_area NUMERIC(10,2) DEFAULT 0,
    roof_type VARCHAR(100),
    grid_type VARCHAR(50) DEFAULT 'On-Grid',
    capacity VARCHAR(50),
    stage VARCHAR(50) DEFAULT 'New Lead',
    source VARCHAR(50) DEFAULT 'Website',
    assigned_to VARCHAR(100),
    notes TEXT,
    created_at VARCHAR(50),
    subsidy_eligible BOOLEAN DEFAULT TRUE,
    sanctioned_load VARCHAR(50),
    system_type VARCHAR(50),
    status VARCHAR(50),
    priority VARCHAR(50) DEFAULT 'Medium',
    estimated_cost NUMERIC(12,2) DEFAULT 0,
    next_follow_up VARCHAR(50)
);

-- 2. BOM TEMPLATES (BILL OF MATERIALS)
CREATE TABLE IF NOT EXISTS bom_templates (
    id VARCHAR(50) PRIMARY KEY,
    capacity VARCHAR(50) NOT NULL,
    grid_type VARCHAR(50) NOT NULL,
    total_cost NUMERIC(12,2) DEFAULT 0,
    customer_price NUMERIC(12,2) DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    lead_id VARCHAR(50),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    capacity VARCHAR(50) NOT NULL,
    grid_type VARCHAR(50) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    advance_paid NUMERIC(12,2) DEFAULT 0,
    balance_due NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Confirmed',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    dispatch_date VARCHAR(50),
    install_date VARCHAR(50),
    assigned_technician VARCHAR(100),
    tech_id VARCHAR(50),
    photo_proof_url TEXT,
    photo_proof_name VARCHAR(255),
    created_at VARCHAR(50)
);

-- 4. INVENTORY TABLE (BARCODE SERIALS & WAREHOUSE)
CREATE TABLE IF NOT EXISTS inventory (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    specification TEXT,
    status VARCHAR(50) DEFAULT 'In Stock',
    linked_order VARCHAR(50),
    linked_customer VARCHAR(255),
    warranty_years INT DEFAULT 5,
    warranty_start VARCHAR(50),
    warranty_end VARCHAR(50),
    purchase_price NUMERIC(12,2) DEFAULT 0,
    supplier VARCHAR(255),
    location VARCHAR(255),
    brand VARCHAR(100),
    model VARCHAR(100),
    batch_number VARCHAR(100),
    barcode VARCHAR(100)
);

-- 5. WARRANTIES TABLE (20-25 YEAR REGISTRY)
CREATE TABLE IF NOT EXISTS warranties (
    id VARCHAR(50) PRIMARY KEY,
    serial_number VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_id VARCHAR(50),
    phone VARCHAR(50) NOT NULL,
    order_id VARCHAR(50),
    install_date VARCHAR(50),
    warranty_years INT NOT NULL,
    expiry_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    claim_count INT DEFAULT 0,
    address TEXT,
    invoice_number VARCHAR(100)
);

-- 6. SERVICE TICKETS TABLE (BREAKDOWNS & REPAIRS)
CREATE TABLE IF NOT EXISTS service_tickets (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    serial_number VARCHAR(100),
    product_name VARCHAR(255),
    issue_type VARCHAR(100) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'High',
    status VARCHAR(50) DEFAULT 'Open',
    warranty_status VARCHAR(50) DEFAULT 'Under Warranty',
    assigned_technician VARCHAR(100),
    tech_id VARCHAR(50),
    photo_proof_url TEXT,
    photo_proof_name VARCHAR(255),
    estimated_cost NUMERIC(12,2) DEFAULT 0,
    actual_cost NUMERIC(12,2) DEFAULT 0,
    created_at VARCHAR(50),
    resolved_at VARCHAR(50)
);

-- 7. SUBSIDIES TABLE (PM SURYA GHAR DBT TRACKER)
CREATE TABLE IF NOT EXISTS subsidies (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    order_id VARCHAR(50),
    capacity VARCHAR(50),
    subsidy_amount NUMERIC(12,2) DEFAULT 0,
    application_number VARCHAR(100),
    discom_name VARCHAR(100) DEFAULT 'JVVNL',
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    electricity_bill_verified BOOLEAN DEFAULT FALSE,
    discom_approval VARCHAR(50) DEFAULT 'Pending',
    mnre_approval VARCHAR(50) DEFAULT 'Pending',
    disbursement_status VARCHAR(50) DEFAULT 'Not Applied',
    applied_date VARCHAR(50),
    approval_date VARCHAR(50),
    credit_date VARCHAR(50),
    phone VARCHAR(50),
    discom VARCHAR(100),
    consumer_number VARCHAR(100),
    remarks TEXT
);

-- 8. TECHNICIANS TABLE (FIELD OPERATIONS TEAM)
CREATE TABLE IF NOT EXISTS technicians (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    specialization VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Available',
    rating NUMERIC(3,2) DEFAULT 4.8,
    completed_jobs INT DEFAULT 0,
    todays_jobs JSONB DEFAULT '[]'::jsonb,
    email VARCHAR(255),
    role VARCHAR(100),
    experience_years INT DEFAULT 3,
    completed_installs INT DEFAULT 0,
    active_jobs INT DEFAULT 0,
    certifications JSONB DEFAULT '[]'::jsonb,
    location VARCHAR(100),
    vehicle_number VARCHAR(50)
);

-- 9. USER LOGIN LOGS TABLE (AUDIT & ACCESS TRAIL)
CREATE TABLE IF NOT EXISTS user_logs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    login_method VARCHAR(100) NOT NULL,
    timestamp VARCHAR(100) NOT NULL,
    formatted_time VARCHAR(50),
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    device VARCHAR(255),
    location VARCHAR(100) DEFAULT 'Jaipur, Rajasthan',
    status VARCHAR(50) DEFAULT 'Success',
    is_new BOOLEAN DEFAULT FALSE
);

-- 10. CUSTOMER ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS customer_enquiries (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    system_type VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'Normal',
    status VARCHAR(50) DEFAULT 'New Enquiry',
    attached_photo TEXT,
    created_at VARCHAR(100)
);

-- INDEXES FOR INSTANT QUERIES
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads (stage);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_lead ON orders (lead_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory (category);
CREATE INDEX IF NOT EXISTS idx_inventory_serial ON inventory (serial_number);
CREATE INDEX IF NOT EXISTS idx_warranties_serial ON warranties (serial_number);
CREATE INDEX IF NOT EXISTS idx_warranties_order ON warranties (order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON service_tickets (status);
CREATE INDEX IF NOT EXISTS idx_subsidies_status ON subsidies (disbursement_status);
CREATE INDEX IF NOT EXISTS idx_user_logs_email ON user_logs (email);
