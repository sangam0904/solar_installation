"use client";

import PageShell from "@/components/PageShell";
import AdminUserLoginLogsSection from "@/components/AdminUserLoginLogsSection";
import { useState, useEffect } from "react";
import { dashboardStats } from "@/data/mockData";
import Link from "next/link";
import {
  DashboardIcon,
  FileTextIcon,
  WrenchIcon,
  PackageIcon,
  IndianRupeeIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  HardHatIcon,
  LandmarkIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
} from "@/components/Icons";

// ---------- Helpers ----------
function formatCurrencyLakhs(amount: number): string {
  const lakhs = amount / 100000;
  return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
}

function formatCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getOrderStatusBadge(status: string) {
  const map: Record<string, string> = {
    Completed: "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40",
    Installed: "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40",
    Dispatched: "bg-[#F7EEF2] text-[#4A355E] border-[#D7B6C7]",
    "In Progress": "bg-[#F7EEF2] text-[#6D5284] border-[#B39CCB]/50",
    "Installation Scheduled": "bg-[#EBCED6]/50 text-[#4A355E] border-[#D7B6C7]",
    Confirmed: "bg-[#EBCED6]/50 text-[#6D5284] border-[#D7B6C7]",
  };
  return map[status] || "bg-[#F7EEF2] text-[#6D5284] border-[#EBCED6]";
}

function getTicketStatusBadge(status: string) {
  const map: Record<string, string> = {
    Open: "bg-[#FEF2F2] text-[#DC2626] border-red-200",
    Assigned: "bg-[#EBCED6]/60 text-[#4A355E] border-[#D7B6C7]",
    "In Progress": "bg-[#F7EEF2] text-[#6D5284] border-[#B39CCB]",
    Resolved: "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40",
    Closed: "bg-[#F7EEF2] text-[#8D73A8] border-[#EBCED6]",
  };
  return map[status] || "bg-[#F7EEF2] text-[#6D5284] border-[#EBCED6]";
}

function getPriorityBadge(priority: string) {
  const map: Record<string, string> = {
    Low: "bg-[#EBF5EC] text-[#5B965E]",
    Medium: "bg-[#EBCED6] text-[#4A355E]",
    High: "bg-[#D7B6C7] text-[#372447] font-bold",
    Critical: "bg-[#FEF2F2] text-[#DC2626] font-bold",
  };
  return map[priority] || "bg-gray-100 text-[#261C33]";
}

// ---------- Lead pipeline counts ----------
const leadStages = [
  { stage: "New Lead", color: "bg-[#4A355E]" },
  { stage: "Contacted", color: "bg-[#6D5284]" },
  { stage: "Survey Scheduled", color: "bg-[#8D73A8]" },
  { stage: "Survey Done", color: "bg-[#B39CCB]" },
  { stage: "Quote Sent", color: "bg-[#D7B6C7]" },
  { stage: "Converted", color: "bg-[#78B77B]" },
  { stage: "Lost", color: "bg-red-300" },
];

// Computed inside component

export default function DashboardPage() {
  const [liveLeads, setLiveLeads] = useState<any[]>([]);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [liveTickets, setLiveTickets] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/solar/data")
      .then((r) => r.json())
      .then((data) => {
        if (data.leads) setLiveLeads(data.leads);
        if (data.orders) setLiveOrders(data.orders);
        if (data.tickets) setLiveTickets(data.tickets);
      })
      .catch((e) => console.warn(e));

    // Auto-scroll to #user-logs if clicked in sidebar or directly navigated
    const handleHashScroll = () => {
      if (typeof window !== "undefined" && window.location.hash === "#user-logs") {
        setTimeout(() => {
          const el = document.getElementById("user-logs");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 200);
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);
  const leadStageCounts = leadStages.map((s) => ({
    ...s,
    count: liveLeads.filter((l) => l.stage === s.stage).length,
  }));
  const totalLeads = liveLeads.length;

  const activeTickets = liveTickets.filter(
    (t) => t.status === "Open" || t.status === "Assigned" || t.status === "In Progress"
  );

  const maxRevenue = Math.max(...dashboardStats.monthlyData.map((d) => d.revenue));

  return (
    <PageShell>
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#261C33] flex items-center gap-2">
            <DashboardIcon className="w-6 h-6 text-[#4A355E]" />
            <span>Executive Performance Dashboard</span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
              🐘 PostgreSQL Live ({totalLeads} Leads • {liveOrders.length} Orders)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6D5284] mt-0.5">
            SunPower Solutions — Month-end operations, hardware costs, and profit overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/quotations"
            className="px-3.5 py-2 bg-[#4A355E] hover:bg-[#6D5284] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <FileTextIcon className="w-3.5 h-3.5" />
            <span>Quick Quote</span>
          </Link>
          <Link
            href="/service"
            className="px-3.5 py-2 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#D7B6C7] rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <WrenchIcon className="w-3.5 h-3.5 text-[#6D5284]" />
            <span>Breakdowns</span>
          </Link>
        </div>
      </div>

      {/* ── ROW 1: 4 KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Installations */}
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#4A355E] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#6D5284] uppercase tracking-wider">
                Monthly Installations
              </p>
              <p className="text-2xl font-extrabold text-[#261C33] mt-1">
                {dashboardStats.totalInstallations}
                <span className="text-sm font-semibold text-[#8D73A8]">
                  /{dashboardStats.monthlyTarget}
                </span>
              </p>
            </div>
            <div className="w-11 h-11 bg-[#F7EEF2] text-[#4A355E] rounded-xl flex items-center justify-center border border-[#EBCED6]">
              <PackageIcon className="w-5 h-5 text-[#4A355E]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-[#F7EEF2] rounded-full h-2 overflow-hidden border border-[#EBCED6]">
              <div
                className="bg-[#6D5284] h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(dashboardStats.totalInstallations / dashboardStats.monthlyTarget) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-[#6D5284] mt-1.5 flex justify-between">
              <span>85% of monthly goal</span>
              <span className="font-semibold text-[#4A355E]">6 remaining</span>
            </p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#6D5284] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#6D5284] uppercase tracking-wider">
                Monthly Revenue
              </p>
              <p className="text-2xl font-extrabold text-[#4A355E] mt-1">
                {formatCurrencyLakhs(dashboardStats.totalRevenue)}
              </p>
            </div>
            <div className="w-11 h-11 bg-[#F7EEF2] text-[#6D5284] rounded-xl flex items-center justify-center border border-[#EBCED6]">
              <IndianRupeeIcon className="w-5 h-5 text-[#6D5284]" />
            </div>
          </div>
          <p className="text-[11px] text-[#5B965E] font-medium mt-3 flex items-center gap-1">
            <span>▲ +14% vs last month</span>
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#8D73A8] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#6D5284] uppercase tracking-wider">
                Net Profit
              </p>
              <p className="text-2xl font-extrabold text-[#6D5284] mt-1">
                {formatCurrencyLakhs(dashboardStats.netProfit)}
              </p>
            </div>
            <div className="w-11 h-11 bg-[#F7EEF2] text-[#8D73A8] rounded-xl flex items-center justify-center border border-[#EBCED6]">
              <TrendingUpIcon className="w-5 h-5 text-[#8D73A8]" />
            </div>
          </div>
          <p className="text-[11px] text-[#4A355E] font-medium mt-3">
            Hardware Cost: {formatCurrencyLakhs(dashboardStats.totalCost)} (34% Margin)
          </p>
        </div>

        {/* Open Service Tickets */}
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#B39CCB] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#6D5284] uppercase tracking-wider">
                Open Service Tickets
              </p>
              <p className="text-2xl font-extrabold text-[#8D73A8] mt-1">
                {dashboardStats.openTickets}
              </p>
            </div>
            <div className="w-11 h-11 bg-[#F7EEF2] text-[#B39CCB] rounded-xl flex items-center justify-center border border-[#EBCED6]">
              <AlertCircleIcon className="w-5 h-5 text-[#8D73A8]" />
            </div>
          </div>
          <p className="text-[11px] text-[#6D5284] font-medium mt-3">
            {dashboardStats.resolvedTickets} resolved this month
          </p>
        </div>
      </div>

      {/* ── ROW 2: Monthly Performance & Lead Pipeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <div className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-[#EBCED6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#261C33]">Revenue vs Profit (Last 6 Months)</h2>
              <p className="text-[11px] text-[#6D5284]">Comparing gross turnover against net earnings</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#6D5284]">
                <span className="w-3 h-3 rounded bg-[#4A355E] inline-block" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[#6D5284]">
                <span className="w-3 h-3 rounded bg-[#8D73A8] inline-block" />
                Profit
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-[#EBCED6] pb-2">
            {dashboardStats.monthlyData.map((d) => {
              const revHeight = (d.revenue / maxRevenue) * 100;
              const profHeight = (d.profit / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Revenue Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-[#4A355E] rounded-t transition-all hover:opacity-85"
                      style={{ height: `${revHeight}%` }}
                      title={`${d.month} Revenue: ${formatCurrencyLakhs(d.revenue)}`}
                    />
                    {/* Profit Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-[#8D73A8] rounded-t transition-all hover:opacity-85"
                      style={{ height: `${profHeight}%` }}
                      title={`${d.month} Profit: ${formatCurrencyLakhs(d.profit)}`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#6D5284]">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Pipeline Summary */}
        <div className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-[#EBCED6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#261C33]">Lead Pipeline Distribution</h2>
              <p className="text-[11px] text-[#6D5284]">{totalLeads} active prospective inquiries</p>
            </div>
            <Link href="/leads" className="text-xs font-semibold text-[#4A355E] hover:underline flex items-center gap-1">
              <span>View Kanban</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stacked bar */}
          <div className="w-full bg-[#F7EEF2] rounded-full h-3.5 flex overflow-hidden border border-[#EBCED6]">
            {leadStageCounts.map((s) => {
              const pct = (s.count / totalLeads) * 100;
              return (
                <div
                  key={s.stage}
                  className={`${s.color} h-full transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${s.stage}: ${s.count}`}
                />
              );
            })}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {leadStageCounts.map((s) => (
              <div key={s.stage} className="flex items-center gap-2 text-xs bg-[#F7EEF2] p-2 rounded-xl border border-[#EBCED6]">
                <span className={`w-2.5 h-2.5 rounded-full ${s.color} flex-shrink-0`} />
                <span className="text-[#261C33] font-medium truncate">{s.stage}</span>
                <span className="ml-auto font-bold text-[#4A355E]">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Secondary Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Surveys */}
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#6D5284] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#6D5284] uppercase tracking-wider">
              Pending Roof Surveys
            </p>
            <p className="text-2xl font-extrabold text-[#4A355E] mt-1">
              {dashboardStats.pendingSurveys}
            </p>
            <p className="text-[11px] text-[#6D5284] mt-1">Scheduled for this week</p>
          </div>
          <div className="w-11 h-11 bg-[#F7EEF2] text-[#6D5284] rounded-xl flex items-center justify-center border border-[#EBCED6]">
            <HardHatIcon className="w-5 h-5 text-[#6D5284]" />
          </div>
        </div>

        {/* Subsidies Credited */}
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#8D73A8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#6D5284] uppercase tracking-wider">
              Subsidies Credited
            </p>
            <p className="text-2xl font-extrabold text-[#6D5284] mt-1">
              {formatCurrencyLakhs(dashboardStats.subsidiesCredited)}
            </p>
            <p className="text-[11px] text-[#5B965E] font-medium mt-1">
              {formatCurrencyLakhs(dashboardStats.subsidiesPending)} in pipeline
            </p>
          </div>
          <div className="w-11 h-11 bg-[#F7EEF2] text-[#8D73A8] rounded-xl flex items-center justify-center border border-[#EBCED6]">
            <LandmarkIcon className="w-5 h-5 text-[#8D73A8]" />
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#EBCED6] border-l-4 border-l-[#4A355E] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#6D5284] uppercase tracking-wider">
              Customer Satisfaction
            </p>
            <p className="text-2xl font-extrabold text-[#4A355E] mt-1">
              {dashboardStats.customerSatisfaction}
              <span className="text-sm font-semibold text-[#8D73A8]">/5.0</span>
            </p>
            <p className="text-[11px] text-[#6D5284] mt-1 font-semibold">
              4.9 Rating <span className="text-[#8D73A8] font-normal font-sans">(150+ verified reviews)</span>
            </p>
          </div>
          <div className="w-11 h-11 bg-[#F7EEF2] text-[#4A355E] rounded-xl flex items-center justify-center border border-[#EBCED6]">
            <ShieldCheckIcon className="w-5 h-5 text-[#4A355E]" />
          </div>
        </div>
      </div>

      {/* ── ROW 4: Tables (Recent Orders & Active Tickets) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#EBCED6] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#EBCED6] flex items-center justify-between bg-white">
            <div>
              <h2 className="text-sm font-bold text-[#261C33]">Recent Orders</h2>
              <p className="text-[11px] text-[#6D5284]">Latest installation bookings</p>
            </div>
            <Link href="/orders" className="text-xs font-semibold text-[#4A355E] hover:underline flex items-center gap-1">
              <span>All Orders</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7EEF2] text-[#6D5284] font-semibold border-b border-[#EBCED6]">
                <tr>
                  <th className="px-4 py-2.5">Order ID</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">System</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBCED6]/60">
                {liveOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-[#F7EEF2]/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#4A355E]">{o.id}</td>
                    <td className="px-4 py-3 font-semibold text-[#261C33]">{o.customerName}</td>
                    <td className="px-4 py-3 text-[#6D5284]">
                      {o.capacity} {o.gridType}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#261C33]">
                      {formatCurrencyFull(o.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getOrderStatusBadge(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Service Tickets */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#EBCED6] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#EBCED6] flex items-center justify-between bg-white">
            <div>
              <h2 className="text-sm font-bold text-[#261C33]">Active Service Tickets</h2>
              <p className="text-[11px] text-[#6D5284]">Pending repairs and breakdowns</p>
            </div>
            <Link href="/service" className="text-xs font-semibold text-[#4A355E] hover:underline flex items-center gap-1">
              <span>All Tickets</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7EEF2] text-[#6D5284] font-semibold border-b border-[#EBCED6]">
                <tr>
                  <th className="px-4 py-2.5">Ticket ID</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">Issue</th>
                  <th className="px-4 py-2.5 text-center">Priority</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBCED6]/60">
                {activeTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F7EEF2]/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#6D5284]">{t.id}</td>
                    <td className="px-4 py-3 font-semibold text-[#261C33]">{t.customerName}</td>
                    <td className="px-4 py-3 text-[#6D5284] truncate max-w-[140px]">{t.issueType}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge(
                          t.priority
                        )}`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getTicketStatusBadge(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── ROW 5: Real-Time User Login & Activity Logs ── */}
      <AdminUserLoginLogsSection />
    </PageShell>
  );
}
