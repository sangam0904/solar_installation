import { NextResponse } from "next/server";
import { getOtpStore } from "@/lib/otpStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, purpose = "login", newPassword, role = "customer" } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const store = getOtpStore();
    const record = store.get(cleanEmail);

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "No OTP was requested for this email, or the code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // Check expiration
    if (Date.now() > record.expiresAt) {
      store.delete(cleanEmail);
      return NextResponse.json(
        { success: false, error: "This OTP code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check code match
    if (record.code !== cleanOtp) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP code. Please check your email and try again." },
        { status: 400 }
      );
    }

    // Single-use: remove after successful verification
    store.delete(cleanEmail);

    return NextResponse.json({
      success: true,
      message: purpose === "reset_password" ? "Password reset authorized." : "OTP verified successfully.",
      email: cleanEmail,
      role: record.role || role,
      purpose,
    });
  } catch (error: any) {
    console.error("[API verify-otp error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to verify OTP." },
      { status: 500 }
    );
  }
}
