/**
 * New-lead alert via an incoming webhook (Discord or Slack, both free).
 * Set LEAD_ALERT_WEBHOOK_URL; when unset this is a no-op. Never throws:
 * an alert failure must not lose or fail the lead itself.
 */
export type LeadAlert = {
  name: string;
  email: string;
  company?: string | null;
  service?: string | null;
  message: string;
  utmSource?: string | null;
};

export function formatLeadAlert(lead: LeadAlert): string {
  const lines = [
    `New lead: ${lead.name} <${lead.email}>`,
    lead.company ? `Company: ${lead.company}` : null,
    lead.service ? `Service: ${lead.service}` : null,
    lead.utmSource ? `Source: ${lead.utmSource}` : null,
    "",
    lead.message.length > 1500 ? `${lead.message.slice(0, 1500)}…` : lead.message,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export async function notifyNewLead(lead: LeadAlert): Promise<void> {
  const url = process.env.LEAD_ALERT_WEBHOOK_URL;
  if (!url) return;
  const text = formatLeadAlert(lead);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Discord reads `content`, Slack reads `text`; sending both covers either.
      body: JSON.stringify({ content: text.slice(0, 2000), text }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) console.error("[notify] lead alert failed", res.status);
  } catch (err) {
    console.error("[notify] lead alert error", err instanceof Error ? err.message : err);
  }
}
