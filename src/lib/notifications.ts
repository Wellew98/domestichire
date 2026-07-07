// Email notification service using Resend
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@domestichire.co.zw";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log("[EMAIL SIMULATED]", params.subject, "→", params.to);
    return true;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `DomesticHire <${FROM_EMAIL}>`,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

// ---- Notification templates ----

export async function sendPaymentConfirmation(
  to: string,
  employerName: string,
  workerName: string,
  amount: number
) {
  return sendEmail({
    to,
    subject: `Payment Confirmed — ${workerName}'s Contact Details`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#1d4ed8">Payment Confirmed!</h1>
        <p>Hi ${employerName},</p>
        <p>Your payment of <strong>$${amount}</strong> for <strong>${workerName}</strong> has been received.</p>
        <p>You can now log in to view their contact details:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/workers" 
           style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">
          View Contact Details
        </a>
        <p style="color:#64748b;font-size:14px">Thank you for using DomesticHire!</p>
      </div>
    `,
  });
}

export async function sendAdminNotification(
  employerName: string,
  workerName: string,
  amount: number,
  paymentRef: string
) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@domestichire.co.zw";
  return sendEmail({
    to: adminEmail,
    subject: `New Payment — ${employerName} paid $${amount} for ${workerName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2>New Payment Received</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Employer</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${employerName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Worker</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${workerName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Amount</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">$${amount}</td></tr>
          <tr><td style="padding:8px">Reference</td><td style="padding:8px">${paymentRef}</td></tr>
        </table>
      </div>
    `,
  });
}

// WhatsApp notification (placeholder — requires WhatsApp Business API)
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log("[WHATSAPP SIMULATED]", "→", to, message);
    return true;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Failed to send WhatsApp:", error);
    return false;
  }
}
