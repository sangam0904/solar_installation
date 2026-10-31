"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquareIcon,
  BotIcon,
  UserIcon,
  SendIcon,
  XMarkIcon,
  ChevronDownIcon,
  SunIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PhoneIcon,
  ZapIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@/components/Icons";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: string[];
}

interface CustomerSupportChatbotProps {
  customerName?: string;
  systemCapacity?: string;
  subsidyStatus?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CustomerSupportChatbot({
  customerName = "Customer",
  systemCapacity = "5 kW On-Grid System",
  subsidyStatus = "Approved - Disbursed",
  isOpen: controlledIsOpen,
  onOpenChange,
}: CustomerSupportChatbotProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  };

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: "msg-1",
      sender: "bot",
      text: `Hello ${customerName}! I'm your SunPower Solar Assistant. How can I help you today with your ${systemCapacity}?`,
      timestamp: "Just now",
      options: [
        "How do I check daily yield?",
        "When is my subsidy disbursed?",
        "How to clean solar panels?",
        "Inverter lights & normal status",
        "Order more solar panels",
        "Talk to support helpline",
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Automated smart response generator
  const getBotResponse = (query: string): { text: string; options?: string[] } => {
    const q = query.toLowerCase();

    if (q.includes("yield") || q.includes("generation") || q.includes("kwh") || q.includes("units") || q.includes("bill")) {
      return {
        text: `Your ${systemCapacity} typically produces 20 to 24 kWh (units) of clean electricity per sunny day, translating to ~600-720 units monthly.\n\nYou can review your real-time generation in the 'Solar Yield & Passbook' section right on this portal. Any excess generation is exported to the grid via your bidirectional net meter and credited against your electricity bill.`,
        options: ["How to clean solar panels?", "Order more solar panels", "Inverter lights & normal status"],
      };
    }

    if (q.includes("subsidy") || q.includes("pm surya") || q.includes("dbt") || q.includes("78000") || q.includes("disburs")) {
      return {
        text: `Under the PM Surya Ghar: Muft Bijli Yojana, eligible rooftop systems (3kW and above) qualify for a Central DBT subsidy of up to ₹78,000.\n\nYour current account status: "${subsidyStatus}". The subsidy is credited directly to your Aadhaar-linked bank account within 30-45 days following DISCOM net-meter inspection and commissioning.`,
        options: ["How do I check daily yield?", "Talk to support helpline"],
      };
    }

    if (q.includes("clean") || q.includes("wash") || q.includes("dust") || q.includes("maintenance")) {
      return {
        text: `Here are expert rooftop panel cleaning tips:\n• Frequency: Clean panels every 15-20 days.\n• Time of Day: Clean early morning (before 8 AM) or late evening (after 6 PM) when panels are cool to prevent thermal shock.\n• Method: Use plain clean tap water and a soft microfiber sponge or wiper.\n• Precaution: Never use harsh acids, abrasive brushes, or high-pressure jets directly on cables or junction boxes.`,
        options: ["Inverter lights & normal status", "Order more solar panels"],
      };
    }

    if (q.includes("inverter") || q.includes("light") || q.includes("error") || q.includes("red") || q.includes("green") || q.includes("fault")) {
      return {
        text: `Inverter Status Guide:\n• Solid Green LED: System is generating normally and feeding power into your home and grid.\n• Blinking Green LED: System is waiting for sunrise or synchronizing with grid voltage.\n• Red LED / Error Code (e.g. E-01/E-04): Indicates grid power outage, voltage fluctuation, or an tripped AC/DC isolator.\n\nIf your inverter shows a red light, please check if your main utility grid switch is ON. If the light stays red for over 2 hours during daytime, contact our support helpline.`,
        options: ["Talk to support helpline", "How do I check daily yield?"],
      };
    }

    if (q.includes("order") || q.includes("more panel") || q.includes("expand") || q.includes("capacity") || q.includes("additional")) {
      return {
        text: `You can easily order additional solar panels right from this portal!\n\nSimply scroll to the bottom of the 'Solar Yield & Passbook' tab to find the 'Order solar panels at your house' section. There you can select high-efficiency modules (540W Mono PERC, 550W Bi-Facial) and enter your desired quantity. Our team will verify your roof structure and contact you.`,
        options: ["How do I check daily yield?", "When is my subsidy disbursed?"],
      };
    }

    if (q.includes("warranty") || q.includes("guarantee") || q.includes("card")) {
      return {
        text: `Your SunPower installation includes comprehensive warranty protection:\n• Solar PV Modules: 25-Year Performance & Linear Power Output Warranty.\n• Inverter: 5-Year Full Replacement & Component Warranty.\n• Workmanship & Mounting: 5-Year Structural Integrity Warranty.\n\nYou can view and download your warranty cards in the 'Digital Warranty Cards' section of this portal.`,
        options: ["Inverter lights & normal status", "Talk to support helpline"],
      };
    }

    if (q.includes("phone") || q.includes("call") || q.includes("helpline") || q.includes("human") || q.includes("contact") || q.includes("agent") || q.includes("talk")) {
      return {
        text: `You can reach our dedicated SunPower Support Team:\n• Phone: +91 98765 43210 (Mon–Sat, 9:00 AM – 7:00 PM IST)\n• Email: support@sunpower.local\n• Operations Desk: SunPower Solar Center, Jaipur, Rajasthan\n\nOur engineers will gladly assist you with technical inquiries, grid synchronizations, or site visits.`,
        options: ["How do I check daily yield?", "When is my subsidy disbursed?"],
      };
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("namaste")) {
      return {
        text: `Hello ${customerName}! I'm always here to help. What would you like to know about your rooftop solar system today?`,
        options: [
          "How do I check daily yield?",
          "When is my subsidy disbursed?",
          "How to clean solar panels?",
          "Order more solar panels",
        ],
      };
    }

    // Default fallback
    return {
      text: `Thanks for asking. For this request, our engineering support team can provide personalized help. You can call our helpline at +91 98765 43210 or check your installation details in the tabs above.`,
      options: [
        "How do I check daily yield?",
        "When is my subsidy disbursed?",
        "How to clean solar panels?",
        "Talk to support helpline",
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Realistic bot response delay
    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: response.text,
        timestamp: "Just now",
        options: response.options,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* ── FLOATING TRIGGER BUTTON (BOTTOM RIGHT) ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group">
          {/* Helpful teaser pill on hover/idle */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#191D23] text-white text-xs font-semibold rounded-full shadow-lg border border-white/20 animate-in fade-in slide-in-from-right-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Need Help? Chat with us</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Customer Support Chat"
            className="w-14 h-14 rounded-full bg-[#191D23] hover:bg-[#57707A] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer border-2 border-white/20 hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <BotIcon className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#191D23]" />
            </div>
          </button>
        </div>
      )}

      {/* ── EXPANDED CHATBOT WINDOW ── */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-[#DEDCDC] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#191D23] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#57707A]/30">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-[#57707A] flex items-center justify-center text-white border border-white/20">
                <BotIcon className="w-5 h-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#191D23]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white leading-tight">SunPower Assistant</h3>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-[#C5BAC4] leading-tight">Instant Help &amp; Solar System Support</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimize Chat"
                className="p-1.5 text-[#C5BAC4] hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                title="Minimize"
              >
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
                className="p-1.5 text-[#C5BAC4] hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                title="Close"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-[#F7F8F9] px-3.5 py-1.5 border-b border-[#DEDCDC] flex items-center justify-between text-[11px] text-[#57707A]">
            <span className="flex items-center gap-1 font-semibold truncate">
              <SunIcon className="w-3.5 h-3.5 text-[#57707A] shrink-0" />
              <span className="truncate">{systemCapacity}</span>
            </span>
            <span className="font-bold text-[#191D23] shrink-0">24/7 AI Support</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCFCFD]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === "user"
                      ? "bg-[#191D23] text-white rounded-br-xs"
                      : "bg-[#F7F8F9] text-[#191D23] border border-[#DEDCDC] rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                <span className="text-[10px] text-[#7B919C] mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Quick Option Buttons if provided on bot message */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(option)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white text-[#57707A] hover:text-[#191D23] hover:bg-gray-100 border border-[#DEDCDC] shadow-2xs transition cursor-pointer text-left"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-[#F7F8F9] border border-[#DEDCDC] rounded-xl w-16 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B919C] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B919C] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B919C] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#DEDCDC]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about solar yield, subsidy, inverter..."
                className="flex-1 px-3.5 py-2 text-xs font-semibold bg-[#F7F8F9] border border-[#DEDCDC] rounded-xl text-[#191D23] placeholder:text-[#989DAA] focus:outline-none focus:bg-white focus:border-[#57707A] focus:ring-2 focus:ring-[#57707A]/20 transition"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                aria-label="Send Message"
                className="w-9 h-9 rounded-xl bg-[#191D23] hover:bg-[#57707A] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition cursor-pointer shadow-xs shrink-0"
              >
                <SendIcon className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#DEDCDC]/60 text-[10px] text-[#7B919C]">
              <span>Helpline: +91 98765 43210</span>
              <button
                type="button"
                onClick={() => setMessages(initialMessages)}
                className="hover:text-[#191D23] underline cursor-pointer"
              >
                Reset Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
