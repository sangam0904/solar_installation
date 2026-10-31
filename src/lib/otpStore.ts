// ============================================================
// SERVER-SIDE IN-MEMORY OTP STORE FOR NEXT.JS
// ============================================================

export interface StoredOtp {
  code: string;
  expiresAt: number;
  purpose: "login" | "reset_password";
  role?: string;
  email: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sunpower_otp_store: Map<string, StoredOtp> | undefined;
}

export function getOtpStore(): Map<string, StoredOtp> {
  if (!globalThis.__sunpower_otp_store) {
    globalThis.__sunpower_otp_store = new Map<string, StoredOtp>();
  }
  return globalThis.__sunpower_otp_store;
}
