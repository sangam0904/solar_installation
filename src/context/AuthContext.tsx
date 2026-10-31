"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { recordUserLogin } from "@/data/userLogs";

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
  loginAsTechnician: (techId: string, customEmail?: string) => void;
  loginAsCustomer: (identifier: string, customEmail?: string) => void;
  loginWithOtp: (email: string, role: UserRole, customName?: string) => void;
  resetPassword: (email: string, newPassword: string) => void;
  getUserPassword: (email: string) => string;
  loginWithGoogle: () => void;
  logout: () => void;
  updateProfilePhoto: (photo: string) => void;
}

const defaultAdmin: User = {
  id: "ADM-001",
  name: "Rajendra Rathore (Director)",
  email: "admin@sunpower.com",
  role: "admin",
  avatar: "admin",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultAdmin,
  role: "admin",
  loginAsAdmin: () => {},
  loginAsTechnician: () => {},
  loginAsCustomer: () => {},
  loginWithOtp: () => {},
  resetPassword: () => {},
  getUserPassword: () => "••••••••",
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
  "TECH-017": { name: "Manish Rawat", email: "manish.r@sunpower.com", phone: "+91 98765 18181", specialization: "Rooftop Anchor & Waterproofing Specialist" },
  "TECH-018": { name: "Kavita Gurjar", email: "kavita.g@sunpower.com", phone: "+91 98765 19191", specialization: "Solar PV Performance Auditor" },
  "TECH-019": { name: "Dharmendra Yadav", email: "dharmendra.y@sunpower.com", phone: "+91 98765 20202", specialization: "Battery Storage Integration Engineer" },
  "TECH-020": { name: "Priyanka Meena", email: "priyanka.m@sunpower.com", phone: "+91 98765 21212", specialization: "Net-Metering Liaison & Substation Officer" },
  "TECH-021": { name: "Sandeep Verma", email: "sandeep.v@sunpower.com", phone: "+91 98765 23232", specialization: "Micro-Grid & Hybrid System Expert" },
  "TECH-022": { name: "Govind Kumawat", email: "govind.k@sunpower.com", phone: "+91 98765 24242", specialization: "High-Voltage AC Combiner Tech" },
  "TECH-023": { name: "Asha Pareek", email: "asha.p@sunpower.com", phone: "+91 98765 25252", specialization: "Drone Roof Profiling & Shading Analyst" },
  "TECH-024": { name: "Sunil Chauhan", email: "sunil.c@sunpower.com", phone: "+91 98765 26262", specialization: "Inverter PCB & Capacitor Repair Tech" },
  "TECH-025": { name: "Lokesh Bairwa", email: "lokesh.b@sunpower.com", phone: "+91 98765 27272", specialization: "Lightning Surge & SPD Protection Lead" },
  "TECH-026": { name: "Rekha Sen", email: "rekha.s@sunpower.com", phone: "+91 98765 28282", specialization: "Commercial Rooftop Safety Lead" },
  "TECH-027": { name: "Bharat Singh", email: "bharat.s@sunpower.com", phone: "+91 98765 29292", specialization: "Industrial HT Substation Engineer" },
  "TECH-028": { name: "Devendra Joshi", email: "devendra.j@sunpower.com", phone: "+91 98765 30303", specialization: "Rapid Response Breakdown Engineer" },
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
      avatar: "admin",
    };
    saveUser(adminUser);
    recordUserLogin({
      name: adminUser.name,
      email: adminUser.email,
      role: "admin",
      loginMethod: "Email & Password",
    });
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      id: "ADM-GOOGLE",
      name: "Rajendra Rathore (Google Workspace)",
      email: "rajendra@sunpower.com",
      role: "admin",
      avatar: "google",
    };
    saveUser(googleUser);
    recordUserLogin({
      name: googleUser.name,
      email: googleUser.email,
      role: "admin",
      loginMethod: "Google Workspace SSO",
    });
  };

  const loginAsTechnician = (techId: string, customEmail?: string) => {
    const techInfo = ALL_16_EMPLOYEES[techId] || ALL_16_EMPLOYEES["TECH-001"];
    const effectiveEmail = customEmail || techInfo.email;
    const techUser: User = {
      id: techId,
      techId,
      name: techInfo.name,
      email: effectiveEmail,
      phone: techInfo.phone,
      role: "technician",
      avatar: "technician",
    };
    saveUser(techUser);
    recordUserLogin({
      name: techInfo.name,
      email: effectiveEmail,
      role: "technician",
      loginMethod: "Staff PIN & Email",
    });
  };

  const loginAsCustomer = (identifier: string, customEmail?: string) => {
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
    const effectiveEmail = customEmail || (identifier.includes("@") ? identifier : custInfo.email);
    const custUser: User = {
      id: `CUST-${key.toUpperCase()}`,
      customerId: `CUST-${key.toUpperCase()}`,
      name: custInfo.name,
      email: effectiveEmail,
      phone: custInfo.phone,
      customerOrder: custInfo.order,
      systemDetails: custInfo.system,
      role: "customer",
      avatar: "customer",
    };
    saveUser(custUser);
    recordUserLogin({
      name: custInfo.name,
      email: effectiveEmail,
      role: "customer",
      loginMethod: identifier.includes("@") ? "Direct Email Sign-in" : "Email & OTP Sign-in",
    });
  };

  const loginWithOtp = (email: string, targetRole: UserRole, customName?: string) => {
    let name = customName;
    let userId = "";
    let customerOrder: string | undefined;
    let systemDetails: string | undefined;
    let isNewUser = false;

    if (targetRole === "admin") {
      name = name || "Rajendra Rathore (Director)";
      userId = "ADM-001";
    } else if (targetRole === "technician") {
      const match = Object.entries(ALL_16_EMPLOYEES).find(
        ([, tech]) => tech.email.toLowerCase() === email.toLowerCase()
      );
      if (match) {
        userId = match[0];
        name = match[1].name;
      } else {
        userId = "TECH-001";
        name = name || "Field Operations Technician";
      }
    } else {
      // Customer lookup
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

      const match = Object.entries(customerDirectory).find(
        ([, cust]) => cust.email.toLowerCase() === email.toLowerCase()
      );

      if (match) {
        userId = `CUST-${match[0].toUpperCase()}`;
        name = match[1].name;
        customerOrder = match[1].order;
        systemDetails = match[1].system;
      } else {
        // Brand new registered user!
        isNewUser = true;
        const parsedName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        userId = `CUST-NEW-${Math.floor(100 + Math.random() * 900)}`;
        name = parsedName || "Solar Customer";
        customerOrder = "ORD-NEW";
        systemDetails = "3 kW Residential Solar";
      }
    }

    const authUser: User = {
      id: userId,
      name: name || "Authorized User",
      email,
      role: targetRole,
      avatar: targetRole,
      customerOrder,
      systemDetails,
    };

    saveUser(authUser);
    recordUserLogin({
      name: authUser.name,
      email: authUser.email,
      role: targetRole,
      loginMethod: isNewUser ? "New User Email OTP Registration" : "Email OTP Sign-In",
    });
  };

  const resetPassword = (email: string, newPassword: string) => {
    try {
      const saved = JSON.parse(localStorage.getItem("sunpower_user_passwords") || "{}");
      saved[email.toLowerCase().trim()] = newPassword;
      localStorage.setItem("sunpower_user_passwords", JSON.stringify(saved));
    } catch {}
  };

  const getUserPassword = (email: string) => {
    try {
      const saved = JSON.parse(localStorage.getItem("sunpower_user_passwords") || "{}");
      return saved[email.toLowerCase().trim()] || "••••••••";
    } catch {
      return "••••••••";
    }
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
        loginWithOtp,
        resetPassword,
        getUserPassword,
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
