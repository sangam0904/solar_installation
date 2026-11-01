"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole, ALL_16_EMPLOYEES } from "@/context/AuthContext";
import {
  SunIcon,
  CrownIcon,
  HardHatIcon,
  UserIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ZapIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const {
    loginAsAdmin,
    loginAsTechnician,
    loginAsCustomer,
    loginWithOtp,
    registerUser,
    resetPassword,
  } = useAuth();

  // Top Level Mode: "signin" vs "signup"
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");

  // Sign In Role Tab: "admin" | "technician" | "customer"
  const [activeTab, setActiveTab] = useState<UserRole>("admin");

  // Sign In Method: "password" | "otp"
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");

  // Sign In Form inputs
  const [email, setEmail] = useState("admin@sunpower.com");
  const [password, setPassword] = useState("••••••••");

  // Technician selector in Sign In
  const [selectedTechId, setSelectedTechId] = useState("TECH-001");

  // Sign In OTP state
  const [otpStep, setOtpStep] = useState<"enter_email" | "enter_otp">("enter_email");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Status & Error messages
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ────────────────────────────────────────────────────────────
  // SIGN UP FORM STATE
  // ────────────────────────────────────────────────────────────
  const [signupRole, setSignupRole] = useState<"customer" | "technician">("customer");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupCity, setSignupCity] = useState("Jaipur");
  const [signupSystem, setSignupSystem] = useState("3 kW On-Grid (PM Surya Ghar - ₹78k Subsidy)");
  const [signupSpecialization, setSignupSpecialization] = useState(
    "Lead Installation & Commissioning Engineer"
  );
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupWithOtp, setSignupWithOtp] = useState(false);
  const [signupOtpStep, setSignupOtpStep] = useState<"form" | "otp">("form");
  const [signupOtpDigits, setSignupOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);

  // ────────────────────────────────────────────────────────────
  // FORGOT PASSWORD MODAL STATE
  // ────────────────────────────────────────────────────────────
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
  const signupOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Unique IDs for accessibility
  const techSelectId = useId();
  const signinEmailId = useId();
  const signinPasswordId = useId();
  const signinOtpEmailId = useId();
  const signupNameId = useId();
  const signupEmailId = useId();
  const signupPhoneId = useId();
  const signupCityId = useId();
  const signupSystemId = useId();
  const signupSpecId = useId();
  const signupPasswordId = useId();
  const signupConfirmPasswordId = useId();
  const forgotEmailId = useId();
  const forgotNewPasswordId = useId();
  const forgotConfirmPasswordId = useId();

  // Detect ?mode=signup query parameter from URL on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get("mode");
      const tab = searchParams.get("tab");

      if (mode === "signup" || mode === "register") {
        setAuthType("signup");
        if (tab === "technician") {
          setSignupRole("technician");
        } else {
          setSignupRole("customer");
        }
      } else if (tab === "customer") {
        setActiveTab("customer");
        setEmail("rajesh.gupta@email.com");
      } else if (tab === "technician") {
        setActiveTab("technician");
        setEmail(ALL_16_EMPLOYEES[selectedTechId]?.email || "rohit.m@sunpower.com");
      }
    }
  }, []);

  // Update default credentials when switching role tab in Sign In
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

  // Countdown timer for Sign In OTP
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
  // SIGN IN METHOD 1: EMAIL & PASSWORD
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
  // SIGN IN METHOD 2: EMAIL OTP
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
  // SIGN UP: SUBMIT REGISTRATION
  // ────────────────────────────────────────────────────────────
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!signupName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // If user wants Email OTP Verification during signup
    if (signupWithOtp && signupOtpStep === "form") {
      setIsSubmittingSignup(true);
      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: signupEmail.trim().toLowerCase(),
            purpose: "signup",
            role: signupRole,
            name: signupName.trim(),
          }),
        });

        const data = await res.json();
        if (!data.success) {
          setErrorMessage(data.error || "Failed to dispatch verification code.");
          return;
        }

        setSignupOtpStep("otp");
        setStatusMessage(`Verification code sent to ${signupEmail}. Check your inbox!`);
        setTimeout(() => signupOtpInputRefs.current[0]?.focus(), 150);
        return;
      } catch {
        setErrorMessage("Unable to send OTP. You can uncheck 'Verify with OTP' for direct sign-up.");
      } finally {
        setIsSubmittingSignup(false);
      }
      return;
    }

    // Direct Instant Registration
    setIsSubmittingSignup(true);
    try {
      registerUser({
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        phone: signupPhone.trim() || "+91 98290 12345",
        password: signupPassword,
        role: signupRole,
        address: `${signupCity}, Rajasthan`,
        systemDetails:
          signupRole === "customer"
            ? `${signupSystem} • ${signupCity}`
            : signupSpecialization,
      });

      setStatusMessage("Account created successfully! Redirecting to your portal...");

      setTimeout(() => {
        if (signupRole === "technician") {
          router.push("/technician");
        } else {
          router.push("/customer");
        }
      }, 700);
    } catch {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsSubmittingSignup(false);
    }
  };

  // Sign Up OTP verification handler
  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    const fullCode = signupOtpDigits.join("").trim();
    if (fullCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmittingSignup(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail.trim().toLowerCase(),
          otp: fullCode,
          purpose: "signup",
          role: signupRole,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error || "Invalid OTP code. Please try again.");
        return;
      }

      // Complete registration
      registerUser({
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        phone: signupPhone.trim() || "+91 98290 12345",
        password: signupPassword,
        role: signupRole,
        address: `${signupCity}, Rajasthan`,
        systemDetails:
          signupRole === "customer"
            ? `${signupSystem} • ${signupCity}`
            : signupSpecialization,
      });

      setStatusMessage("Email verified! Redirecting to your dashboard...");
      setTimeout(() => {
        if (signupRole === "technician") router.push("/technician");
        else router.push("/customer");
      }, 700);
    } catch {
      setErrorMessage("OTP verification failed. Please try again.");
    } finally {
      setIsSubmittingSignup(false);
    }
  };

  // ────────────────────────────────────────────────────────────
  // OTP INPUT NAVIGATION HELPERS
  // ────────────────────────────────────────────────────────────
  const handleDigitChange = (
    index: number,
    val: string,
    target: "login" | "forgot" | "signup" = "login"
  ) => {
    const num = val.replace(/[^0-9]/g, "");

    let targetDigits: string[];
    let setDigits: (d: string[]) => void;
    let refs: React.MutableRefObject<(HTMLInputElement | null)[]>;

    if (target === "forgot") {
      targetDigits = [...forgotOtpDigits];
      setDigits = setForgotOtpDigits;
      refs = forgotOtpInputRefs;
    } else if (target === "signup") {
      targetDigits = [...signupOtpDigits];
      setDigits = setSignupOtpDigits;
      refs = signupOtpInputRefs;
    } else {
      targetDigits = [...otpDigits];
      setDigits = setOtpDigits;
      refs = otpInputRefs;
    }

    if (num.length > 1) {
      const pasted = num.slice(0, 6).split("");
      pasted.forEach((d, i) => {
        targetDigits[i] = d;
      });
      setDigits(targetDigits);
      const nextIdx = Math.min(pasted.length, 5);
      refs.current[nextIdx]?.focus();
      return;
    }

    targetDigits[index] = num;
    setDigits(targetDigits);

    if (num && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    target: "login" | "forgot" | "signup" = "login"
  ) => {
    const targetDigits =
      target === "forgot" ? forgotOtpDigits : target === "signup" ? signupOtpDigits : otpDigits;
    const refs =
      target === "forgot"
        ? forgotOtpInputRefs
        : target === "signup"
        ? signupOtpInputRefs
        : otpInputRefs;

    if (e.key === "Backspace" && !targetDigits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  // ────────────────────────────────────────────────────────────
  // FORGOT PASSWORD FLOW
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
        setForgotError(data.error || "Failed to send reset code.");
        return;
      }

      setForgotStep("otp");
      setForgotCountdown(60);
      setTimeout(() => forgotOtpInputRefs.current[0]?.focus(), 150);
    } catch {
      setForgotError("Unable to reach verification service.");
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
          className="w-full h-full bg-cover bg-center opacity-30 filter blur-xl scale-110"
          style={{ backgroundImage: "url('/solar-panel-bg.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7EEF2]/70 via-[#F7EEF2]/90 to-[#F7EEF2]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Top Back to Intro Option */}
        <div className="w-full max-w-md mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#EBCED6] rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Introduction Page</span>
          </button>

          <Link
            href="/"
            className="text-[11px] font-bold text-[#6D5284] hover:text-[#4A355E] transition"
          >
            SunPower Home →
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-4 space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#4A355E] text-white shadow-sm border border-[#B39CCB]/40">
            <SunIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#261C33] tracking-tight">
            SunPower Solar Operations
          </h1>
          <p className="text-xs text-[#6D5284] font-medium">
            PM Surya Ghar Approved Rooftop Installation &amp; EPC Portal
          </p>
        </div>

        {/* Main Clean Card */}
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EBCED6] shadow-xl overflow-hidden">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* TOP TOGGLE: SIGN IN vs SIGN UP                                */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 p-1.5 bg-[#FAF4F7] border-b border-[#EBCED6] text-xs font-black">
            <button
              type="button"
              onClick={() => {
                setAuthType("signin");
                setErrorMessage("");
                setStatusMessage("");
              }}
              className={`py-2.5 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer ${
                authType === "signin"
                  ? "bg-white text-[#4A355E] shadow-xs font-black border border-[#EBCED6]/70"
                  : "text-[#6D5284] hover:text-[#261C33]"
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#8D73A8]" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthType("signup");
                setErrorMessage("");
                setStatusMessage("");
              }}
              className={`py-2.5 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer ${
                authType === "signup"
                  ? "bg-white text-[#4A355E] shadow-xs font-black border border-[#EBCED6]/70"
                  : "text-[#6D5284] hover:text-[#261C33]"
              }`}
            >
              <ZapIcon className="w-4 h-4 text-[#DA9B40]" />
              <span>Create Account (Sign Up)</span>
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB CONTENT A: SIGN IN VIEW                                   */}
          {/* ───────────────────────────────────────────────────────────── */}
          {authType === "signin" && (
            <div>
              {/* Role Tabs: Admin | Technician | Customer */}
              <div className="grid grid-cols-3 border-b border-[#EBCED6] bg-[#F7EEF2]/50 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleTabChange("admin")}
                  className={`py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "admin"
                      ? "bg-white text-[#4A355E] border-b-2 border-[#4A355E] font-black"
                      : "text-[#6D5284] hover:text-[#261C33]"
                  }`}
                >
                  <CrownIcon className="w-3.5 h-3.5 text-[#8D73A8]" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("technician")}
                  className={`py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "technician"
                      ? "bg-white text-[#4A355E] border-b-2 border-[#4A355E] font-black"
                      : "text-[#6D5284] hover:text-[#261C33]"
                  }`}
                >
                  <HardHatIcon className="w-3.5 h-3.5 text-[#8D73A8]" />
                  <span>Technician</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("customer")}
                  className={`py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "customer"
                      ? "bg-white text-[#4A355E] border-b-2 border-[#4A355E] font-black"
                      : "text-[#6D5284] hover:text-[#261C33]"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#8D73A8]" />
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
                    <label htmlFor={techSelectId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                      Select Technician Crew Member
                    </label>
                    <select
                      id={techSelectId}
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

                {/* 1. PASSWORD SIGN IN FLOW */}
                {authMode === "password" && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor={signinEmailId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                        Email Address
                      </label>
                      <input
                        id={signinEmailId}
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
                        <label htmlFor={signinPasswordId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={openForgotModal}
                          className="text-[11px] text-[#4A355E] hover:underline font-bold cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <input
                        id={signinPasswordId}
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
                      Sign In to {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Portal &rarr;
                    </button>
                  </form>
                )}

                {/* 2. EMAIL OTP SIGN IN FLOW */}
                {authMode === "otp" && (
                  <div>
                    {otpStep === "enter_email" ? (
                      <form onSubmit={handleSendLoginOtp} className="space-y-4">
                        <div>
                          <label htmlFor={signinOtpEmailId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                            Email Address
                          </label>
                          <input
                            id={signinOtpEmailId}
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
                              onChange={(e) => handleDigitChange(idx, e.target.value, "login")}
                              onKeyDown={(e) => handleKeyDown(idx, e, "login")}
                              className="w-10 h-12 text-center text-lg font-black bg-[#FAF4F7] border border-[#EBCED6] rounded-xl focus:border-[#4A355E] focus:ring-2 focus:ring-[#4A355E]/20 focus:outline-none"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#6D5284]">
                          {countdown > 0 ? (
                            <span>Resend code in {countdown}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendLoginOtp()}
                              disabled={isSendingOtp}
                              className="text-[#4A355E] font-bold hover:underline"
                            >
                              Resend Verification Code
                            </button>
                          )}
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

                {/* Bottom Switch to Sign Up */}
                <div className="pt-3 border-t border-[#F7EEF2] text-center">
                  <p className="text-xs text-[#6D5284]">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthType("signup");
                        setErrorMessage("");
                        setStatusMessage("");
                      }}
                      className="font-black text-[#4A355E] hover:text-[#DA9B40] underline transition cursor-pointer"
                    >
                      Sign Up for Free &rarr;
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB CONTENT B: SIGN UP / REGISTRATION VIEW                   */}
          {/* ───────────────────────────────────────────────────────────── */}
          {authType === "signup" && (
            <div className="p-6 sm:p-7 space-y-4">
              <div>
                <h3 className="text-sm font-black text-[#261C33]">
                  Create Your SunPower Account
                </h3>
                <p className="text-xs text-[#6D5284] mt-0.5">
                  Register to track rooftop solar installation or join our certified field crew.
                </p>
              </div>

              {/* Role Selection for Sign Up */}
              <div>
                <label className="text-[11px] font-bold text-[#6D5284] uppercase block mb-1.5">
                  I want to register as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole("customer")}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      signupRole === "customer"
                        ? "border-[#4A355E] bg-[#FAF4F7] ring-1 ring-[#4A355E]"
                        : "border-[#EBCED6] bg-white hover:bg-[#FAF4F7]/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#4A355E]">
                      <UserIcon className="w-4 h-4 text-[#DA9B40]" />
                      <span>Rooftop Customer</span>
                    </div>
                    <p className="text-[10px] text-[#6D5284] mt-1 leading-tight">
                      For homeowners seeking DBT subsidies &amp; net-metering.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole("technician")}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      signupRole === "technician"
                        ? "border-[#4A355E] bg-[#FAF4F7] ring-1 ring-[#4A355E]"
                        : "border-[#EBCED6] bg-white hover:bg-[#FAF4F7]/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#4A355E]">
                      <HardHatIcon className="w-4 h-4 text-[#5B965E]" />
                      <span>Field Technician</span>
                    </div>
                    <p className="text-[10px] text-[#6D5284] mt-1 leading-tight">
                      For solar engineers, electricians &amp; site inspectors.
                    </p>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Success Message */}
              {statusMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                  {statusMessage}
                </div>
              )}

              {/* Sign Up Form or OTP Verification */}
              {signupOtpStep === "form" ? (
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor={signupNameId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                      Full Name *
                    </label>
                    <input
                      id={signupNameId}
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder={signupRole === "customer" ? "e.g. Pooja Sharma" : "e.g. Sandeep Verma"}
                      className="w-full mt-1 px-3.5 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Email & Phone in 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={signupEmailId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                        Email Address *
                      </label>
                      <input
                        id={signupEmailId}
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={signupPhoneId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                        Mobile Number
                      </label>
                      <input
                        id={signupPhoneId}
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+91 98290 12345"
                        className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Role Specific Fields */}
                  {signupRole === "customer" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={signupCityId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                          District / City (Rajasthan)
                        </label>
                        <select
                          id={signupCityId}
                          value={signupCity}
                          onChange={(e) => setSignupCity(e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-semibold bg-white focus:outline-none"
                        >
                          <option value="Jaipur">Jaipur</option>
                          <option value="Jodhpur">Jodhpur</option>
                          <option value="Kota">Kota</option>
                          <option value="Bikaner">Bikaner</option>
                          <option value="Udaipur">Udaipur</option>
                          <option value="Ajmer">Ajmer</option>
                          <option value="Alwar">Alwar</option>
                          <option value="Sikar">Sikar</option>
                          <option value="Other">Other Region</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor={signupSystemId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                          Desired Solar Plant
                        </label>
                        <select
                          id={signupSystemId}
                          value={signupSystem}
                          onChange={(e) => setSignupSystem(e.target.value)}
                          className="w-full mt-1 px-2.5 py-2 border border-[#EBCED6] rounded-xl text-xs font-semibold bg-white focus:outline-none"
                        >
                          <option value="3 kW On-Grid (PM Surya Ghar - ₹78k Subsidy)">
                            3 kW On-Grid (₹78k Subsidy)
                          </option>
                          <option value="5 kW On-Grid (High Generation)">
                            5 kW On-Grid (High Power)
                          </option>
                          <option value="2 kW On-Grid (Affordable)">
                            2 kW On-Grid (₹60k Subsidy)
                          </option>
                          <option value="10 kW Commercial Rooftop">
                            10 kW Commercial Rooftop
                          </option>
                          <option value="5 kW Hybrid + Battery Storage">
                            5 kW Hybrid + Battery
                          </option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor={signupSpecId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                        Technical Specialization
                      </label>
                      <select
                        id={signupSpecId}
                        value={signupSpecialization}
                        onChange={(e) => setSignupSpecialization(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-semibold bg-white focus:outline-none"
                      >
                        <option value="Lead Installation & Commissioning Engineer">
                          Lead Installation &amp; Commissioning Engineer
                        </option>
                        <option value="Rooftop Survey & Tilt Analysis Specialist">
                          Rooftop Survey &amp; Tilt Analysis Specialist
                        </option>
                        <option value="DISCOM Net-Metering & Grid Sync Engineer">
                          DISCOM Net-Metering &amp; Grid Sync Engineer
                        </option>
                        <option value="Electrical Quality & Pre-Sales Inspector">
                          Electrical Quality &amp; Pre-Sales Inspector
                        </option>
                        <option value="Off-Grid & Lithium Battery Specialist">
                          Off-Grid &amp; Lithium Battery Specialist
                        </option>
                      </select>
                    </div>
                  )}

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={signupPasswordId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                        Password * (min 6)
                      </label>
                      <input
                        id={signupPasswordId}
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create password"
                        className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={signupConfirmPasswordId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                        Confirm Password *
                      </label>
                      <input
                        id={signupConfirmPasswordId}
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4A355E]/30 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* OTP Checkbox Option */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="otpVerifyCheckbox"
                      checked={signupWithOtp}
                      onChange={(e) => setSignupWithOtp(e.target.checked)}
                      className="w-4 h-4 rounded text-[#4A355E] border-gray-300 focus:ring-[#4A355E]"
                    />
                    <label htmlFor="otpVerifyCheckbox" className="text-xs text-[#6D5284] cursor-pointer">
                      Verify email address with 6-digit OTP code before signup
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingSignup}
                    className="w-full py-3 bg-[#4A355E] hover:bg-[#372447] disabled:opacity-50 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmittingSignup
                      ? "Processing Account..."
                      : signupWithOtp
                      ? "Send Verification OTP ✉️"
                      : "Create Account & Access Portal →"}
                  </button>
                </form>
              ) : (
                /* Step 2: Verify Sign Up OTP */
                <form onSubmit={handleVerifySignupOtp} className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-[#6D5284]">
                    <span>Enter 6-digit OTP sent to {signupEmail}</span>
                    <button
                      type="button"
                      onClick={() => setSignupOtpStep("form")}
                      className="text-[#4A355E] font-bold hover:underline"
                    >
                      Edit Info
                    </button>
                  </div>

                  <div className="flex justify-between gap-1.5 sm:gap-2">
                    {signupOtpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          signupOtpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value, "signup")}
                        onKeyDown={(e) => handleKeyDown(idx, e, "signup")}
                        className="w-10 h-12 text-center text-lg font-black bg-[#FAF4F7] border border-[#EBCED6] rounded-xl focus:border-[#4A355E] focus:ring-2 focus:ring-[#4A355E]/20 focus:outline-none"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingSignup || signupOtpDigits.join("").length !== 6}
                    className="w-full py-2.5 bg-[#4A355E] hover:bg-[#372447] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmittingSignup ? "Verifying..." : "Verify & Complete Registration &rarr;"}
                  </button>
                </form>
              )}

              {/* Bottom Switch to Sign In */}
              <div className="pt-3 border-t border-[#F7EEF2] text-center">
                <p className="text-xs text-[#6D5284]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthType("signin");
                      setErrorMessage("");
                      setStatusMessage("");
                    }}
                    className="font-black text-[#4A355E] hover:text-[#DA9B40] underline transition cursor-pointer"
                  >
                    Sign In here &rarr;
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Security Trust Badges */}
        <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-[#6D5284]">
          <span className="flex items-center gap-1">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-[#5B965E]" />
            256-Bit SSL Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 text-[#DA9B40]" />
            MNRE &amp; DISCOM Verified
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* FORGOT PASSWORD MODAL (EMAIL -> OTP -> NEW PASSWORD)         */}
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
                  <label htmlFor={forgotEmailId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                    Account Email
                  </label>
                  <input
                    id={forgotEmailId}
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
                      onChange={(e) => handleDigitChange(idx, e.target.value, "forgot")}
                      onKeyDown={(e) => handleKeyDown(idx, e, "forgot")}
                      className="w-9 h-11 text-center text-lg font-black bg-[#FAF4F7] border border-[#EBCED6] rounded-xl focus:outline-none focus:border-[#4A355E]"
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#6D5284]">
                  <span>{forgotCountdown > 0 ? `Resend in ${forgotCountdown}s` : ""}</span>
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

            {/* Step 3: Set New Password */}
            {forgotStep === "password" && (
              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <p className="text-xs text-[#6D5284]">
                  Create a new secure password for your account:
                </p>
                <div>
                  <label htmlFor={forgotNewPasswordId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                    New Password (min 6)
                  </label>
                  <input
                    id={forgotNewPasswordId}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={forgotConfirmPasswordId} className="text-[11px] font-bold text-[#6D5284] uppercase">
                    Confirm New Password
                  </label>
                  <input
                    id={forgotConfirmPasswordId}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-[#EBCED6] rounded-xl text-xs font-medium focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#4A355E] hover:bg-[#372447] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Update Password &rarr;
                </button>
              </form>
            )}

            {/* Step 4: Done */}
            {forgotStep === "done" && (
              <div className="text-center py-4 space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#5B965E] flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-[#261C33]">Password Reset Complete!</h4>
                <p className="text-xs text-[#6D5284]">
                  Your password has been successfully updated. You can now sign in with your new credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-[#4A355E] hover:bg-[#372447] text-white text-xs font-bold rounded-xl"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
