"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";

const customerPortalSubItems = [
  { name: "Solar Yield & Passbook", href: "/customer?tab=passbook", icon: "☀️", tab: "passbook" },
  { name: "Installation Progress Report", href: "/customer?tab=progress", icon: "📊", tab: "progress" },
  { name: "Upload Roof Photos", href: "/customer?tab=photos", icon: "📸", tab: "photos" },
  { name: "File Service Complaint", href: "/customer?tab=complaint", icon: "🚨", tab: "complaint" },
  { name: "Ask for Enquiry / Upgrade", href: "/customer?tab=enquiry", icon: "💬", tab: "enquiry" },
  { name: "Digital Warranty Cards", href: "/customer?tab=warranty", icon: "🛡️", tab: "warranty" },
];

const crmSubItems = [
  { name: "Leads Overview", href: "/leads", icon: "🎯" },
  { name: "Quotations", href: "/quotations", icon: "📋" },
  { name: "Orders", href: "/orders", icon: "📦" },
  { name: "Inventory", href: "/inventory", icon: "🏭" },
  { name: "Warranty", href: "/warranty", icon: "🛡️" },
];

function SidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "passbook";
  const { isNavOpen, toggleNav } = useNav();
  const { role, user, logout } = useAuth();

  // Auto-open dropdowns depending on active path
  const isDashboardArea = pathname === "/" || pathname === "/technician" || pathname === "/customer";
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
      className={`fixed top-0 left-0 h-screen bg-[#8E687F] text-white flex flex-col transition-all duration-300 z-50 shadow-md border-r border-[#7A536C] ${
        isNavOpen ? "w-[200px]" : "w-[64px]"
      }`}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-[#7A536C]/70">
        <Link
          href={role === "technician" ? "/technician" : role === "customer" ? "/customer" : "/"}
          className="flex items-center gap-2 overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F4B860] flex items-center justify-center text-base shadow-sm flex-shrink-0">
            ☀️
          </div>
          {isNavOpen && (
            <div className="leading-tight truncate">
              <span className="font-bold text-sm tracking-wide text-white block">SunPower</span>
              <span className="text-[10px] text-white/70 block uppercase tracking-wider">
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
          <span className="text-xs font-bold leading-none">{isNavOpen ? "◀" : "▶"}</span>
        </button>
      </div>

      {/* Role Banner */}
      {isNavOpen && (
        <div className="px-3 py-2 bg-[#7A536C]/40 border-b border-[#7A536C]/50 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Avatar"
                className="w-4 h-4 rounded-full object-cover flex-shrink-0 border border-white/30"
              />
            ) : (
              <span className="text-xs">{user?.avatar || "👤"}</span>
            )}
            <span className="text-white/80 truncate">
              {user?.name.split(" ")[0]} ({role})
            </span>
          </div>
          <Link
            href="/login"
            className="text-[#F4B860] hover:underline font-bold text-[10px] flex-shrink-0"
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
                  ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base flex-shrink-0">📋</span>
              {isNavOpen && <span className="truncate">My Assigned Tasks</span>}
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === "/settings"
                  ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base flex-shrink-0">⚙️</span>
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
                    ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setCustomerSubOpen(!customerSubOpen)}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="text-base flex-shrink-0">☀️</span>
                  {isNavOpen && <span className="truncate">My Solar Portal</span>}
                </div>
                {isNavOpen && (
                  <span className="text-[10px] text-white/70">{customerSubOpen ? "▲" : "▼"}</span>
                )}
              </div>

              {isNavOpen && customerSubOpen && (
                <div className="ml-4 pl-2 mt-1 space-y-1 border-l-2 border-[#F4B860]/40">
                  {customerPortalSubItems.map((sub) => {
                    const isSubActive = pathname === "/customer" && activeTabParam === sub.tab;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition ${
                          isSubActive
                            ? "bg-white/20 text-[#F4B860] font-bold"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="text-xs">{sub.icon}</span>
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
                  ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base flex-shrink-0">⚙️</span>
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
                    ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                    : isDashboardArea
                    ? "bg-[#734960]/60 text-white font-semibold border border-[#5A354A]/50"
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
                  <span className="text-base flex-shrink-0">📊</span>
                  {isNavOpen && <span className="truncate">Dashboard</span>}
                </div>

                {isNavOpen && (
                  <span className="text-[10px] text-white/70 block">
                    {dashboardOpen ? "▲" : "▼"}
                  </span>
                )}
              </div>

              {/* Expanded Dropdown Content */}
              {isNavOpen && dashboardOpen && (
                <div className="ml-3 pl-2 mt-1 space-y-1 border-l-2 border-[#F4B860]/40">
                  <Link
                    href="/"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition ${
                      pathname === "/"
                        ? "bg-white/20 text-[#F4B860] font-bold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-xs">📈</span>
                    <span className="truncate">Overview</span>
                  </Link>

                  <Link
                    href="/technician"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition ${
                      pathname === "/technician"
                        ? "bg-white/20 text-[#F4B860] font-bold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-xs">👷</span>
                    <span className="truncate">Technician Portal</span>
                  </Link>

                  <div className="space-y-0.5 pt-0.5">
                    <div
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition cursor-pointer ${
                        pathname === "/customer"
                          ? "bg-white/20 text-[#F4B860] font-bold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => setCustomerSubOpen(!customerSubOpen)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs">👤</span>
                        <span className="truncate">Customer Portal</span>
                      </div>
                      <span className="text-[9px] text-white/60">
                        {customerSubOpen ? "▲" : "▼"}
                      </span>
                    </div>

                    {customerSubOpen && (
                      <div className="ml-3 pl-2 space-y-0.5 border-l border-white/20">
                        {customerPortalSubItems.map((sub) => {
                          const isSubActive = pathname === "/customer" && activeTabParam === sub.tab;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] transition ${
                                isSubActive
                                  ? "bg-white/25 text-[#F4B860] font-bold"
                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <span className="text-[11px]">{sub.icon}</span>
                              <span className="truncate">{sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Collapsed Navbar Flyout Dropdown */}
              {!isNavOpen && (
                <div className="absolute left-full top-0 ml-2 w-56 bg-[#734960] rounded-xl shadow-xl border border-[#5A354A] p-2 hidden group-hover:block z-50">
                  <div className="px-2 py-1 border-b border-[#5A354A] mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>📊</span> Dashboard Portals
                    </span>
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <Link
                      href="/"
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition ${
                        pathname === "/" ? "bg-white/20 text-[#F4B860] font-bold" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <span>📈</span> Overview
                    </Link>
                    <Link
                      href="/technician"
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition ${
                        pathname === "/technician" ? "bg-white/20 text-[#F4B860] font-bold" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <span>👷</span> Technician Portal
                    </Link>
                    <div className="pt-1 border-t border-[#5A354A]/80">
                      <Link
                        href="/customer"
                        className={`flex items-center gap-2 px-2.5 py-1 rounded-lg font-bold text-xs ${
                          pathname === "/customer" ? "text-[#F4B860]" : "text-white"
                        }`}
                      >
                        <span>👤</span> Customer Portal
                      </Link>
                      <div className="pl-3 space-y-0.5 pt-0.5">
                        {customerPortalSubItems.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-white/80 hover:bg-white/10"
                          >
                            <span>{sub.icon}</span>
                            <span className="truncate">{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── 2. LEAD AND CRM DROPDOWN ── */}
            <div className="relative group">
              <div
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  pathname === "/leads"
                    ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                    : isCrmArea
                    ? "bg-[#734960]/60 text-white font-semibold border border-[#5A354A]/50"
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
                  <span className="text-base flex-shrink-0">🎯</span>
                  {isNavOpen && <span className="truncate">Lead &amp; CRM</span>}
                </div>

                {isNavOpen && (
                  <span className="text-[10px] text-white/70 block">{crmOpen ? "▲" : "▼"}</span>
                )}
              </div>

              {/* Expanded Dropdown Content */}
              {isNavOpen && crmOpen && (
                <div className="ml-3 pl-2 mt-1 space-y-1 border-l-2 border-[#78B77B]/50">
                  {crmSubItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition ${
                          isSubActive
                            ? "bg-white/20 text-[#F4B860] font-bold"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="text-xs">{sub.icon}</span>
                        <span className="truncate">{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Collapsed Navbar Flyout Dropdown */}
              {!isNavOpen && (
                <div className="absolute left-full top-0 ml-2 w-52 bg-[#734960] rounded-xl shadow-xl border border-[#5A354A] p-2 hidden group-hover:block z-50">
                  <div className="px-2 py-1 border-b border-[#5A354A] mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>🎯</span> Lead &amp; CRM
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {crmSubItems.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                            isSubActive
                              ? "bg-white/20 text-[#F4B860] font-bold"
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span className="text-sm">{sub.icon}</span>
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
                  ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
              title={!isNavOpen ? "Service Desk" : undefined}
            >
              <span className="text-base flex-shrink-0">🔧</span>
              {isNavOpen ? (
                <span className="truncate">Service Desk</span>
              ) : (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#734960] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-[#5A354A]">
                  Service Desk
                </span>
              )}
              {pathname === "/service" && isNavOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F4B860]"></span>
              )}
            </Link>

            {/* ── 4. SUBSIDY TRACKER ── */}
            <Link
              href="/subsidy"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                pathname === "/subsidy"
                  ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
              title={!isNavOpen ? "Subsidy Tracker" : undefined}
            >
              <span className="text-base flex-shrink-0">🏛️</span>
              {isNavOpen ? (
                <span className="truncate">Subsidy Tracker</span>
              ) : (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#734960] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-[#5A354A]">
                  Subsidy Tracker
                </span>
              )}
              {pathname === "/subsidy" && isNavOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F4B860]"></span>
              )}
            </Link>

            {/* ── 5. SETTINGS ── */}
            <Link
              href="/settings"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                pathname === "/settings"
                  ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
              title={!isNavOpen ? "Settings" : undefined}
            >
              <span className="text-base flex-shrink-0">⚙️</span>
              {isNavOpen ? (
                <span className="truncate">Settings</span>
              ) : (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#734960] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-[#5A354A]">
                  Settings
                </span>
              )}
              {pathname === "/settings" && isNavOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F4B860]"></span>
              )}
            </Link>
          </>
        )}
      </nav>

      {/* Bottom Action Bar: Only clean Logout / Switch */}
      <div className="p-2 border-t border-[#7A536C]/70 bg-[#835D74]/50">
        <Link
          href="/login"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-2 rounded-xl text-xs font-medium text-white/90 hover:bg-white/10 transition-colors"
          title="Sign out or switch portal"
        >
          <span className="text-xs">🚪</span>
          {isNavOpen && <span className="text-[11px] font-semibold">Sign Out / Switch</span>}
        </Link>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-[64px] h-screen bg-[#8E687F] fixed top-0 left-0" />}>
      <SidebarInner />
    </Suspense>
  );
}
