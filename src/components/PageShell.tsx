"use client";

import React, { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AdminNotificationFloatingWindow from "@/components/AdminNotificationFloatingWindow";
import { useNav } from "@/context/NavContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface PageShellProps {
  children: React.ReactNode;
}

function PageBreadcrumbBar() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const getPageMeta = (path: string) => {
    switch (path) {
      case "/dashboard":
        return { title: "Executive Performance Dashboard", parent: "Dashboard", parentHref: "/dashboard" };
      case "/leads":
        return { title: "Leads & CRM Pipeline", parent: "Lead & CRM", parentHref: "/leads" };
      case "/quotations":
        return { title: "Quotations & BOM Builder", parent: "Lead & CRM", parentHref: "/leads" };
      case "/orders":
        return { title: "Orders & Warehouse Dispatch", parent: "Lead & CRM", parentHref: "/leads" };
      case "/inventory":
        return { title: "Inventory & Barcode Serials", parent: "Lead & CRM", parentHref: "/leads" };
      case "/warranty":
        return { title: "20-Year Solar Warranty Registry", parent: "Lead & CRM", parentHref: "/leads" };
      case "/service":
        return { title: "Service Desk & Breakdowns", parent: "Operations", parentHref: "/" };
      case "/subsidy":
        return { title: "PM Surya Ghar Subsidy Tracker", parent: "Operations", parentHref: "/" };
      case "/technician":
        return { title: "Technician Field Operations", parent: "Dashboard", parentHref: "/" };
      case "/customer":
        return { title: "Customer Solar Passbook", parent: "Dashboard", parentHref: "/" };
      case "/settings":
        return { title: "Settings & Profile", parent: "System", parentHref: "/" };
      case "/database":
        return { title: "PostgreSQL Database Engine", parent: "System", parentHref: "/" };
      default:
        return { title: path.replace("/", "").toUpperCase(), parent: "Home", parentHref: "/" };
    }
  };

  const meta = getPageMeta(pathname);

  return (
    <div className="flex items-center justify-between py-1 px-1 -mt-2 mb-2 print:hidden">
      <div className="text-[11px] font-semibold text-[#6D5284] flex items-center gap-1.5">
        <Link href="/" className="hover:underline text-[#8D73A8]">
          Home
        </Link>
        <span className="text-[#B39CCB]">/</span>
        <Link href={meta.parentHref} className="hover:underline text-[#8D73A8]">
          {meta.parent}
        </Link>
        <span className="text-[#B39CCB]">/</span>
        <span className="text-[#4A355E] font-bold">{meta.title}</span>
      </div>
    </div>
  );
}

export default function PageShell({ children }: PageShellProps) {
  const { isNavOpen } = useNav();

  return (
    <div className="min-h-screen bg-[#F7EEF2] text-[#261C33] flex relative overflow-x-hidden">
      {/* Blurry Solar Panel Thematic Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="w-full h-full bg-cover bg-center opacity-35 filter blur-lg scale-105"
          style={{ backgroundImage: `url('/solar-panel-bg.svg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7EEF2]/75 via-[#F7EEF2]/90 to-[#F7EEF2]" />
      </div>

      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isNavOpen ? "ml-[200px]" : "ml-[64px]"
        } min-w-0 flex flex-col relative z-10`}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4">
          <Suspense fallback={null}>
            <PageBreadcrumbBar />
          </Suspense>
          {children}
        </main>
      </div>
      <AdminNotificationFloatingWindow />
    </div>
  );
}
