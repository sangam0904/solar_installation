"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";
import {
  SearchIcon,
  BellIcon,
  ArrowLeftIcon,
  PlusIcon,
  LogOutIcon,
  CrownIcon,
  HardHatIcon,
  UserIcon,
  AlertCircleIcon,
  ClockIcon,
  DashboardIcon,
  ChevronLeftIcon,
  MessageSquareIcon,
} from "@/components/Icons";

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
  const router = useRouter();
  const pathname = usePathname();
  const { isNavOpen, toggleNav } = useNav();
  const { role, user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(defaultAdminNotifications);

  const handleBack = () => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
  };

  // Sync notifications with localStorage
  useEffect(() => {
    const loadStoredNotifs = () => {
      try {
        const stored = localStorage.getItem("sunpower_notifications");
        if (stored) {
          setNotifications(JSON.parse(stored));
        } else {
          setNotifications(defaultAdminNotifications);
        }
      } catch {
        setNotifications(defaultAdminNotifications);
      }
    };

    loadStoredNotifs();
    window.addEventListener("storage", loadStoredNotifs);
    window.addEventListener("sunpower_customer_update", loadStoredNotifs);
    return () => {
      window.removeEventListener("storage", loadStoredNotifs);
      window.removeEventListener("sunpower_customer_update", loadStoredNotifs);
    };
  }, []);

  // Filter notifications relevant to current logged-in role & technician ID
  const relevantNotifications = notifications.filter((n) => {
    if (role === "admin") {
      return !n.recipientRole || n.recipientRole === "admin" || !n.recipientId;
    }
    if (role === "technician") {
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
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-[#EBCED6] flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 card-floating">
      {/* Left Side: Navbar Toggle + Back Button + Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        {/* Navbar Toggle */}
        <button
          onClick={toggleNav}
          className="p-1.5 rounded-lg text-[#6D5284] hover:text-[#4A355E] hover:bg-[#F7EEF2] border border-[#EBCED6] transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer"
          title={isNavOpen ? "Collapse Navigation" : "Expand Navigation"}
          aria-label="Toggle Navigation Bar"
        >
          {isNavOpen ? (
            <ChevronLeftIcon className="w-4 h-4" />
          ) : (
            <DashboardIcon className="w-4 h-4" />
          )}
        </button>

        {/* Global Back Option Button */}
        <button
          onClick={handleBack}
          className="px-2.5 py-1.5 rounded-lg text-[#4A355E] hover:text-[#372447] bg-[#F7EEF2] hover:bg-[#EBCED6] border border-[#D7B6C7] transition-all flex items-center gap-1.5 flex-shrink-0 text-xs font-bold card-floating cursor-pointer group"
          title="Go Back to Previous Page"
          aria-label="Go Back"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8D73A8]" />
          <input
            type="text"
            placeholder={
              role === "technician"
                ? "Search my assigned site tasks..."
                : role === "customer"
                ? "Search my solar passbook, warranty..."
                : "Search leads, serials, warranties..."
            }
            className="w-full pl-8 pr-3 py-1.5 bg-[#F7EEF2]/70 border border-[#EBCED6] rounded-xl text-xs text-[#261C33] placeholder-[#8D73A8] focus:outline-none focus:ring-2 focus:ring-[#8D73A8]/30 focus:border-[#6D5284] transition"
          />
        </div>
      </div>

      {/* Right Side: Quick Action + Notification + User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role-Sensitive Action Button */}
        {role === "admin" && (
          <Link
            href="/leads"
            className="px-3 py-1.5 bg-[#4A355E] hover:bg-[#6D5284] text-white text-xs font-semibold rounded-xl card-floating transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span> Lead
          </Link>
        )}
        {role === "customer" && (
          <Link
            href="/customer?tab=enquiry"
            className="px-3 py-1.5 bg-[#191D23] hover:bg-[#57707A] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <MessageSquareIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span> Support
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-[#6D5284] hover:text-[#4A355E] hover:bg-[#F7EEF2] rounded-xl transition-colors border border-transparent hover:border-[#EBCED6] cursor-pointer"
            title="Notifications"
          >
            <BellIcon className="w-4 h-4" />
            {relevantNotifications.length > 0 && (
              <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-[#8D73A8] text-white rounded-full border border-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                {relevantNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-[#EBCED6] overflow-hidden z-50">
              <div className="px-4 py-2.5 border-b border-[#EBCED6] flex items-center justify-between bg-[#F7EEF2]">
                <h3 className="font-bold text-xs text-[#261C33]">
                  {role === "technician" ? "Field Task Notifications" : "System Notifications"}
                </h3>
                <span className="text-[10px] bg-[#EBCED6] text-[#4A355E] border border-[#D7B6C7] px-2 py-0.5 rounded-full font-bold">
                  {relevantNotifications.length} new
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#EBCED6]/50">
                {relevantNotifications.length > 0 ? (
                  relevantNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-3.5 py-2.5 hover:bg-[#F7EEF2] cursor-pointer transition text-xs space-y-0.5"
                    >
                      <p className="text-[#261C33] font-medium leading-snug">{n.text}</p>
                      <p className="text-[10px] text-[#8D73A8] flex items-center gap-1 mt-1">
                        <ClockIcon className="w-3 h-3 text-[#8D73A8]" />
                        <span>{n.time}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#6D5284]">
                    No new notifications right now.
                  </div>
                )}
              </div>

              {relevantNotifications.length > 0 && (
                <div className="px-3.5 py-2 border-t border-[#EBCED6] bg-[#F7EEF2] text-center">
                  <button
                    onClick={handleClearNotifications}
                    className="text-xs text-[#4A355E] font-semibold hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Pill & Switcher */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#EBCED6]">
          <Link href="/settings" className="hover:opacity-85 transition" title="Go to Profile / Settings">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover border border-[#EBCED6]"
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold card-floating shadow-xs ${
                  role === "technician"
                    ? "bg-[#6D5284] text-white"
                    : role === "customer"
                    ? "bg-[#8D73A8] text-white"
                    : "bg-[#4A355E] text-white"
                }`}
              >
                {role === "technician" ? (
                  <HardHatIcon className="w-3.5 h-3.5 text-white" />
                ) : role === "customer" ? (
                  <UserIcon className="w-3.5 h-3.5 text-white" />
                ) : (
                  <CrownIcon className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            )}
          </Link>

          <div className="hidden md:block leading-tight text-left">
            <p className="text-xs font-bold text-[#261C33] truncate max-w-[120px]">
              {user ? user.name.split(" ")[0] : "Admin"}
            </p>
            <p className="text-[10px] text-[#6D5284] capitalize font-medium">
              {role === "admin" ? "Director" : role}
            </p>
          </div>

          <Link
            href="/login"
            onClick={logout}
            className="p-1.5 text-[#6D5284] hover:text-[#4A355E] rounded-lg hover:bg-[#F7EEF2] transition cursor-pointer"
            title="Switch User / Log Out"
          >
            <LogOutIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
