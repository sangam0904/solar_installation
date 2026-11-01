"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  SunIcon,
  ShieldCheckIcon,
  ZapIcon,
  CheckCircleIcon,
  HardHatIcon,
  UsersIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  FileTextIcon,
  TrendingUpIcon,
  DashboardIcon,
  LandmarkIcon,
} from "@/components/Icons";

export default function IntroductionLandingPage() {
  const { user, role } = useAuth();
  const billInputId = useId();

  // Interactive Solar Calculator State
  const [monthlyBill, setMonthlyBill] = useState(4500);

  // Dynamic calculations based on monthly bill
  const calculatedCapacity = Math.max(1, Math.min(25, Math.round(monthlyBill / 1200)));
  const roofAreaNeeded = calculatedCapacity * 90; // ~90 sq ft per kW
  const monthlyGeneration = calculatedCapacity * 125; // ~125 kWh per kW per month in Rajasthan
  const annualSavings = Math.round(monthlyBill * 11.2);
  const lifetimeSavings25Yrs = Math.round(annualSavings * 23.5);
  const centralSubsidy =
    calculatedCapacity === 1 ? 30000 : calculatedCapacity === 2 ? 60000 : 78000;
  const estimatedGrossCost = calculatedCapacity * 62000;
  const netPayableCost = Math.max(15000, estimatedGrossCost - centralSubsidy);
  const co2ReductionTonnes = (calculatedCapacity * 1.35).toFixed(1);
  const treesEquivalent = Math.round(calculatedCapacity * 42);

  // Active technology tab
  const [activeTechTab, setActiveTechTab] = useState<"ongrid" | "hybrid" | "offgrid">("ongrid");

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FFFBF8] text-[#261C33] selection:bg-[#4A355E] selection:text-white font-sans antialiased">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP GLOBAL NOTIFICATION TICKER                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#4A355E] text-white text-[11px] py-2 px-4 border-b border-[#6D5284]/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="bg-[#DA9B40] text-black font-extrabold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
              PM Surya Ghar 2026
            </span>
            <span className="text-white/90">
              Get up to <strong>₹78,000 Direct Bank Subsidy</strong> on residential rooftop solar systems!
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <span className="hidden md:inline font-mono text-[10px]">
              🟢 PostgreSQL 18 Live Engine • 324+ Active Database Records
            </span>
            <a
              href="tel:+919876511111"
              className="hover:text-white transition flex items-center gap-1 font-semibold text-[#FFBB94]"
            >
              <PhoneIcon className="w-3 h-3" /> +91 98765 11111
            </a>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. STICKY TOP NAVIGATION BAR (WITH TOP-RIGHT SIGN UP / LOGIN) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EBCED6] shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4A355E] to-[#6D5284] flex items-center justify-center text-white shadow-sm border border-[#4A355E]/30 overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/icon.png" alt="SunPower Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#261C33]">
                  SunPower<span className="text-[#DA9B40]">.</span>
                </span>
                <span className="text-[10px] font-bold bg-[#F7EEF2] text-[#4A355E] px-2 py-0.5 rounded-md border border-[#EBCED6]">
                  Solutions
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#6D5284] tracking-wider uppercase -mt-0.5">
                Smart Solar Rooftops &amp; Clean Energy
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#4A355E]">
            <a href="#why-solar" className="hover:text-[#DA9B40] transition">Why Solar</a>
            <a href="#how-it-works" className="hover:text-[#DA9B40] transition">How It Works</a>
            <a href="#technology" className="hover:text-[#DA9B40] transition">Technology</a>
            <a href="#subsidy" className="hover:text-[#DA9B40] transition">PM Surya Ghar</a>
            <a href="#calculator" className="hover:text-[#DA9B40] transition">Savings Calculator</a>
            <a href="#live-stats" className="hover:text-[#DA9B40] transition">Live Platform</a>
          </nav>

          {/* ── TOP RIGHT CORNER: SIGN UP & LOGIN BUTTONS ── */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={role === "technician" ? "/technician" : role === "customer" ? "/customer" : "/dashboard"}
                  className="px-3.5 py-2 bg-[#EBF5EC] text-[#5B965E] hover:bg-[#d8eedb] border border-[#78B77B]/50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-[#5B965E] animate-pulse"></span>
                  <span>Go to Portal ({user.name.split(" ")[0]}) →</span>
                </Link>

                <Link
                  href="/login"
                  className="px-3 py-2 text-xs font-semibold text-[#6D5284] hover:text-[#4A355E] hover:bg-[#F7EEF2] rounded-xl transition"
                  title="Switch User Role"
                >
                  Switch
                </Link>
              </div>
            ) : (
              <>
                {/* Sign Up Option */}
                <Link
                  href="/login?tab=customer"
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-[#4A355E] hover:text-[#372447] bg-[#F7EEF2] hover:bg-[#EBCED6] border border-[#EBCED6] rounded-xl transition cursor-pointer"
                >
                  Sign Up
                </Link>

                {/* Log In Option */}
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#4A355E] hover:bg-[#372447] rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>Log In</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. HERO SECTION WITH SOLAR PHOTO & VALUE BADGES               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#EBCED6]">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FAF4F7] via-[#F7EEF2]/70 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Floating Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7EEF2] border border-[#EBCED6] rounded-full text-xs font-bold text-[#4A355E] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#DA9B40] animate-ping" />
                <span>Rajasthan’s Premier Solar EPC &amp; Asset Management Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#261C33] tracking-tight leading-[1.12]">
                Power Your Home With Clean Solar.
                <span className="block text-[#4A355E] mt-1">
                  Cut Electricity Bills to <span className="underline decoration-[#DA9B40] decoration-wavy">₹0</span>.
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#6D5284] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Convert your unused rooftop into a high-yielding, 25-year green power plant.
                Get automated DISCOM approvals, guaranteed ₹78,000 PM Surya Ghar DBT subsidies,
                and real-time IoT smart meter monitoring powered by our 28 certified field engineers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#calculator"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#4A355E] hover:bg-[#372447] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ZapIcon className="w-4 h-4 text-[#DA9B40]" />
                  <span>Calculate Solar Savings</span>
                </a>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F7EEF2] text-[#4A355E] border border-[#EBCED6] font-bold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-2xs"
                >
                  <span>Access Platform / Sign In</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>

              {/* Key Assurance Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#EBCED6]">
                <div className="flex items-center gap-2 text-left">
                  <CheckCircleIcon className="w-4 h-4 text-[#5B965E] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-[#4A355E]">₹78,000 DBT Subsidy</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <CheckCircleIcon className="w-4 h-4 text-[#5B965E] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-[#4A355E]">25-Year Performance</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <CheckCircleIcon className="w-4 h-4 text-[#5B965E] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-[#4A355E]">MNRE Tier-1 Modules</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <CheckCircleIcon className="w-4 h-4 text-[#5B965E] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-[#4A355E]">28 Certified Crew</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              {/* Outer decorative card frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#EBCED6] shadow-xl bg-white p-2">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80"
                    alt="Solar Rooftop Installation"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Overlaid Live Generation Telemetry Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full font-bold text-[#4A355E] flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#5B965E] animate-ping" />
                      Live Generation Active
                    </span>

                    <span className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-mono text-[11px]">
                      5 kW Mono PERC
                    </span>
                  </div>

                  {/* Bottom metrics on the photo */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <p className="text-[11px] font-medium text-[#FFBB94] uppercase tracking-wider">
                      Jaipur Rooftop System #ORD-003
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-black">21.4 kWh Today</p>
                      <p className="text-sm font-bold text-[#78B77B]">₹18,400 Saved</p>
                    </div>
                  </div>
                </div>

                {/* Micro floating live engineer badge */}
                <div className="mt-3 p-3 bg-[#FAF4F7] rounded-xl flex items-center justify-between text-xs border border-[#EBCED6]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#4A355E] text-white flex items-center justify-center font-bold">
                      👷
                    </div>
                    <div>
                      <p className="font-bold text-[#261C33]">Rohit Meena (Lead Engineer)</p>
                      <p className="text-[11px] text-[#6D5284]">Assigned on site • Commissioning Done</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EBF5EC] text-[#5B965E] px-2 py-0.5 rounded-full border border-[#78B77B]/40">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. WHY SOLAR & WHAT IS ROOFTOP SOLAR (EXPLANATION)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="why-solar" className="py-16 bg-white border-b border-[#EBCED6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A355E] bg-[#F7EEF2] px-3 py-1 rounded-full border border-[#EBCED6]">
              Understanding Solar Energy
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#261C33]">
              How Does Rooftop Solar Actually Work?
            </h2>
            <p className="text-xs sm:text-sm text-[#6D5284] leading-relaxed">
              Rooftop solar turns sunlight into immediate household electrical energy.
              Here is how your home or business transitions to 100% clean, self-sustaining energy:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#FAF4F7] p-6 rounded-3xl border border-[#EBCED6] space-y-3 relative hover:shadow-sm transition">
              <span className="w-8 h-8 rounded-xl bg-[#4A355E] text-white text-xs font-extrabold flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-[#261C33]">Solar Photovoltaics</h3>
              <p className="text-xs text-[#6D5284] leading-relaxed">
                High-efficiency Monocrystalline PERC silicon cells absorb sunlight photons, liberating electrons to create Direct Current (DC) electricity.
              </p>
            </div>

            <div className="bg-[#FAF4F7] p-6 rounded-3xl border border-[#EBCED6] space-y-3 relative hover:shadow-sm transition">
              <span className="w-8 h-8 rounded-xl bg-[#4A355E] text-white text-xs font-extrabold flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-[#261C33]">MPPT Inversion</h3>
              <p className="text-xs text-[#6D5284] leading-relaxed">
                Smart MPPT inverters convert raw DC into synchronized 230V/415V Alternating Current (AC) to safely power all heavy home appliances.
              </p>
            </div>

            <div className="bg-[#FAF4F7] p-6 rounded-3xl border border-[#EBCED6] space-y-3 relative hover:shadow-sm transition">
              <span className="w-8 h-8 rounded-xl bg-[#4A355E] text-white text-xs font-extrabold flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-[#261C33]">Net Metering</h3>
              <p className="text-xs text-[#6D5284] leading-relaxed">
                During sunny daytime hours, excess electricity feeds back into the DISCOM grid. The bidirectional net meter runs backwards, giving you credits!
              </p>
            </div>

            <div className="bg-[#FAF4F7] p-6 rounded-3xl border border-[#EBCED6] space-y-3 relative hover:shadow-sm transition">
              <span className="w-8 h-8 rounded-xl bg-[#4A355E] text-white text-xs font-extrabold flex items-center justify-center">
                4
              </span>
              <h3 className="text-base font-bold text-[#261C33]">Direct Bank Subsidy</h3>
              <p className="text-xs text-[#6D5284] leading-relaxed">
                Upon DISCOM inspection, the central government credits up to ₹78,000 directly into your bank account under PM Surya Ghar DBT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. INTERACTIVE SOLAR SAVINGS CALCULATOR                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="calculator" className="py-16 bg-[#F7EEF2]/50 border-b border-[#EBCED6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DA9B40] bg-[#FEF6EB] px-3 py-0.5 rounded-full border border-[#F4B860]/40">
              Interactive ROI Tool
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#261C33]">
              How Much Will You Save With Solar?
            </h2>
            <p className="text-xs sm:text-sm text-[#6D5284]">
              Drag the slider to your average monthly electricity bill and see your customized system size, subsidy, and net cost immediately:
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBCED6] p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Slider Control */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor={billInputId} className="text-xs font-bold text-[#4A355E] uppercase tracking-wider">
                    Average Monthly Electricity Bill
                  </label>
                  <span className="text-2xl font-black text-[#261C33]">
                    ₹{monthlyBill.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  id={billInputId}
                  type="range"
                  min="1500"
                  max="25000"
                  step="500"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#F7EEF2] rounded-lg appearance-none cursor-pointer accent-[#4A355E] mt-3"
                />
                <div className="flex justify-between text-[10px] text-gray-600 font-semibold mt-1">
                  <span>₹1,500/mo</span>
                  <span>₹10,000/mo</span>
                  <span>₹25,000/mo</span>
                </div>
              </div>

              {/* Calculated Quick Specs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#FAF4F7] rounded-2xl border border-[#EBCED6] space-y-1">
                  <span className="text-[10px] font-bold text-[#6D5284] uppercase">Recommended Capacity</span>
                  <p className="text-lg font-black text-[#4A355E]">{calculatedCapacity} kW Rooftop</p>
                  <p className="text-[10px] text-gray-600 font-medium">{roofAreaNeeded} sq. ft. shade-free roof</p>
                </div>

                <div className="p-3 bg-[#FAF4F7] rounded-2xl border border-[#EBCED6] space-y-1">
                  <span className="text-[10px] font-bold text-[#6D5284] uppercase">Monthly Generation</span>
                  <p className="text-lg font-black text-[#5B965E]">~{monthlyGeneration} Units (kWh)</p>
                  <p className="text-[10px] text-gray-600 font-medium">Replaces 100% of grid billing</p>
                </div>
              </div>

              <div className="p-3 bg-[#EBF5EC] rounded-2xl border border-[#78B77B]/40 text-xs text-[#5B965E] flex items-center gap-2">
                <span className="text-base">🌱</span>
                <span>
                  Prevents <strong>{co2ReductionTonnes} tonnes CO2/yr</strong> — equivalent to planting <strong>{treesEquivalent} trees</strong>!
                </span>
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#4A355E] to-[#372447] text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-semibold text-[#FFBB94] uppercase tracking-wider">
                  Cost &amp; Subsidy Breakdown
                </span>
                <span className="text-[10px] font-bold bg-[#DA9B40] text-black px-2.5 py-0.5 rounded-full">
                  Govt. Approved Rates
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-white/80">
                  <span>Gross Turnkey Cost:</span>
                  <span className="line-through text-white/60">₹{estimatedGrossCost.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center text-[#78B77B] font-bold">
                  <span>PM Surya Ghar Direct Subsidy:</span>
                  <span>- ₹{centralSubsidy.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center text-base font-black text-white pt-2 border-t border-white/20 font-sans">
                  <span>Effective Net Investment:</span>
                  <span className="text-xl text-[#FFBB94]">₹{netPayableCost.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl space-y-1">
                <p className="text-[11px] text-white/80 uppercase font-semibold">25-Year Estimated Savings</p>
                <p className="text-2xl font-black text-[#DA9B40]">
                  ₹{lifetimeSavings25Yrs.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-white/70">
                  Full investment payback in ~2.8 years, followed by 22+ years of free electricity!
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-3 bg-[#DA9B40] hover:bg-[#F4B860] text-black font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Free Site Survey &amp; Quote</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. SOLAR TECHNOLOGIES: ON-GRID, HYBRID, OFF-GRID              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="technology" className="py-16 bg-white border-b border-[#EBCED6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A355E] bg-[#F7EEF2] px-3 py-0.5 rounded-full border border-[#EBCED6]">
              Engineered for Highest Solar Yield
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#261C33]">
              Choose Your Solar Configuration
            </h2>
            <p className="text-xs sm:text-sm text-[#6D5284]">
              Whether you need maximum grid credits, 24/7 battery backup, or remote off-grid independence:
            </p>
          </div>

          {/* Technology Switcher Pills */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setActiveTechTab("ongrid")}
              className={`px-5 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer ${
                activeTechTab === "ongrid"
                  ? "bg-[#4A355E] text-white shadow-sm"
                  : "bg-[#F7EEF2] text-[#6D5284] hover:bg-[#EBCED6]"
              }`}
            >
              ☀️ On-Grid Rooftop (Most Popular)
            </button>
            <button
              onClick={() => setActiveTechTab("hybrid")}
              className={`px-5 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer ${
                activeTechTab === "hybrid"
                  ? "bg-[#4A355E] text-white shadow-sm"
                  : "bg-[#F7EEF2] text-[#6D5284] hover:bg-[#EBCED6]"
              }`}
            >
              🔋 Hybrid + LiFePO4 Battery Backup
            </button>
            <button
              onClick={() => setActiveTechTab("offgrid")}
              className={`px-5 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer ${
                activeTechTab === "offgrid"
                  ? "bg-[#4A355E] text-white shadow-sm"
                  : "bg-[#F7EEF2] text-[#6D5284] hover:bg-[#EBCED6]"
              }`}
            >
              🏡 Off-Grid Standalone System
            </button>
          </div>

          {/* Active Tab Content Card */}
          <div className="bg-[#FAF4F7] rounded-3xl border border-[#EBCED6] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B965E] bg-[#EBF5EC] px-2.5 py-0.5 rounded-full border border-[#78B77B]/40">
                {activeTechTab === "ongrid"
                  ? "Maximum Savings & Net Metering"
                  : activeTechTab === "hybrid"
                  ? "Zero Blackouts & Lithium Storage"
                  : "100% Grid Independence"}
              </span>

              <h3 className="text-2xl font-black text-[#261C33]">
                {activeTechTab === "ongrid"
                  ? "Grid-Tied On-Grid Solar Systems"
                  : activeTechTab === "hybrid"
                  ? "Smart Hybrid Systems with Lithium Batteries"
                  : "Off-Grid Standalone Solar Plants"}
              </h3>

              <p className="text-xs sm:text-sm text-[#6D5284] leading-relaxed">
                {activeTechTab === "ongrid"
                  ? "Directly connected to the DISCOM electrical grid. Electricity generated during the day runs your appliances, and any excess units are fed to the DISCOM grid through bidirectional net-metering. No batteries required, lowest cost per kW, and 100% eligible for PM Surya Ghar ₹78,000 DBT subsidy."
                  : activeTechTab === "hybrid"
                  ? "Combines the benefits of net-metering grid connection with modern High-Voltage LiFePO4 battery storage. Seamlessly powers critical household loads during power outages while selling surplus daytime generation back to the government."
                  : "Independent solar micro-plant designed for remote farmhouses, agricultural tubewells, and heritage resorts where grid connectivity is unstable or unavailable."}
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#5B965E]" />
                  <span><strong>Panels:</strong> Waaree / Tata Power 540W–550W Mono PERC Bifacial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#5B965E]" />
                  <span><strong>Inverters:</strong> Growatt / Deye IP65 MPPT String Inverters with WiFi Telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#5B965E]" />
                  <span><strong>Structure:</strong> Hot-Dip Galvanized (GI) structure rated for 150 km/h winds</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A355E] hover:bg-[#372447] text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  <span>Request Engineering Design</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#EBCED6] shadow-sm h-72 sm:h-80">
              <img
                src={
                  activeTechTab === "ongrid"
                    ? "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80"
                    : activeTechTab === "hybrid"
                    ? "https://images.unsplash.com/photo-1558441719-8b489c63f749?auto=format&fit=crop&w=800&q=80"
                    : "https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?auto=format&fit=crop&w=800&q=80"
                }
                alt="Solar Technology"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. PM SURYA GHAR: MUFT BIJLI YOJANA SUBSIDY BREAKDOWN         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="subsidy" className="py-16 bg-[#FEF6EB]/40 border-b border-[#EBCED6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DA9B40] bg-[#FEF6EB] px-3 py-0.5 rounded-full border border-[#F4B860]/40">
              Government Central Scheme
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#261C33]">
              PM Surya Ghar: Muft Bijli Yojana Subsidies
            </h2>
            <p className="text-xs sm:text-sm text-[#6D5284]">
              The Ministry of New and Renewable Energy (MNRE) provides direct subsidies transferred to your bank account:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#EBCED6] shadow-xs space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D5284]">1 kW Rooftop System</span>
              <p className="text-3xl font-black text-[#261C33]">₹30,000</p>
              <p className="text-xs text-gray-600">Fixed Central Financial Assistance (CFA) DBT subsidy directly to homeowner.</p>
              <div className="pt-3 border-t border-gray-100 text-[11px] font-bold text-[#5B965E]">
                ✓ Ideal for small 1-2 BHK residences
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EBCED6] shadow-xs space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D5284]">2 kW Rooftop System</span>
              <p className="text-3xl font-black text-[#4A355E]">₹60,000</p>
              <p className="text-xs text-gray-600">Double subsidy coverage supporting medium residential energy needs.</p>
              <div className="pt-3 border-t border-gray-100 text-[11px] font-bold text-[#5B965E]">
                ✓ Powers lights, fans, fridge &amp; 1 AC
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#4A355E] to-[#261C33] text-white p-6 rounded-3xl border border-[#4A355E] shadow-md space-y-4 text-center relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-[#DA9B40] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Maximum CFA
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFBB94]">3 kW to 10 kW Rooftop</span>
              <p className="text-3xl font-black text-[#DA9B40]">₹78,000</p>
              <p className="text-xs text-white/80">Maximum direct government subsidy for residential rooftop installations.</p>
              <div className="pt-3 border-t border-white/20 text-[11px] font-bold text-[#78B77B]">
                ✓ Powers full duplex, multiple ACs &amp; EV charger
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. LIVE PLATFORM OPERATIONS SHOWCASE                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="live-stats" className="py-16 bg-white border-b border-[#EBCED6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B965E] bg-[#EBF5EC] px-3 py-0.5 rounded-full border border-[#78B77B]/40">
              Live Production Operations
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#261C33]">
              Backed by Real Engineering &amp; PostgreSQL Backend
            </h2>
            <p className="text-xs sm:text-sm text-[#6D5284]">
              Our platform connects homeowners, field technicians, and DISCOM net-metering desks in real time:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-[#FAF4F7] p-5 rounded-2xl border border-[#EBCED6] space-y-1">
              <p className="text-3xl font-black text-[#4A355E]">324+</p>
              <p className="text-xs font-bold text-[#261C33]">Live Database Records</p>
              <p className="text-[10px] text-gray-500">PostgreSQL 18 Localhost:5432</p>
            </div>

            <div className="bg-[#FAF4F7] p-5 rounded-2xl border border-[#EBCED6] space-y-1">
              <p className="text-3xl font-black text-[#DA9B40]">28 Crew</p>
              <p className="text-xs font-bold text-[#261C33]">Certified Technicians</p>
              <p className="text-[10px] text-gray-500">With GPS Dispatch &amp; Live Tasks</p>
            </div>

            <div className="bg-[#FAF4F7] p-5 rounded-2xl border border-[#EBCED6] space-y-1">
              <p className="text-3xl font-black text-[#5B965E]">45+</p>
              <p className="text-xs font-bold text-[#261C33]">Installed Customers</p>
              <p className="text-[10px] text-gray-500">Across Rajasthan Discoms</p>
            </div>

            <div className="bg-[#FAF4F7] p-5 rounded-2xl border border-[#EBCED6] space-y-1">
              <p className="text-3xl font-black text-[#4A355E]">100%</p>
              <p className="text-xs font-bold text-[#261C33]">Digital Asset Registry</p>
              <p className="text-[10px] text-gray-500">25-Year Barcode Serials</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 9. REAL PHOTO GALLERY: INSTALLATIONS IN ACTION                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#FAF4F7]/40 border-b border-[#EBCED6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A355E] bg-[#F7EEF2] px-3 py-0.5 rounded-full border border-[#EBCED6]">
                Site Visuals
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#261C33] mt-1">
                Real Installations Across Rajasthan
              </h2>
            </div>
            <Link
              href="/login"
              className="px-4 py-2 bg-white text-[#4A355E] border border-[#EBCED6] rounded-xl text-xs font-bold hover:bg-[#F7EEF2] transition self-start sm:self-auto"
            >
              View All Customer Reports →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-[#EBCED6] shadow-xs group">
              <div className="h-52 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80"
                  alt="Jaipur Rooftop Solar Array"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <p className="text-[11px] font-bold text-[#DA9B40] uppercase">Residential • 5 kW On-Grid</p>
                <h4 className="text-sm font-bold text-[#261C33]">Vaishali Nagar Residence (Jaipur)</h4>
                <p className="text-[11px] text-gray-500">10x Waaree 540W Mono PERC bifacial panels on RCC roof.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-[#EBCED6] shadow-xs group">
              <div className="h-52 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&w=600&q=80"
                  alt="Inverter & AC DB Wiring"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <p className="text-[11px] font-bold text-[#5B965E] uppercase">Equipment • IP65 MPPT</p>
                <h4 className="text-sm font-bold text-[#261C33]">Smart Dual MPPT String Inverter</h4>
                <p className="text-[11px] text-gray-500">High efficiency conversion with built-in DC surge protection.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-[#EBCED6] shadow-xs group">
              <div className="h-52 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?auto=format&fit=crop&w=600&q=80"
                  alt="Commercial Hospital Rooftop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <p className="text-[11px] font-bold text-[#4A355E] uppercase">Commercial • 20 kW Rooftop</p>
                <h4 className="text-sm font-bold text-[#261C33]">Apex Hospital Clinic (Malviya Nagar)</h4>
                <p className="text-[11px] text-gray-500">3-Phase commercial net metering saving ₹45,000/month.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 10. CALL TO ACTION BANNER (ACCESS / SIGN IN)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[#4A355E] via-[#372447] to-[#261C33] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-3xl flex items-center justify-center mx-auto shadow-inner">
            ☀️
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Transition to Clean, Free Solar Energy?
          </h2>

          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Join 45+ happy homeowners across Rajasthan. Log in to track your installation progress, view your live solar passbook, or explore crew assignments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#DA9B40] hover:bg-[#F4B860] text-black font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition cursor-pointer"
            >
              Log In to Portal Now →
            </Link>

            <Link
              href="/login?tab=customer"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/15 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl transition border border-white/20"
            >
              Sign Up as New Customer
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 11. FOOTER                                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#261C33] text-white/70 py-12 border-t border-[#4A355E]/60 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white p-0.5">
                  <img src="/icon.png" alt="SunPower" className="w-full h-full object-contain" />
                </div>
                <span className="text-base font-black text-white">SunPower Solutions</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Empowering India with smart rooftop solar energy systems, AI tilt surveys, and automated PM Surya Ghar DBT subsidies.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Platform Access</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/login?role=admin" className="hover:text-white transition">Admin ERP Portal</Link></li>
                <li><Link href="/login?role=technician" className="hover:text-white transition">Technician Crew Dispatch</Link></li>
                <li><Link href="/login?role=customer" className="hover:text-white transition">Homeowner Solar Passbook</Link></li>
                <li><Link href="/database" className="hover:text-white transition">PostgreSQL Database Engine</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Solar Technologies</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="#technology" className="hover:text-white transition">On-Grid Rooftop Systems</a></li>
                <li><a href="#technology" className="hover:text-white transition">Hybrid + Lithium Batteries</a></li>
                <li><a href="#technology" className="hover:text-white transition">Off-Grid Farmhouse Systems</a></li>
                <li><a href="#subsidy" className="hover:text-white transition">PM Surya Ghar Subsidy Guide</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Headquarters &amp; Support</p>
              <p className="text-[11px] leading-relaxed">
                Plot 42, Malviya Nagar Industrial Area, Jaipur, Rajasthan 302017
              </p>
              <p className="text-[11px] text-[#DA9B40] font-bold mt-2">
                📞 Hotline: +91 98765 11111
              </p>
              <p className="text-[11px] text-white/60">
                ✉️ Email: support@sunpower.com
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>© 2026 SunPower Solutions Platform. MNRE Registered Solar Partner.</p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-white transition font-bold text-[#FFBB94]">
                Portal Login →
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
