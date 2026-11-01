import https from "https";

export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded string or raw buffer
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  freeTierNotice?: string;
}

export async function sendEmailViaResend({
  to,
  subject,
  html,
  attachments,
}: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  const payloadObj: Record<string, any> = {
    from: "SunPower Solar <onboarding@resend.dev>",
    to: [to],
    subject,
    html,
  };

  if (attachments && attachments.length > 0) {
    payloadObj.attachments = attachments;
  }

  const payload = JSON.stringify(payloadObj);

  return new Promise((resolve) => {
    try {
      const req = https.request(
        "https://api.resend.com/emails",
        {
          method: "POST",
          rejectUnauthorized: false,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            try {
              const parsed = JSON.parse(body);
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve({
                  success: true,
                  id: parsed.id,
                });
              } else {
                console.warn("[Resend Warning]:", parsed);
                resolve({
                  success: false,
                  error: parsed.message || parsed.name || "Failed to deliver email",
                  freeTierNotice:
                    parsed.message?.includes("testing emails to your own email address")
                      ? "Resend test mode allows delivery to your registered Resend account email. For other emails, verify your domain in resend.com/domains."
                      : undefined,
                });
              }
            } catch {
              resolve({
                success: false,
                error: `HTTP ${res.statusCode}: ${body}`,
              });
            }
          });
        }
      );

      req.on("error", (err) => {
        console.error("[Resend Request Error]:", err);
        resolve({
          success: false,
          error: err.message,
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          success: false,
          error: "Resend request timed out after 10s",
        });
      });

      req.write(payload);
      req.end();
    } catch (err: any) {
      resolve({
        success: false,
        error: err?.message || "Internal error sending email",
      });
    }
  });
}
