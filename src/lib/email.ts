export async function sendLeadNotification(lead: { name: string, email: string, phone?: string, lastMessage?: string }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "owner@aura-platform.com";

  console.log(`[EMAIL_SERVICE] Sending lead alert to ${NOTIFICATION_EMAIL} for ${lead.name}...`);

  if (!RESEND_API_KEY) {
    console.warn("[EMAIL_SERVICE] No RESEND_API_KEY found. Email alert skipped but logged above.");
    return { success: false, reason: 'missing_api_key' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Aura Intelligence <alerts@aura-platform.com>',
        to: NOTIFICATION_EMAIL,
        subject: `New Lead Captured: ${lead.name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #0c101a; color: #fff; border-radius: 12px;">
            <h2 style="color: #06b6d4; margin-top: 0;">New Lead Captured!</h2>
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone || 'N/A'}</p>
            <p><strong>Interest/Context:</strong><br/><i>"${lead.lastMessage || 'N/A'}"</i></p>
            <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">This alert was generated automatically by your Aura AI Agent.</p>
          </div>
        `
      })
    });
    return await res.json();
  } catch (err) {
    console.error("[EMAIL_SERVICE] Failed to send email:", err);
    return { success: false, error: err };
  }
}
