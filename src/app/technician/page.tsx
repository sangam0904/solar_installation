"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import PageShell from "@/components/PageShell";
import { technicians as initialTechs, serviceTickets } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

function TechnicianFieldContent() {
  const { user, role, loginAsTechnician } = useAuth();
  const searchParams = useSearchParams();

  // Find active technician based on logged in user or default to TECH-001
  const activeTechId = user?.techId || "TECH-001";
  const [currentTechId, setCurrentTechId] = useState(activeTechId);

  useEffect(() => {
    if (user?.techId) {
      setCurrentTechId(user.techId);
    }
  }, [user]);

  const currentTech = initialTechs.find((t) => t.id === currentTechId) || initialTechs[0];

  // Tab navigation: 'jobs' | 'survey' | 'handover' | 'repairs'
  const initialTab = (searchParams.get("tab") as "jobs" | "survey" | "handover" | "repairs") || "jobs";
  const [activeTab, setActiveTab] = useState<"jobs" | "survey" | "handover" | "repairs">(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as "jobs" | "survey" | "handover" | "repairs" | null;
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Roof Survey Form state
  const [surveyCustomer, setSurveyCustomer] = useState("Vikram Singh (LD-003)");
  const [roofTilt, setRoofTilt] = useState(26);
  const [roofDirection, setRoofDirection] = useState("South (Optimal)");
  const [cableDistance, setCableDistance] = useState(18);
  const [shadowObstacles, setShadowObstacles] = useState("No obstacles, shadow-free from 9am to 4pm");
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // Handover & Commissioning form
  const [jobSize, setJobSize] = useState("3 kW On-Grid");
  const [measuredVolts, setMeasuredVolts] = useState("238 V");
  const [measuredWatts, setMeasuredWatts] = useState("2,850 W");
  const [startTime, setStartTime] = useState("09:30 AM");
  const [endTime, setEndTime] = useState("04:15 PM");
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [handoverComplete, setHandoverComplete] = useState(false);

  // Canvas signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Filter repair tickets assigned specifically to this technician
  const assignedTickets = serviceTickets.filter(
    (t) => t.assignedTechnician === currentTech.name
  );

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#734960";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <PageShell>
      {/* Technician Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👷</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#333333]">
              Technician Field Portal
            </h1>
            <span className="text-[10px] font-bold bg-[#FAF4F7] text-[#734960] px-2.5 py-0.5 rounded-full border border-[#8E687F]/30">
              Assigned Field Queue Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            Logged in as <strong>{currentTech.name}</strong> • {currentTech.specialization}
          </p>
        </div>

        {/* Quick Tech Switcher (For Demo & Admin) */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E4E7EB] shadow-xs">
          <span className="text-[11px] font-bold text-[#666666] uppercase">Active Crew:</span>
          <select
            value={currentTechId}
            onChange={(e) => {
              setCurrentTechId(e.target.value);
              loginAsTechnician(e.target.value);
            }}
            className="text-xs font-bold text-[#734960] bg-transparent focus:outline-none cursor-pointer"
          >
            {initialTechs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.specialization})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-[#5B965E] font-bold bg-[#EBF5EC] px-2 py-0.5 rounded-full border border-[#78B77B]/40">
            ⭐ {currentTech.rating}
          </span>
        </div>
      </div>

      {/* Technician Quick Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E4E7EB] border-l-4 border-l-[#734960] shadow-xs">
          <span className="text-[10px] font-bold text-[#666666] uppercase">Assigned Today</span>
          <p className="text-xl font-extrabold text-[#333333] mt-0.5">
            {currentTech.todaysJobs.length} Jobs
          </p>
          <span className="text-[10px] text-[#5B965E]">1 Survey • 1 Installation</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E4E7EB] border-l-4 border-l-[#F4B860] shadow-xs">
          <span className="text-[10px] font-bold text-[#666666] uppercase">Active Repairs</span>
          <p className="text-xl font-extrabold text-[#DA9B40] mt-0.5">
            {assignedTickets.length} Breakdown Tickets
          </p>
          <span className="text-[10px] text-[#DA9B40]">Under Warranty (Free)</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E4E7EB] border-l-4 border-l-[#78B77B] shadow-xs">
          <span className="text-[10px] font-bold text-[#666666] uppercase">Completed Plants</span>
          <p className="text-xl font-extrabold text-[#78B77B] mt-0.5">
            {currentTech.completedJobs}
          </p>
          <span className="text-[10px] text-[#5B965E]">100% Commissioned</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E4E7EB] border-l-4 border-l-[#8E687F] shadow-xs">
          <span className="text-[10px] font-bold text-[#666666] uppercase">Quality Rating</span>
          <p className="text-xl font-extrabold text-[#8E687F] mt-0.5">
            {currentTech.rating} / 5.0
          </p>
          <span className="text-[10px] text-[#DA9B40]">★★★★★ Verified</span>
        </div>
      </div>

      {/* Field Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E7EB] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap border ${
            activeTab === "jobs"
              ? "bg-[#734960] text-white border-[#734960] shadow-xs"
              : "bg-white text-[#666666] border-[#E4E7EB] hover:bg-[#F5F7FA]"
          }`}
        >
          <span>📋</span> My Scheduled Jobs ({currentTech.todaysJobs.length})
        </button>

        <button
          onClick={() => setActiveTab("survey")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap border ${
            activeTab === "survey"
              ? "bg-[#F4B860] text-[#333333] border-[#F4B860] shadow-xs"
              : "bg-white text-[#666666] border-[#E4E7EB] hover:bg-[#F5F7FA]"
          }`}
        >
          <span>📐</span> Roof Survey Tool
        </button>

        <button
          onClick={() => setActiveTab("handover")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap border ${
            activeTab === "handover"
              ? "bg-[#78B77B] text-white border-[#78B77B] shadow-xs"
              : "bg-white text-[#666666] border-[#E4E7EB] hover:bg-[#F5F7FA]"
          }`}
        >
          <span>✍️</span> Commissioning &amp; E-Signature
        </button>

        <button
          onClick={() => setActiveTab("repairs")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap border ${
            activeTab === "repairs"
              ? "bg-[#8E687F] text-white border-[#8E687F] shadow-xs"
              : "bg-white text-[#666666] border-[#E4E7EB] hover:bg-[#F5F7FA]"
          }`}
        >
          <span>🔧</span> Assigned Service Calls ({assignedTickets.length})
        </button>
      </div>

      {/* ───────────────── TAB 1: MY SCHEDULED JOBS ───────────────── */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              Today&apos;s Field Route for {currentTech.name}
            </h3>
            <span className="text-[11px] text-[#5B965E] font-semibold">📍 Jaipur City Territory</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTech.todaysJobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-[#E4E7EB] shadow-xs space-y-4 hover:border-[#8E687F] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      job.type === "Installation"
                        ? "bg-[#FAF4F7] text-[#734960] border-[#8E687F]/30"
                        : "bg-[#FEF6EB] text-[#DA9B40] border-[#F4B860]/40"
                    }`}>
                      {job.type}
                    </span>
                    <h3 className="text-sm font-bold text-[#333333] mt-2">{job.customerName}</h3>
                    <p className="text-xs text-[#666666]">{job.address}</p>
                  </div>
                  <span className="font-mono text-xs font-bold bg-[#F5F7FA] px-2.5 py-1 rounded-lg text-[#734960] border border-[#E4E7EB]">
                    {job.orderId}
                  </span>
                </div>

                <div className="bg-[#F5F7FA] p-3 rounded-xl flex items-center justify-between text-xs border border-[#E4E7EB]">
                  <div>
                    <span className="text-[#666666] text-[10px] block">Time Window</span>
                    <span className="font-bold text-[#333333]">{job.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] text-[10px] block">System Capacity</span>
                    <span className="font-bold text-[#734960]">{job.capacity}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] text-[10px] block">Job Status</span>
                    <span className={`font-bold ${job.status === "Completed" ? "text-[#5B965E]" : "text-[#DA9B40]"}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab("handover")}
                    className="flex-1 py-2 bg-[#734960] hover:bg-[#5A354A] text-white text-xs font-bold rounded-xl shadow-xs transition text-center"
                  >
                    Open Rooftop Commissioning Form ➔
                  </button>
                  <button
                    onClick={() => alert(`Opening Google Maps navigation to: ${job.address}`)}
                    className="px-3.5 py-2 bg-[#F5F7FA] hover:bg-[#E4E7EB] text-[#333333] text-xs font-semibold rounded-xl border border-[#E4E7EB] transition"
                  >
                    📍 Navigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────── TAB 2: ROOF SURVEY TOOL ───────────────── */}
      {activeTab === "survey" && (
        <div className="bg-white rounded-2xl border border-[#E4E7EB] p-6 shadow-xs max-w-xl mx-auto space-y-4">
          <div className="border-b border-[#E4E7EB] pb-3">
            <span className="text-[10px] font-bold text-[#DA9B40] uppercase tracking-wider">Field Survey Tool</span>
            <h2 className="text-base font-bold text-[#333333] mt-0.5">Physical Rooftop Assessment</h2>
            <p className="text-xs text-[#666666]">
              Measure shadow-free area, azimuth direction, and cable run for {currentTech.name}&apos;s customer visit
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-[#666666] uppercase">Customer Lead</label>
              <input
                type="text"
                value={surveyCustomer}
                onChange={(e) => setSurveyCustomer(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase">Roof Orientation (Compass)</label>
                <select
                  value={roofDirection}
                  onChange={(e) => setRoofDirection(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-bold text-[#333333]"
                >
                  <option value="South (Optimal)">South (180° - 100% Sun Exposure)</option>
                  <option value="South-West">South-West (225° - 92% Sun Exposure)</option>
                  <option value="South-East">South-East (135° - 90% Sun Exposure)</option>
                  <option value="West">West (270° - 80% Sun Exposure)</option>
                  <option value="East">East (90° - 78% Sun Exposure)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#666666] uppercase flex justify-between">
                  <span>Tilt Angle</span>
                  <span className="font-bold text-[#734960]">{roofTilt}°</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="45"
                  value={roofTilt}
                  onChange={(e) => setRoofTilt(Number(e.target.value))}
                  className="w-full mt-2 accent-[#734960]"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>10°</span>
                  <span>Optimal: 26°</span>
                  <span>45°</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#666666] uppercase">Cable Run Distance to Main Inverter (Meters)</label>
              <input
                type="number"
                value={cableDistance}
                onChange={(e) => setCableDistance(Number(e.target.value))}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs font-semibold"
              />
              <p className="text-[10px] text-[#666666] mt-1">
                Auto-calculates DC wire gauges (4mm² vs 6mm²) and voltage drop.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#666666] uppercase">Shadow Obstacles &amp; Parapet Notes</label>
              <textarea
                rows={2}
                value={shadowObstacles}
                onChange={(e) => setShadowObstacles(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border border-[#E4E7EB] rounded-xl text-xs"
              />
            </div>

            {surveySubmitted && (
              <div className="p-2.5 bg-[#EBF5EC] text-[#5B965E] text-xs font-bold rounded-xl border border-[#78B77B] text-center animate-in fade-in">
                ✓ Survey Approved! Lead unlocked for instant BOM &amp; Quotation Generation.
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setSurveySubmitted(true);
                setTimeout(() => setSurveySubmitted(false), 3000);
              }}
              className="w-full py-2.5 bg-[#F4B860] hover:bg-[#DA9B40] text-[#333333] font-bold rounded-xl text-xs shadow-xs transition"
            >
              Approve Survey &amp; Trigger Automatic Quote
            </button>
          </div>
        </div>
      )}

      {/* ───────────────── TAB 3: COMMISSIONING & E-SIGNATURE ───────────────── */}
      {activeTab === "handover" && (
        <div className="bg-white rounded-2xl border border-[#E4E7EB] p-6 shadow-xs max-w-xl mx-auto space-y-5">
          <div className="border-b border-[#E4E7EB] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#5B965E] uppercase tracking-wider">Field Sign-off</span>
              <h2 className="text-base font-bold text-[#333333] mt-0.5">On-Roof Testing &amp; Commissioning</h2>
            </div>
            <span className="text-xs bg-[#EBF5EC] text-[#5B965E] px-2.5 py-0.5 rounded-full font-bold border border-[#78B77B]/40">
              ORD-003 (Rajesh Gupta)
            </span>
          </div>

          {/* Time Tracker */}
          <div className="bg-[#F5F7FA] p-3 rounded-xl grid grid-cols-2 gap-3 text-xs border border-[#E4E7EB]">
            <div>
              <label className="font-bold text-[#666666] text-[10px] uppercase">Job Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 px-2.5 py-1 bg-white border border-[#E4E7EB] rounded-lg font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-[#666666] text-[10px] uppercase">Finish Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 px-2.5 py-1 bg-white border border-[#E4E7EB] rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          {/* Live Meter Readings */}
          <div className="bg-[#FAF4F7] border border-[#8E687F]/30 p-3.5 rounded-xl space-y-2">
            <h4 className="text-[11px] font-bold text-[#734960] uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> Commissioning Multimeter &amp; Inverter Output Check
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#666666] block">System Size</label>
                <input
                  type="text"
                  value={jobSize}
                  onChange={(e) => setJobSize(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white border border-[#E4E7EB] rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#666666] block">AC Output Voltage</label>
                <input
                  type="text"
                  value={measuredVolts}
                  onChange={(e) => setMeasuredVolts(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white border border-[#E4E7EB] rounded-lg text-xs font-mono text-[#5B965E] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#666666] block">Active Yield (Watts)</label>
                <input
                  type="text"
                  value={measuredWatts}
                  onChange={(e) => setMeasuredWatts(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white border border-[#E4E7EB] rounded-lg text-xs font-mono text-[#5B965E] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Photos Proof */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#666666] uppercase">
              Rooftop Installation Photos (Panels &amp; Earthing)
            </label>
            <div className="border border-dashed border-[#E4E7EB] rounded-xl p-3 text-center bg-[#F5F7FA]">
              {photoUploaded ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-10 bg-[#FAF4F7] text-[#734960] rounded-lg flex items-center justify-center text-lg border border-[#8E687F]/30">☀️</div>
                  <div className="w-12 h-10 bg-[#EBF5EC] text-[#78B77B] rounded-lg flex items-center justify-center text-lg border border-[#78B77B]/40">🔌</div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-[#5B965E]">2 Verified Photos Attached</p>
                    <p className="text-[10px] text-[#666666]">Rooftop Structure &amp; Earthing Rod Geotagged</p>
                  </div>
                </div>
              ) : (
                <button onClick={() => setPhotoUploaded(true)} className="text-xs text-[#734960] font-bold">
                  + Snap Rooftop Photos
                </button>
              )}
            </div>
          </div>

          {/* Digital E-Signature Pad */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#666666] uppercase">
                Homeowner E-Signature (Sign Below on Screen)
              </label>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[11px] text-[#DC2626] hover:underline font-semibold"
              >
                Clear
              </button>
            </div>
            <div className="border-2 border-[#E4E7EB] rounded-xl overflow-hidden bg-white shadow-inner">
              <canvas
                ref={canvasRef}
                width={480}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full cursor-crosshair touch-none"
              />
            </div>
            <p className="text-[10px] text-[#666666] italic">
              Homeowner statement: &quot;I accept physical delivery, testing, and handoff of the plant.&quot;
            </p>
          </div>

          {handoverComplete && (
            <div className="p-3 bg-[#EBF5EC] border border-[#78B77B] rounded-xl text-center space-y-0.5 animate-in fade-in">
              <p className="text-xs font-bold text-[#5B965E]">
                🎉 Handover Completed by {currentTech.name}!
              </p>
              <p className="text-[11px] text-[#333333]">
                Customer passbook updated. 20-Year warranty officially initialized.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setHandoverComplete(true)}
            className="w-full py-2.5 bg-[#78B77B] hover:bg-[#5B965E] text-white font-bold rounded-xl text-xs shadow-xs transition"
          >
            ✓ Complete Handover &amp; Start Warranty Clock
          </button>
        </div>
      )}

      {/* ───────────────── TAB 4: ASSIGNED BREAKDOWN TICKETS ───────────────── */}
      {activeTab === "repairs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              Breakdown Service Tickets Assigned to {currentTech.name}
            </h3>
            <span className="text-[11px] text-[#734960] font-semibold">{assignedTickets.length} active service calls</span>
          </div>

          {assignedTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="bg-white p-5 rounded-2xl border border-[#E4E7EB] shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF4F7] text-[#734960] border border-[#8E687F]/30">
                        {tkt.priority} Priority
                      </span>
                      <h4 className="text-sm font-bold text-[#333333] mt-1.5">{tkt.customerName}</h4>
                      <p className="text-xs text-[#666666]">{tkt.address} • {tkt.phone}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#DA9B40]">{tkt.id}</span>
                  </div>

                  <div className="bg-[#F5F7FA] p-3 rounded-xl text-xs space-y-1.5 border border-[#E4E7EB]">
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Equipment:</span>
                      <span className="font-bold text-[#333333]">{tkt.productName} ({tkt.serialNumber})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Reported Issue:</span>
                      <span className="font-bold text-[#DA9B40]">{tkt.issueType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Warranty Coverage:</span>
                      <span className="font-bold text-[#5B965E]">
                        {tkt.warrantyStatus} (Free Repair)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#333333] pt-1 border-t border-[#E4E7EB]">
                      {tkt.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => alert(`Marking Ticket ${tkt.id} as diagnosed & replaced at ₹0 cost.`)}
                      className="flex-1 py-2 bg-[#78B77B] hover:bg-[#5B965E] text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                      ✓ Replace Component &amp; Close Ticket
                    </button>
                    <button
                      onClick={() => alert(`Dialing customer at ${tkt.phone}`)}
                      className="px-3 py-2 bg-[#F5F7FA] hover:bg-[#E4E7EB] text-[#333333] text-xs font-semibold rounded-xl border border-[#E4E7EB]"
                    >
                      📞 Call Client
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E4E7EB] p-8 text-center text-xs text-[#666666]">
              🎉 No open breakdown tickets assigned to {currentTech.name}. All customer systems running optimally!
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}

export default function TechnicianFieldPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#666666]">Loading Field Portal...</div>}>
      <TechnicianFieldContent />
    </Suspense>
  );
}
