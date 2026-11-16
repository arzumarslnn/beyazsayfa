// Resend ile e-posta gönderimi. RESEND_API_KEY yoksa gönderim atlanır (site çalışmaya devam eder).
export async function sendEmail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from || !to) return { sent: false, reason: "yapilandirilmadi" as const };
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1e2235;max-width:560px">${text
    .split("\n")
    .map((l) => (l.trim() ? `<p style="margin:0 0 8px">${l.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!))}</p>` : "<br>"))
    .join("")}</div>`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text, html }),
    });
    return { sent: r.ok, reason: r.ok ? undefined : ("hata" as const) };
  } catch {
    return { sent: false, reason: "hata" as const };
  }
}
