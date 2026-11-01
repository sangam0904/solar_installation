"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole, ALL_16_EMPLOYEES } from "@/context/AuthContext";
import {
  SunIcon,
  CrownIcon,
  HardHatIcon,
  UserIcon,
  ArrowLeftIcon,
} from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const {
    loginAsAdmin,
    loginAsTechnician,
    loginAsCustomer,
    loginWithOtp,
    resetPassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<UserRole>("admin");

  // Auth Mode: "password" or "otp" across all roles
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");

  // Form inputs
  const [email, setEmail] = useState("admin@sunpower.com");
  const [password, setPassword] = useState("••••••••");

  // Technician crew selector (updates email)
  const [selectedTechId, setSelectedTechId] = useState("TECH-001");

  // OTP Login step state
  const [otpStep, setOtpStep] = useState<"enter_email" | "enter_otp">("enter_email");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Status & Error messages
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<"email" | "otp" | "password" | "done">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtpDigits, setForgotOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotCountdown, setForgotCountdown] = useState(0);

  // Input refs for OTP auto-focus
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const forgotOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update default email when switching role tab
  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setOtpStep("enter_email");
    setOtpDigits(["", "", "", "", "", ""]);
    setStatusMessage("");
    setErrorMessage("");

    if (role === "admin") {
      setEmail("admin@sunpower.com");
      setPassword("••••••••");
    } else if (role === "technician") {
      setEmail(ALL_16_EMPLOYEES[selectedTechId]?.email || "rohit.m@sunpower.com");
      setPassword("1234");
    } else {
      setEmail("rajesh.gupta@email.com");
      setPassword("••••••••");
    }
  };

  // Countdown timer for Login OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  // Countdown timer for Forgot Password OTP
  useEffect(() => {
    if (forgotCountdown <= 0) return;
    const t = setInterval(() => setForgotCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [forgotCountdown]);

  // ────────────────────────────────────────────────────────────
  // METHOD 1: EMAIL & PASSWORD SIGN IN
  // ────────────────────────────────────────────────────────────
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (activeTab === "admin") {
      loginAsAdmin(email);
      router.push("/dashboard");
    } else if (activeTab === "technician") {
      loginAsTechnician(selectedTechId, email);
      router.push("/technician");
    } else {
      loginAsCustomer(email, email);
      router.push("/customer");
    }
  };

  // ────────────────────────────────────────────────────────────
  // METHOD 2: EMAIL OTP SIGN IN
  // ────────────────────────────────────────────────────────────
  const handleSendLoginOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          purpose: "login",
          role: activeTab,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error || "Failed to send verification code.");
        return;
      }

      setOtpStep("enter_otp");
      setCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setStatusMessage(`Verification code sent to ${email}. Please check your inbox.`);

      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch {
      setErrorMessage("Unable to connect to verification server. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    const fullCode = otpDigits.join("").trim();
    if (fullCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullCode,
          purpose: "login",
          role: activeTab,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error || "Invalid verification code. Please try again.");
        return;
      }

      // Success: Sign in user session
      loginWithOtp(email.trim().toLowerCase(), activeTab);

      if (activeTab === "admin") router.push("/dashboard");
      else if (activeTab === "technician") router.push("/technician");
      else router.push("/customer");
    } catch {
      setErrorMessage("Verification request failed. Please check your connection.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ────────────────────────────────────────────────────────────
  // OTP INPUT NAVIGATION HELPERS
  // ────────────────────────────────────────────────────────────
  const handleDigitChange = (index: number, val: string, isForgot = false) => {
    const num = val.replace(/[^0-9]/g, "");
    const targetDigits = isForgot ? [...forgotOtpDigits] : [...otpDigits];
    const targetSetter = isForgot ? setForgotOtpDigits : setOtpDigits;
    const targetRefs = isForgot ? forgotOtpInputRefs : otpInputRefs;

    if (num.length > 1) {
      const pasted = num.slice(0, 6).split("");
      pasted.forEach((d, i) => {
        targetDigits[i] = d;
      });
      targetSetter(targetDigits);
      const nextIdx = Math.min(5, pasted.length - 1);
      targetRefs.current[nextIdx]?.focus();
      return;
    }

    targetDigits[index] = num;
    targetSetter(targetDigits);

    if (num && index < 5) {
      targetRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, isForgot = false) => {
    const targetDigits = isForgot ? forgotOtpDigits : otpDigits;
    const targetRefs = isForgot ? forgotOtpInputRefs : otpInputRefs;

    if (e.key === "Backspace" && !targetDigits[index] && index > 0) {
      targetRefs.current[index - 1]?.focus();
    }
  };

  // ────────────────────────────────────────────────────────────
  // FORGOT PASSWORD MODAL HANDLERS
  // ────────────────────────────────────────────────────────────
  const openForgotModal = () => {
    setForgotEmail(email);
    setForgotStep("email");
    setForgotError("");
    setForgotOtpDigits(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setShowForgotModal(true);
  };

  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotError("Please enter a valid email address.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          purpose: "reset_password",
          role: activeTab,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setForgotError(data.error || "Failed to dispatch reset code.");
        return;
      }

      setForgotStep("otp");
      setForgotCountdown(60);
      setTimeout(() => forgotOtpInputRefs.current[0]?.focus(), 150);
    } catch {
      setForgotError("Network error. Could not dispatch reset code.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    const fullCode = forgotOtpDigits.join("").trim();
    if (fullCode.length !== 6) {
      setForgotError("Please enter the complete 6-digit code.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          otp: fullCode,
          purpose: "reset_password",
          role: activeTab,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setForgotError(data.error || "Invalid or expired reset code.");
        return;
      }

      setForgotStep("password");
    } catch {
      setForgotError("Verification failed. Please check your connection.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    resetPassword(forgotEmail, newPassword);
    setForgotStep("done");
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7EEF2] text-[#261C33] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Blurry Solar Panel Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="w-full h-full bg-cover bg-center opacity-40 filter blur-xl scale-110"
          style={{ backgroundImage: "url('/solar-panel-bg.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7EEF2]/70 via-[#F7EEF2]/90 to-[#F7EEF2]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Top Back Option */}
        <div className="w-full max-w-md mb-3 flex items-center justify-start">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#EBCED6] rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-5 space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#4A355E] text-white shadow-sm border border-[#B39CCB]/40">
            <SunIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#261C33]">
            SunPower Solar Operations
          </h1>
          <p className="text-xs text-[#6D5284]">
            Sign in to access your portal
          </p>
        </div>

        {/* Clean Login Card */}
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EBCED6] shadow-lg overflow-hidden">
          {/* Role Tabs: Admin | Technician | Customer */}
          <div className="grid grid-cols-3 border-b border-[#EBCED6] bg-[#F7EEF2]/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleTabChange("admin")}
              className={`py-3 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "admin"
                  ? "bg-white text-[#4A355E] border-b-2 border-[#4A355E] font-black"
                  : "text-[#6D5284] hover:text-[#261C33]"
              }`}
            >
              <CrownIcon className="w-4 h-4 text-[#8D73A8]" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("technician")}
              className={`py-3 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "technician"
                  ? "bg-white text-[#4A355E] border-b-2 border-[#4A355E] font-black"
                  : "text-[#6D5284] hover:text-[#261C33]"
              }`}
            >
              <HardHatIcon className="w-4 h-4 text-[#8D73A8]" />
              <span>Technician</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("customer")}
              className={`py-3 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "customer"
                  ? "bg-white text-[#4A355E] border-b-2 border-[#4A355E] font-black"
                  : "text-[#6D5284] hover:text-[#261C33]"
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#8D73A8]" />
              <span>Customer</span>
            </button>
          </div>

          <div className="p-6 sm:p-7 space-y-4">
            {/* Two Login Method Toggle (Password vs Email OTP) */}
            <div className="p-1 bg-[#F7EEF2] rounded-xl flex items-center text-xs font-bold border border-[#EBCED6]">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("password");
                  setOtpStep("enter_email");
                  setErrorMessage("");
                  setStatusMessage("");
                }}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  authMode === "password"
                    ? "bg-white text-[#4A355E] shadow-2xs font-extrabold"
                    : "text-[#6D5284] hover:text-[#261C33]"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("otp");
                  setOtpStep("enter_email");
                  setErrorMessage("");
                  setStatusMessage("");
                }}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  authMode === "otp"
                    ? "bg-white text-[#4A355E] shadow-2xs font-extrabold"
                    : "text-[#6D5284] hover:text-[#261C33]"
                }`}
              >
                Email OTP Login
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Success Status Message */}
            {statusMessage && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                {statusMessage}
              </div>
            )}

            {/* Technician Select Helper (Only in Technician Tab) */}
            {activeTab === "technician" && (
              <div>
                <label className="text-[11px] font-bold text-[#6D5284] uppercase">Select Technician</label>
                <select
                  value={selectedTechId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedTechId(id);
                    if (ALL_16_EMPLOYEES[id]) {
                      setEmail(ALL_16_EMPLOYEES[id].email);
                    }
                  }}
                  className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-semibold bg-white focus:outline-none"
                >
                  {Object.entries(ALL_16_EMPLOYEES).map(([id, tech]) => (
                    <option key={id} value={id}>
                      {tech.name} • {tech.specialization.split("&")[0]} ({id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ────────────────────────────────────────────────── */}
            {/* 1. PASSWORD LOGIN FLOW                             */}
            {/* ────────────────────────────────────────────────── */}
            {authMode === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#6D5284] uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full mt-1 px-3.5 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-[#6D5284] uppercase">Password</label>
                    <button
                      type="button"
                      onClick={openForgotModal}
                      className="text-[11px] text-[#4A355E] hover:underline font-bold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full mt-1 px-3.5 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4A355E] hover:bg-[#372447] text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
                >
                  Sign In &rarr;
                </button>
              </form>
            )}

            {/* ────────────────────────────────────────────────── */}
            {/* 2. EMAIL OTP LOGIN FLOW                            */}
            {/* ────────────────────────────────────────────────── */}
            {authMode === "otp" && (
              <div>
                {otpStep === "enter_email" ? (
                  <form onSubmit={handleSendLoginOtp} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#6D5284] uppercase">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full mt-1 px-3.5 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-2.5 bg-[#4A355E] hover:bg-[#372447] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSendingOtp ? "Sending Code..." : "Send Login OTP ✉️"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyLoginOtp} className="space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs text-[#6D5284]">
                      <span>Enter 6-digit code sent to your email</span>
                      <button
                        type="button"
                        onClick={() => setOtpStep("enter_email")}
                        className="text-[#4A355E] font-bold hover:underline"
                      >
                        Edit Email
                      </button>
                    </div>

                    {/* 6 Digit Input Boxes */}
                    <div className="flex justify-between gap-1.5 sm:gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          className="w-11 h-12 text-center font-mono text-xl font-black rounded-xl border-2 border-[#EBCED6] bg-white text-[#4A355E] focus:border-[#4A355E] focus:outline-none"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6D5284]">
                      <span>
                        {countdown > 0 ? `Resend in ${countdown}s` : "Didn't receive code?"}
                      </span>
                      <button
                        type="button"
                        disabled={countdown > 0 || isSendingOtp}
                        onClick={handleSendLoginOtp}
                        className="text-[#4A355E] font-bold hover:underline disabled:opacity-40"
                      >
                        Resend Code
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || otpDigits.join("").length !== 6}
                      className="w-full py-2.5 bg-[#4A355E] hover:bg-[#372447] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isVerifyingOtp ? "Verifying..." : "Verify & Sign In &rarr;"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* CLEAN FORGOT PASSWORD MODAL (EMAIL -> OTP -> NEW PASSWORD)   */}
      {/* ──────────────────────────────────────────────────────────── */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#EBCED6] space-y-4 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F7EEF2] pb-3">
              <h3 className="text-sm font-extrabold text-[#261C33]">
                {forgotStep === "email" && "Reset Password"}
                {forgotStep === "otp" && "Enter Security Code"}
                {forgotStep === "password" && "Set New Password"}
                {forgotStep === "done" && "Password Updated"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="p-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
                {forgotError}
              </div>
            )}

            {/* Step 1: Email */}
            {forgotStep === "email" && (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <p className="text-xs text-[#6D5284]">
                  Enter your email to receive a password reset verification code.
                </p>
                <div>
                  <label className="text-[11px] font-bold text-[#6D5284] uppercase">Account Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 border border-[#EBCED6] text-xs font-bold text-[#6D5284] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-1.5 bg-[#4A355E] hover:bg-[#372447] disabled:opacity-50 text-white text-xs font-bold rounded-xl"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Code"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP */}
            {forgotStep === "otp" && (
              <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                <p className="text-xs text-[#6D5284]">
                  Enter the 6-digit code sent to your email:
                </p>

                <div className="flex justify-between gap-1.5">
                  {forgotOtpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        forgotOtpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value, true)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e, true)}
                      className="w-10 h-11 text-center font-mono text-lg font-black rounded-xl border-2 border-[#EBCED6] bg-white text-[#4A355E] focus:border-[#4A355E] focus:outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{forgotCountdown > 0 ? `Resend in ${forgotCountdown}s` : "Didn't receive code?"}</span>
                  <button
                    type="button"
                    disabled={forgotCountdown > 0 || forgotLoading}
                    onClick={handleSendForgotOtp}
                    className="font-bold text-[#4A355E] hover:underline disabled:opacity-40"
                  >
                    Resend Code
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep("email")}
                    className="px-3 py-1.5 text-xs font-bold text-gray-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || forgotOtpDigits.join("").length !== 6}
                    className="px-4 py-1.5 bg-[#4A355E] hover:bg-[#372447] disabled:opacity-50 text-white text-xs font-bold rounded-xl"
                  >
                    {forgotLoading ? "Verifying..." : "Verify Code"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Password */}
            {forgotStep === "password" && (
              <form onSubmit={handleSaveNewPassword} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6D5284] uppercase">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6D5284] uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#5B965E] hover:bg-[#47774A] text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Save &amp; Sign In &rarr;
                </button>
              </form>
            )}

            {/* Step 4: Done */}
            {forgotStep === "done" && (
              <div className="text-center py-2 space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-[#5B965E] rounded-full flex items-center justify-center text-xl mx-auto">
                  ✓
                </div>
                <p className="text-xs text-[#261C33] font-bold">
                  Your password has been updated successfully!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setPassword(newPassword);
                    loginWithOtp(forgotEmail, activeTab);
                    if (activeTab === "admin") router.push("/dashboard");
                    else if (activeTab === "technician") router.push("/technician");
                    else router.push("/customer");
                  }}
                  className="w-full py-2 bg-[#4A355E] hover:bg-[#372447] text-white font-bold rounded-xl text-xs"
                >
                  Proceed to Dashboard &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
