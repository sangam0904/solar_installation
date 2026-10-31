"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { orders as initialOrders, Order } from "@/data/mockData";

export default function OrdersPage() {
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [dispatchOrder, setDispatchOrder] = useState<Order | null>(null);

  // Dispatch barcode scan states
  const [inverterSerial, setInverterSerial] = useState("");
  const [batterySerial, setBatterySerial] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState("");

  const stages = ["Confirmed", "Dispatched", "Installation Scheduled", "Installed", "Completed"];

  const filteredOrders = filterStatus === "All"
    ? ordersList
    : ordersList.filter((o) => o.status === filterStatus);

  const stats = {
    total: ordersList.length,
    pendingDispatch: ordersList.filter((o) => o.status === "Confirmed").length,
    inProgress: ordersList.filter((o) => o.status === "Dispatched" || o.status === "Installation Scheduled").length,
    installed: ordersList.filter((o) => o.status === "Installed" || o.status === "Completed").length,
  };

  const handleOpenDispatch = (order: Order) => {
    setDispatchOrder(order);
    setInverterSerial("");
    setBatterySerial("");
    setDispatchSuccess(false);
    setShowDispatchModal(true);
  };

  const handleSimulateScan = (field: "inverter" | "battery") => {
    setScannerActive(true);
    setTimeout(() => {
      if (field === "inverter") {
        setInverterSerial(`INV-5K-${Math.floor(1000 + Math.random() * 9000)}`);
      } else {
        setBatterySerial(`BAT-LFP-${Math.floor(1000 + Math.random() * 9000)}`);
      }
      setScannerActive(false);
    }, 600);
  };

  const handleConfirmDispatch = () => {
    if (!dispatchOrder) return;
    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === dispatchOrder.id
          ? { ...o, status: "Dispatched", dispatchDate: "2026-10-31" }
          : o
      )
    );
    setDispatchSuccess(true);
    setTimeout(() => {
      setShowDispatchModal(false);
      setDispatchOrder(null);
    }, 1200);
  };

  const handleRecordPayment = () => {
    if (!selectedOrder || !paymentAmount) return;
    const amount = Number(paymentAmount);
    setOrdersList((prev) =>
      prev.map((o) => {
        if (o.id === selectedOrder.id) {
          const newAdvance = o.advancePaid + amount;
          const newBalance = Math.max(0, o.totalAmount - newAdvance);
          const newPaymentStatus = newBalance === 0 ? "Full Paid" : "Partial";
          return {
            ...o,
            advancePaid: newAdvance,
            balanceDue: newBalance,
            paymentStatus: newPaymentStatus,
          };
        }
        return o;
      })
    );
    setShowPaymentModal(false);
    setPaymentAmount("");
    setSelectedOrder(null);
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40";
      case "Dispatched":
        return "bg-[#FAF4F7] text-[#734960] border-[#8E687F]/30";
      case "Installation Scheduled":
        return "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40";
      case "Installed":
        return "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40";
      case "Completed":
        return "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40";
      default:
        return "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB]";
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] flex items-center gap-2">
            <span>📦</span> Orders & Warehouse Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Track payments, scan hardware serial numbers, and schedule installation crews
          </p>
        </div>
        <button
          onClick={() => alert("Converting approved quote into an order...")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#734960] hover:bg-[#5A354A] text-white font-semibold rounded-xl text-xs shadow-xs transition"
        >
          <span>+</span> Create New Order
        </button>
      </div>

      {/* Top KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#8E687F] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Total Active Orders</p>
              <p className="text-2xl font-extrabold text-[#333333] mt-1">{stats.total}</p>
            </div>
            <div className="w-11 h-11 bg-[#FAF4F7] text-[#8E687F] rounded-xl flex items-center justify-center text-xl font-bold">
              📋
            </div>
          </div>
          <p className="text-[11px] text-[#734960] mt-3 font-semibold">Synced with Quotations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#F4B860] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Pending Dispatch</p>
              <p className="text-2xl font-extrabold text-[#DA9B40] mt-1">{stats.pendingDispatch}</p>
            </div>
            <div className="w-11 h-11 bg-[#FEF6EB] text-[#DA9B40] rounded-xl flex items-center justify-center text-xl font-bold">
              🚚
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-3">Needs warehouse scan & pick</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#8E687F] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">In Installation</p>
              <p className="text-2xl font-extrabold text-[#734960] mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-11 h-11 bg-[#FAF4F7] text-[#734960] rounded-xl flex items-center justify-center text-xl font-bold">
              👷
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-3">Active technician crews on-site</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] border-l-4 border-l-[#78B77B] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Installed / Done</p>
              <p className="text-2xl font-extrabold text-[#78B77B] mt-1">{stats.installed}</p>
            </div>
            <div className="w-11 h-11 bg-[#EBF5EC] text-[#78B77B] rounded-xl flex items-center justify-center text-xl font-bold">
              ✅
            </div>
          </div>
          <p className="text-[11px] text-[#5B965E] mt-3 font-semibold">Warranty clock started</p>
        </div>
      </div>

      {/* Interactive Pipeline Step Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4E7EB] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Order Lifecycle Filter
          </h2>
          <span className="text-[11px] text-[#666666]">Click stage to filter view</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          <button
            onClick={() => setFilterStatus("All")}
            className={`py-1.5 px-3 text-xs font-bold rounded-xl border text-center transition ${
              filterStatus === "All"
                ? "bg-[#734960] text-white border-[#734960] shadow-xs"
                : "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB] hover:bg-gray-100"
            }`}
          >
            All ({ordersList.length})
          </button>
          {stages.map((stage) => {
            const count = ordersList.filter((o) => o.status === stage).length;
            const isSelected = filterStatus === stage;
            return (
              <button
                key={stage}
                onClick={() => setFilterStatus(stage)}
                className={`py-1.5 px-2 text-xs font-bold rounded-xl border text-center transition flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-[#8E687F] text-white border-[#8E687F] shadow-xs"
                    : "bg-[#F5F7FA] text-[#666666] border-[#E4E7EB] hover:bg-gray-100"
                }`}
              >
                <span className="truncate">{stage}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? "bg-white text-[#8E687F]" : "bg-gray-200 text-[#333333]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E4E7EB] bg-[#F5F7FA] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            Active Order Directory ({filteredOrders.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-[#666666] font-semibold border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-2.5">Order ID</th>
                <th className="px-4 py-2.5">Customer & Location</th>
                <th className="px-4 py-2.5">System</th>
                <th className="px-4 py-2.5 text-right">Total Price</th>
                <th className="px-4 py-2.5 text-right">Advance / Balance</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5">Technician</th>
                <th className="px-4 py-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EB]/60">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#734960]">{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#333333]">{order.customerName}</div>
                    <div className="text-[11px] text-[#666666]">{order.phone}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[170px]">{order.address}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[#333333]">{order.capacity}</span>
                    <span
                      className={`ml-2 px-2 py-0.5 text-[10px] rounded-full font-bold border ${
                        order.gridType === "Off-Grid"
                          ? "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40"
                          : "bg-[#EBF5EC] text-[#5B965E] border-[#78B77B]/40"
                      }`}
                    >
                      {order.gridType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#333333]">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-[11px] text-[#5B965E] font-semibold">
                      Paid: ₹{order.advancePaid.toLocaleString("en-IN")}
                    </div>
                    {order.balanceDue > 0 ? (
                      <div className="text-[11px] text-[#DA9B40] font-bold">
                        Due: ₹{order.balanceDue.toLocaleString("en-IN")}
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#5B965E] font-bold">
                        Full Paid ✓
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#333333]">{order.assignedTechnician}</div>
                    <div className="text-[10px] text-[#666666]">📅 {order.installDate}</div>
                  </td>
                  <td className="px-4 py-3 text-center space-x-1.5">
                    {order.status === "Confirmed" && (
                      <button
                        onClick={() => handleOpenDispatch(order)}
                        className="px-2.5 py-1 bg-[#F4B860] hover:bg-[#DA9B40] text-[#333333] text-[11px] font-bold rounded-lg shadow-xs transition"
                      >
                        🚀 Dispatch
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowPaymentModal(true);
                      }}
                      className="px-2.5 py-1 bg-[#F5F7FA] hover:bg-[#E4E7EB] text-[#333333] text-[11px] font-semibold rounded-lg border border-[#E4E7EB] transition"
                    >
                      💳 Ledger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISPATCH SCANNER MODAL */}
      {showDispatchModal && dispatchOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E4E7EB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EB]">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📦</span>
                <div>
                  <h3 className="text-base font-bold text-[#333333]">Warehouse Dispatch & Serial Scan</h3>
                  <p className="text-xs text-[#666666]">{dispatchOrder.id} • {dispatchOrder.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-gray-400 hover:text-[#333333] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#FEF6EB] border border-[#F4B860]/40 rounded-xl p-3 text-xs text-[#DA9B40]">
              ⚠️ <strong>Serial Rule:</strong> Scan each equipment barcode before dispatch. This automatically kicks off the 5-year inverter and 25-year panel warranty clock.
            </div>

            {/* Inverter Serial Section */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#666666] uppercase flex items-center justify-between">
                <span>Inverter Serial Number (Required)</span>
                {inverterSerial && <span className="text-[#78B77B] font-bold">✓ Verified</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. INV-5K-OG-9921"
                  value={inverterSerial}
                  onChange={(e) => setInverterSerial(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSimulateScan("inverter")}
                  className="px-3 py-1.5 bg-[#734960] hover:bg-[#5A354A] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition"
                >
                  📷 Scan Barcode
                </button>
              </div>
            </div>

            {/* Battery Serial Section (if Off-Grid) */}
            {dispatchOrder.gridType === "Off-Grid" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#666666] uppercase flex items-center justify-between">
                  <span>Battery Serial Number (Off-Grid)</span>
                  {batterySerial && <span className="text-[#78B77B] font-bold">✓ Verified</span>}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. BAT-LFP-48V-3321"
                    value={batterySerial}
                    onChange={(e) => setBatterySerial(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#F4B860]/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSimulateScan("battery")}
                    className="px-3 py-1.5 bg-[#F4B860] hover:bg-[#DA9B40] text-[#333333] rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    📷 Scan Barcode
                  </button>
                </div>
              </div>
            )}

            {scannerActive && (
              <div className="p-2.5 bg-[#FAF4F7] border border-[#8E687F]/30 rounded-xl text-center text-xs text-[#734960] animate-pulse font-medium">
                Scanning device camera / barcode reader...
              </div>
            )}

            {dispatchSuccess && (
              <div className="p-2.5 bg-[#EBF5EC] border border-[#78B77B] rounded-xl text-center text-xs text-[#5B965E] font-bold">
                🎉 Dispatch Confirmed! Serial numbers linked to customer profile and warranty initialized.
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="px-3.5 py-1.5 border border-[#E4E7EB] text-[#666666] rounded-xl text-xs font-semibold hover:bg-[#F5F7FA]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!inverterSerial || (dispatchOrder.gridType === "Off-Grid" && !batterySerial)}
                onClick={handleConfirmDispatch}
                className="px-4 py-1.5 bg-[#78B77B] hover:bg-[#5B965E] disabled:bg-gray-200 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Approve Dispatch & Gate Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT & ORDER DETAILS MODAL */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EB]">
              <div>
                <h3 className="text-base font-bold text-[#333333]">Order Ledger & Milestone</h3>
                <p className="text-xs text-[#666666]">{selectedOrder.id} • {selectedOrder.customerName}</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-[#333333] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#F5F7FA] p-3.5 rounded-2xl space-y-2 text-xs border border-[#E4E7EB]">
              <div className="flex justify-between text-[#666666]">
                <span>System Specs:</span>
                <span className="font-semibold text-[#333333]">{selectedOrder.capacity} ({selectedOrder.gridType})</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Technician:</span>
                <span className="font-semibold text-[#8E687F]">{selectedOrder.assignedTechnician}</span>
              </div>
              <div className="flex justify-between text-[#666666] border-t border-[#E4E7EB] pt-1.5">
                <span>Contract Value:</span>
                <span className="font-bold text-[#333333]">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#5B965E]">
                <span>Advance Paid:</span>
                <span className="font-bold">₹{selectedOrder.advancePaid.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#DA9B40] font-bold border-t border-[#E4E7EB] pt-1 text-sm">
                <span>Balance Due:</span>
                <span>₹{selectedOrder.balanceDue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {selectedOrder.balanceDue > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-[#666666] uppercase">Record Incoming Payment</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter amount (₹)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#78B77B]/30 focus:outline-none"
                  />
                  <button
                    onClick={handleRecordPayment}
                    className="px-3.5 py-1.5 bg-[#78B77B] hover:bg-[#5B965E] text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-1.5 bg-[#F5F7FA] hover:bg-[#E4E7EB] text-[#333333] rounded-xl text-xs font-semibold border border-[#E4E7EB]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
