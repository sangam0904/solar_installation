"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  UserLoginLog,
  getUserLoginLogs,
  recordUserLogin,
  resetUserLoginLogs,
  clearUserLoginLogs,
  formatLogTime,
  LogUserRole,
} from "@/data/userLogs";
import {
  UsersIcon,
  CrownIcon,
  HardHatIcon,
  UserIcon,
  SearchIcon,
  RefreshIcon,
  DownloadIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  PlusIcon,
  ZapIcon,
  CheckIcon,
} from "@/components/Icons";

export default function AdminUserLoginLogsSection() {
  const [logs, setLogs] = useState<UserLoginLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"all" | LogUserRole>("all");
  const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Quick Simulation Modal state for Admin testing
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simName, setSimName] = useState("Pooja Sharma");
  const [simEmail, setSimEmail] = useState("pooja.sharma@gmail.com");
  const [simRole, setSimRole] = useState<LogUserRole>("customer");
  const [simMethod, setSimMethod] = useState("Email & OTP Sign-in");
  const [simSuccessToast, setSimSuccessToast] = useState(false);

  // Load and refresh logs from storage
  const reloadLogs = () => {
    const current = getUserLoginLogs();
    setLogs(current);
    setLastRefreshed(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  };

  useEffect(() => {
    reloadLogs();

    // Event listener for cross-tab storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key === "sunpower_user_login_logs") {
        reloadLogs();
      }
    };

    // Event listener for same-tab custom login event
    const handleCustomLogin = () => {
      reloadLogs();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("sunpower_user_login", handleCustomLogin);

    // Fast polling fallback (every 1 second) to guarantee instantaneous UI refresh
    const pollInterval = setInterval(() => {
      const current = getUserLoginLogs();
      setLogs((prev) => {
        if (current.length !== prev.length || (current[0] && prev[0] && current[0].id !== prev[0].id)) {
          return current;
        }
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sunpower_user_login", handleCustomLogin);
      clearInterval(pollInterval);
    };
  }, []);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesRole = selectedRole === "all" || log.role === selectedRole;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.email.toLowerCase().includes(q) ||
        log.name.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q) ||
        log.loginMethod.toLowerCase().includes(q) ||
        log.device.toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [logs, selectedRole, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    return {
      total: logs.length,
      admin: logs.filter((l) => l.role === "admin").length,
      technician: logs.filter((l) => l.role === "technician").length,
      customer: logs.filter((l) => l.role === "customer").length,
    };
  }, [logs]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["Log ID", "Name", "Email", "Role", "Login Method", "Timestamp", "IP Address", "Device", "Location", "Status"];
    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.role}"`,
      `"${l.loginMethod}"`,
      `"${l.timestamp}"`,
      `"${l.ipAddress}"`,
      `"${l.device}"`,
      `"${l.location}"`,
      `"${l.status}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sunpower_user_login_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy email to clipboard
  const handleCopyEmail = (email: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  };

  // Submit test simulation
  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simEmail || !simName) return;

    recordUserLogin({
      name: simName,
      email: simEmail,
      role: simRole,
      loginMethod: simMethod,
      location: "Jaipur, Rajasthan",
      device: "Chrome 128 / Windows",
    });

    setSimSuccessToast(true);
    setTimeout(() => {
      setSimSuccessToast(false);
      setShowSimulateModal(false);
    }, 1500);
  };

  return (
    <section id="user-logs" className="bg-white rounded-2xl border border-[#EBCED6] shadow-xs overflow-hidden">
      {/* ── SECTION HEADER ── */}
      <div className="p-4 sm:p-6 border-b border-[#EBCED6] bg-gradient-to-r from-white via-[#F7EEF2]/40 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md">
                Live Audit Active
              </span>
              <span className="text-[11px] text-[#6D5284] font-medium hidden sm:inline">
                Last checked: {lastRefreshed}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[#261C33] mt-1 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-[#4A355E]" />
              <span>All Users Login &amp; Activity Logs</span>
            </h2>
            <p className="text-xs text-[#6D5284] mt-0.5">
              Live audit stream of all user authentications via email across Admin, Field Technician, and Customer portals.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSimulateModal(true)}
              className="px-3 py-1.5 bg-[#4A355E] hover:bg-[#372447] text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Test real-time user login with custom email"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Test Email Login</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#EBCED6] text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Export all logs to CSV file"
            >
              <DownloadIcon className="w-3.5 h-3.5 text-[#6D5284]" />
              <span className="hidden sm:inline">Export</span> CSV
            </button>

            <button
              onClick={reloadLogs}
              className="p-1.5 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#EBCED6] rounded-xl transition cursor-pointer shadow-2xs"
              title="Refresh Logs Now"
            >
              <RefreshIcon className="w-4 h-4 text-[#6D5284]" />
            </button>
          </div>
        </div>

        {/* ── STATS COUNTER STRIP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#EBCED6]/70">
          <div className="bg-[#F7EEF2]/70 rounded-xl p-2.5 border border-[#EBCED6]">
            <span className="text-[10px] font-bold text-[#6D5284] uppercase block">Total Logins</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-extrabold text-[#261C33]">{metrics.total}</span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">
                Real-Time
              </span>
            </div>
          </div>

          <div className="bg-[#F7EEF2]/70 rounded-xl p-2.5 border border-[#EBCED6]">
            <span className="text-[10px] font-bold text-[#6D5284] uppercase block flex items-center gap-1">
              <CrownIcon className="w-3 h-3 text-[#8D73A8]" /> Admin Logins
            </span>
            <span className="text-lg font-extrabold text-[#4A355E] mt-0.5 block">{metrics.admin}</span>
          </div>

          <div className="bg-[#F7EEF2]/70 rounded-xl p-2.5 border border-[#EBCED6]">
            <span className="text-[10px] font-bold text-[#6D5284] uppercase block flex items-center gap-1">
              <HardHatIcon className="w-3 h-3 text-[#DA9B40]" /> Technician Logins
            </span>
            <span className="text-lg font-extrabold text-[#DA9B40] mt-0.5 block">{metrics.technician}</span>
          </div>

          <div className="bg-[#F7EEF2]/70 rounded-xl p-2.5 border border-[#EBCED6]">
            <span className="text-[10px] font-bold text-[#6D5284] uppercase block flex items-center gap-1">
              <UserIcon className="w-3 h-3 text-[#5B965E]" /> Customer Logins
            </span>
            <span className="text-lg font-extrabold text-[#5B965E] mt-0.5 block">{metrics.customer}</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="p-4 bg-[#FCFBFD] border-b border-[#EBCED6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6D5284]">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email (e.g. @sunpower.com), user name, IP..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-white border border-[#EBCED6] rounded-xl text-[#261C33] placeholder:text-gray-400 focus:outline-none focus:border-[#4A355E] focus:ring-1 focus:ring-[#4A355E]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setSelectedRole("all")}
            className={`px-3 py-1 rounded-xl transition cursor-pointer ${
              selectedRole === "all"
                ? "bg-[#4A355E] text-white shadow-2xs"
                : "bg-white text-[#6D5284] border border-[#EBCED6] hover:bg-[#F7EEF2]"
            }`}
          >
            All ({metrics.total})
          </button>
          <button
            onClick={() => setSelectedRole("admin")}
            className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
              selectedRole === "admin"
                ? "bg-[#4A355E] text-white shadow-2xs"
                : "bg-white text-[#6D5284] border border-[#EBCED6] hover:bg-[#F7EEF2]"
            }`}
          >
            <CrownIcon className="w-3 h-3" />
            <span>Admin ({metrics.admin})</span>
          </button>
          <button
            onClick={() => setSelectedRole("technician")}
            className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
              selectedRole === "technician"
                ? "bg-[#DA9B40] text-white shadow-2xs"
                : "bg-white text-[#6D5284] border border-[#EBCED6] hover:bg-[#F7EEF2]"
            }`}
          >
            <HardHatIcon className="w-3 h-3" />
            <span>Technicians ({metrics.technician})</span>
          </button>
          <button
            onClick={() => setSelectedRole("customer")}
            className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
              selectedRole === "customer"
                ? "bg-[#5B965E] text-white shadow-2xs"
                : "bg-white text-[#6D5284] border border-[#EBCED6] hover:bg-[#F7EEF2]"
            }`}
          >
            <UserIcon className="w-3 h-3" />
            <span>Customers ({metrics.customer})</span>
          </button>
        </div>
      </div>

      {/* ── TABLE VIEW ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7EEF2] text-[#6D5284] font-semibold border-b border-[#EBCED6]">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">User &amp; Email</th>
              <th className="px-4 py-3 text-center">Portal Role</th>
              <th className="px-4 py-3">Login Method</th>
              <th className="px-4 py-3">IP Address &amp; Location</th>
              <th className="px-4 py-3">Device / Browser</th>
              <th className="px-4 py-3 text-center">Session Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBCED6]/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#6D5284]">
                  <p className="font-semibold">No login records found matching filter criteria.</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Try searching for another email or reset the filters.
                  </p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => {
                const isVeryRecent = index === 0 && log.formattedTime === "Just now";

                return (
                  <tr
                    key={log.id}
                    className={`hover:bg-[#F7EEF2]/50 transition-colors ${
                      isVeryRecent ? "bg-emerald-50/60 ring-1 ring-emerald-300" : ""
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5 text-[#6D5284]" />
                        <span className="font-semibold text-[#261C33]">
                          {formatLogTime(log.timestamp)}
                        </span>
                        {isVeryRecent && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500 text-white animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* User & Email */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#261C33] flex items-center gap-1.5">
                        <span>{log.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <code className="text-[11px] font-mono text-[#4A355E] bg-[#F7EEF2] px-1.5 py-0.2 rounded border border-[#EBCED6]/80">
                          {log.email}
                        </code>
                        <button
                          onClick={() => handleCopyEmail(log.email)}
                          className="text-[10px] text-gray-400 hover:text-[#4A355E] cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedEmail === log.email ? (
                            <span className="text-emerald-600 font-bold">Copied</span>
                          ) : (
                            <span>Copy</span>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {log.role === "admin" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7EEF2] text-[#4A355E] border border-[#B39CCB]/40">
                          <CrownIcon className="w-3 h-3 text-[#8D73A8]" />
                          <span>Admin</span>
                        </span>
                      )}
                      {log.role === "technician" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF6EB] text-[#DA9B40] border border-[#F4B860]/40">
                          <HardHatIcon className="w-3 h-3 text-[#DA9B40]" />
                          <span>Technician</span>
                        </span>
                      )}
                      {log.role === "customer" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5EC] text-[#5B965E] border border-[#78B77B]/40">
                          <UserIcon className="w-3 h-3 text-[#5B965E]" />
                          <span>Customer</span>
                        </span>
                      )}
                    </td>

                    {/* Login Method */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-[#261C33] block">{log.loginMethod}</span>
                      <span className="text-[10px] text-gray-400 block font-mono">ID: {log.id}</span>
                    </td>

                    {/* IP & Location */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-[#261C33] block">{log.ipAddress}</span>
                      <span className="text-[10px] text-[#6D5284] block">{log.location}</span>
                    </td>

                    {/* Device / Browser */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-[#261C33] font-medium block truncate max-w-[150px]">
                        {log.device}
                      </span>
                    </td>

                    {/* Session Status */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                        <span>Success</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER CONTROLS ── */}
      <div className="p-3 bg-[#F7EEF2]/50 border-t border-[#EBCED6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6D5284]">
        <span>
          Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> total login events
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetUserLoginLogs()}
            className="text-[11px] text-[#4A355E] hover:underline cursor-pointer"
          >
            Reset Sample Data
          </button>
          <span>•</span>
          <button
            onClick={() => clearUserLoginLogs()}
            className="text-[11px] text-red-600 hover:underline cursor-pointer"
          >
            Clear All Logs
          </button>
        </div>
      </div>

      {/* ── MODAL: SIMULATE NEW USER EMAIL LOGIN ── */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EBCED6] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EBCED6] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#261C33]">Simulate User Email Login</h3>
                <p className="text-xs text-[#6D5284]">
                  Trigger a live authentication event to test real-time admin portal log updates.
                </p>
              </div>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="text-gray-400 hover:text-[#261C33] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#6D5284] uppercase">User Full Name</label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl font-medium focus:outline-none focus:border-[#4A355E]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D5284] uppercase">User Email Address</label>
                <input
                  type="email"
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  placeholder="e.g. user@gmail.com"
                  className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl font-medium focus:outline-none focus:border-[#4A355E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6D5284] uppercase">User Role</label>
                  <select
                    value={simRole}
                    onChange={(e) => setSimRole(e.target.value as LogUserRole)}
                    className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl font-medium bg-white focus:outline-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6D5284] uppercase">Auth Method</label>
                  <select
                    value={simMethod}
                    onChange={(e) => setSimMethod(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl font-medium bg-white focus:outline-none"
                  >
                    <option value="Email & OTP Sign-in">Email &amp; OTP</option>
                    <option value="Email & Password">Email &amp; Password</option>
                    <option value="Google Workspace SSO">Google Workspace</option>
                    <option value="Staff PIN & Email">Staff PIN &amp; Email</option>
                  </select>
                </div>
              </div>

              {simSuccessToast && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-300 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                  <span>Login event registered! Check log table above.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EBCED6]">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 border border-[#EBCED6] rounded-xl text-[#6D5284] font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4A355E] hover:bg-[#372447] text-white rounded-xl font-bold cursor-pointer transition shadow-2xs"
                >
                  Trigger Login Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
