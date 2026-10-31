"use client";

import React, { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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
      default:
        return { title: path.replace("/", "").toUpperCase(), parent: "Home", parentHref: "/" };
    }
  };

  const meta = getPageMeta(pathname);

  return (
    <div className="flex items-center justify-between py-1 px-1 -mt-2 mb-2 print:hidden">
      <div className="text-[11px] font-semibold text-[#8E687F] flex items-center gap-1.5">
        <Link href="/" className="hover:underline text-[#666666]">
          Home
        </Link>
        <span>/</span>
        <Link href={meta.parentHref} className="hover:underline text-[#666666]">
          {meta.parent}
        </Link>
        <span>/</span>
        <span className="text-[#734960] font-bold">{meta.title}</span>
      </div>
    </div>
  );
}

export default function PageShell({ children }: PageShellProps) {
  const { isNavOpen } = useNav();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#333333] flex">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isNavOpen ? "ml-[200px]" : "ml-[64px]"
        } min-w-0 flex flex-col`}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4">
          <Suspense fallback={null}>
            <PageBreadcrumbBar />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}
