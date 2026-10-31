"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "technician" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  profilePhoto?: string;
  techId?: string;
  customerId?: string;
  customerOrder?: string;
  systemDetails?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loginAsAdmin: (email?: string) => void;
  loginAsTechnician: (techId: string) => void;
  loginAsCustomer: (identifier: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  updateProfilePhoto: (photo: string) => void;
}

const defaultAdmin: User = {
  id: "ADM-001",
  name: "Rajendra Rathore (Director)",
  email: "admin@sunpower.com",
  role: "admin",
  avatar: "👑",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultAdmin,
  role: "admin",
  loginAsAdmin: () => {},
  loginAsTechnician: () => {},
  loginAsCustomer: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
  updateProfilePhoto: () => {},
});

export const ALL_16_EMPLOYEES: Record<string, { name: string; email: string; phone: string; specialization: string }> = {
  "TECH-001": { name: "Rohit Meena", email: "rohit.m@sunpower.com", phone: "+91 98765 11111", specialization: "Lead Installation & Commissioning Engineer" },
  "TECH-002": { name: "Amit Kumar", email: "amit.k@sunpower.com", phone: "+91 98765 22222", specialization: "Rooftop Survey & Tilt Analysis Specialist" },
  "TECH-003": { name: "Suresh Yadav", email: "suresh.y@sunpower.com", phone: "+91 98765 33333", specialization: "Off-Grid & Lithium Battery Specialist" },
  "TECH-004": { name: "Sonia Verma", email: "sonia.v@sunpower.com", phone: "+91 98765 44444", specialization: "Electrical Quality & Pre-Sales Inspector" },
  "TECH-005": { name: "Vikram Rathore", email: "vikram.r@sunpower.com", phone: "+91 98765 55555", specialization: "High-Voltage String Inverter Specialist" },
  "TECH-006": { name: "Manoj Sharma", email: "manoj.s@sunpower.com", phone: "+91 98765 66666", specialization: "Earthing Pit & Lightning Arrestor Tech" },
  "TECH-007": { name: "Deepak Saini", email: "deepak.s@sunpower.com", phone: "+91 98765 77777", specialization: "Galvanized Structure Mounting Lead" },
  "TECH-008": { name: "Pooja Choudhary", email: "pooja.c@sunpower.com", phone: "+91 98765 88888", specialization: "Discom Net-Metering & Grid Sync Engineer" },
  "TECH-009": { name: "Rajesh Gurjar", email: "rajesh.g@sunpower.com", phone: "+91 98765 99999", specialization: "Solar DC Cabling & Combiner Box Tech" },
  "TECH-010": { name: "Ankit Tiwari", email: "ankit.t@sunpower.com", phone: "+91 98765 10101", specialization: "Micro-Inverter & AC DB Wiring Tech" },
  "TECH-011": { name: "Sunita Meena", email: "sunita.m@sunpower.com", phone: "+91 98765 12121", specialization: "Safety Compliance & Quality Assurance" },
  "TECH-012": { name: "Rakesh Prajapat", email: "rakesh.p@sunpower.com", phone: "+91 98765 13131", specialization: "Commercial & Industrial Plant Crew" },
  "TECH-013": { name: "Tarun Bhati", email: "tarun.b@sunpower.com", phone: "+91 98765 14141", specialization: "Preventive Maintenance & Deep Cleaning" },
  "TECH-014": { name: "Neha Khandelwal", email: "neha.k@sunpower.com", phone: "+91 98765 15151", specialization: "Inverter Telemetry & Firmware Diagnostics" },
  "TECH-015": { name: "Harish Jangid", email: "harish.j@sunpower.com", phone: "+91 98765 16161", specialization: "Emergency Breakdown Fast Response" },
  "TECH-016": { name: "Vikas Shekhawat", email: "vikas.s@sunpower.com", phone: "+91 98765 17171", specialization: "Final Grid Testing & Handover Lead" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultAdmin);

  // Restore saved auth session
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("sunpower_auth_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem("sunpower_auth_user", JSON.stringify(u));
      } else {
        localStorage.removeItem("sunpower_auth_user");
      }
    } catch {
      // Ignore
    }
  };

  const updateProfilePhoto = (photo: string) => {
    if (!user) return;
    const updated = { ...user, profilePhoto: photo };
    saveUser(updated);
  };

  const loginAsAdmin = (email = "admin@sunpower.com") => {
    const adminUser: User = {
      id: "ADM-001",
      name: "Rajendra Rathore (Director)",
      email,
      role: "admin",
      avatar: "👑",
    };
    saveUser(adminUser);
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      id: "ADM-GOOGLE",
      name: "Rajendra Rathore (Google Workspace)",
      email: "rajendra@sunpower.com",
      role: "admin",
      avatar: "🌐",
    };
    saveUser(googleUser);
  };

  const loginAsTechnician = (techId: string) => {
    const techInfo = ALL_16_EMPLOYEES[techId] || ALL_16_EMPLOYEES["TECH-001"];
    const techUser: User = {
      id: techId,
      techId,
      name: techInfo.name,
      email: techInfo.email,
      phone: techInfo.phone,
      role: "technician",
      avatar: "👷",
    };
    saveUser(techUser);
  };

  const loginAsCustomer = (identifier: string) => {
    const customerDirectory: Record<string, { name: string; email: string; phone: string; order: string; system: string }> = {
      "rajesh": {
        name: "Rajesh Gupta",
        email: "rajesh.gupta@email.com",
        phone: "+91 99887 76655",
        order: "ORD-003",
        system: "5 kW On-Grid System",
      },
      "mohan": {
        name: "Mohan Lal",
        email: "mohan.lal@email.com",
        phone: "+91 77665 54433",
        order: "ORD-005",
        system: "3 kW On-Grid System",
      },
      "kavita": {
        name: "Kavita Joshi",
        email: "kavita.j@email.com",
        phone: "+91 43210 98765",
        order: "ORD-001",
        system: "3 kW Off-Grid System",
      },
      "arjun": {
        name: "Arjun Mehta",
        email: "arjun.m@email.com",
        phone: "+91 54321 09876",
        order: "ORD-002",
        system: "4 kW On-Grid System",
      },
    };

    const key = Object.keys(customerDirectory).find((k) =>
      identifier.toLowerCase().includes(k) || customerDirectory[k].phone.includes(identifier)
    ) || "rajesh";

    const custInfo = customerDirectory[key];
    const custUser: User = {
      id: `CUST-${key.toUpperCase()}`,
      customerId: `CUST-${key.toUpperCase()}`,
      name: custInfo.name,
      email: custInfo.email,
      phone: custInfo.phone,
      customerOrder: custInfo.order,
      systemDetails: custInfo.system,
      role: "customer",
      avatar: "👤",
    };
    saveUser(custUser);
  };

  const logout = () => {
    saveUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : "admin",
        loginAsAdmin,
        loginAsTechnician,
        loginAsCustomer,
        loginWithGoogle,
        logout,
        updateProfilePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
