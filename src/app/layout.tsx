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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F7FA] text-[#333333]">
        <AuthProvider>
          <NavProvider>{children}</NavProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
