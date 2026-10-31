"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole, ALL_16_EMPLOYEES } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsAdmin, loginAsTechnician, loginAsCustomer, loginWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState<UserRole>("admin");

  // Admin form
  const [adminEmail, setAdminEmail] = useState("admin@sunpower.com");
  const [adminPassword, setAdminPassword] = useState("••••••••");

  // Technician form
  const [selectedTech, setSelectedTech] = useState("TECH-001");
  const [techPin, setTechPin] = useState("1234");

  // Customer form
  const [customerPhone, setCustomerPhone] = useState("+91 99887 76655");
  const [customerOtp, setCustomerOtp] = useState("5432");

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin(adminEmail);
    router.push("/");
  };

  const handleGoogleSubmit = () => {
    loginWithGoogle();
    router.push("/");
  };

  const handleTechnicianSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsTechnician(selectedTech);
    router.push("/technician");
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCustomer(customerPhone);
    router.push("/customer");
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotModal(false);
      setForgotEmail("");
    }, 2500);
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#333333] flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Back Button Option */}
      <div className="w-full max-w-md mb-3 flex items-center justify-start">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF4F7] text-[#734960] hover:text-[#5A354A] border border-[#E4E7EB] hover:border-[#734960]/30 rounded-xl text-xs font-bold card-floating transition cursor-pointer group"
          title="Return to previous screen"
        >
          <span className="text-sm font-extrabold transition-transform group-hover:-translate-x-1">←</span>
          <span>Back</span>
        </button>
      </div>

      {/* SunPower Logo & Title */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F4B860] shadow-sm text-2xl">
          ☀️
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          SunPower Solutions
        </h1>
        <p className="text-xs sm:text-sm text-[#666666]">
          Unified Solar Installation, Field Crew &amp; Customer Portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E4E7EB] shadow-lg overflow-hidden">
        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-3 border-b border-[#E4E7EB] bg-[#F5F7FA]/70 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`py-3.5 text-center transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === "admin"
                ? "bg-white text-[#734960] border-b-2 border-[#734960] shadow-2xs font-extrabold"
                : "text-[#666666] hover:text-[#333333]"
            }`}
          >
            <span>👑</span>
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("technician")}
            className={`py-3.5 text-center transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === "technician"
                ? "bg-white text-[#734960] border-b-2 border-[#734960] shadow-2xs font-extrabold"
                : "text-[#666666] hover:text-[#333333]"
            }`}
          >
            <span>👷</span>
            <span>Technician</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("customer")}
            className={`py-3.5 text-center transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === "customer"
                ? "bg-white text-[#734960] border-b-2 border-[#734960] shadow-2xs font-extrabold"
                : "text-[#666666] hover:text-[#333333]"
            }`}
          >
            <span>👤</span>
            <span>Customer</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* ───────────────── ADMIN LOGIN TAB ───────────────── */}
          {activeTab === "admin" && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#734960] bg-[#FAF4F7] px-2.5 py-0.5 rounded-full border border-[#8E687F]/30">
                  Management &amp; Operations
                </span>
                <h3 className="text-base font-bold text-[#333333] pt-1">Director &amp; Admin Sign In</h3>
                <p className="text-xs text-[#666666]">Access ERP, CRM, Warehouses, and Financial Dashboards</p>
              </div>

              {/* Google Login Option for Admin */}
              <button
                type="button"
                onClick={handleGoogleSubmit}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#F5F7FA] text-[#333333] border border-[#E4E7EB] rounded-2xl text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Workspace</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E4E7EB]"></div>
                <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase">or email sign-in</span>
                <div className="flex-grow border-t border-[#E4E7EB]"></div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-[#E4E7EB] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-[#666666] uppercase">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(adminEmail);
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-[#734960] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-[#E4E7EB] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#734960] hover:bg-[#5A354A] text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Sign In to Admin Portal ➔
              </button>
            </form>
          )}

          {/* ───────────────── TECHNICIAN LOGIN TAB ───────────────── */}
          {activeTab === "technician" && (
            <form onSubmit={handleTechnicianSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#DA9B40] bg-[#FEF6EB] px-2.5 py-0.5 rounded-full border border-[#F4B860]/40">
                  Field Operations Crew
                </span>
                <h3 className="text-base font-bold text-[#333333] pt-1">Select Field Technician &amp; PIN</h3>
                <p className="text-xs text-[#666666]">Access your daily rooftop installation and maintenance jobs</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Select Assigned Crew Member</label>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-[#E4E7EB] rounded-xl text-xs font-bold bg-white focus:outline-none"
                >
                  {Object.entries(ALL_16_EMPLOYEES).map(([id, tech]) => (
                    <option key={id} value={id}>
                      {tech.name} • {tech.specialization} ({id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-[#666666] uppercase">4-Digit Field PIN</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail("rohit.meena@sunpower.com");
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-[#734960] hover:underline font-semibold"
                  >
                    Forgot PIN?
                  </button>
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={techPin}
                  onChange={(e) => setTechPin(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-[#E4E7EB] rounded-xl text-xs font-mono text-center tracking-widest text-lg font-bold"
                  required
                />
              </div>

              <div className="p-3 bg-[#FEF6EB] rounded-xl border border-[#F4B860]/40 text-xs text-[#DA9B40]">
                👷 <strong>Field Mode:</strong> Only your assigned daily job cards, site photos, barcode scan &amp; commissioning forms will load.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#DA9B40] hover:bg-[#C2852E] text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Access My Field Jobs ➔
              </button>
            </form>
          )}

          {/* ───────────────── CUSTOMER LOGIN TAB ───────────────── */}
          {activeTab === "customer" && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#5B965E] bg-[#EBF5EC] px-2.5 py-0.5 rounded-full border border-[#78B77B]/40">
                  Solar Homeowner Access
                </span>
                <h3 className="text-base font-bold text-[#333333] pt-1">Track Your Rooftop Installation</h3>
                <p className="text-xs text-[#666666]">Monitor daily generation, upload photos, and track subsidy status</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Registered Mobile Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 99887 76655"
                  className="w-full mt-1 px-3.5 py-2 border border-[#E4E7EB] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#78B77B]/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-[#666666] uppercase">OTP / Access Code</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail("rajesh.gupta@email.com");
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-[#734960] hover:underline font-semibold"
                  >
                    Resend Code?
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={customerOtp}
                  onChange={(e) => setCustomerOtp(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-[#E4E7EB] rounded-xl text-xs font-mono text-center tracking-widest text-lg font-bold"
                  required
                />
              </div>

              <div className="p-3 bg-[#EBF5EC] rounded-xl border border-[#78B77B]/40 text-xs text-[#5B965E]">
                ☀️ <strong>Customer Portal:</strong> Upload roof pre-inspection photos, view 20-year warranty cards, and check subsidy payment status.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#78B77B] hover:bg-[#5B965E] text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Enter My Solar Passbook ➔
              </button>
            </form>
          )}

          {/* ───────────────── 1-CLICK DEMO TESTERS FOR JUDGES ───────────────── */}
          <div className="pt-2 border-t border-[#E4E7EB] space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#666666] text-center">
              ⚡ Hackathon Demo Quick Switcher (1-Click)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsAdmin();
                  router.push("/");
                }}
                className="py-1.5 px-2 bg-[#FAF4F7] hover:bg-[#734960] hover:text-white text-[#734960] border border-[#8E687F]/30 rounded-xl text-[10px] font-bold transition text-center cursor-pointer"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsTechnician("TECH-001");
                  router.push("/technician");
                }}
                className="py-1.5 px-2 bg-[#FEF6EB] hover:bg-[#DA9B40] hover:text-white text-[#DA9B40] border border-[#F4B860]/40 rounded-xl text-[10px] font-bold transition text-center cursor-pointer"
              >
                👷 Rohit (Tech)
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsCustomer("rajesh");
                  router.push("/customer");
                }}
                className="py-1.5 px-2 bg-[#EBF5EC] hover:bg-[#5B965E] hover:text-white text-[#5B965E] border border-[#78B77B]/40 rounded-xl text-[10px] font-bold transition text-center cursor-pointer"
              >
                👤 Rajesh (Client)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home link */}
      <div className="mt-6 text-center">
        <Link href="/" className="text-xs font-semibold text-[#734960] hover:underline">
          ← Return to Public Dashboard
        </Link>
      </div>

      {/* ───────────────── FORGOT PASSWORD MODAL ───────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E4E7EB] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E7EB]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h3 className="text-base font-bold text-[#333333]">Reset Password / PIN</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-[#333333] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#666666]">
              Enter your registered email address or mobile phone number to receive a secure password recovery link.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Registered Email or Phone</label>
                <input
                  type="text"
                  placeholder="admin@sunpower.com or +91..."
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-[#E4E7EB] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#734960]/30 focus:outline-none"
                  required
                />
              </div>

              {forgotSent && (
                <div className="p-2.5 bg-[#EBF5EC] border border-[#78B77B] text-[#5B965E] rounded-xl text-xs font-bold text-center">
                  ✓ Reset link and one-time temporary PIN sent successfully!
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-1.5 border border-[#E4E7EB] text-[#666666] rounded-xl text-xs font-semibold hover:bg-[#F5F7FA] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#734960] hover:bg-[#5A354A] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
