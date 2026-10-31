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
});

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
    const techDirectory: Record<string, { name: string; email: string; phone: string }> = {
      "TECH-001": { name: "Rohit Meena", email: "rohit.m@sunpower.com", phone: "+91 98765 11111" },
      "TECH-002": { name: "Amit Kumar", email: "amit.k@sunpower.com", phone: "+91 98765 22222" },
      "TECH-003": { name: "Suresh Yadav", email: "suresh.y@sunpower.com", phone: "+91 98765 33333" },
      "TECH-004": { name: "Sonia Verma", email: "sonia.v@sunpower.com", phone: "+91 98765 44444" },
    };

    const techInfo = techDirectory[techId] || techDirectory["TECH-001"];
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
