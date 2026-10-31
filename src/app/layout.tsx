import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavProvider } from "@/context/NavContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SunPower - Solar Installation & Operations Platform",
  description: "Unified digital backbone for rooftop solar installation, CRM, 20-year warranty tracking, warehouse dispatch & field operations.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7EEF2] text-[#261C33] font-sans antialiased selection:bg-[#B39CCB]/40 selection:text-[#4A355E]">
        <AuthProvider>
          <NavProvider>{children}</NavProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
