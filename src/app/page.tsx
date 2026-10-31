"use client";

import PageShell from "@/components/PageShell";
import { leads, orders, serviceTickets, dashboardStats } from "@/data/mockData";
import Link from "next/link";

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
    Dispatched: "bg-[#FAF4F7] text-[#734960] border-[#8E687F]/30",
    "In Progress": "bg-[#FAF4F7] text-[#734960] border-[#8E687F]/30",
    "Installation Scheduled": "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40",
    Confirmed: "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40",
  };
  return map[status] || "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB]";
}

function getTicketStatusBadge(status: string) {
  const map: Record<string, string> = {
    Open: "bg-[#FEF2F2] text-[#DC2626] border-red-200",
    Assigned: "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40",
    "In Progress": "bg-[#FAF4F7] text-[#734960] border-[#8E687F]/30",
    Resolved: "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40",
    Closed: "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB]",
  };
  return map[status] || "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB]";
}

function getPriorityBadge(priority: string) {
  const map: Record<string, string> = {
    Low: "bg-[#EBF5EC] text-[#5B965E]",
    Medium: "bg-[#FEF6EB] text-[#DA9B40]",
    High: "bg-[#FAF4F7] text-[#734960]",
    Critical: "bg-[#FEF2F2] text-[#DC2626]",
  };
  return map[priority] || "bg-gray-100 text-[#333333]";
}

// ---------- Lead pipeline counts ----------
const leadStages = [
  { stage: "New Lead", color: "bg-[#734960]" },
  { stage: "Contacted", color: "bg-[#8E687F]" },
  { stage: "Survey Scheduled", color: "bg-[#F4B860]" },
  { stage: "Survey Done", color: "bg-[#DA9B40]" },
  { stage: "Quote Sent", color: "bg-[#8E687F]" },
  { stage: "Converted", color: "bg-[#78B77B]" },
  { stage: "Lost", color: "bg-red-300" },
];

const leadStageCounts = leadStages.map((s) => ({
  ...s,
  count: leads.filter((l) => l.stage === s.stage).length,
}));
const totalLeads = leads.length;

// ---------- Active tickets ----------
const activeTickets = serviceTickets.filter(
  (t) => t.status === "Open" || t.status === "Assigned" || t.status === "In Progress"
);

export default function DashboardPage() {
  const maxRevenue = Math.max(...dashboardStats.monthlyData.map((d) => d.revenue));

  return (
    <PageShell>
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <span>📊</span> Executive Performance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            SunPower Solutions — Month-end operations, hardware costs, and profit overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/quotations"
            className="px-3.5 py-2 bg-[#734960] hover:bg-[#5A354A] text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            📋 Quick Quote
          </Link>
          <Link
            href="/service"
            className="px-3.5 py-2 bg-white hover:bg-[#F5F7FA] text-[#734960] border border-[#734960]/30 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            🔧 Breakdowns
          </Link>
        </div>
      </div>

      {/* ── ROW 1: 4 KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Installations */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#8E687F] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                Monthly Installations
              </p>
              <p className="text-2xl font-extrabold text-[#333333] mt-1">
                {dashboardStats.totalInstallations}
                <span className="text-sm font-semibold text-[#666666]">
                  /{dashboardStats.monthlyTarget}
                </span>
              </p>
            </div>
            <div className="w-11 h-11 bg-[#FAF4F7] text-[#8E687F] rounded-xl flex items-center justify-center text-xl font-bold">
              🏗️
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-[#F5F7FA] rounded-full h-2 overflow-hidden border border-[#E4E7EB]">
              <div
                className="bg-[#8E687F] h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(dashboardStats.totalInstallations / dashboardStats.monthlyTarget) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-[#666666] mt-1.5 flex justify-between">
              <span>85% of monthly goal</span>
              <span className="font-semibold text-[#8E687F]">6 remaining</span>
            </p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#78B77B] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                Monthly Revenue
              </p>
              <p className="text-2xl font-extrabold text-[#78B77B] mt-1">
                {formatCurrencyLakhs(dashboardStats.totalRevenue)}
              </p>
            </div>
            <div className="w-11 h-11 bg-[#EBF5EC] text-[#78B77B] rounded-xl flex items-center justify-center text-xl font-bold">
              💰
            </div>
          </div>
          <p className="text-[11px] text-[#5B965E] font-medium mt-3 flex items-center gap-1">
            <span>▲ +14% vs last month</span>
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#734960] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                Net Profit
              </p>
              <p className="text-2xl font-extrabold text-[#734960] mt-1">
                {formatCurrencyLakhs(dashboardStats.netProfit)}
              </p>
            </div>
            <div className="w-11 h-11 bg-[#FAF4F7] text-[#734960] rounded-xl flex items-center justify-center text-xl font-bold">
              📈
            </div>
          </div>
          <p className="text-[11px] text-[#734960] font-medium mt-3">
            Hardware Cost: {formatCurrencyLakhs(dashboardStats.totalCost)} (34% Margin)
          </p>
        </div>

        {/* Open Service Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#F4B860] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                Open Service Tickets
              </p>
              <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">
                {dashboardStats.openTickets}
              </p>
            </div>
            <div className="w-11 h-11 bg-[#FEF6EB] text-[#DA9B40] rounded-xl flex items-center justify-center text-xl font-bold">
              🎫
            </div>
          </div>
          <p className="text-[11px] text-[#DA9B40] font-medium mt-3">
            {dashboardStats.resolvedTickets} resolved this month
          </p>
        </div>
      </div>

      {/* ── ROW 2: Monthly Performance & Lead Pipeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#333333]">Revenue vs Profit (Last 6 Months)</h2>
              <p className="text-[11px] text-[#666666]">Comparing gross turnover against net earnings</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#666666]">
                <span className="w-3 h-3 rounded bg-[#8E687F] inline-block" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[#666666]">
                <span className="w-3 h-3 rounded bg-[#78B77B] inline-block" />
                Profit
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-[#E4E7EB] pb-2">
            {dashboardStats.monthlyData.map((d) => {
              const revHeight = (d.revenue / maxRevenue) * 100;
              const profHeight = (d.profit / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Revenue Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-[#8E687F] rounded-t transition-all hover:opacity-85"
                      style={{ height: `${revHeight}%` }}
                      title={`${d.month} Revenue: ${formatCurrencyLakhs(d.revenue)}`}
                    />
                    {/* Profit Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-[#78B77B] rounded-t transition-all hover:opacity-85"
                      style={{ height: `${profHeight}%` }}
                      title={`${d.month} Profit: ${formatCurrencyLakhs(d.profit)}`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#666666]">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Pipeline Summary */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#333333]">Lead Pipeline Distribution</h2>
              <p className="text-[11px] text-[#666666]">{totalLeads} active prospective inquiries</p>
            </div>
            <Link href="/leads" className="text-xs font-semibold text-[#734960] hover:underline">
              View Kanban ➔
            </Link>
          </div>

          {/* Stacked bar */}
          <div className="w-full bg-[#F5F7FA] rounded-full h-3.5 flex overflow-hidden border border-[#E4E7EB]">
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
              <div key={s.stage} className="flex items-center gap-2 text-xs bg-[#F5F7FA] p-2 rounded-xl border border-[#E4E7EB]/60">
                <span className={`w-2.5 h-2.5 rounded-full ${s.color} flex-shrink-0`} />
                <span className="text-[#333333] font-medium truncate">{s.stage}</span>
                <span className="ml-auto font-bold text-[#734960]">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Secondary Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Surveys */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#F4B860] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              Pending Roof Surveys
            </p>
            <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">
              {dashboardStats.pendingSurveys}
            </p>
            <p className="text-[11px] text-[#666666] mt-1">Scheduled for this week</p>
          </div>
          <div className="w-11 h-11 bg-[#FEF6EB] text-[#DA9B40] rounded-xl flex items-center justify-center text-xl font-bold">
            📐
          </div>
        </div>

        {/* Subsidies Credited */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#78B77B] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              Subsidies Credited
            </p>
            <p className="text-2xl font-extrabold text-[#78B77B] mt-1">
              {formatCurrencyLakhs(dashboardStats.subsidiesCredited)}
            </p>
            <p className="text-[11px] text-[#5B965E] font-medium mt-1">
              {formatCurrencyLakhs(dashboardStats.subsidiesPending)} in pipeline
            </p>
          </div>
          <div className="w-11 h-11 bg-[#EBF5EC] text-[#78B77B] rounded-xl flex items-center justify-center text-xl font-bold">
            🏛️
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#8E687F] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              Customer Satisfaction
            </p>
            <p className="text-2xl font-extrabold text-[#734960] mt-1">
              {dashboardStats.customerSatisfaction}
              <span className="text-sm font-semibold text-[#666666]">/5.0</span>
            </p>
            <p className="text-[11px] text-[#F4B860] mt-1 font-bold">
              ★★★★★ <span className="text-[#666666] font-normal font-sans">(150+ reviews)</span>
            </p>
          </div>
          <div className="w-11 h-11 bg-[#FAF4F7] text-[#8E687F] rounded-xl flex items-center justify-center text-xl font-bold">
            ⭐
          </div>
        </div>
      </div>

      {/* ── ROW 4: Tables (Recent Orders & Active Tickets) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-[#E4E7EB] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E4E7EB] flex items-center justify-between bg-white">
            <div>
              <h2 className="text-sm font-bold text-[#333333]">Recent Orders</h2>
              <p className="text-[11px] text-[#666666]">Latest installation bookings</p>
            </div>
            <Link href="/orders" className="text-xs font-semibold text-[#734960] hover:underline">
              All Orders ➔
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#666666] font-semibold border-b border-[#E4E7EB]">
                <tr>
                  <th className="px-4 py-2.5">Order ID</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">System</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EB]/60">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#734960]">{o.id}</td>
                    <td className="px-4 py-3 font-semibold text-[#333333]">{o.customerName}</td>
                    <td className="px-4 py-3 text-[#666666]">
                      {o.capacity} {o.gridType}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#333333]">
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
        <div className="bg-white rounded-2xl border border-[#E4E7EB] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E4E7EB] flex items-center justify-between bg-white">
            <div>
              <h2 className="text-sm font-bold text-[#333333]">Active Service Tickets</h2>
              <p className="text-[11px] text-[#666666]">Pending repairs and breakdowns</p>
            </div>
            <Link href="/service" className="text-xs font-semibold text-[#734960] hover:underline">
              All Tickets ➔
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#666666] font-semibold border-b border-[#E4E7EB]">
                <tr>
                  <th className="px-4 py-2.5">Ticket ID</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">Issue</th>
                  <th className="px-4 py-2.5 text-center">Priority</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EB]/60">
                {activeTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#DA9B40]">{t.id}</td>
                    <td className="px-4 py-3 font-semibold text-[#333333]">{t.customerName}</td>
                    <td className="px-4 py-3 text-[#666666] truncate max-w-[140px]">{t.issueType}</td>
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
    </PageShell>
  );
}
