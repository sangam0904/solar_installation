"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";

export interface AppNotification {
  id: number | string;
  recipientId?: string;
  recipientRole?: "admin" | "technician" | "customer";
  text: string;
  time: string;
  type?: "lead" | "alert" | "success" | "info" | "task" | "complaint";
}

const defaultAdminNotifications: AppNotification[] = [
  { id: "init-1", recipientRole: "admin", text: "New lead from website: Deepak Agarwal (5 kW)", time: "2 min ago", type: "lead" },
  { id: "init-2", recipientRole: "admin", text: "Inverter E-04 error reported by Sanjay Tiwari", time: "15 min ago", type: "alert" },
  { id: "init-3", recipientRole: "admin", text: "Subsidy ₹78,000 credited for Mohan Lal", time: "1 hour ago", type: "success" },
  { id: "init-4", recipientRole: "admin", text: "Roof survey scheduled for Vikram Singh", time: "2 hours ago", type: "info" },
];

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { isNavOpen, toggleNav } = useNav();
  const { user, role, logout } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sunpower_notifications");
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore
      }
    }
    return defaultAdminNotifications;
  });

  // Reload notifications when role changes or window focuses
  useEffect(() => {
    const loadNotifs = () => {
      try {
        const saved = localStorage.getItem("sunpower_notifications");
        if (saved) {
          setNotifications(JSON.parse(saved));
        }
      } catch {
        // Ignore
      }
    };

    loadNotifs();
    window.addEventListener("focus", loadNotifs);
    return () => window.removeEventListener("focus", loadNotifs);
  }, [role, user]);

  // Filter notifications relevant to current logged-in role & technician ID
  const relevantNotifications = notifications.filter((n) => {
    if (role === "admin") {
      // Admin sees admin notifications and general alerts
      return !n.recipientRole || n.recipientRole === "admin" || !n.recipientId;
    }
    if (role === "technician") {
      // Technician sees tasks assigned to them or general crew notices
      if (user?.techId && n.recipientId) {
        return n.recipientId === user.techId;
      }
      return n.recipientRole === "technician" || !n.recipientRole;
    }
    if (role === "customer") {
      return n.recipientRole === "customer" || !n.recipientRole;
    }
    return true;
  });

  const handleClearNotifications = () => {
    const remaining = notifications.filter((n) => !relevantNotifications.some((rn) => rn.id === n.id));
    setNotifications(remaining);
    try {
      localStorage.setItem("sunpower_notifications", JSON.stringify(remaining));
    } catch {
      // Ignore
    }
    setShowNotifications(false);
  };

  return (
    <header className="h-14 bg-white border-b border-[#E4E7EB] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-xs">
      {/* Left Side: Navbar Toggle + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Navbar Open/Close Hamburger Toggle */}
        <button
          onClick={toggleNav}
          className="p-1.5 rounded-lg text-[#666666] hover:text-[#734960] hover:bg-[#F5F7FA] border border-[#E4E7EB] transition-colors flex items-center justify-center flex-shrink-0"
          title={isNavOpen ? "Collapse Navbar (◀)" : "Expand Navbar (▶)"}
          aria-label="Toggle Navigation Bar"
        >
          <span className="text-base font-bold leading-none">
            {isNavOpen ? "◀" : "☰"}
          </span>
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder={
              role === "technician"
                ? "Search my assigned site tasks..."
                : role === "customer"
                ? "Search my solar passbook, warranty..."
                : "Search leads, serials, warranties..."
            }
            className="w-full pl-8 pr-3 py-1.5 bg-[#F5F7FA] border border-[#E4E7EB] rounded-xl text-xs text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#734960]/30 focus:border-[#734960] transition"
          />
        </div>
      </div>

      {/* Right Side: Quick Action + Notification + User */}
      <div className="flex items-center gap-3">
        {/* Role-Sensitive Action Button */}
        {role === "admin" && (
          <Link
            href="/leads"
            className="px-3 py-1.5 bg-[#734960] hover:bg-[#5A354A] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>+</span> New Lead
          </Link>
        )}
        {role === "customer" && (
          <Link
            href="/customer?tab=complaint"
            className="px-3 py-1.5 bg-[#78B77B] hover:bg-[#5B965E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>🚨</span> Report Issue
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-[#666666] hover:text-[#734960] hover:bg-[#F5F7FA] rounded-xl transition-colors border border-transparent hover:border-[#E4E7EB]"
            title="Notifications"
          >
            <span className="text-base">🔔</span>
            {relevantNotifications.length > 0 && (
              <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-[#F4B860] text-[#333333] rounded-full border border-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                {relevantNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-[#E4E7EB] overflow-hidden z-50">
              <div className="px-4 py-2.5 border-b border-[#E4E7EB] flex items-center justify-between bg-[#F5F7FA]">
                <h3 className="font-bold text-xs text-[#333333]">
                  {role === "technician" ? "Field Task Notifications" : "System Notifications"}
                </h3>
                <span className="text-[10px] bg-[#FEF6EB] text-[#DA9B40] border border-[#F4B860]/40 px-2 py-0.5 rounded-full font-bold">
                  {relevantNotifications.length} new
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E4E7EB]/50">
                {relevantNotifications.length > 0 ? (
                  relevantNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-3.5 py-2.5 hover:bg-[#F5F7FA] cursor-pointer transition text-xs space-y-0.5"
                    >
                      <p className="text-[#333333] font-medium leading-snug">{n.text}</p>
                      <p className="text-[10px] text-[#666666]">🕒 {n.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#666666]">
                    No new notifications right now.
                  </div>
                )}
              </div>

              {relevantNotifications.length > 0 && (
                <div className="px-3.5 py-2 border-t border-[#E4E7EB] bg-[#F5F7FA] text-center">
                  <button
                    onClick={handleClearNotifications}
                    className="text-xs text-[#734960] font-semibold hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Pill & Switcher */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E4E7EB]">
          <Link href="/settings" className="hover:opacity-85 transition" title="Go to Profile / Settings">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover border border-[#E4E7EB]"
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                  role === "technician"
                    ? "bg-[#DA9B40] text-[#333333]"
                    : role === "customer"
                    ? "bg-[#78B77B] text-white"
                    : "bg-[#734960] text-white"
                }`}
              >
                {user?.avatar || (role === "technician" ? "👷" : role === "customer" ? "👤" : "👑")}
              </div>
            )}
          </Link>

          <div className="hidden md:block leading-tight text-left">
            <p className="text-xs font-bold text-[#333333] truncate max-w-[120px]">
              {user ? user.name.split(" ")[0] : "Admin"}
            </p>
            <p className="text-[10px] text-[#666666] capitalize font-medium">
              {role === "admin" ? "Director" : role}
            </p>
          </div>

          <Link
            href="/login"
            onClick={logout}
            className="p-1 text-[#666666] hover:text-[#734960] rounded-lg hover:bg-[#F5F7FA] transition"
            title="Switch User / Log Out"
          >
            <span className="text-xs">🚪</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
