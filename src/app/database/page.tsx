"use client";

import { useState, useEffect } from "react";
import PageShell from "@/components/PageShell";

interface DbHealth {
  connected: boolean;
  database?: string;
  version?: string;
  port?: number;
  host?: string;
  tableCount?: number;
  totalRecords?: number;
  tables?: Record<string, number>;
  error?: string;
}

export default function DatabasePage() {
  const [health, setHealth] = useState<DbHealth | null>(null);
  const [loading, setLoading] = useState(true);

  // Migration & Seed Form state
  const [dbPassword, setDbPassword] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    summary?: Record<string, number>;
  } | null>(null);

  // Table Explorer state
  const [selectedTable, setSelectedTable] = useState<string>("leads");
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/db/health");
      const data = await res.json();
      setHealth(data);
    } catch (err: any) {
      setHealth({ connected: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setTableLoading(true);
    setTableError("");
    try {
      const resourceMap: Record<string, string> = {
        leads: "leads",
        orders: "orders",
        inventory: "inventory",
        warranties: "warranties",
        service_tickets: "tickets",
        subsidies: "subsidies",
        technicians: "technicians",
        bom_templates: "bom_templates",
        user_logs: "user_logs",
        customer_enquiries: "customer_enquiries",
      };

      const res = await fetch(`/api/solar/data?resource=${resourceMap[tableName] || "leads"}`);
      const data = await res.json();
      setTableData(data.data || []);
    } catch (err: any) {
      setTableError(err.message || "Failed to query table data");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    if (health?.connected) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable, health?.connected]);

  const handleSeedDatabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSeeding(true);
    setSeedResult(null);

    try {
      const res = await fetch("/api/db/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: dbPassword || undefined,
        }),
      });

      const data = await res.json();
      setSeedResult(data);

      if (data.success) {
        await checkHealth();
        fetchTableData(selectedTable);
      }
    } catch (err: any) {
      setSeedResult({
        success: false,
        error: err.message || "Failed to initialize and seed database.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐘</span>
              <h1 className="text-xl sm:text-2xl font-black text-[#261C33]">
                PostgreSQL Backend Database
              </h1>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  health?.connected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {loading ? "Checking..." : health?.connected ? "🟢 Connected to localhost:5432" : "🔴 Disconnected"}
              </span>
            </div>
            <p className="text-xs text-[#6D5284] mt-1">
              Production relational backend replacing static mockdata.ts with PostgreSQL 18
            </p>
          </div>

          <button
            onClick={checkHealth}
            disabled={loading}
            className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#EBCED6] text-[#4A355E] text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto"
          >
            {loading ? "Pinging DB..." : "🔄 Refresh Status"}
          </button>
        </div>

        {/* Database Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] card-floating space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6D5284]">Database Engine</span>
            <p className="text-base font-black text-[#261C33]">
              {health?.connected ? "PostgreSQL 18" : "PostgreSQL (Offline)"}
            </p>
            <p className="text-[11px] text-gray-400 font-mono">Port 5432 • Localhost</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] card-floating space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6D5284]">Target Database</span>
            <p className="text-base font-black text-[#4A355E]">
              {health?.database || "solar_db"}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold">
              {health?.connected ? "✓ UTF-8 Production Schema" : "Awaiting Connection"}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] card-floating space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6D5284]">Relational Tables</span>
            <p className="text-base font-black text-[#DA9B40]">
              {health?.tableCount ?? 0} Tables
            </p>
            <p className="text-[11px] text-gray-500 font-medium">Leads, Orders, Serials, Tickets</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EBCED6] card-floating space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6D5284]">Total Live Records</span>
            <p className="text-base font-black text-[#5B965E]">
              {health?.totalRecords ?? 0} Rows
            </p>
            <p className="text-[11px] text-emerald-600 font-bold">100% Moved from MockData</p>
          </div>
        </div>

        {/* Database Initialization & Migration Tool */}
        <div className="bg-white rounded-3xl border border-[#EBCED6] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7EEF2] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A355E] bg-[#F7EEF2] px-2.5 py-0.5 rounded-full border border-[#EBCED6]">
                One-Click Migration Engine
              </span>
              <h2 className="text-base font-bold text-[#261C33] mt-1.5">
                Seed &amp; Migrate All MockData to PostgreSQL
              </h2>
              <p className="text-xs text-[#6D5284]">
                Creates all 10 relational tables and moves mockdata.ts + 30+ new records into PostgreSQL
              </p>
            </div>
          </div>

          <form onSubmit={handleSeedDatabase} className="space-y-4 max-w-xl">
            <div>
              <label className="text-[11px] font-bold text-[#6D5284] uppercase">
                PostgreSQL Password (for user: postgres)
              </label>
              <input
                type="password"
                value={dbPassword}
                onChange={(e) => setDbPassword(e.target.value)}
                placeholder="Enter password you chose during PostgreSQL installation"
                className="w-full mt-1 px-3.5 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Enter the password you entered when installing PostgreSQL 18.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSeeding}
              className="px-5 py-2.5 bg-[#4A355E] hover:bg-[#372447] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <span>{isSeeding ? "⚡ Migrating Data to PostgreSQL..." : "🚀 Run Database Setup & Migration"}</span>
            </button>
          </form>

          {/* Seed Result Box */}
          {seedResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                seedResult.success
                  ? "bg-[#FAFDFB] border-[#78B77B] text-[#261C33]"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                <span>{seedResult.success ? "✅ Success:" : "❌ Error:"}</span>
                <span>{seedResult.message || seedResult.error}</span>
              </div>

              {seedResult.summary && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="font-bold text-[11px] text-[#4A355E] uppercase block mb-2">
                    Migrated Tables &amp; Record Counts:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                    {Object.entries(seedResult.summary).map(([tbl, count]) => (
                      <div key={tbl} className="p-1.5 bg-white rounded border border-gray-200 flex justify-between">
                        <span className="text-gray-600">{tbl}:</span>
                        <strong className="text-[#5B965E]">{count} rows</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Database Table Explorer */}
        <div className="bg-white rounded-3xl border border-[#EBCED6] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7EEF2] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B965E] bg-[#EBF5EC] px-2.5 py-0.5 rounded-full border border-[#78B77B]/40">
                Live Query Inspector
              </span>
              <h3 className="text-base font-bold text-[#261C33] mt-1">
                PostgreSQL Table Explorer
              </h3>
            </div>

            {/* Table Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "leads",
                "orders",
                "inventory",
                "warranties",
                "service_tickets",
                "subsidies",
                "technicians",
                "bom_templates",
                "user_logs",
                "customer_enquiries",
              ].map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => setSelectedTable(tbl)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                    selectedTable === tbl
                      ? "bg-[#4A355E] text-white"
                      : "bg-[#F7EEF2] text-[#6D5284] hover:bg-[#EBCED6]"
                  }`}
                >
                  {tbl} ({health?.tables?.[tbl] ?? (selectedTable === tbl ? tableData.length : 0)})
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-[#F7EEF2] rounded-xl font-mono text-[11px] text-[#4A355E] border border-[#EBCED6]">
            <strong>Executed SQL:</strong> SELECT * FROM {selectedTable} ORDER BY id ASC;
          </div>

          {tableLoading ? (
            <div className="text-center py-10 text-xs text-gray-500 font-semibold">
              Querying PostgreSQL database...
            </div>
          ) : tableError ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
              {tableError}
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400">
              No records returned for this table yet. Run migration above to populate data.
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#EBCED6] rounded-xl max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF4F7] text-[#4A355E] font-bold sticky top-0 border-b border-[#EBCED6]">
                  <tr>
                    {Object.keys(tableData[0] || {}).slice(0, 7).map((col) => (
                      <th key={col} className="p-2.5 whitespace-nowrap uppercase text-[10px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-[#261C33]">
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.values(row).slice(0, 7).map((val: any, cIdx) => (
                        <td key={cIdx} className="p-2.5 max-w-xs truncate text-[11px]">
                          {typeof val === "object" ? JSON.stringify(val) : String(val ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
