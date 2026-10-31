"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";
import {
  SunIcon,
  DashboardIcon,
  TrendingUpIcon,
  HardHatIcon,
  UsersIcon,
  FileTextIcon,
  PackageIcon,
  WarehouseIcon,
  ShieldCheckIcon,
  WrenchIcon,
  LandmarkIcon,
  SettingsIcon,
  LogOutIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  AlertCircleIcon,
  MessageSquareIcon,
  ChartBarIcon,
} from "@/components/Icons";

const customerPortalSubItems = [
  { name: "Solar Yield & Passbook", href: "/customer?tab=passbook", icon: SunIcon, tab: "passbook" },
  { name: "Installation Progress Report", href: "/customer?tab=progress", icon: ChartBarIcon, tab: "progress" },
  { name: "Upload Roof Photos", href: "/customer?tab=photos", icon: CameraIcon, tab: "photos" },
  { name: "File Service Complaint", href: "/customer?tab=complaint", icon: AlertCircleIcon, tab: "complaint" },
  { name: "Ask for Enquiry / Upgrade", href: "/customer?tab=enquiry", icon: MessageSquareIcon, tab: "enquiry" },
  { name: "Digital Warranty Cards", href: "/customer?tab=warranty", icon: ShieldCheckIcon, tab: "warranty" },
];

const crmSubItems = [
  { name: "Leads Overview", href: "/leads", icon: UsersIcon },
  { name: "Quotations", href: "/quotations", icon: FileTextIcon },
  { name: "Orders", href: "/orders", icon: PackageIcon },
  { name: "Inventory", href: "/inventory", icon: WarehouseIcon },
  { name: "Warranty", href: "/warranty", icon: ShieldCheckIcon },
];

function SidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "passbook";
  const { isNavOpen, toggleNav } = useNav();
  const { role, user, logout } = useAuth();

  // Auto-open dropdowns depending on active path
  const isDashboardArea = pathname === "/" || pathname === "/technician";
  const isCrmArea = ["/leads", "/quotations", "/orders", "/inventory", "/warranty"].includes(pathname);

  const [dashboardOpen, setDashboardOpen] = useState(isDashboardArea);
  const [customerSubOpen, setCustomerSubOpen] = useState(pathname === "/customer");
  const [crmOpen, setCrmOpen] = useState(isCrmArea);

  useEffect(() => {
    if (isDashboardArea) setDashboardOpen(true);
    if (pathname === "/customer") setCustomerSubOpen(true);
    if (isCrmArea) setCrmOpen(true);
  }, [pathname, isDashboardArea, isCrmArea]);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#4A355E] text-white flex flex-col transition-all duration-300 z-50 shadow-md border-r border-[#6D5284] ${
        isNavOpen ? "w-[200px]" : "w-[64px]"
      }`}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-[#6D5284]/70">
        <Link
          href={role === "technician" ? "/technician" : role === "customer" ? "/customer" : "/"}
          className="flex items-center gap-2 overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8D73A8] to-[#6D5284] flex items-center justify-center text-white shadow-sm flex-shrink-0 border border-[#B39CCB]/30">
            <SunIcon className="w-4 h-4 text-white" />
          </div>
          {isNavOpen && (
            <div className="leading-tight truncate">
              <span className="font-bold text-sm tracking-wide text-white block">SunPower</span>
              <span className="text-[10px] text-[#B39CCB] block uppercase tracking-wider font-semibold">
                {role === "technician" ? "Crew Portal" : role === "customer" ? "Homeowner" : "Admin ERP"}
              </span>
            </div>
          )}
        </Link>

        {/* Clean, Single Navbar Toggle Button */}
        <button
          onClick={toggleNav}
          className={`p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer ${
            !isNavOpen ? "mx-auto mt-1" : ""
          }`}
          title={isNavOpen ? "Collapse Navbar" : "Expand Navbar"}
          aria-label={isNavOpen ? "Collapse Navbar" : "Expand Navbar"}
        >
          {isNavOpen ? (
            <ChevronLeftIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Role Banner */}
      {isNavOpen && (
        <div className="px-3 py-2 bg-[#3A284B]/70 border-b border-[#6D5284]/50 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Avatar"
                className="w-4 h-4 rounded-full object-cover flex-shrink-0 border border-white/30"
              />
            ) : (
              <UserIcon className="w-3.5 h-3.5 text-[#B39CCB] flex-shrink-0" />
            )}
            <span className="text-white/85 truncate font-medium">
              {user?.name.split(" ")[0]} ({role})
            </span>
          </div>
          <Link
            href="/login"
            className="text-[#D7B6C7] hover:text-white hover:underline font-bold text-[10px] flex-shrink-0 ml-1"
            title="Switch User Role"
          >
            Switch ⇄
          </Link>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-3 space-y-1.5 overflow-y-auto">
        {/* ======================================================== */}
        {/* ROLE: TECHNICIAN */}
        {/* ======================================================== */}
        {role === "technician" && (
          <>
            <Link
              href="/technician"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === "/technician"
                  ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FileTextIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
              {isNavOpen && <span className="truncate">My Assigned Tasks</span>}
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === "/settings"
                  ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <SettingsIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
              {isNavOpen && <span className="truncate">Settings</span>}
            </Link>
          </>
        )}

        {/* ======================================================== */}
        {/* ROLE: CUSTOMER */}
        {/* ======================================================== */}
        {role === "customer" && (
          <>
            <div className="relative group">
              <div
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  pathname === "/customer"
                    ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setCustomerSubOpen(!customerSubOpen)}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <SunIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
                  {isNavOpen && <span className="truncate">My Solar Portal</span>}
                </div>
                {isNavOpen && (
                  customerSubOpen ? (
                    <ChevronUpIcon className="w-3.5 h-3.5 text-white/70" />
                  ) : (
                    <ChevronDownIcon className="w-3.5 h-3.5 text-white/70" />
                  )
                )}
              </div>

              {isNavOpen && customerSubOpen && (
                <div className="ml-4 pl-2 mt-1 space-y-1 border-l-2 border-[#B39CCB]/40">
                  {customerPortalSubItems.map((sub) => {
                    const isSubActive = pathname === "/customer" && activeTabParam === sub.tab;
                    const SubIcon = sub.icon;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition ${
                          isSubActive
                            ? "bg-white/20 text-[#D7B6C7] font-bold"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/settings"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === "/settings"
                  ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <SettingsIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
              {isNavOpen && <span className="truncate">Settings</span>}
            </Link>
          </>
        )}

        {/* ======================================================== */}
        {/* ROLE: ADMIN                                              */}
        {/* ======================================================== */}
        {role !== "technician" && role !== "customer" && (
          <>
            {/* ── 1. DASHBOARD DROPDOWN ── */}
            <div className="relative group">
              <div
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  pathname === "/"
                    ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                    : isDashboardArea
                    ? "bg-[#6D5284]/60 text-white font-semibold border border-[#8D73A8]/30"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => {
                  if (isNavOpen) {
                    setDashboardOpen(!dashboardOpen);
                  }
                }}
                title={!isNavOpen ? "Dashboard" : undefined}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <DashboardIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
                  {isNavOpen && <span className="truncate">Dashboard</span>}
                </div>

                {isNavOpen && (
                  dashboardOpen ? (
                    <ChevronUpIcon className="w-3.5 h-3.5 text-white/70" />
                  ) : (
                    <ChevronDownIcon className="w-3.5 h-3.5 text-white/70" />
                  )
                )}
              </div>

              {/* Expanded Dropdown Content */}
              {isNavOpen && dashboardOpen && (
                <div className="ml-3 pl-2 mt-1 space-y-1 border-l-2 border-[#8D73A8]/50">
                  <Link
                    href="/"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition ${
                      pathname === "/"
                        ? "bg-white/20 text-[#D7B6C7] font-bold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <TrendingUpIcon className="w-3.5 h-3.5 text-[#B39CCB]" />
                    <span className="truncate">Overview</span>
                  </Link>

                  <Link
                    href="/technician"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition ${
                      pathname === "/technician"
                        ? "bg-white/20 text-[#D7B6C7] font-bold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <HardHatIcon className="w-3.5 h-3.5 text-[#B39CCB]" />
                    <span className="truncate">Technician Portal</span>
                  </Link>
                </div>
              )}

              {/* Collapsed Navbar Flyout Dropdown */}
              {!isNavOpen && (
                <div className="absolute left-full top-0 ml-2 w-52 bg-[#4A355E] rounded-xl shadow-xl border border-[#6D5284] p-2 hidden group-hover:block z-50">
                  <div className="px-2 py-1 border-b border-[#6D5284] mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <DashboardIcon className="w-3.5 h-3.5 text-[#B39CCB]" />
                      <span>Dashboard</span>
                    </span>
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <Link
                      href="/"
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition ${
                        pathname === "/" ? "bg-white/20 text-[#D7B6C7] font-bold" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <TrendingUpIcon className="w-3.5 h-3.5 text-[#B39CCB]" />
                      <span>Overview</span>
                    </Link>
                    <Link
                      href="/technician"
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition ${
                        pathname === "/technician" ? "bg-white/20 text-[#D7B6C7] font-bold" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <HardHatIcon className="w-3.5 h-3.5 text-[#B39CCB]" />
                      <span>Technician Portal</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ── 2. LEAD AND CRM DROPDOWN ── */}
            <div className="relative group">
              <div
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  pathname === "/leads"
                    ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                    : isCrmArea
                    ? "bg-[#6D5284]/60 text-white font-semibold border border-[#8D73A8]/30"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => {
                  if (isNavOpen) {
                    setCrmOpen(!crmOpen);
                  }
                }}
                title={!isNavOpen ? "Lead & CRM" : undefined}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <UsersIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
                  {isNavOpen && <span className="truncate">Lead &amp; CRM</span>}
                </div>

                {isNavOpen && (
                  crmOpen ? (
                    <ChevronUpIcon className="w-3.5 h-3.5 text-white/70" />
                  ) : (
                    <ChevronDownIcon className="w-3.5 h-3.5 text-white/70" />
                  )
                )}
              </div>

              {/* Expanded Dropdown Content */}
              {isNavOpen && crmOpen && (
                <div className="ml-3 pl-2 mt-1 space-y-1 border-l-2 border-[#8D73A8]/50">
                  {crmSubItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    const SubIcon = sub.icon;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition ${
                          isSubActive
                            ? "bg-white/20 text-[#D7B6C7] font-bold"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 flex-shrink-0 text-[#B39CCB]" />
                        <span className="truncate">{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Collapsed Navbar Flyout Dropdown */}
              {!isNavOpen && (
                <div className="absolute left-full top-0 ml-2 w-52 bg-[#4A355E] rounded-xl shadow-xl border border-[#6D5284] p-2 hidden group-hover:block z-50">
                  <div className="px-2 py-1 border-b border-[#6D5284] mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <UsersIcon className="w-3.5 h-3.5 text-[#B39CCB]" />
                      <span>Lead &amp; CRM</span>
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {crmSubItems.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                            isSubActive
                              ? "bg-white/20 text-[#D7B6C7] font-bold"
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <SubIcon className="w-3.5 h-3.5 text-[#B39CCB]" />
                          <span className="truncate">{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── 3. SERVICE DESK ── */}
            <Link
              href="/service"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                pathname === "/service"
                  ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
              title={!isNavOpen ? "Service Desk" : undefined}
            >
              <WrenchIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
              {isNavOpen ? (
                <span className="truncate">Service Desk</span>
              ) : (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#4A355E] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-[#6D5284]">
                  Service Desk
                </span>
              )}
              {pathname === "/service" && isNavOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D7B6C7]"></span>
              )}
            </Link>

            {/* ── 4. SUBSIDY TRACKER ── */}
            <Link
              href="/subsidy"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                pathname === "/subsidy"
                  ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
              title={!isNavOpen ? "Subsidy Tracker" : undefined}
            >
              <LandmarkIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
              {isNavOpen ? (
                <span className="truncate">Subsidy Tracker</span>
              ) : (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#4A355E] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-[#6D5284]">
                  Subsidy Tracker
                </span>
              )}
              {pathname === "/subsidy" && isNavOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D7B6C7]"></span>
              )}
            </Link>

            {/* ── 5. SETTINGS ── */}
            <Link
              href="/settings"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                pathname === "/settings"
                  ? "bg-[#6D5284] text-white font-semibold shadow-xs border border-[#8D73A8]/50"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
              title={!isNavOpen ? "Settings" : undefined}
            >
              <SettingsIcon className="w-4 h-4 flex-shrink-0 text-[#B39CCB]" />
              {isNavOpen ? (
                <span className="truncate">Settings</span>
              ) : (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#4A355E] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-[#6D5284]">
                  Settings
                </span>
              )}
              {pathname === "/settings" && isNavOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D7B6C7]"></span>
              )}
            </Link>
          </>
        )}
      </nav>

      {/* Bottom Action Bar: Clean Logout / Switch */}
      <div className="p-2 border-t border-[#6D5284]/70 bg-[#3A284B]/60">
        <Link
          href="/login"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-2 rounded-xl text-xs font-medium text-white/90 hover:bg-white/10 transition-colors"
          title="Sign out or switch portal"
        >
          <LogOutIcon className="w-3.5 h-3.5 text-[#B39CCB]" />
          {isNavOpen && <span className="text-[11px] font-semibold">Sign Out / Switch</span>}
        </Link>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-[64px] h-screen bg-[#4A355E] fixed top-0 left-0" />}>
      <SidebarInner />
    </Suspense>
  );
}
