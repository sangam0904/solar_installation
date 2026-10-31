"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";

const adminMenuItems = [
  { name: "Dashboard", href: "/", icon: "📊" },
  { name: "Leads & CRM", href: "/leads", icon: "🎯" },
  { name: "Quotations", href: "/quotations", icon: "📋" },
  { name: "Orders", href: "/orders", icon: "📦" },
  { name: "Inventory", href: "/inventory", icon: "🏭" },
  { name: "Warranty", href: "/warranty", icon: "🛡️" },
  { name: "Service Desk", href: "/service", icon: "🔧" },
  { name: "Subsidy Tracker", href: "/subsidy", icon: "🏛️" },
  { name: "Technicians", href: "/technician", icon: "👷" },
  { name: "Customer Portal", href: "/customer", icon: "👤" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

const technicianMenuItems = [
  { name: "My Assigned Tasks", href: "/technician", icon: "📋" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

const customerMenuItems = [
  { name: "My Solar Portal", href: "/customer", icon: "☀️" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isNavOpen, toggleNav } = useNav();
  const { role, user, logout } = useAuth();

  const menuItems =
    role === "technician"
      ? technicianMenuItems
      : role === "customer"
      ? customerMenuItems
      : adminMenuItems;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#8E687F] text-white flex flex-col transition-all duration-300 z-50 shadow-md border-r border-[#7A536C] ${
        isNavOpen ? "w-[200px]" : "w-[64px]"
      }`}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-[#7A536C]/70">
        <Link href={role === "technician" ? "/technician" : role === "customer" ? "/customer" : "/"} className="flex items-center gap-2 overflow-hidden">
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

        {/* Close/Open Toggle Button inside header */}
        <button
          onClick={toggleNav}
          className={`p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center ${
            !isNavOpen ? "mx-auto mt-1" : ""
          }`}
          title={isNavOpen ? "Collapse Navbar (Close)" : "Expand Navbar (Open)"}
          aria-label={isNavOpen ? "Close Navbar" : "Open Navbar"}
        >
          {isNavOpen ? (
            <span className="text-xs font-bold">◀</span>
          ) : (
            <span className="text-xs font-bold">▶</span>
          )}
        </button>
      </div>

      {/* Role Banner inside sidebar */}
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
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href.split("?")[0];
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#734960] text-white font-semibold shadow-sm border border-[#5A354A]"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
              title={!isNavOpen ? item.name : undefined}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>

              {isNavOpen ? (
                <span className="truncate">{item.name}</span>
              ) : (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#734960] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-[#5A354A]">
                  {item.name}
                </span>
              )}

              {isActive && isNavOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F4B860]"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action Bar with Logout / Switch */}
      <div className="p-2 border-t border-[#7A536C]/70 bg-[#835D74]/50 space-y-1">
        <Link
          href="/login"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-xl text-xs font-medium text-white/90 hover:bg-white/10 transition-colors"
          title="Sign out or switch portal"
        >
          <span className="text-xs">🚪</span>
          {isNavOpen && <span className="text-[11px] font-semibold">Sign Out / Switch</span>}
        </Link>

        <button
          onClick={toggleNav}
          className="w-full flex items-center justify-center gap-2 py-1 px-2 rounded-xl text-[10px] font-medium text-white/70 hover:bg-white/10 transition-colors"
          title={isNavOpen ? "Close navigation bar" : "Open navigation bar"}
        >
          <span>{isNavOpen ? "◀" : "▶"}</span>
          {isNavOpen && <span>{isNavOpen ? "Collapse Menu" : "Expand"}</span>}
        </button>
      </div>
    </aside>
  );
}
