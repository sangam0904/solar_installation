// ============================================================
// REAL-TIME USER LOGIN & ACCESS AUDIT LOG SYSTEM
// ============================================================

export type LogUserRole = "admin" | "technician" | "customer";

export interface UserLoginLog {
  id: string;
  name: string;
  email: string;
  role: LogUserRole;
  loginMethod: string;
  timestamp: string; // ISO string
  formattedTime: string;
  ipAddress: string;
  device: string;
  location: string;
  status: "Success" | "Active";
  isNew?: boolean;
}

export const INITIAL_USER_LOGIN_LOGS: UserLoginLog[] = [
  {
    id: "LOG-9281",
    name: "Rajendra Rathore (Director)",
    email: "admin@sunpower.com",
    role: "admin",
    loginMethod: "Email & Password",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    formattedTime: "12 mins ago",
    ipAddress: "103.212.144.18",
    device: "Chrome 128 / Windows 11",
    location: "Jaipur, Rajasthan",
    status: "Active",
  },
  {
    id: "LOG-9280",
    name: "Rohit Meena",
    email: "rohit.m@sunpower.com",
    role: "technician",
    loginMethod: "Staff PIN & Email",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    formattedTime: "45 mins ago",
    ipAddress: "103.212.144.82",
    device: "Mobile Chrome / Android 14",
    location: "Vaishali Nagar, Jaipur",
    status: "Success",
  },
  {
    id: "LOG-9279",
    name: "Rajesh Gupta",
    email: "rajesh.gupta@email.com",
    role: "customer",
    loginMethod: "Email & OTP Sign-in",
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    formattedTime: "1 hr ago",
    ipAddress: "182.73.112.44",
    device: "Safari 17 / iOS 18",
    location: "Mansarovar, Jaipur",
    status: "Success",
  },
  {
    id: "LOG-9278",
    name: "Amit Kumar",
    email: "amit.k@sunpower.com",
    role: "technician",
    loginMethod: "Staff PIN & Email",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    formattedTime: "3 hrs ago",
    ipAddress: "103.212.144.91",
    device: "Mobile Chrome / Android 13",
    location: "C-Scheme, Jaipur",
    status: "Success",
  },
  {
    id: "LOG-9277",
    name: "Kavita Joshi",
    email: "kavita.j@email.com",
    role: "customer",
    loginMethod: "Email & OTP Sign-in",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    formattedTime: "4 hrs ago",
    ipAddress: "49.36.198.110",
    device: "Edge 128 / Windows 10",
    location: "Civil Lines, Jaipur",
    status: "Success",
  },
  {
    id: "LOG-9276",
    name: "Rajendra Rathore (Google Workspace)",
    email: "rajendra@sunpower.com",
    role: "admin",
    loginMethod: "Google Workspace SSO",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    formattedTime: "6 hrs ago",
    ipAddress: "103.212.144.18",
    device: "Firefox 130 / macOS 15",
    location: "Jaipur, Rajasthan",
    status: "Success",
  },
  {
    id: "LOG-9275",
    name: "Mohan Lal",
    email: "mohan.lal@email.com",
    role: "customer",
    loginMethod: "Email & OTP Sign-in",
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    formattedTime: "8 hrs ago",
    ipAddress: "122.160.22.89",
    device: "Chrome Mobile / Samsung Galaxy",
    location: "Malviya Nagar, Jaipur",
    status: "Success",
  },
];

const STORAGE_KEY = "sunpower_user_login_logs";
const EVENT_NAME = "sunpower_user_login";

// Format relative or local time
export function formatLogTime(dateIso: string): string {
  try {
    const d = new Date(dateIso);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hrs ago`;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateIso;
  }
}

// Retrieve logs from localStorage
export function getUserLoginLogs(): UserLoginLog[] {
  if (typeof window === "undefined") {
    return INITIAL_USER_LOGIN_LOGS;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: UserLoginLog[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // Initialize with mock logs if empty
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USER_LOGIN_LOGS));
  } catch {}

  return INITIAL_USER_LOGIN_LOGS;
}

// Record a new login event
export function recordUserLogin(entry: {
  name: string;
  email: string;
  role: LogUserRole;
  loginMethod: string;
  ipAddress?: string;
  device?: string;
  location?: string;
}): UserLoginLog {
  const now = new Date();
  const newLog: UserLoginLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    name: entry.name,
    email: entry.email,
    role: entry.role,
    loginMethod: entry.loginMethod,
    timestamp: now.toISOString(),
    formattedTime: "Just now",
    ipAddress: entry.ipAddress || (entry.role === "technician" ? "103.212.144.82" : entry.role === "customer" ? "182.73.112.44" : "103.212.144.18"),
    device: entry.device || (typeof navigator !== "undefined" ? (navigator.userAgent.includes("Windows") ? "Chrome / Windows" : "Safari / Mobile") : "Web Browser"),
    location: entry.location || "Jaipur, Rajasthan",
    status: "Active",
    isNew: true,
  };

  if (typeof window !== "undefined") {
    try {
      const currentLogs = getUserLoginLogs();
      const updated = [newLog, ...currentLogs.filter((l) => l.id !== newLog.id)];
      // Keep up to 100 logs
      const trimmed = updated.slice(0, 100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

      // Also add to admin notifications
      const notifs = JSON.parse(localStorage.getItem("sunpower_notifications") || "[]");
      const adminNotif = {
        id: `notif-${Date.now()}`,
        recipientRole: "admin" as const,
        text: `User Login: ${entry.name} (${entry.email}) authenticated as ${entry.role.toUpperCase()}`,
        time: "Just now",
        type: "info" as const,
      };
      localStorage.setItem("sunpower_notifications", JSON.stringify([adminNotif, ...notifs]));

      // Dispatch both standard storage and custom login event for instantaneous UI updates
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newLog }));
    } catch (e) {
      console.error("Error storing user login log:", e);
    }
  }

  return newLog;
}

// Clear all logs
export function clearUserLoginLogs(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
    } catch {}
  }
}

// Reset logs back to default demo logs
export function resetUserLoginLogs(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USER_LOGIN_LOGS));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
    } catch {}
  }
}
