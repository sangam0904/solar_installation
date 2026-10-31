"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useNav } from "@/context/NavContext";

interface PageShellProps {
  children: React.ReactNode;
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
        <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
