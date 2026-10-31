import { NextResponse } from "next/server";
import { getOtpStore } from "@/lib/otpStore";
import { sendEmailViaResend } from "@/lib/resendEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, purpose = "login", role = "customer", name = "" } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Store in global memory store
    const store = getOtpStore();
    store.set(cleanEmail, {
      code: otp,
      expiresAt,
      purpose,
      role,
      email: cleanEmail,
    });

    console.log(`[SunPower Auth] Generated OTP for ${cleanEmail} (${purpose}, ${role}): ${otp}`);

    // Create branded HTML email
    const isReset = purpose === "reset_password";
    const subject = isReset
      ? `🔐 SunPower Security: ${otp} is your password reset code`
      : `⚡ SunPower Login Code: ${otp}`;

    const greetingName = name || (cleanEmail.split("@")[0].replace(/[._-]/g, " "));

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7EEF2; margin: 0; padding: 20px; color: #261C33; }
    .card { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EBCED6; padding: 32px; box-shadow: 0 4px 20px rgba(74, 53, 94, 0.08); }
    .header { text-align: center; border-bottom: 1px solid #F7EEF2; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 20px; font-weight: 800; color: #4A355E; letter-spacing: -0.5px; }
    .badge { display: inline-block; padding: 4px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 20px; background: #FAF4F7; color: #734960; border: 1px solid #EBCED6; margin-top: 8px; }
    .title { font-size: 18px; font-weight: 700; color: #261C33; margin-top: 16px; margin-bottom: 8px; text-align: center; }
    .subtitle { font-size: 13px; color: #6D5284; text-align: center; margin-bottom: 24px; line-height: 1.5; }
    .otp-box { background: #F7EEF2; border: 2px dashed #6D5284; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #4A355E; }
    .timer { font-size: 12px; font-weight: 600; color: #DA9B40; text-align: center; margin-top: 8px; }
    .warning { font-size: 11px; color: #8E687F; line-height: 1.5; text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #F7EEF2; }
    .footer { text-align: center; font-size: 11px; color: #A08FA8; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">☀️ SunPower Operations</div>
      <div class="badge">${isReset ? "Password Reset Verification" : `${role.toUpperCase()} Portal Access`}</div>
    </div>
    <div class="title">${isReset ? "Reset Your SunPower Password" : "Your One-Time Sign-In Passcode"}</div>
    <div class="subtitle">Hello <strong>${greetingName}</strong>,<br>${isReset ? "Use this 6-digit code to securely reset your account password." : "Use this single-use code to sign in to your solar management portal."}</div>
    
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <div class="timer">⏱️ Code expires in 10 minutes</div>
    </div>

    <div class="warning">
      <strong>Security Notice:</strong> SunPower staff will never ask you for your one-time code. If you did not request this verification, your account is safe and you can safely ignore this email.
    </div>
    
    <div class="footer">
      SunPower Solar Management Platform • Solar Operations, CRM & Warranty Desk
    </div>
  </div>
</body>
</html>
`;

    // Dispatch email through Resend API
    const emailResult = await sendEmailViaResend({
      to: cleanEmail,
      subject,
      html,
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit code has been sent to ${cleanEmail}. Please check your inbox.`,
      emailSent: emailResult.success,
      emailId: emailResult.id,
      note: emailResult.freeTierNotice || emailResult.error,
    });
  } catch (error: any) {
    console.error("[API send-otp error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process OTP request" },
      { status: 500 }
    );
  }
}
