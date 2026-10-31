"use client";

import React, { useState, useEffect } from "react";
import { ALL_16_EMPLOYEES } from "@/context/AuthContext";
import {
  PackageIcon,
  HardHatIcon,
  PhoneIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  CheckIcon,
  ZapIcon,
  ClockIcon,
  StarIcon,
  WrenchIcon,
  ShieldCheckIcon,
  FileTextIcon,
} from "@/components/Icons";

export interface CustomerWorkProgressBarProps {
  customer: {
    key: string;
    name: string;
    phone: string;
    address: string;
    system: string;
    installedDate: string;
    todayGen: string;
    monthlyGen: string;
    lifetimeSavings: string;
    subsidyStatus: string;
    inverterSerial: string;
    panelSerial: string;
    inverterWarranty: string;
    panelWarranty: string;
    progressStep: number;
  };
  orderId?: string;
}

interface MilestoneStep {
  stepNumber: number;
  name: string;
  shortLabel: string;
  iconType: "order" | "survey" | "dispatch" | "install" | "sync" | "subsidy";
  statusTitle: string;
  deliveryEta: string;
  statusBadge: string;
  description: string;
  checkpoints: { time: string; text: string; done: boolean }[];
  liveStatusBanner: string;
}

const MILESTONE_DEFINITIONS: MilestoneStep[] = [
  {
    stepNumber: 1,
    name: "Order Booked & Pre-Qualification",
    shortLabel: "Order Confirmed",
    iconType: "order",
    statusTitle: "Engineering Order Booked",
    deliveryEta: "Completed • Survey Scheduled",
    statusBadge: "Phase 1 Complete",
    liveStatusBanner: "Order confirmed & PM Surya Ghar central subsidy pre-check verified",
    description: "System capacity calculated, structural feasibility reviewed, and subsidy token reserved on National Portal.",
    checkpoints: [
      { time: "09:30 AM", text: "Customer quotation accepted and digital contract confirmed", done: true },
      { time: "11:00 AM", text: "National Portal PM Surya Ghar subsidy application submitted", done: true },
      { time: "02:15 PM", text: "Electrical Single Line Diagram (SLD) approved by Chief Engineer", done: true },
    ],
  },
  {
    stepNumber: 2,
    name: "Site Survey & 3D Shading Analysis",
    shortLabel: "Site Surveyed",
    iconType: "survey",
    statusTitle: "Rooftop Tilt & Shading Approved",
    deliveryEta: "Completed • Hardware Assigned",
    statusBadge: "Phase 2 Complete",
    liveStatusBanner: "Technician completed drone tilt scan & roof shadow analysis",
    description: "South-facing solar orientation measured (26° optimal tilt), shadow free area verified, and anchor points marked.",
    checkpoints: [
      { time: "10:00 AM", text: "Technician checked in at customer rooftop with laser meter", done: true },
      { time: "11:30 AM", text: "3D shade profiling completed (0% midday obstruction)", done: true },
      { time: "03:45 PM", text: "Structural mounting blueprint finalized and sent to warehouse", done: true },
    ],
  },
  {
    stepNumber: 3,
    name: "Hardware Dispatched from Warehouse",
    shortLabel: "Out for Delivery",
    iconType: "dispatch",
    statusTitle: "Dispatch Crew On The Way",
    deliveryEta: "Arriving at Site in 40 Mins",
    statusBadge: "Dispatched & In Transit",
    liveStatusBanner: "Hardware scanned at central warehouse and loaded onto logistics vehicle",
    description: "Solar panels, grid-tie inverter, mounting rails, and DC surge protection boxes are in transit to your site.",
    checkpoints: [
      { time: "08:15 AM", text: "Warehouse barcodes scanned for Inverter & Mono PERC modules", done: true },
      { time: "09:40 AM", text: "Loaded onto SunPower Logistics Vehicle (RJ-14-GA-4890)", done: true },
      { time: "10:15 AM", text: "Vehicle en route to customer destination (Driver: Rakesh)", done: true },
      { time: "Expected 11:30 AM", text: "Unloading at customer site with safety inspection", done: false },
    ],
  },
  {
    stepNumber: 4,
    name: "Rooftop Structure & Solar Installation",
    shortLabel: "Rooftop Mounting",
    iconType: "install",
    statusTitle: "Technicians At Work On Your Rooftop",
    deliveryEta: "Expected Complete Today by 2:30 PM",
    statusBadge: "Active Installation",
    liveStatusBanner: "Certified engineers actively bolting mounting structures & DC cables",
    description: "Hot-dip galvanized structure anchored, high-efficiency solar modules bolted, and dedicated chemical earthing pit completed.",
    checkpoints: [
      { time: "11:00 AM", text: "Site safety barriers and rooftop ladder harness secured", done: true },
      { time: "12:15 PM", text: "Galvanized aluminum structure assembled with windproof anchors", done: true },
      { time: "01:30 PM", text: "Solar modules mounted and interconnected in series strings", done: true },
      { time: "In Progress", text: "Copper chemical earthing pit wiring & surge arrester connection", done: false },
    ],
  },
  {
    stepNumber: 5,
    name: "Grid Net-Meter Sync & Commissioning",
    shortLabel: "Grid Sync & Testing",
    iconType: "sync",
    statusTitle: "Discom Net-Meter Sync & Live Yield Test",
    deliveryEta: "Commissioning Today by 4:45 PM",
    statusBadge: "Grid Commissioning",
    liveStatusBanner: "Testing live solar power generation & bidirectional Discom net-metering",
    description: "Inverter synchronized with electricity grid, live kilowatt-hour telemetry online, and Discom meter inspector handover.",
    checkpoints: [
      { time: "02:00 PM", text: "AC Distribution Box (ACDB) and DC isolator breakers connected", done: true },
      { time: "03:15 PM", text: "Discom JVVNL inspector verified bidirectional meter sync", done: true },
      { time: "04:00 PM", text: "Inverter powered on: 21.4 kWh solar generation confirmed live", done: true },
      { time: "Today 4:45 PM", text: "Final safety certificate & system handover signoff", done: false },
    ],
  },
  {
    stepNumber: 6,
    name: "Subsidy Disbursed & 25-Year Warranty",
    shortLabel: "100% Handed Over",
    iconType: "subsidy",
    statusTitle: "Plant 100% Commissioned & Subsidy Credited",
    deliveryEta: "Successfully Handed Over",
    statusBadge: "100% Complete & Active",
    liveStatusBanner: "Your solar plant is live! ₹78,000 subsidy credited & 25-year warranty active",
    description: "Central government DBT subsidy disbursed to bank account, 20-25 year digital warranty registered, and zero grid dependency achieved.",
    checkpoints: [
      { time: "22 Oct 2026", text: "Grid synchronization testing passed 100% with zero faults", done: true },
      { time: "25 Oct 2026", text: "PFMS token released by Ministry of New and Renewable Energy", done: true },
      { time: "30 Oct 2026", text: "₹78,000 PM Surya Ghar DBT credited to customer bank account", done: true },
      { time: "Active Now", text: "25-Year Tier-1 Linear Performance Warranty running", done: true },
    ],
  },
];

function renderMilestoneIcon(type: string, className = "w-5 h-5") {
  switch (type) {
    case "order":
      return <FileTextIcon className={className} />;
    case "survey":
      return <ShieldCheckIcon className={className} />;
    case "dispatch":
      return <PackageIcon className={className} />;
    case "install":
      return <WrenchIcon className={className} />;
    case "sync":
      return <ZapIcon className={className} />;
    case "subsidy":
      return <CheckCircleIcon className={className} />;
    default:
      return <ZapIcon className={className} />;
  }
}

export default function CustomerWorkProgressBar({ customer, orderId }: CustomerWorkProgressBarProps) {
  const [currentStep, setCurrentStep] = useState<number>(customer.progressStep || 5);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedMilestoneNum, setSelectedMilestoneNum] = useState<number>(customer.progressStep || 5);

  useEffect(() => {
    setCurrentStep(customer.progressStep || 5);
    setSelectedMilestoneNum(customer.progressStep || 5);
  }, [customer.progressStep, customer.key]);

  const activeMilestone = MILESTONE_DEFINITIONS.find((m) => m.stepNumber === currentStep) || MILESTONE_DEFINITIONS[4];
  const viewedMilestone = MILESTONE_DEFINITIONS.find((m) => m.stepNumber === selectedMilestoneNum) || activeMilestone;

  // Assigned engineer data
  const engineer = ALL_16_EMPLOYEES["TECH-001"]; // Rohit Meena

  // Calculate percentage width for delivery bar
  const progressPercent = Math.min(100, Math.max(12, ((currentStep - 1) / (MILESTONE_DEFINITIONS.length - 1)) * 100));

  return (
    <div className="bg-white rounded-2xl border border-[#DEDCDC] shadow-md overflow-hidden">
      {/* Top Delivery-App Banner Header */}
      <div className="bg-gradient-to-r from-[#191D23] via-[#57707A] to-[#7B919C] text-white p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white flex-shrink-0 shadow-inner">
            {renderMilestoneIcon(activeMilestone.iconType, "w-6 h-6 text-white")}
            {currentStep < 6 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5BAC4] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#C5BAC4] border-2 border-[#191D23]"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE PROGRESS TRACKER
              </span>
              <span className="text-[11px] font-mono text-white/90 font-bold">
                {orderId || `ORD-${customer.key.toUpperCase()}-2026`}
              </span>
              <span className="text-[11px] text-white/80 font-medium">
                • {customer.system}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug">
              {activeMilestone.statusTitle}
            </h3>

            <p className="text-xs text-white/90 flex items-center gap-1.5 mt-0.5">
              <ClockIcon className="w-3.5 h-3.5 text-white/80" />
              <span className="font-semibold">{activeMilestone.deliveryEta}</span>
              <span className="text-white/60">•</span>
              <span className="text-white/80">Site: {customer.address}</span>
            </p>
          </div>
        </div>

        {/* Top Right Controls & Toggle */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/20">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">Overall Progress</span>
            <span className="text-sm font-black text-white">
              Stage {currentStep} of 6 ({Math.round(progressPercent)}%)
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <span>{isExpanded ? "Hide Details" : "View Full Activity"}</span>
            <span className="text-[10px]">{isExpanded ? "▲" : "▼"}</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* HORIZONTAL PROGRESS BAR WITH MOVING STEPPER PIN               */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 bg-[#F7F8F9] border-b border-[#DEDCDC]">
        {/* Step indicator header */}
        <div className="flex items-center justify-between text-xs font-bold text-[#57707A] mb-4">
          <span className="flex items-center gap-1.5 text-[#191D23]">
            <PackageIcon className="w-4 h-4 text-[#57707A]" /> Solar Delivery &amp; Rooftop Commissioning Track
          </span>
          <span className="text-[11px] text-[#57707A] font-semibold">
            {currentStep === 6 ? "Plant 100% Commissioned" : `Active: Step ${currentStep} (${activeMilestone.shortLabel})`}
          </span>
        </div>

        {/* Visual Progress Track */}
        <div className="relative pt-6 pb-4 px-2 sm:px-6">
          {/* Background Track Line */}
          <div className="absolute top-10 left-6 right-6 h-2 bg-[#DEDCDC] rounded-full z-0"></div>

          {/* Animated Filled Progress Line */}
          <div
            className="absolute top-10 left-6 h-2 bg-gradient-to-r from-[#191D23] via-[#57707A] to-[#7B919C] rounded-full z-0 transition-all duration-700 ease-out shadow-xs"
            style={{ width: `calc(${progressPercent}% - 24px)` }}
          ></div>

          {/* Moving Vehicle / Worker Pin Indicator Above Line */}
          <div
            className="absolute -top-1 z-20 transition-all duration-700 ease-out -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `calc(1.5rem + (100% - 3rem) * ${(currentStep - 1) / 5})` }}
          >
            <div className="px-2.5 py-0.5 bg-[#191D23] text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap animate-bounce border border-white">
              <span>{currentStep === 6 ? "COMPLETE" : "ON SITE NOW"}</span>
            </div>
            <div className="w-2 h-2 bg-[#191D23] rotate-45 -mt-1"></div>
          </div>

          {/* 6 Milestone Step Nodes */}
          <div className="relative z-10 flex items-center justify-between">
            {MILESTONE_DEFINITIONS.map((step) => {
              const isCompleted = step.stepNumber < currentStep;
              const isCurrent = step.stepNumber === currentStep;
              const isSelected = step.stepNumber === selectedMilestoneNum;

              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => setSelectedMilestoneNum(step.stepNumber)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#57707A] rounded-xl p-1 transition"
                >
                  {/* Circle Node */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm ${
                      isCompleted
                        ? "bg-[#57707A] text-white border-2 border-white ring-2 ring-[#7B919C]/40"
                        : isCurrent
                        ? "bg-[#191D23] text-white border-2 border-white ring-4 ring-[#C5BAC4] scale-110"
                        : "bg-white text-[#989DAA] border-2 border-[#DEDCDC]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-4 h-4 text-white stroke-[3]" />
                    ) : (
                      renderMilestoneIcon(step.iconType, "w-4 h-4")
                    )}
                  </div>

                  {/* Step Label below */}
                  <span
                    className={`mt-2 text-[10px] sm:text-[11px] font-bold text-center max-w-[65px] sm:max-w-[85px] leading-tight transition ${
                      isCurrent
                        ? "text-[#191D23] font-extrabold"
                        : isCompleted
                        ? "text-[#57707A]"
                        : "text-[#989DAA]"
                    } ${isSelected ? "underline decoration-2 underline-offset-2" : ""}`}
                  >
                    {step.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Simulation / Interactive Step Switcher */}
        <div className="mt-3 pt-3 border-t border-[#DEDCDC] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-[#7B919C] font-medium">
            <span>Click any milestone above or preview progress steps:</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const prev = Math.max(1, currentStep - 1);
                setCurrentStep(prev);
                setSelectedMilestoneNum(prev);
              }}
              disabled={currentStep === 1}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 disabled:opacity-40 text-[#191D23] border border-[#DEDCDC] rounded-lg font-bold text-[11px] transition"
            >
              &larr; Previous Stage
            </button>
            <span className="px-2 py-1 bg-white border border-[#DEDCDC] font-mono font-bold text-[11px] text-[#191D23] rounded-lg">
              Stage {currentStep} / 6
            </span>
            <button
              onClick={() => {
                const next = Math.min(6, currentStep + 1);
                setCurrentStep(next);
                setSelectedMilestoneNum(next);
              }}
              disabled={currentStep === 6}
              className="px-2.5 py-1 bg-[#191D23] hover:bg-[#57707A] disabled:opacity-40 text-white rounded-lg font-bold text-[11px] transition"
            >
              Next Stage &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* EXPANDABLE DELIVERY DETAILS & ASSIGNED ENGINEER CARD         */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-white space-y-5 animate-in fade-in duration-300">
          {/* Active Stage Live Description Banner */}
          <div className="bg-[#F7F8F9] border border-[#DEDCDC] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#DEDCDC] flex items-center justify-center text-[#57707A] flex-shrink-0 shadow-2xs">
                {renderMilestoneIcon(viewedMilestone.iconType, "w-5 h-5")}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-extrabold text-[#191D23]">
                    Stage {viewedMilestone.stepNumber}: {viewedMilestone.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#57707A] border border-[#C5BAC4]">
                    {viewedMilestone.statusBadge}
                  </span>
                </div>
                <p className="text-xs text-[#57707A] mt-1 leading-relaxed">
                  {viewedMilestone.description}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 text-right sm:border-l sm:border-[#DEDCDC] sm:pl-4">
              <span className="text-[10px] font-bold text-[#7B919C] uppercase block">Stage Status</span>
              <span className="text-xs font-black text-[#191D23]">
                {viewedMilestone.stepNumber < currentStep
                  ? "Verified Done"
                  : viewedMilestone.stepNumber === currentStep
                  ? "Active In-Progress"
                  : "Scheduled Next"}
              </span>
            </div>
          </div>

          {/* Two-Column Grid: Delivery Checkpoints & Assigned Engineer Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Live Checkpoints Activity Log */}
            <div className="lg:col-span-2 space-y-2.5">
              <h5 className="text-xs font-extrabold text-[#191D23] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileTextIcon className="w-4 h-4 text-[#57707A]" /> Live Work Checkpoints &amp; Telemetry
                </span>
                <span className="text-[10px] text-[#7B919C] font-semibold">
                  Timestamped Activity Feed
                </span>
              </h5>

              <div className="space-y-2">
                {viewedMilestone.checkpoints.map((cp, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                      cp.done
                        ? "bg-[#F7F8F9] border-[#DEDCDC]"
                        : "bg-white border-[#DEDCDC] opacity-75"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0 ${
                        cp.done
                          ? "bg-[#57707A] text-white"
                          : "bg-gray-100 text-gray-500 border border-gray-300"
                      }`}
                    >
                      {cp.done ? <CheckIcon className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-medium text-[#191D23]">
                        {cp.text}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#7B919C] whitespace-nowrap bg-white px-2 py-0.5 rounded border border-[#DEDCDC] self-start sm:self-auto">
                        {cp.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Assigned Delivery Engineer Card */}
            <div className="bg-[#F7F8F9] rounded-2xl border border-[#DEDCDC] p-4 space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#57707A]">
                    Your Installation Partner
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#57707A] border border-[#C5BAC4]">
                    On Duty
                  </span>
                </div>

                {/* Engineer Profile */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-12 h-12 rounded-full bg-[#191D23] text-white flex items-center justify-center text-xl font-bold shadow-md">
                    <HardHatIcon className="w-6 h-6 text-[#C5BAC4]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#191D23] flex items-center gap-1">
                      <span>{engineer.name}</span>
                      <CheckCircleIcon className="w-3.5 h-3.5 text-[#57707A] inline" />
                    </h5>
                    <p className="text-[10px] text-[#7B919C] font-medium">
                      {engineer.specialization.split("&")[0]}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#191D23] mt-0.5">
                      <StarIcon className="w-3 h-3 fill-[#191D23] text-[#191D23]" />
                      <span>4.95</span>
                      <span className="text-[#7B919C] font-normal">(142 rooftop plants)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-white rounded-xl border border-[#DEDCDC] text-[11px] text-[#57707A] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#7B919C]">Order Ref:</span>
                    <span className="font-mono font-bold text-[#191D23]">{customer.inverterSerial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7B919C]">System Spec:</span>
                    <span className="font-semibold text-[#191D23]">{customer.system}</span>
                  </div>
                </div>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="pt-2 border-t border-[#DEDCDC] space-y-1.5">
                <a
                  href={`tel:${engineer.phone.replace(/\s+/g, "")}`}
                  className="w-full py-2 bg-[#191D23] hover:bg-[#57707A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <PhoneIcon className="w-3.5 h-3.5" /> Call Lead Engineer
                </a>

                <a
                  href={`https://wa.me/${engineer.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-white hover:bg-gray-50 text-[#191D23] border border-[#DEDCDC] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <MessageSquareIcon className="w-3.5 h-3.5 text-[#57707A]" /> WhatsApp Live Updates
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
